"""
Forensic Reports REST API endpoint.
GET  /reports/{run_id}  -> Return full Autopsy Markdown/JSON report for a run
"""

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/{run_id}")
async def get_report(run_id: str):
    """
    Generate and return a structured Forensic Report for the given run_id.
    Combines trace facts, diagnosis hypothesis, replay proof, and regression metrics.
    """
    from backend.app.db.repositories import EventRepository, DiagnosisRepository, RunRepository

    run = await RunRepository.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")

    events = await EventRepository.get_events_by_run_id(run_id)
    if not events:
        raise HTTPException(status_code=404, detail=f"No trace events found for run '{run_id}'.")

    diagnosis = await DiagnosisRepository.get_diagnosis(run_id)

    from backend.app.reports.generator import generate_autopsy_report
    from backend.app.schemas.event import TraceEvent
    trace = [TraceEvent(**e) for e in events]
    report = generate_autopsy_report(run_id=run_id, trace=trace, diagnosis_dict=diagnosis)

    return report
