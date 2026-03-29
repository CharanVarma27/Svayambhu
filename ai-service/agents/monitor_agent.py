import threading
import time
import random

class MonitorAgent:
    def __init__(self, log_agent):
        self.log_agent = log_agent
        self.active_monitors = {}

    def start_monitoring_step(self, workflow_id: str, step: dict):
        step_id = step['id']
        stop_event = threading.Event()
        self.active_monitors[step_id] = stop_event
        
        def monitor_task():
            while not stop_event.is_set():
                if random.random() < 0.05:
                    self.log_agent.log(workflow_id, "Monitor", "WARN", f"High CPU utilization detected during: {step['action']}")
                time.sleep(1)
                
        t = threading.Thread(target=monitor_task)
        t.daemon = True
        t.start()
        self.log_agent.log(workflow_id, "Monitor", "DEBUG", f"Started telemetry for step: {step['action']}")

    def stop_monitoring_step(self, workflow_id: str, step: dict):
        step_id = step['id']
        if step_id in self.active_monitors:
            self.active_monitors[step_id].set()
            del self.active_monitors[step_id]
            self.log_agent.log(workflow_id, "Monitor", "DEBUG", f"Stopped telemetry for step: {step['action']}")
