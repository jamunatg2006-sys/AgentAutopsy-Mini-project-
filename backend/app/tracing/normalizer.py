"""
Common Event Format (CEF) Normalizer.
Parses arbitrary external agent trace JSON and normalizes it into the standard CEF schema.
"""

from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime
from backend.app.schemas.event import TraceEvent


def normalize_trace(raw_data: Any, run_id: Optional[str] = None) -> List[TraceEvent]:
    """
    Normalizes arbitrary trace structures into a list of valid CEF TraceEvents.
    Handles raw arrays of events, LangChain/LangGraph run histories, or nested steps.
    """
    if not run_id:
        run_id = f"imported_run_{uuid.uuid4().hex[:8]}"

    # Extract event list if wrapped inside an outer dict
    raw_events = []
    if isinstance(raw_data, list):
        raw_events = raw_data
    elif isinstance(raw_data, dict):
        if "events" in raw_data and isinstance(raw_data["events"], list):
            raw_events = raw_data["events"]
        elif "steps" in raw_data and isinstance(raw_data["steps"], list):
            raw_events = raw_data["steps"]
        elif "trace" in raw_data and isinstance(raw_data["trace"], list):
            raw_events = raw_data["trace"]
        else:
            raw_events = [raw_data]

    normalized_events: List[TraceEvent] = []
    previous_event_id: Optional[str] = None

    for idx, item in enumerate(raw_events, start=1):
        if not isinstance(item, dict):
            continue

        event_id = item.get("event_id") or item.get("id") or f"evt_{idx:03d}"
        parent_id = item.get("parent_event_id") or item.get("parent_id") or previous_event_id
        component = item.get("component") or item.get("name") or item.get("action") or f"step_{idx}"
        
        # Determine event type
        event_type = item.get("event_type") or "model"
        if "tool" in component.lower() or "fetch" in component.lower() or "lookup" in component.lower():
            event_type = "tool"
        elif "state" in component.lower():
            event_type = "state"

        # Determine status
        raw_status = str(item.get("status", "success")).lower()
        if raw_status in ("fail", "failed", "error"):
            status = "failure"
        elif raw_status in ("warn", "warning"):
            status = "warning"
        elif raw_status in ("skip", "skipped"):
            status = "skipped"
        else:
            status = "success"

        # Extract input & output
        inp = item.get("input") or item.get("inputs") or item.get("args") or {}
        out = item.get("output") or item.get("outputs") or item.get("result") or {}

        event = TraceEvent(
            event_id=event_id,
            run_id=run_id,
            sequence=idx,
            parent_event_id=parent_id,
            timestamp=item.get("timestamp") or datetime.utcnow().isoformat(),
            component=component,
            event_type=event_type,
            input=inp if isinstance(inp, dict) else {"raw": inp},
            output=out if isinstance(out, dict) else {"raw": out},
            status=status,
            duration_ms=item.get("duration_ms") or 100,
            metadata=item.get("metadata") or {}
        )
        normalized_events.append(event)
        previous_event_id = event_id

    return normalized_events
