import time
import random
import requests
from agents.base_agent import BaseAgent
from models.shared_context import WorkflowState
from logs.log_agent import LogAgent

class ExecutionAgent(BaseAgent):
    def __init__(self, log_agent: LogAgent, backend_url="http://127.0.0.1:8081/api/v1/workflows"):
        self.log_agent = log_agent
        self.backend_url = backend_url

    def process(self, state: WorkflowState) -> WorkflowState:
        self.update_status(state.workflow_id, "flowing", "Execution")
        self.log_agent.log(state.workflow_id, "Execution", "INFO", "Seizing resource slots and spinning up required modules.", reason="Agent graph initialization sequence started.")
        time.sleep(1)

        for i in range(state.current_step_index, len(state.steps)):
            step = state.steps[i]
            state.current_step_index = i
            
            self.log_agent.log(state.workflow_id, "Execution", "INFO", f"Executing Step {i+1}: {step['name']} assigned to {step['owner']}", reason="Dependencies cleared. Resource allocation granted.")
            time.sleep(1.5)
            
            # Human in the loop pause — skip if this is a human-authorized resumption
            if "HUMAN_CHECK" in step['name'] and state.status not in ["recovering", "authorized"]:
                self.log_agent.log(state.workflow_id, "Execution", "WARN", f"Execution Paused: Awaiting human authorization for '{step['name']}'", reason="HITL Vault node triggered. Awaiting manager cryptographic signature.")
                state.status = "blocked_on_human"
                self.update_status(state.workflow_id, "blocked_on_human", "Human")
                return state
            
            # Simulated Agentic Validation Error for Hackathon Demo
            if state.context_data.get("simulate_fault") and i == 1 and state.status != "recovering":

                self.log_agent.log(state.workflow_id, "Execution", "ERROR", f"Critical anomaly detected in '{step['name']}'!", reason="Downstream service timeout or malformed payload. Initiating fail-safe break.")
                state.status = "failed"
                return state

                
            step['status'] = "completed"

        state.status = "completed"
        return state
