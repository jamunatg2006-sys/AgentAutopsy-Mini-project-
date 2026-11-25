"""
Outcome Evaluator (Engine 2)
Determines whether an agent run passed or failed using deterministic assertions,
not relying solely on LLM self-evaluation.
"""

from typing import List, Dict, Any
from backend.app.schemas.event import TraceEvent
from backend.app.schemas.run import AgentRun
from backend.app.diagnosis.rules import run_all_rules, RuleViolation


class EvaluationResult:
    """Represents the outcome verdict of a run."""
    def __init__(
        self,
        is_failure: bool,
        verdict: str,  # 'PASS', 'FAIL', or 'INCONCLUSIVE'
        symptoms: List[str],
        rule_violations: List[RuleViolation],
        suspicious_event_ids: List[str]
    ):
        self.is_failure = is_failure
        self.verdict = verdict
        self.symptoms = symptoms
        self.rule_violations = rule_violations
        self.suspicious_event_ids = suspicious_event_ids

    def to_dict(self) -> Dict[str, Any]:
        return {
            "is_failure": self.is_failure,
            "verdict": self.verdict,
            "symptoms": self.symptoms,
            "rule_violations": [v.to_dict() for v in self.rule_violations],
            "suspicious_event_ids": self.suspicious_event_ids
        }


def evaluate_run_outcome(run: AgentRun, events: List[TraceEvent]) -> EvaluationResult:
    """
    Evaluates the complete run against domain assertions and invariant rules.
    """
    symptoms: List[str] = []
    suspicious_event_ids: List[str] = []

    # 1. Check for explicit error events in the trace
    for event in events:
        if event.status.value == "failure" or event.event_type.value == "error":
            symptoms.append(f"Event {event.event_id} ({event.component}) ended with failure status.")
            if event.event_id not in suspicious_event_ids:
                suspicious_event_ids.append(event.event_id)

    # 2. Check rule violations
    violations = run_all_rules(events)
    for v in violations:
        symptoms.append(f"Invariant broken: {v.message}")
        if v.event_id not in suspicious_event_ids:
            suspicious_event_ids.append(v.event_id)

    # 3. Check domain-specific business expectations
    # For example, if order was ineligible but refund tool was called
    refund_executed = any(e.component == "execute_refund" and e.status.value == "success" for e in events)
    expected_outcome = run.expected_outcome or {}

    if expected_outcome.get("should_refund") is False and refund_executed:
        symptoms.append("Domain Assertion Failed: Ineligible order was refunded.")

    # 4. Determine final verdict
    is_failure = len(symptoms) > 0 or len(violations) > 0
    verdict = "FAIL" if is_failure else "PASS"

    return EvaluationResult(
        is_failure=is_failure,
        verdict=verdict,
        symptoms=symptoms,
        rule_violations=violations,
        suspicious_event_ids=suspicious_event_ids
    )
