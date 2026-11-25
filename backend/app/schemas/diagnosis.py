"""
Diagnosis Schema
Defines the structured output for an Agent Autopsy diagnosis report.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class DiagnosisCandidateModel(BaseModel):
    """A single candidate cause identified during investigation."""
    candidate_step_id: str = Field(..., description="The event ID identified as candidate cause")
    rank: int = Field(default=1, description="Priority rank (1 is top candidate)")
    category: str = Field(..., description="Fault taxonomy category")
    confidence: str = Field(..., description="'high', 'medium', 'low', or 'inconclusive'")
    causal_hypothesis: str = Field(..., description="Plain-English explanation of why this step caused the failure")
    evidence_event_ids: List[str] = Field(default_factory=list, description="IDs of trace events supporting this claim")
    downstream_impact_step_ids: List[str] = Field(default_factory=list, description="IDs of subsequent steps affected")
    recommended_intervention: Dict[str, Any] = Field(
        default_factory=dict,
        description="Suggested fix intervention to test in Replay Lab"
    )


class AutopsyDiagnosis(BaseModel):
    """Full autopsy report for an agent run."""
    diagnosis_id: str = Field(..., description="Unique diagnosis ID (e.g. diag_001)")
    run_id: str = Field(..., description="Target run ID")
    verdict: str = Field(..., description="'PASS', 'FAIL', or 'INCONCLUSIVE'")
    failure_symptoms: List[str] = Field(default_factory=list, description="Visible error symptoms")
    candidates: List[DiagnosisCandidateModel] = Field(default_factory=list, description="Ranked candidate root causes")
    summary: str = Field(..., description="Executive summary of the investigation")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of diagnosis")
