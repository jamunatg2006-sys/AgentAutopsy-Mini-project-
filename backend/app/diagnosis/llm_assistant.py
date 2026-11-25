"""
LLM Diagnosis Assistant (Engine 4)
Uses Gemini (with deterministic offline fallback) to interpret trace evidence,
explain the root-cause hypothesis, and cite specific event IDs as evidence.
"""

import os
import json
from typing import List, Dict, Any, Optional
from backend.app.schemas.event import TraceEvent
from backend.app.schemas.run import AgentRun
from backend.app.schemas.diagnosis import AutopsyDiagnosis, DiagnosisCandidateModel
from backend.app.diagnosis.outcome_evaluator import EvaluationResult
from backend.app.diagnosis.ranker import RankedCandidate


def build_diagnosis_prompt(
    run: AgentRun,
    eval_result: EvaluationResult,
    ranked_candidates: List[RankedCandidate],
    events: List[TraceEvent]
) -> str:
    """
    Constructs a structured prompt containing only relevant trace excerpts and evidence IDs.
    """
    event_snippets = []
    for e in events:
        event_snippets.append({
            "event_id": e.event_id,
            "sequence": e.sequence,
            "component": e.component,
            "type": e.event_type.value,
            "status": e.status.value,
            "input": e.input,
            "output": e.output
        })

    prompt = f"""You are the Agent Autopsy Investigation Assistant.
Analyze this failed agent run and generate an evidence-backed root cause diagnosis.

Run ID: {run.run_id}
Task Goal: {run.input_summary}
Failure Symptoms: {json.dumps(eval_result.symptoms)}

Trace Events:
{json.dumps(event_snippets, indent=2)}

Detected Rule Invariants:
{json.dumps([v.to_dict() for v in eval_result.rule_violations], indent=2)}

Instructions:
1. Identify the decisive mistake step that triggered this failure.
2. Every claim MUST cite real event IDs from the trace as evidence.
3. Suggest a concrete counterfactual intervention for Replay Lab.

Respond ONLY with valid JSON matching this schema:
{{
  "candidate_step_id": "evt_xxx",
  "category": "policy_trust_boundary | retrieval_stale_policy | tool_schema_violation | state_memory_contamination | planning_missing_validation",
  "confidence": "high | medium | low | inconclusive",
  "causal_hypothesis": "Detailed explanation of why this step caused the failure...",
  "evidence_event_ids": ["evt_xxx", "evt_yyy"],
  "recommended_intervention": {{
    "type": "replace_input | replace_output | replace_tool_result | prompt_variant",
    "target_event_id": "evt_xxx",
    "replacement_payload": {{}}
  }}
}}
"""
    return prompt


class GeminiDiagnosisAssistant:
    """
    Diagnosis engine using Gemini API with deterministic fallback for offline testing.
    """
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    async def generate_diagnosis(
        self,
        run: AgentRun,
        eval_result: EvaluationResult,
        ranked_candidates: List[RankedCandidate],
        events: List[TraceEvent]
    ) -> AutopsyDiagnosis:
        """
        Generates full structured autopsy diagnosis.
        """
        valid_event_ids = {e.event_id for e in events}

        # If run passed, return healthy pass diagnosis
        if not eval_result.is_failure:
            return AutopsyDiagnosis(
                diagnosis_id=f"diag_{run.run_id}",
                run_id=run.run_id,
                verdict="PASS",
                failure_symptoms=[],
                candidates=[],
                summary="Execution completed successfully. All invariant assertions and domain checks passed."
            )

        # Candidate fallback from ranking engine if LLM is unavailable or offline
        top_ranked = ranked_candidates[0] if ranked_candidates else None
        candidate_models: List[DiagnosisCandidateModel] = []

        # Try calling Gemini if API key is present
        llm_data: Optional[Dict[str, Any]] = None
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                from google import genai
                client = genai.Client(api_key=self.api_key)
                prompt = build_diagnosis_prompt(run, eval_result, ranked_candidates, events)
                response = client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                )
                raw_text = response.text.strip()
                # Clean markdown backticks if present
                if raw_text.startswith("```"):
                    raw_text = raw_text.split("```")[1]
                    if raw_text.startswith("json"):
                        raw_text = raw_text[4:]
                llm_data = json.loads(raw_text.strip())
            except Exception as e:
                # Log and proceed with deterministic synthesis
                print(f"[GeminiDiagnosisAssistant] Note: Gemini call skipped/failed ({e}), using deterministic synthesis.")
                llm_data = None

        if llm_data and "candidate_step_id" in llm_data:
            # Validate evidence IDs cited by LLM exist in the trace
            cited_ids = [eid for eid in llm_data.get("evidence_event_ids", []) if eid in valid_event_ids]
            candidate_models.append(
                DiagnosisCandidateModel(
                    candidate_step_id=llm_data["candidate_step_id"],
                    rank=1,
                    category=llm_data.get("category", "unknown"),
                    confidence=llm_data.get("confidence", "high"),
                    causal_hypothesis=llm_data.get("causal_hypothesis", ""),
                    evidence_event_ids=cited_ids or [llm_data["candidate_step_id"]],
                    downstream_impact_step_ids=top_ranked.downstream_impact_step_ids if top_ranked else [],
                    recommended_intervention=llm_data.get("recommended_intervention", {})
                )
            )
        elif top_ranked:
            # Deterministic expert synthesis grounded in invariant analysis
            intervention_payload = self._suggest_intervention(top_ranked, events)
            candidate_models.append(
                DiagnosisCandidateModel(
                    candidate_step_id=top_ranked.event_id,
                    rank=1,
                    category=top_ranked.category,
                    confidence=top_ranked.confidence,
                    causal_hypothesis=f"Decisive failure occurred at step #{top_ranked.event_id} ({top_ranked.component}). {top_ranked.rationale}",
                    evidence_event_ids=top_ranked.evidence_event_ids,
                    downstream_impact_step_ids=top_ranked.downstream_impact_step_ids,
                    recommended_intervention=intervention_payload
                )
            )

        summary_text = (
            f"Investigation identified decisive error at event '{candidate_models[0].candidate_step_id}' "
            f"under category '{candidate_models[0].category}' with {candidate_models[0].confidence} confidence."
            if candidate_models else "Inconclusive: trace evidence was insufficient to isolate a single decisive cause."
        )

        return AutopsyDiagnosis(
            diagnosis_id=f"diag_{run.run_id}",
            run_id=run.run_id,
            verdict="FAIL",
            failure_symptoms=eval_result.symptoms,
            candidates=candidate_models,
            summary=summary_text
        )

    def _suggest_intervention(self, candidate: RankedCandidate, events: List[TraceEvent]) -> Dict[str, Any]:
        """Generates a default suggested intervention for the Replay Lab."""
        if candidate.category == "policy_trust_boundary":
            return {
                "type": "replace_output",
                "target_event_id": candidate.event_id,
                "replacement_payload": {
                    "eligible": False,
                    "reason": "Order delivered >30 days ago. Customer chat prompt cannot override policy.",
                    "source": "official_policy_2026"
                }
            }
        elif candidate.category == "retrieval_stale_policy":
            return {
                "type": "replace_output",
                "target_event_id": candidate.event_id,
                "replacement_payload": {
                    "policy_id": "POL-CURRENT-2026",
                    "max_refund_days": 30,
                    "is_authoritative": True
                }
            }
        elif candidate.category == "tool_schema_violation":
            return {
                "type": "replace_input",
                "target_event_id": candidate.event_id,
                "replacement_payload": {
                    "order_id": "SYN-1003",
                    "amount": 95.00,
                    "reason": "damaged_on_arrival"
                }
            }
        return {
            "type": "replace_output",
            "target_event_id": candidate.event_id,
            "replacement_payload": {"status": "corrected"}
        }
