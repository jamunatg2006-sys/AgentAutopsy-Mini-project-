"""
Fixes & Regression REST API endpoints.
POST /fixes/regression  -> Run 10-scenario benchmark regression suite
GET  /fixes/regression  -> Get latest regression evaluation report
"""

from fastapi import APIRouter

router = APIRouter(prefix="/fixes", tags=["Fixes & Regression"])


@router.post("/regression")
async def run_regression():
    """
    Run the 10-scenario benchmark regression evaluation suite (F01-F05 + P01-P05).
    Calculates Rescue Rate and Break Rate metrics.
    """
    from backend.app.evaluation.regression_runner import run_full_regression
    report = run_full_regression()
    return report.dict()


@router.get("/regression")
async def get_regression_report():
    """
    Return a pre-computed regression report with standard benchmark fix applied.
    """
    from backend.app.evaluation.regression_runner import run_full_regression
    report = run_full_regression()
    return report.dict()
