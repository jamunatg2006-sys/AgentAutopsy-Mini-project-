"""
Dependency Graph Builder (Engine 3)
Constructs a directed dependency graph of execution events using NetworkX,
allowing backward causal tracing from failure symptoms to root causes.
"""

from typing import List, Dict, Any, Set
import networkx as nx
from backend.app.schemas.event import TraceEvent


class ExecutionGraph:
    """
    Manages the directed execution graph of events in an agent run.
    """
    def __init__(self, events: List[TraceEvent]):
        self.events = events
        self.event_map = {e.event_id: e for e in events}
        # Directed graph: edge (A, B) means B depends on or was caused by A
        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self):
        """Builds nodes and edges from parent relationships and sequence order."""
        for event in self.events:
            # Add node with metadata for visualization
            self.graph.add_node(
                event.event_id,
                sequence=event.sequence,
                component=event.component,
                event_type=event.event_type.value,
                status=event.status.value,
                duration_ms=event.duration_ms
            )

        for i, event in enumerate(self.events):
            # 1. Edge from parent to child
            if event.parent_event_id and event.parent_event_id in self.event_map:
                self.graph.add_edge(event.parent_event_id, event.event_id, relation="parent_child")

            # 2. Sequential control-flow edge from previous step in the same chain
            if i > 0:
                prev_event = self.events[i - 1]
                if not self.graph.has_edge(prev_event.event_id, event.event_id):
                    self.graph.add_edge(prev_event.event_id, event.event_id, relation="sequence_flow")

    def get_upstream_ancestors(self, event_id: str) -> Set[str]:
        """
        Traces backward from a given event (e.g. symptom) to all steps that contributed to it.
        """
        if event_id not in self.graph:
            return set()
        # In a directed graph where edges point forward, ancestors are upstream predecessors
        return nx.ancestors(self.graph, event_id)

    def get_downstream_impact(self, event_id: str) -> Set[str]:
        """
        Traces forward to find all subsequent steps affected by this event.
        """
        if event_id not in self.graph:
            return set()
        return nx.descendants(self.graph, event_id)

    def to_react_flow(self) -> Dict[str, Any]:
        """
        Converts the NetworkX graph into standard React Flow nodes and edges
        ready for visualization in the frontend.
        """
        nodes = []
        for node_id, attrs in self.graph.nodes(data=True):
            event = self.event_map.get(node_id)
            nodes.append({
                "id": node_id,
                "data": {
                    "label": f"#{attrs.get('sequence')} {attrs.get('component')}",
                    "component": attrs.get("component"),
                    "type": attrs.get("event_type"),
                    "status": attrs.get("status"),
                    "event_id": node_id,
                    "input": event.input if event else {},
                    "output": event.output if event else {}
                },
                "position": {"x": 150, "y": attrs.get("sequence", 1) * 90}
            })

        edges = []
        for u, v, data in self.graph.edges(data=True):
            edges.append({
                "id": f"e_{u}_{v}",
                "source": u,
                "target": v,
                "label": data.get("relation", "flow"),
                "animated": data.get("relation") == "sequence_flow"
            })

        return {"nodes": nodes, "edges": edges}
