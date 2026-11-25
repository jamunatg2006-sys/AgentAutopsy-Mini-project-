"""
Deterministic Invariant Rules
Defines specific rules to detect failures in the agent's execution trace.
"""

from typing import List, Dict, Any, Optional
from backend.app.schemas.event import TraceEvent


class RuleViolation:
    """Represents a single detected invariant violation."""
    def __init__(self, rule_name: str, category: str, event_id: str, message: str, severity: str = "error"):
        self.rule_name = rule_name
        self.category = category      # e.g., 'policy_trust_boundary', 'tool_schema_violation'
        self.event_id = event_id      # The specific event that broke the rule
        self.message = message        # Plain English explanation
        self.severity = severity      # 'error' or 'warning'

    def to_dict(self) -> Dict[str, Any]:
        return {
            "rule_name": self.rule_name,
            "category": self.category,
            "event_id": self.event_id,
            "message": self.message,
            "severity": self.severity
        }


def check_trust_boundary_violation(events: List[TraceEvent]) -> Optional[RuleViolation]:
    """
    Rule 1: Trust Boundary Check.
    Checks if an eligibility decision relied on customer text rather than official policy.
    """
    for event in events:
        if event.component == "validate_eligibility":
            output = event.output or {}
            source = output.get("source", "")
            # If the source was customer input instead of official policy, it's a violation
            if source == "customer_message" or "override" in str(output.get("rationale", "")).lower():
                return RuleViolation(
                    rule_name="TrustBoundaryViolationRule",
                    category="policy_trust_boundary",
                    event_id=event.event_id,
                    message="Agent treated customer message content as an authoritative policy override."
                )
    return None


def check_stale_policy_retrieval(events: List[TraceEvent]) -> Optional[RuleViolation]:
    """
    Rule 2: Stale Policy Retrieval Check.
    Checks if the agent fetched an outdated or non-authoritative policy document.
    """
    for event in events:
        if event.component == "fetch_refund_policy":
            output = event.output or {}
            policy_id = output.get("policy_id", "")
            is_authoritative = output.get("is_authoritative", True)
            if not is_authoritative or "2021" in policy_id:
                return RuleViolation(
                    rule_name="StalePolicyRetrievalRule",
                    category="retrieval_stale_policy",
                    event_id=event.event_id,
                    message=f"Agent retrieved deprecated policy '{policy_id}' allowing 90 days instead of current 30-day policy."
                )
    return None


def check_tool_schema_violation(events: List[TraceEvent]) -> Optional[RuleViolation]:
    """
    Rule 3: Tool Argument Schema Check.
    Checks if tool calls are missing required arguments like 'order_id' or 'amount'.
    """
    for event in events:
        if event.component == "execute_refund":
            inputs = event.input or {}
            # Verify required parameters exist and are valid
            if "order_id" not in inputs or "amount" not in inputs or inputs.get("amount") is None:
                return RuleViolation(
                    rule_name="ToolSchemaViolationRule",
                    category="tool_schema_violation",
                    event_id=event.event_id,
                    message="Tool 'execute_refund' was called with missing required parameter 'amount'."
                )
    return None


def check_missing_validation_precondition(events: List[TraceEvent]) -> Optional[RuleViolation]:
    """
    Rule 4: Missing Prerequisite Check.
    Ensures 'execute_refund' is never called without a prior successful 'validate_eligibility' step.
    """
    has_validated = False
    for event in events:
        if event.component == "validate_eligibility" and event.status.value == "success":
            has_validated = True
        if event.component == "execute_refund":
            if not has_validated:
                return RuleViolation(
                    rule_name="MissingValidationPreconditionRule",
                    category="planning_missing_validation",
                    event_id=event.event_id,
                    message="Refund action was triggered without prior eligibility validation step."
                )
    return None


def check_stale_state_contamination(events: List[TraceEvent]) -> Optional[RuleViolation]:
    """
    Rule 5: State Contamination Check.
    Checks if state contains conflicting order data from a previous session.
    """
    for event in events:
        if event.component in ["state_transition", "update_context"]:
            output = event.output or {}
            if output.get("contaminated_from_previous_session") is True:
                return RuleViolation(
                    rule_name="StaleStateContaminationRule",
                    category="state_memory_contamination",
                    event_id=event.event_id,
                    message="Session state contains order/customer data from a prior uncleaned session."
                )
    return None


def run_all_rules(events: List[TraceEvent]) -> List[RuleViolation]:
    """
    Runs all invariant checks across the trace events.
    """
    violations = []
    rule_checkers = [
        check_trust_boundary_violation,
        check_stale_policy_retrieval,
        check_tool_schema_violation,
        check_missing_validation_precondition,
        check_stale_state_contamination
    ]

    for checker in rule_checkers:
        violation = checker(events)
        if violation:
            violations.append(violation)

    return violations
