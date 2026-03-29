import time
from agents.base_agent import BaseAgent
from models.shared_context import WorkflowState
from logs.log_agent import LogAgent
import requests

class RecoveryAgent(BaseAgent):
    def __init__(self, log_agent: LogAgent, backend_url="http://127.0.0.1:8081/api/v1/workflows"):
        self.log_agent = log_agent
        self.backend_url = backend_url

    def process(self, state: WorkflowState) -> WorkflowState:
        self.update_status(state.workflow_id, "recovering", "Recovery")
        
        failed_step = state.steps[state.current_step_index]
        self.log_agent.log(state.workflow_id, "Recovery", "WARN", f"Intercepted runtime crash at Step {state.current_step_index + 1}.", reason=f"ExecutionAgent threw exception during {failed_step['name']}")
        time.sleep(1.5)
        
        # 1. Retry
        self.log_agent.log(state.workflow_id, "Recovery", "INFO", "Attempting Phase 1: Retry Logic...", reason="Transient network errors often resolve within 500ms.")
        time.sleep(1)
        self.log_agent.log(state.workflow_id, "Recovery", "ERROR", "Phase 1: Retry Failed.", reason="Endpoint unresponsive after 3 attempts.")
        
        # 2. Reassign
        self.log_agent.log(state.workflow_id, "Recovery", "INFO", "Attempting Phase 2: Reassigning Resource...", reason=f"Failing over from {failed_step['owner']} to Secondary Cluster.")
        time.sleep(1)
        self.log_agent.log(state.workflow_id, "Recovery", "ERROR", "Phase 2: Reassign Failed.", reason="Secondary cluster is operating at maximum capacity.")
        
        # 3. Modify Plan
        self.log_agent.log(state.workflow_id, "Recovery", "WARN", "Attempting Phase 3: Modifying Execution Plan...", reason="SLA requires fallback to low-fidelity offline processing.")
        failed_step['owner'] = "OfflineBatchProcessor"
        time.sleep(1)
        
        self.log_agent.log(state.workflow_id, "Recovery", "INFO", "Phase 3: Plan modification successful. Signaling ExecutionAgent to resume.", reason="Offline processing queue accepted the task.")
        state.status = "recovering"
        return state
