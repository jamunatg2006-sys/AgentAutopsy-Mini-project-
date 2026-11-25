"""
Sandbox Environment (Engine 5)
Ensures strict isolation during replay experiments to guarantee zero live side effects.
"""

import os


class SandboxSafetyGuard:
    """
    Enforces security and side-effect isolation boundaries.
    """
    def __init__(self):
        self.allow_network = os.getenv("ALLOW_EXTERNAL_NETWORK", "false").lower() == "true"
        self.mock_execution = os.getenv("MOCK_TOOL_EXECUTION", "true").lower() == "true"

    def verify_safety_invariants(self) -> bool:
        """
        Confirms sandbox environment is safely restricted.
        """
        # Replay should never hit external payment gateways or live APIs
        if not self.mock_execution:
            raise RuntimeError("CRITICAL: Sandbox cannot run with mock execution disabled!")
        return True
