"""
Autopsy & Investigation REST API endpoints.
POST /autopsy/{run_id}/analyze   -> Run full failure investigation pipeline
GET  /autopsy/{run_id}/diagnosis -> Retrieve saved diagnosis for a run
"""

from fastapi import APIRouter, HTTPException
from backend.app.db.repositories import EventRepository, DiagnosisRepository

router = APIRouter(prefix="/autopsy", tags=["Autopsy & Investigation"])


@router.post("/{run_id}/analyze")
async def analyze_run(run_id: str):
    """
    Trigger the full 4-step investigation pipeline on a recorded agent run:
    1. Deterministic invariant rule checks
    2. NetworkX dependency graph construction
    3. Candidate root-cause step ranking
    4. Gemini-grounded explanation generation
    """
    # Fetch trace events
    events = await EventRepository.get_events_by_run_id(run_id)
    if not events:
        raise HTTPException(status_code=404, detail=f"No events found for run '{run_id}'.")

    from backend.app.schemas.event import TraceEvent
    trace = [TraceEvent(**e) for e in events]

    # Engine 2: Outcome evaluation + invariant rules
    from backend.app.diagnosis.outcome_evaluator import evaluate_outcome
    evaluation = evaluate_outcome(run_id=run_id, trace=trace)

    # Engine 3: Graph construction + candidate ranking
    from backend.app.dependency.graph_builder import build_dependency_graph
    from backend.app.diagnosis.ranker import rank_candidates
    graph = build_dependency_graph(trace)
    candidates = rank_candidates(evaluation, graph)

    # Engine 4: Gemini LLM diagnosis
    from backend.app.diagnosis.llm_assistant import generate_diagnosis
    diagnosis = generate_diagnosis(run_id=run_id, evaluation=evaluation, candidates=candidates, trace=trace)

    # Persist diagnosis
    await DiagnosisRepository.save_diagnosis(diagnosis.dict())

    return diagnosis.dict()


@router.get("/{run_id}/diagnosis")
async def get_diagnosis(run_id: str):
    """Retrieve the saved autopsy diagnosis for a previously analyzed run."""
    diagnosis = await DiagnosisRepository.get_diagnosis(run_id)
    if not diagnosis:
        raise HTTPException(
            status_code=404,
            detail=f"No diagnosis found for run '{run_id}'. Run POST /autopsy/{run_id}/analyze first."
        )
    return diagnosis
