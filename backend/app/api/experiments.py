"""
Replay & Experiments REST API endpoints.
POST /experiments/{run_id}/replay  -> Run a counterfactual sandbox replay
GET  /experiments/{run_id}/diff    -> Get baseline vs replay event diff
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal

from backend.app.db.repositories import EventRepository

router = APIRouter(prefix="/experiments", tags=["Replay & Experiments"])


class ReplayRequest(BaseModel):
    target_event_id: str
    action: Literal["replace_output", "replace_input", "prompt_variant"] = "replace_output"
    value: Optional[dict] = None


@router.post("/{run_id}/replay")
async def run_replay(run_id: str, request: ReplayRequest):
    """
    Launch a counterfactual sandbox replay on the given run.
    Applies an intervention on target_event_id and re-runs downstream execution.
    Zero side effects on the original run.
    """
    events = await EventRepository.get_events_by_run_id(run_id)
    if not events:
        raise HTTPException(status_code=404, detail=f"No events found for run '{run_id}'.")

    from backend.app.schemas.event import TraceEvent
    trace = [TraceEvent(**e) for e in events]

    # Find the target event
    target_event = next((e for e in trace if e.event_id == request.target_event_id), None)
    if not target_event:
        raise HTTPException(
            status_code=404,
            detail=f"Event '{request.target_event_id}' not found in trace for run '{run_id}'."
        )

    # Apply intervention using sandbox
    from backend.app.replay.interventions import build_intervention
    from backend.app.replay.runner import run_replay_simulation

    intervention = build_intervention(
        event=target_event,
        action=request.action,
        value=request.value or {"eligible": False, "reason": "Policy enforcement applied by replay"}
    )
    replay_result = run_replay_simulation(trace=trace, intervention=intervention)

    return {
        "run_id": run_id,
        "intervention_event_id": request.target_event_id,
        "action": request.action,
        "baseline_verdict": "FAIL" if any(e.status == "failure" for e in trace) else "PASS",
        "replay_verdict": replay_result.verdict,
        "hypothesis_proven": replay_result.hypothesis_proven,
        "changed_events": replay_result.changed_event_count,
        "replay_events": [e.dict() for e in replay_result.replay_trace]
    }


@router.get("/{run_id}/diff")
async def get_replay_diff(run_id: str):
    """
    Get the baseline vs most recent replay comparison for a run.
    Returns both event streams for the Before vs After diff view.
    """
    events = await EventRepository.get_events_by_run_id(run_id)
    if not events:
        raise HTTPException(status_code=404, detail=f"No events found for run '{run_id}'.")
    return {"run_id": run_id, "baseline_events": events}
