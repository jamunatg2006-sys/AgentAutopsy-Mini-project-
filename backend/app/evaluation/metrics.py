"""
Regression Metrics (Engine 6)
Computes scientific regression metrics (Rescue Rate and Break Rate)
to verify if a fix genuinely improves performance without regressions.
"""


def calculate_rescue_rate(rescued_count: int, total_failing_cases: int) -> float:
    """
    Rescue Rate: Percentage of previously failing cases that now pass with the fix.
    Formula: (Rescued Cases / Total Failing Cases) * 100
    """
    if total_failing_cases == 0:
        return 0.0
    return round((rescued_count / total_failing_cases) * 100.0, 1)


def calculate_break_rate(broken_count: int, total_passing_cases: int) -> float:
    """
    Break Rate: Percentage of previously passing controls that now fail (regressions).
    Formula: (Broken Passing Cases / Total Passing Cases) * 100
    Target: Must be 0.0% for an acceptable fix.
    """
    if total_passing_cases == 0:
        return 0.0
    return round((broken_count / total_passing_cases) * 100.0, 1)


def determine_status_change(baseline_verdict: str, post_fix_verdict: str) -> str:
    """
    Classifies the transition of a test case after applying a fix.
    """
    if baseline_verdict == "FAIL" and post_fix_verdict == "PASS":
        return "rescued"
    elif baseline_verdict == "PASS" and post_fix_verdict == "FAIL":
        return "broken"
    elif baseline_verdict == "PASS" and post_fix_verdict == "PASS":
        return "preserved_pass"
    else:
        return "still_failed"
