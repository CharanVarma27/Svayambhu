from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class WorkflowState(BaseModel):
    workflow_id: str
    original_prompt: str
    steps: List[Dict[str, Any]] = Field(default_factory=list)
    current_step_index: int = 0
    current_agent: str = "Planner"
    status: str = "pending" # pending, flowing, recovering, completed, failed
    context_data: Dict[str, Any] = Field(default_factory=dict)
