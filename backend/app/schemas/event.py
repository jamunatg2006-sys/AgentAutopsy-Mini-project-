"""
Event Schema (Common Event Format - CEF)
Defines the standard structure for recording every single step an AI agent takes.
"""

from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class EventType(str, Enum):
    """Types of events that can happen during an agent run."""
    AGENT = "agent"            # Agent-level events (start, finish)
    MODEL = "model"            # LLM prompt and response calls
    TOOL = "tool"              # Tool execution (lookup, refund, etc.)
    VALIDATION = "validation"  # Assertions or business rule checks
    STATE = "state"            # State transitions or memory updates
    ERROR = "error"            # Caught exceptions or unexpected errors


class EventStatus(str, Enum):
    """Execution status of a single event."""
    SUCCESS = "success"
    FAILURE = "failure"
    WARNING = "warning"
    SKIPPED = "skipped"


class TraceEvent(BaseModel):
    """
    Common Event Format (CEF) model.
    Every action performed by an agent is saved using this format.
    """
    # Unique identifier for this specific event (e.g., 'evt_001')
    event_id: str = Field(..., description="Unique event identifier")

    # The run ID this event belongs to (e.g., 'run_101')
    run_id: str = Field(..., description="ID of the parent agent execution run")

    # Chronological sequence number (1, 2, 3...) to keep events ordered
    sequence: int = Field(..., description="Ordering sequence number of this event")

    # The ID of the event that caused this event (for building dependency trees)
    parent_event_id: Optional[str] = Field(None, description="Parent event ID if nested")

    # Type of event (model call, tool call, state update, etc.)
    event_type: EventType = Field(..., description="Category of event")

    # Name of the component/tool (e.g., 'refund_eligibility_check', 'gemini_llm')
    component: str = Field(..., description="Name of tool, node, or model being executed")

    # The inputs passed to this component (dictionary)
    input: Dict[str, Any] = Field(default_factory=dict, description="Input data or arguments")

    # The output produced by this component (dictionary)
    output: Dict[str, Any] = Field(default_factory=dict, description="Output or return data")

    # Status of this event
    status: EventStatus = Field(default=EventStatus.SUCCESS, description="Status of the step")

    # Detailed error information if this event failed
    error_details: Optional[Dict[str, Any]] = Field(None, description="Error message or stack trace if failed")

    # Time taken by this step in milliseconds
    duration_ms: float = Field(default=0.0, description="Execution duration in milliseconds")

    # Timestamp when the event happened (ISO format)
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the event")

    # Extra metadata (schema version, mock flag, tags)
    metadata: Dict[str, Any] = Field(
        default_factory=lambda: {"schema_version": "1.0", "mocked": True},
        description="Additional debugging metadata"
    )
