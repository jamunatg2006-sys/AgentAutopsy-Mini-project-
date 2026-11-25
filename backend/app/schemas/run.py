"""
Run Schema
Defines the structure for an entire agent execution run.
"""

from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class RunStatus(str, Enum):
    """Overall status of an agent run."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class AgentRun(BaseModel):
    """
    Represents one complete run of an agent on a specific task or scenario.
    """
    # Unique identifier for this run (e.g., 'run_001')
    run_id: str = Field(..., description="Unique run identifier")

    # The scenario ID if launched from the benchmark suite (e.g., 'F01', 'P01')
    scenario_id: Optional[str] = Field(None, description="Benchmark scenario ID if applicable")

    # Name of the agent executed
    agent_name: str = Field(default="CustomerSupportRefundAgent", description="Name of the agent")

    # High-level status of the run
    status: RunStatus = Field(default=RunStatus.PENDING, description="Current run status")

    # Summary of the user input or customer request
    input_summary: str = Field(..., description="Brief description of the input task")

    # Full task input parameters (customer message, order ID, etc.)
    task_input: Dict[str, Any] = Field(default_factory=dict, description="Raw input passed to agent")

    # What the run is expected to produce
    expected_outcome: Dict[str, Any] = Field(default_factory=dict, description="Expected outcome assertions")

    # What the run actually produced in the end
    actual_outcome: Dict[str, Any] = Field(default_factory=dict, description="Final agent outcome")

    # True if the outcome evaluator detected an error or assertion failure
    failure_detected: bool = Field(default=False, description="Whether failure was detected")

    # Total number of trace events recorded for this run
    total_events: int = Field(default=0, description="Count of recorded trace events")

    # Start and end timestamps
    start_time: datetime = Field(default_factory=datetime.utcnow, description="When run started")
    end_time: Optional[datetime] = Field(None, description="When run completed")

    # Tags for quick filtering
    tags: Dict[str, Any] = Field(default_factory=dict, description="Extra metadata tags")


class CreateRunRequest(BaseModel):
    """
    Request model for triggering a new agent run via API.
    """
    scenario_id: Optional[str] = Field(None, description="Pre-configured scenario (F01-F05, P01-P05)")
    custom_message: Optional[str] = Field(None, description="Optional custom user prompt")
    order_id: Optional[str] = Field(None, description="Target order ID (e.g. SYN-1042)")
