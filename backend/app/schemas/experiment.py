"""
Experiment & Replay Schema
Defines the structure for counterfactual replay experiments in the sandbox.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from backend.app.schemas.event import TraceEvent


class InterventionSpec(BaseModel):
    """Specification of what to change during replay."""
    type: str = Field(..., description="'replace_output', 'replace_input', 'replace_tool_result', 'prompt_variant'")
    target_event_id: str = Field(..., description="ID of the event to modify")
    replacement_payload: Dict[str, Any] = Field(..., description="The new data to inject")


class ReplayExperiment(BaseModel):
    """A single counterfactual replay experiment."""
    experiment_id: str = Field(..., description="Unique experiment ID (e.g. exp_001)")
    baseline_run_id: str = Field(..., description="Original failed run ID")
    replay_run_id: str = Field(..., description="New run ID produced by sandbox replay")
    intervention: InterventionSpec = Field(..., description="Intervention applied")
    baseline_verdict: str = Field(default="FAIL", description="Baseline run result")
    replay_verdict: str = Field(..., description="Replay run result ('PASS' or 'FAIL')")
    hypothesis_supported: bool = Field(..., description="True if replay turned failure into success")
    changed_events_count: int = Field(default=0, description="How many downstream steps changed")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Experiment timestamp")


class CreateExperimentRequest(BaseModel):
    """Request model to trigger a replay experiment."""
    run_id: str = Field(..., description="Target run to replay")
    intervention: InterventionSpec = Field(..., description="Intervention to test")
