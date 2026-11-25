"""
Intervention Handlers (Engine 5)
Applies controlled counterfactual modifications to specific trace steps during replay.
"""

from typing import List
from copy import deepcopy
from backend.app.schemas.event import TraceEvent, EventStatus
from backend.app.schemas.experiment import InterventionSpec


def apply_intervention(
    events: List[TraceEvent],
    intervention: InterventionSpec,
    replay_run_id: str
) -> List[TraceEvent]:
    """
    Creates a new modified trace for the replay run with the intervention applied.
    """
    modified_events: List[TraceEvent] = []

    for event in events:
        # Clone event so original baseline remains 100% immutable
        cloned = deepcopy(event)
        cloned.run_id = replay_run_id
        cloned.event_id = f"replay_{event.event_id}"
        if cloned.parent_event_id:
            cloned.parent_event_id = f"replay_{event.parent_event_id}"

        # If this is the target event, apply the intervention
        if event.event_id == intervention.target_event_id:
            cloned.metadata["is_intervened"] = True
            cloned.metadata["intervention_type"] = intervention.type

            if intervention.type == "replace_output":
                cloned.output = intervention.replacement_payload
                cloned.status = EventStatus.SUCCESS
                cloned.error_details = None

            elif intervention.type == "replace_input":
                cloned.input = intervention.replacement_payload
                cloned.status = EventStatus.SUCCESS
                cloned.error_details = None

            elif intervention.type == "replace_tool_result":
                cloned.output = intervention.replacement_payload
                cloned.status = EventStatus.SUCCESS
                cloned.error_details = None

            elif intervention.type == "skip_step":
                cloned.status = EventStatus.SKIPPED
                cloned.output = {"skipped": True, "reason": "ablation_test"}

        modified_events.append(cloned)

    return modified_events
