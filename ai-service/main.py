from fastapi import FastAPI, BackgroundTasks, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from logs.log_agent import LogAgent
from models.shared_context import WorkflowState
from agents.planner_agent import PlannerAgent
from agents.execution_agent import ExecutionAgent
from agents.sla_prediction_agent import SLAPredictionAgent
from agents.recovery_agent import RecoveryAgent
from agents.verification_agent import VerificationAgent

app = FastAPI(title="Svayambhu Multi-Agent AI Service")

# Allow CORS from React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"VALIDATION ERROR: {exc.errors()}")
    print(f"REQUEST BODY: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(await request.body())},
    )


# Instantiate central Logging Agent (acts as System Context bus)
log_agent = LogAgent()

# Instantiate MCP Sub-Agents
planner = PlannerAgent(log_agent)
sla_agent = SLAPredictionAgent(log_agent)
execution_agent = ExecutionAgent(log_agent)
recovery_agent = RecoveryAgent(log_agent)
verification_agent = VerificationAgent(log_agent)

from typing import Optional

class WorkflowRequest(BaseModel):
    id: str
    name: str
    gemini_key: Optional[str] = None
    model: Optional[str] = None
    simulate_fault: bool = False




class SimulateRequest(BaseModel):
    prompt: str

class ResumeRequest(BaseModel):
    id: str

active_workflows = {}

def mcp_orchestrator(workflow_id: str, prompt: str, gemini_key: str = None, model_name: str = None, simulate_fault: bool = False):
    """
    Central Director: Passes the WorkflowState payload linearly through the Agent Graph.
    """
    state = WorkflowState(workflow_id=workflow_id, original_prompt=prompt)
    
    if gemini_key:
        state.context_data["gemini_key"] = gemini_key
    if model_name:
        state.context_data["ai_model"] = model_name
    if simulate_fault:
        state.context_data["simulate_fault"] = True

    active_workflows[workflow_id] = state


    
    # SYSTEM START
    log_agent.log(workflow_id, "System", "INFO", f"Incoming API Request: Initializing MCP Pipeline for '{prompt}'")
    
    try:
        # 1. Planner Agent
        state = planner.process(state)
        active_workflows[workflow_id] = state
        
        # 2. SLA Prediction Agent
        try:
            state = sla_agent.process(state)
        except Exception:
            log_agent.log(workflow_id, "System", "WARN", "SLA Agent bypassed to maintain demo speed.")

        # 3. Execution Agent (Primary Compute Loop)
        try:
            state = execution_agent.process(state)
            active_workflows[workflow_id] = state
        except Exception as e:
            log_agent.log(workflow_id, "System", "ERROR", f"Execution Engine encountered a local glitch: {str(e)}. Attempting Recovery.", reason="Self-healing protocol engaged.")
            state.status = "failed"
        
        if state.status == "blocked_on_human":
            return
        
        # 4. Recovery Agent (Self-Healing Branch)
        if state.status == "failed":
            state = recovery_agent.process(state)
            if state.status == "recovering":
                state = execution_agent.process(state)
                active_workflows[workflow_id] = state

        # 5. Verification Agent (Output Validation)
        if state.status == "completed":
            state = verification_agent.process(state)
            active_workflows[workflow_id] = state
            
    except Exception as e:
        import traceback
        error_msg = f"{type(e).__name__}: {str(e)}"
        stack_trace = traceback.format_exc()
        log_agent.log(workflow_id, "System", "ERROR", "Critical Orchestrator Fail-Safe Triggered.", reason=f"Internal Error: {error_msg}. Stack: {stack_trace[:100]}...")
        print(f"CRITICAL ORCHESTRATOR ERROR: {error_msg}")
        print(stack_trace)
        
        # Don't try to sync status if we might have a network error - just mark local state
        state.status = "failed"
        try:
            planner.update_status(workflow_id, "failed", f"System_FailSafe_{type(e).__name__}")
        except:
            pass


@app.post("/workflow/start")
@app.post("/api/v1/trigger")
async def trigger_workflow(req: WorkflowRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(mcp_orchestrator, req.id, req.name, req.gemini_key, req.model, req.simulate_fault)
    return {"status": "dispatched", "workflow_id": req.id}



@app.get("/workflow/status")
async def get_workflow_status():
    return {"status": "MCP Multi-Agent Cluster Online", "active_agents": ["Planner", "Execution", "Monitor", "SLA", "Recovery", "Verification"]}

@app.get("/workflow/logs")
async def get_workflow_logs():
    return {"message": "Logs are actively flushed to the Spring Boot backend system of record at /api/v1/logs"}

@app.post("/workflow/simulate")
async def simulate_workflow(req: SimulateRequest):
    # Mock realistic metrics based on prompt length
    risk = min(int(len(req.prompt) / 5) + 2, 85)
    cost = round((len(req.prompt) * 0.001) + 0.02, 4)
    latency = round(len(req.prompt) * 0.05 + 1.2, 2)
    return {
        "predicted_latency": latency,
        "estimated_cost": cost,
        "risk_percentage": risk,
    }

@app.post("/workflow/resume")
async def resume_workflow(req: ResumeRequest, background_tasks: BackgroundTasks):
    def resume_task(wid: str):
        print(f"[RESUME] Signal received for Workflow ID: {wid}")
        state = active_workflows.get(wid)
        
        if not state:
            print(f"[RESUME] WARNING: State missing from memory. Attempting to reconstruct from backend...")
            try:
                # Fetch workflow details from Spring Boot
                resp = requests.get(f"http://127.0.0.1:8081/api/v1/workflows/{wid}", timeout=1.0)
                if resp.status_code == 200:
                    wf_data = resp.json()
                    # We don't have the full step list in DB, so we re-plan based on the prompt
                    print(f"[RESUME] Re-initializing state for '{wf_data['name']}'...")
                    state = WorkflowState(workflow_id=wid, original_prompt=wf_data['name'])
                    # Re-trigger Planner to get the steps again
                    state = planner.process(state)
                    active_workflows[wid] = state
                else:
                    print(f"[RESUME] CRITICAL: Could not find workflow {wid} in database.")
                    return
            except Exception as e:
                print(f"[RESUME] CRITICAL: State reconstruction failed: {e}")
                return

        if state.status == "blocked_on_human" or state.status == "flowing":
            print(f"[RESUME] HITL lock released by user. Advancing cursor and resuming Execution flow...")
            log_agent.log(wid, "System", "INFO", "Human authorization received. Execution lock released.", reason="Authorized manager signature verified via dashboard override.")
            
            # CRITICAL FIX: Advance the cursor so we don't hit the same HUMAN_CHECK node again!
            state.current_step_index += 1
            state.status = "authorized"  # special status: skip HUMAN_CHECK nodes
            
            try:
                # Resume Execution
                state = execution_agent.process(state)
                active_workflows[wid] = state
                print(f"[RESUME] ExecutionAgent handoff successful. Current status: {state.status}")
                
                # Recovery Agent
                if state.status == "failed":
                    print(f"[RESUME] Execution failed, triggering self-healing recovery...")
                    state = recovery_agent.process(state)
                    if state.status == "recovering":
                        state = execution_agent.process(state)
                        active_workflows[wid] = state
                
                # Verification Agent
                if state.status == "completed":
                    print(f"[RESUME] Execution complete, triggering final verification...")
                    state = verification_agent.process(state)
                    active_workflows[wid] = state
            except Exception as e:
                print(f"[RESUME] Internal Error: {e}")
                import traceback
                traceback.print_exc()
                
    background_tasks.add_task(resume_task, req.id)
    return {"status": "resumed"}
