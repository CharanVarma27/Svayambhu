import requests
from datetime import datetime

class LogAgent:
    def __init__(self, backend_url="http://127.0.0.1:8081/api/v1/logs"):
        self.backend_url = backend_url

    def log(self, workflow_id, agent_name, level, message, reason=None):
        payload = {
            "workflowId": workflow_id,
            "agentName": agent_name,
            "level": level,
            "message": message,
            "reason": reason,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            # Ultra short timeout for demo speed
            requests.post(self.backend_url, json=payload, timeout=0.8)
        except Exception:
            # Fallback to local console print if backend is struggling
            print(f"[{agent_name}] {level}: {message} (Reason: {reason})")
