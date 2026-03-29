# Svayambhu — Autonomous Multi-Agent AI Workflow Orchestrator


## 🎯 Key Innovations

| Feature | Description |
|---|---|
| 🧠 **LLM-to-DAG Engine** | Converts natural language → Google Gemini → executable multi-agent DAG |
| 🔗 **MCP-Style Agent Bus** | 7 specialized agents sharing a live context state pipeline |
| 🛡️ **Human-in-the-Loop Vault** | Auto-detects high-risk nodes, suspends execution, requires manager approval |
| 🏥 **3-Phase Self-Healing** | Retry → Failover → Replan on any execution failure, zero downtime |
| 🎤 **Voice-to-Workflow** | Web Speech API converts spoken goals to dispatched pipelines |
| 🔬 **Simulation Engine** | Pre-flight risk/cost audit before any real workflow runs |
| 📊 **Enterprise ROI Analytics** | Live financial telemetry: hours saved, cost avoidance, autonomy rates |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           React Frontend (Port 5173)         │
│  Dashboard │ Workflows │ GraphView │ Analytics│
└────────────────────┬────────────────────────┘
                     │ REST API
    ┌────────────────┴───────────────────┐
    │   Spring Boot Backend (Port 8081)  │
    │   Workflow CRUD │ AgentLog Storage │
    └────────────────┬───────────────────┘
                     │ Agent Dispatch
    ┌────────────────┴───────────────────────────────────┐
    │              FastAPI AI Service (Port 8000)         │
    │                                                     │
    │  PlannerAgent → ExecutionAgent → SLAAgent           │
    │       ↓               ↓               ↓            │
    │  RecoveryAgent ← MonitorAgent  VerificationAgent    │
    │                                                     │
    │              Google Gemini 2.0 Flash LLM            │
    └─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Java 17+, Maven
- Python 3.10+, pip
- Node.js 18+
- MySQL 8+

### 1. Database
```sql
CREATE DATABASE svayambhudb;
```

### 2. Backend (Spring Boot)
```bash
cd backend
.\mvnw.cmd spring-boot:run
# Runs on http://localhost:8081
```

### 3. AI Service (FastAPI)
```bash
cd ai-service
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
# Add GEMINI_API_KEY to .env (optional — works without it in fallback mode)
uvicorn main:app --port 8000 --reload
```

### 4. Frontend (React)
```bash
cd frontend
npm install && npm run dev
# Open http://localhost:5173
```

---

## 💼 Business Use Cases

- **HR → Legal Onboarding**: Automates multi-department approval chains
- **Procurement-to-Payment**: Validates, approves, and commits financial flows
- **Contract Finalization**: Human gates for legal review before AI commits

---

## 🧠 How the AI Works

1. User types a natural language goal (e.g., *"Automate vendor invoice processing"*)
2. **PlannerAgent** sends the prompt to Gemini 2.0 Flash → receives a JSON DAG
3. **NetworkX** validates and topologically sorts the execution order
4. **ExecutionAgent** processes each node, emitting real-time audit logs
5. If a node contains `HUMAN_CHECK` → workflow enters **HITL Vault pause mode**
6. On manager approval → execution resumes from the next node
7. **RecoveryAgent** intercepts failures: 3-phase remediation loop
8. **VerificationAgent** validates final output against ISO compliance checks

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Framer Motion, Lucide Icons, TailwindCSS
- **Backend**: Spring Boot 3.4, Spring Data JPA, Lombok, MySQL 8
- **AI Layer**: FastAPI, Python 3.11, NetworkX, Google Gemini 2.0 Flash, Pydantic v2
- **Infrastructure**: Uvicorn ASGI, Maven Wrapper, Vite Dev Server

---
