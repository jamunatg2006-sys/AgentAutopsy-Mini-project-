"""
Trace Event Logger for Agent Autopsy.
Records agent execution events into MongoDB or in-memory storage in real-time.
"""

import logging
import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime
from backend.app.schemas.event import TraceEvent

logger = logging.getLogger("agent_autopsy.tracing")


class TraceLogger:
    """
    Records each step of a LangGraph agent execution.
    Call start_run() first, then append events, and finally finish_run().
    Events are stored immediately in memory and flushed to the repository.
    """

    def __init__(self, run_id: Optional[str] = None):
        self.run_id = run_id or f"run_{uuid.uuid4().hex[:10]}"
        self._events: List[Dict[str, Any]] = []
        self._sequence_counter = 0
        self._previous_event_id: Optional[str] = None

    def log_event(
        self,
        component: str,
        event_type: str,
        input_data: Dict[str, Any],
        output_data: Dict[str, Any],
        status: str = "success",
        duration_ms: int = 100,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Record a single step in the execution trace.
        Returns the event_id assigned to this step.
        """
        self._sequence_counter += 1
        event_id = f"evt_{self._sequence_counter:03d}"

        event = {
            "event_id": event_id,
            "run_id": self.run_id,
            "sequence": self._sequence_counter,
            "parent_event_id": self._previous_event_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "component": component,
            "event_type": event_type,
            "input": input_data,
            "output": output_data,
            "status": status,
            "duration_ms": duration_ms,
            "metadata": metadata or {}
        }

        self._events.append(event)
        self._previous_event_id = event_id
        logger.debug(f"[TraceLogger] run={self.run_id} event={event_id} component={component} status={status}")
        return event_id

    def get_events(self) -> List[Dict[str, Any]]:
        """Return the full trace collected so far."""
        return self._events

    def has_failure(self) -> bool:
        """Returns True if any recorded event has a failure or warning status."""
        return any(e["status"] in ("failure", "warning") for e in self._events)
