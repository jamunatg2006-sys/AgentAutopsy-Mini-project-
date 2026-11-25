"""
Evaluation & Regression Schema
Defines structures for candidate fix versions, test matrices, and regression metrics.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class ScenarioResult(BaseModel):
    """Result of running a fix against one scenario."""
    scenario_id: str = Field(..., description="e.g., F01, P01")
    scenario_name: str = Field(..., description="Scenario title")
    expected_verdict: str = Field(..., description="'PASS' or 'FAIL'")
    baseline_verdict: str = Field(..., description="Original result before fix")
    post_fix_verdict: str = Field(..., description="Result with fix applied")
    status_change: str = Field(..., description="'rescued', 'broken', 'preserved_pass', 'still_failed'")


class RegressionEvaluationReport(BaseModel):
    """Overall evaluation report across the 10 benchmark test cases."""
    evaluation_id: str = Field(..., description="Unique evaluation ID")
    fix_id: str = Field(..., description="Fix being tested")
    fix_description: str = Field(..., description="Summary of fix applied")
    total_scenarios_tested: int = Field(default=10, description="Total cases run")
    rescue_rate: float = Field(..., description="Percentage of failing cases fixed (0.0 to 100.0%)")
    break_rate: float = Field(..., description="Percentage of passing cases broken (0.0 to 100.0%)")
    rescued_count: int = Field(default=0, description="Number of failures rescued")
    broken_count: int = Field(default=0, description="Number of passes broken")
    scenario_results: List[ScenarioResult] = Field(default_factory=list, description="Per-scenario breakdown")
    verdict: str = Field(..., description="'ACCEPTED' or 'REJECTED'")
    evaluated_at: datetime = Field(default_factory=datetime.utcnow, description="Evaluation timestamp")


class ProposedFix(BaseModel):
    """A proposed fix to be evaluated across the regression suite."""
    fix_id: str = Field(..., description="Unique fix ID")
    name: str = Field(..., description="Short title for fix")
    description: str = Field(..., description="Detailed description of what fix changes")
    category: str = Field(..., description="Target fault category")
    patch_details: Dict[str, Any] = Field(default_factory=dict, description="Configuration or prompt patch")
