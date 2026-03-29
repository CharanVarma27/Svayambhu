import time
import requests
import networkx as nx
from agents.base_agent import BaseAgent
from models.shared_context import WorkflowState
from logs.log_agent import LogAgent
from utils.llm_client import generate_dag_from_prompt

class PlannerAgent(BaseAgent):
    def __init__(self, log_agent: LogAgent, backend_url="http://127.0.0.1:8081/api/v1/workflows"):
        self.log_agent = log_agent
        self.backend_url = backend_url

    def process(self, state: WorkflowState) -> WorkflowState:
        # Update System status
        self.update_status(state.workflow_id, "flowing", "Planner")
        
        self.log_agent.log(state.workflow_id, "Planner", "INFO", "Parsed user intent", reason=f"Received natural language input: '{state.original_prompt}'")
        time.sleep(1)
        
        # Build DAG representation of the workflow using NetworkX
        self.log_agent.log(state.workflow_id, "Planner", "INFO", "Constructing Directed Acyclic Graph (DAG)", reason="Graph structure optimizes execution sequence and dependency matching.")
        G = nx.DiGraph()
        
        user_key = state.context_data.get("gemini_key")
        user_model = state.context_data.get("ai_model")

        
        dag_json = generate_dag_from_prompt(state.original_prompt, api_key=user_key, model_name=user_model)

        
        if dag_json and "nodes" in dag_json and "edges" in dag_json:
            self.log_agent.log(state.workflow_id, "Planner", "SUCCESS", "Dynamically synthesized DAG using Google Gemini LLM API.", reason="Real-time generative AI context injection successful.")
            for node in dag_json.get("nodes", []):
                G.add_node(node.get("id", 1), name=node.get("name", "Unknown"), owner=node.get("owner", "System"))
            for pair in dag_json.get("edges", []):
                if len(pair) == 2:
                    G.add_edge(pair[0], pair[1])
        else:
            self.log_agent.log(state.workflow_id, "Planner", "WARN", "LLM Generation bypassed or failed. Falling back to deterministic procedural DAGs.", reason="Missing GEMINI_API_KEY or connection timeout.")
            if "HUMAN_CHECK" in state.original_prompt.upper() or "HUMAN" in state.original_prompt.upper():
                self.log_agent.log(state.workflow_id, "Planner", "WARN", "Detected high-risk policy string. Injecting Human-in-the-Loop node.", reason="Enterprise safety constraints require manual overrides for identified keywords.")
                G.add_node(1, name="Extract Metadata", owner="DataSystem")
                G.add_node(2, name="HUMAN_CHECK Security Gate", owner="Manager_Authorization")
                G.add_node(3, name="Finalize Transaction", owner="LedgerSystem")
                G.add_edges_from([(1, 2), (2, 3)])
            else:
                # Add nodes with metadata
                G.add_node(1, name="Extract Metadata", owner="DataSystem")
                G.add_node(2, name="LLM Summarization", owner="NvidiaNim")
                G.add_node(3, name="Data Validation", owner="VerificationCheck")
                G.add_node(4, name="Database Commit", owner="PostgresDB")
                # Create DAG directed edges (Dependencies)
                G.add_edges_from([(1, 2), (2, 3), (3, 4)])
        
        # Topological Sort to compile sequence
        execution_order = list(nx.topological_sort(G))
        state.steps = [{"name": G.nodes[n]["name"], "status": "pending", "owner": G.nodes[n]["owner"]} for n in execution_order]
        
        time.sleep(1)
        self.log_agent.log(state.workflow_id, "Planner", "INFO", f"Compiled {len(state.steps)} DAG nodes to linear queue", reason="Topological sort completed without cycles.")
        
        # Update state locally
        state.status = "flowing"
        state.current_agent = "Execution"
        
        # Sync with backend System of Record
        self.update_status(state.workflow_id, "flowing", "Execution")
            
        return state
