# Svayambhu Hackathon Demonstration Guide 🚀

This guide ensures you can give a 10/10 presentation even if the Wi-Fi is shaky or the API is slow.

## 1. Preparation
1. Ensure all 3 terminals are running:
   - **Backend**: `.\mvnw.cmd spring-boot:run` (Port 8081)
   - **AI Service**: `uvicorn main:app --port 8000 --reload` (Port 8000)
   - **Frontend**: `npm run dev` (Port 5173)
2. (Optional) In `ai-service/.env`, paste your `GEMINI_API_KEY` for the "Wow" factor. If not present, the system will use the **Hardcoded Robust DAG Engine**.

## 2. The Winning Pitch Script

### 🚨 Emergency Troubleshooting
If an agent fails or says "System Failsafe Mode":

1.  **Check the Console**: I've enabled **High-Visibility Logging**. Look at the `uvicorn` (AI-service) terminal; it will print the exact reason (e.g., `GEMINI_API_KEY Missing`).
2.  **Hard Refresh**: Sometimes the UI state gets out of sync. Use `Ctrl + R` on the browser.
3.  **One-Click Restart**:
    - Stop the Python service (Ctrl+C in `ai-service` terminal).
    - Stop the Spring Boot service (Ctrl+C in `backend` terminal).
    - Restart both. The database will persist your workflows.
4.  **Delete & Re-Prompt**: If a specific workflow name is causing issues, **Delete** it from the Actions tab and try a simpler prompt like "Analyze enterprise data logs."

### Part 1: The Vision
"Most AI systems are just chatbots. **Svayambhu** is an Autonomous Multi-Agent Orchestrator. It doesn't just talk; it thinks in Graphs (DAGs) and executes complex enterprise loops with zero human intervention."

### Part 2: Voice-to-Workflow (The "Wow" moment)
1. Go to the **Workflows** page.
2. Click the **Microphone** icon.
3. Say clearly: *"Automate my procurement process and include a human security check."*
4. Watch as the AI parses the speech, builds a DAG, and dispatches it to the Agent Cluster.

### Part 3: The Brain (Analytics)
1. Navigate to the **Analytics & ROI** page.
2. Point out the **Autonomy Rate** and **Estimated Cost Savings**.
3. Explain: *"Svayambhu doesn't just run tasks; it predicts delays (SLA Agent) and heals itself (Recovery Agent)."*

### Part 4: The "Million Dollar Moment" (The Anomaly)
1. In **Workflows**, click the **"Golden P2P Flow"** preset.
2. Click the **"Simulate Anomaly"** button (It should glow **RED/Armed**).
3. Click **Dispatch**.
4. **The Drama**: Stage 2 (Verify Vendor) will **FAIL**. 
5. Explain: *"In an ordinary system, the business would stop here. But watch Svayambhu's **Recovery Agent** instantly self-heal the path."*
6. Show the logs as the recovery phases pass and the workflow resumes for a successful finish.

### Part 5: Human-in-the-Loop
1. Use the preset: **"HUMAN_CHECK Contract Finalization"**.
2. Show how the workflow "Pauses" in the UI with a glowing amber state.
3. Click **"Approve Override"** to show how humans and AI collaborate in a secure "Vault."


### Part 5: Transparency (Logs)
1. Open the **Logs** page.
2. Show the **"Reasoning"** column.
3. Say: *"Every decision made by our agents is explained. We don't have black boxes; we have a fully transparent audit trail."*

## 3. Trouble Shooting (Fail-Safes)
- **Stuck at Planner?** Click the **Delete (Trash)** icon to clear the queue and try again. 
- **API Timeout?** I have built a **Hardcoded Demo Mode**. If the AI server loses connection to the Backend, it will continue to simulate the workflow stages so your demo never "freezes" on stage.
