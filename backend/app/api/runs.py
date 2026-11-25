"""
Runs & Trace REST API endpoints.
GET  /runs        -> List all recorded agent runs
GET  /runs/{id}   -> Get a specific run by ID
POST /runs/launch -> Launch a new agent run (live or by scenario ID)
GET  /runs/{id}/trace -> Get ordered trace events for a run
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from backend.app.agents.support_agent import run_support_agent, run_benchmark_scenario
from backend.app.db.repositories import RunRepository, EventRepository

router = APIRouter(prefix="/runs", tags=["Runs & Trace"])


class LaunchRunRequest(BaseModel):
    scenario_id: Optional[str] = None
    customer_message: Optional[str] = None
    order_id: Optional[str] = None


@router.get("/")
async def list_runs():
    """Return all recorded agent runs (most recent first)."""
    return await RunRepository.list_runs()


@router.get("/{run_id}")
async def get_run(run_id: str):
    """Get a specific run by its unique run ID."""
    run = await RunRepository.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")
    return run


@router.post("/launch")
async def launch_run(request: LaunchRunRequest):
    """
    Launch a new customer-support agent execution.
    Either supply a scenario_id (F01-F05, P01-P05) OR a free-form customer_message + order_id.
    """
    try:
        if request.scenario_id:
            result = run_benchmark_scenario(request.scenario_id)
        elif request.customer_message and request.order_id:
            result = run_support_agent(
                customer_message=request.customer_message,
                order_id=request.order_id
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="Provide either 'scenario_id' OR both 'customer_message' and 'order_id'."
            )

        # Persist run metadata
        run_record = {
            "run_id": result["run_id"],
            "agent_name": "CustomerSupportAgent-v2",
            "start_time": datetime.utcnow().isoformat(),
            "end_time": datetime.utcnow().isoformat(),
            "status": "failed" if result["failure_detected"] else "completed",
            "failure_detected": result["failure_detected"],
            "input_summary": request.customer_message or f"Benchmark scenario {request.scenario_id}",
            "total_events": result["total_events"],
            "scenario_id": result.get("scenario_id")
        }
        await RunRepository.create_run(run_record)
        await EventRepository.create_events(result["events"])

        return {
            "run_id": result["run_id"],
            "verdict": result["verdict"],
            "failure_detected": result["failure_detected"],
            "total_events": result["total_events"]
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{run_id}/trace")
async def get_trace(run_id: str):
    """Return all trace events for a run in execution sequence order."""
    events = await EventRepository.get_events_by_run_id(run_id)
    if not events:
        raise HTTPException(status_code=404, detail=f"No trace events found for run '{run_id}'.")
    return events
