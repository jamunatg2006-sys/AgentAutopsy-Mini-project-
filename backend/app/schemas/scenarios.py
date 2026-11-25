"""
Scenario Schema
Typed models for the 10 benchmark scenarios.
"""

from typing import Optional
from pydantic import BaseModel, Field


class BenchmarkScenarioModel(BaseModel):
    """
    Representation of a single benchmark test case (F01-F05, P01-P05).
    """
    scenario_id: str = Field(..., description="ID like F01 or P01")
    fault_type: str = Field(..., description="Category of failure or passing_control")
    name: str = Field(..., description="Human readable scenario title")
    description: str = Field(..., description="Scenario narrative and injected fault description")
    order_id: str = Field(..., description="Target synthetic order ID")
    customer_message: str = Field(..., description="Simulated customer request message")
    expected_verdict: str = Field(..., description="'PASS' or 'FAIL'")
    decisive_step_type: Optional[str] = Field(None, description="Event type of decisive mistake (for failures)")
    decisive_step_component: Optional[str] = Field(None, description="Component of decisive mistake")
    expected_failure_symptom: Optional[str] = Field(None, description="What failure shows at the end")
