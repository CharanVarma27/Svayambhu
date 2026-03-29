import requests
from abc import ABC, abstractmethod
from models.shared_context import WorkflowState

class BaseAgent(ABC):
    """
    Abstract Base Class for all MCP-style Agents.
    Takes the shared WorkflowState context, mutates it, and returns it.
    """
    def __init__(self, log_agent, backend_url="http://127.0.0.1:8081/api/v1/workflows"):
        self.log_agent = log_agent
        self.backend_url = backend_url

    def update_status(self, workflow_id: str, status: str, current_agent: str):
        # HARDCODED FAIL-SAFE: If the network is lagging, we do NOT wait.
        try:
            # Short 1.0s timeout to prevent thread hanging on Windows
            requests.put(
                f"{self.backend_url}/{workflow_id}/status", 
                json={"status": status, "currentAgent": current_agent},
                timeout=1.0
            )
        except Exception:
            # Silent fail for Demo continuity - print to console only
            print(f"[FAIL-SAFE] Could not sync status for {workflow_id} to {status}. Proceeding to maintain demo flow.")

    @abstractmethod
    def process(self, state: WorkflowState) -> WorkflowState:
        pass
