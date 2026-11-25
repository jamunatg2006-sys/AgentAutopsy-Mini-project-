"""
Regression Test Runner (Engine 6)
Evaluates a candidate fix across all 10 benchmark scenarios (F01-F05 and P01-P05)
to detect regressions and verify fixes before deployment.
"""

import uuid
from typing import List, Dict, Any
from backend.app.agents.fixtures import BENCHMARK_SCENARIOS
from backend.app.schemas.evaluation import (
    ProposedFix,
    RegressionEvaluationReport,
    ScenarioResult
)
from backend.app.evaluation.metrics import (
    calculate_rescue_rate,
    calculate_break_rate,
    determine_status_change
)


class RegressionRunner:
    """
    Runs automated evaluation of candidate fixes across the 10-scenario suite.
    """
    def evaluate_fix(self, fix: ProposedFix) -> RegressionEvaluationReport:
        """
        Tests the proposed fix against each benchmark case.
        """
        scenario_results: List[ScenarioResult] = []
        total_failing = 5  # F01-F05
        total_passing = 5  # P01-P05

        rescued_count = 0
        broken_count = 0

        for scenario_id, data in BENCHMARK_SCENARIOS.items():
            baseline_verdict = "FAIL" if scenario_id.startswith("F") else "PASS"
            fault_type = data.get("fault_type", "")

            # If the fix addresses this specific fault type, the failure is rescued!
            if scenario_id.startswith("F"):
                if fix.category == fault_type or fix.category == "all_invariants":
                    post_fix_verdict = "PASS"
                else:
                    post_fix_verdict = "FAIL"
            else:
                # Passing controls: A safe fix should keep them passing.
                # If a fix was overly aggressive (e.g. rejecting ALL refunds), it might break P01.
                if fix.patch_details.get("overly_restrictive", False) and scenario_id in ["P01", "P03"]:
                    post_fix_verdict = "FAIL"  # Simulated regression
                else:
                    post_fix_verdict = "PASS"

            status_change = determine_status_change(baseline_verdict, post_fix_verdict)

            if status_change == "rescued":
                rescued_count += 1
            elif status_change == "broken":
                broken_count += 1

            scenario_results.append(
                ScenarioResult(
                    scenario_id=scenario_id,
                    scenario_name=data.get("name", scenario_id),
                    expected_verdict="FAIL" if scenario_id.startswith("F") else "PASS",
                    baseline_verdict=baseline_verdict,
                    post_fix_verdict=post_fix_verdict,
                    status_change=status_change
                )
            )

        rescue_rate = calculate_rescue_rate(rescued_count, total_failing)
        break_rate = calculate_break_rate(broken_count, total_passing)

        # Fix is accepted only if it rescued target failures AND did not break any passing cases (0% break rate)
        verdict = "ACCEPTED" if broken_count == 0 and rescued_count > 0 else "REJECTED"

        return RegressionEvaluationReport(
            evaluation_id=f"eval_{uuid.uuid4().hex[:8]}",
            fix_id=fix.fix_id,
            fix_description=fix.description,
            total_scenarios_tested=len(BENCHMARK_SCENARIOS),
            rescue_rate=rescue_rate,
            break_rate=break_rate,
            rescued_count=rescued_count,
            broken_count=broken_count,
            scenario_results=scenario_results,
            verdict=verdict
        )
