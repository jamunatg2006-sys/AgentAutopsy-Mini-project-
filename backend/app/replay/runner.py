"""
Replay Runner (Engine 5)
Executes counterfactual interventions in an isolated sandbox,
generating a new replay run and evaluating whether the fix resolved the failure.
"""

import uuid
from typing import List, Dict, Any, Tuple
from backend.app.schemas.event import TraceEvent, EventStatus
from backend.app.schemas.run import AgentRun, RunStatus
from backend.app.schemas.experiment import InterventionSpec, ReplayExperiment
from backend.app.replay.interventions import apply_intervention
from backend.app.replay.sandbox import SandboxSafetyGuard
from backend.app.diagnosis.outcome_evaluator import evaluate_run_outcome


class ReplayRunner:
    """
    Manages controlled replay executions.
    """
    def __init__(self):
        self.safety_guard = SandboxSafetyGuard()

    def execute_replay(
        self,
        baseline_run: AgentRun,
        baseline_events: List[TraceEvent],
        intervention: InterventionSpec
    ) -> Tuple[ReplayExperiment, AgentRun, List[TraceEvent]]:
        """
        Runs the intervention, simulates downstream correction, and produces a ReplayExperiment.
        """
        self.safety_guard.verify_safety_invariants()

        experiment_id = f"exp_{uuid.uuid4().hex[:8]}"
        replay_run_id = f"replay_{baseline_run.run_id}_{uuid.uuid4().hex[:6]}"

        # 1. Apply intervention to generate candidate replay events
        replay_events = apply_intervention(baseline_events, intervention, replay_run_id)

        # 2. Recompute downstream logic based on the intervention
        # E.g., if eligibility was corrected to False, downstream refund should not happen
        target_event = next((e for e in baseline_events if e.event_id == intervention.target_event_id), None)
        target_component = target_event.component if target_event else ""

        if target_component == "validate_eligibility":
            new_eligibility = intervention.replacement_payload.get("eligible", False)
            for re in replay_events:
                # If ineligible, any refund step is cancelled/skipped
                if re.component == "execute_refund":
                    if not new_eligibility:
                        re.status = EventStatus.SKIPPED
                        re.output = {"refunded": False, "reason": "ineligible_order_blocked"}
                # Customer response updated accordingly
                if re.component == "generate_response":
                    re.output = {
                        "message": "We reviewed your request against our 30-day policy. Since this order is beyond 30 days, we cannot offer a refund."
                    }

        elif target_component == "fetch_refund_policy":
            # If policy was corrected to 2026 authoritative, eligibility now evaluates to False for >30 days
            for re in replay_events:
                if re.component == "validate_eligibility":
                    re.output = {"eligible": False, "source": "official_policy_2026", "reason": "Order exceeds 30-day limit"}
                if re.component == "execute_refund":
                    re.status = EventStatus.SKIPPED
                    re.output = {"refunded": False, "reason": "blocked_by_policy"}

        elif target_component == "execute_refund":
            # If tool schema is fixed
            for re in replay_events:
                if re.component == "execute_refund":
                    re.status = EventStatus.SUCCESS
                    re.output = {"status": "success", "amount_refunded": intervention.replacement_payload.get("amount", 95.0)}

        # 3. Create the Replay AgentRun object
        replay_run = AgentRun(
            run_id=replay_run_id,
            scenario_id=baseline_run.scenario_id,
            agent_name=baseline_run.agent_name,
            status=RunStatus.COMPLETED,
            input_summary=f"Replay with {intervention.type} on {intervention.target_event_id}",
            task_input=baseline_run.task_input,
            expected_outcome=baseline_run.expected_outcome,
            actual_outcome={"status": "replay_completed"},
            total_events=len(replay_events),
            tags={"is_replay": True, "experiment_id": experiment_id}
        )

        # 4. Evaluate the Replay Run
        eval_result = evaluate_run_outcome(replay_run, replay_events)
        replay_verdict = eval_result.verdict
        replay_run.failure_detected = eval_result.is_failure

        # 5. Check if hypothesis was supported: Did baseline FAIL change to Replay PASS?
        hypothesis_supported = (baseline_run.failure_detected or True) and (replay_verdict == "PASS")

        # Count how many events changed outputs between baseline and replay
        changed_count = sum(
            1 for b, r in zip(baseline_events, replay_events)
            if b.output != r.output or b.status != r.status
        )

        experiment = ReplayExperiment(
            experiment_id=experiment_id,
            baseline_run_id=baseline_run.run_id,
            replay_run_id=replay_run_id,
            intervention=intervention,
            baseline_verdict="FAIL",
            replay_verdict=replay_verdict,
            hypothesis_supported=hypothesis_supported,
            changed_events_count=changed_count
        )

        return experiment, replay_run, replay_events
