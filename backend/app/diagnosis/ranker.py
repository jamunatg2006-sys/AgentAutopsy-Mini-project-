"""
Candidate Step Ranker
Ranks candidate root-cause steps using deterministic rule matches,
graph dependency proximity, and downstream impact.
"""

from typing import List, Dict, Any, Optional
from backend.app.schemas.event import TraceEvent
from backend.app.diagnosis.outcome_evaluator import EvaluationResult
from backend.app.dependency.graph_builder import ExecutionGraph


class RankedCandidate:
    """Represents a candidate error step ranked by likelihood of being the root cause."""
    def __init__(
        self,
        event_id: str,
        rank: int,
        score: float,
        component: str,
        category: str,
        confidence: str,  # 'high', 'medium', 'low', 'inconclusive'
        rationale: str,
        evidence_event_ids: List[str],
        downstream_impact_step_ids: List[str]
    ):
        self.event_id = event_id
        self.rank = rank
        self.score = score
        self.component = component
        self.category = category
        self.confidence = confidence
        self.rationale = rationale
        self.evidence_event_ids = evidence_event_ids
        self.downstream_impact_step_ids = downstream_impact_step_ids

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_id": self.event_id,
            "rank": self.rank,
            "score": self.score,
            "component": self.component,
            "category": self.category,
            "confidence": self.confidence,
            "rationale": self.rationale,
            "evidence_event_ids": self.evidence_event_ids,
            "downstream_impact_step_ids": self.downstream_impact_step_ids
        }


def rank_candidate_steps(
    events: List[TraceEvent],
    eval_result: EvaluationResult,
    exec_graph: ExecutionGraph
) -> List[RankedCandidate]:
    """
    Combines rule violations and graph lineage to rank the most likely root causes.
    """
    if not eval_result.is_failure:
        return []

    # Map rule violations by event ID
    violations_by_event: Dict[str, Any] = {}
    for v in eval_result.rule_violations:
        violations_by_event[v.event_id] = v

    candidates: List[Dict[str, Any]] = []

    # Score each suspicious event
    for event in events:
        score = 0.0
        rationale_parts = []
        evidence_ids = [event.event_id]
        category = "unknown_error"

        # 1. Did this event directly trigger a rule violation? (+50 points)
        if event.event_id in violations_by_event:
            v = violations_by_event[event.event_id]
            score += 50.0
            category = v.category
            rationale_parts.append(f"Direct invariant breach: {v.message}")

        # 2. Is this event upstream from the failure symptom in the graph? (+20 points)
        downstream_nodes = exec_graph.get_downstream_impact(event.event_id)
        impacted_symptoms = [s for s in eval_result.suspicious_event_ids if s in downstream_nodes]
        if impacted_symptoms:
            score += 20.0
            rationale_parts.append(f"Causal ancestor to symptom event(s): {', '.join(impacted_symptoms)}")
            evidence_ids.extend(impacted_symptoms)

        # 3. Failed event status (+10 points)
        if event.status.value == "failure":
            score += 10.0
            rationale_parts.append("Step executed with failure status.")

        if score > 0:
            # Determine confidence level
            if score >= 60.0:
                confidence = "high"
            elif score >= 30.0:
                confidence = "medium"
            else:
                confidence = "low"

            candidates.append({
                "event_id": event.event_id,
                "score": score,
                "component": event.component,
                "category": category,
                "confidence": confidence,
                "rationale": "; ".join(rationale_parts),
                "evidence_event_ids": list(set(evidence_ids)),
                "downstream_impact_step_ids": list(downstream_nodes)
            })

    # Sort descending by score
    candidates.sort(key=lambda x: x["score"], reverse=True)

    ranked_list = []
    for rank, c in enumerate(candidates, start=1):
        ranked_list.append(
            RankedCandidate(
                event_id=c["event_id"],
                rank=rank,
                score=c["score"],
                component=c["component"],
                category=c["category"],
                confidence=c["confidence"],
                rationale=c["rationale"],
                evidence_event_ids=c["evidence_event_ids"],
                downstream_impact_step_ids=c["downstream_impact_step_ids"]
            )
        )

    return ranked_list
