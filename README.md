# Agent Autopsy: AI That Investigates Why AI Agents Fail

> Developer-focused failure investigation and debugging platform for multi-step AI-agent workflows.

---

## 🎯 Core Promise
Show developers not only that an agent failed, but **which earlier decision most likely caused the failure**, **what evidence supports that diagnosis**, and **whether a proposed fix improves the result in a safe replay**.

```
TRACE  ➔  INVESTIGATE  ➔  INTERVENE SAFELY  ➔  COMPARE  ➔  VALIDATE
```

---

## 🏗️ Architecture & Core Engines

1. **Engine 1 — Execution Capture & Trace Normalization**: Captures model calls, tool calls, state transitions into immutable, structured traces.
2. **Engine 2 — Failure Detection & Outcome Evaluation**: Deterministic checks, domain assertions, and invariant evaluation.
3. **Engine 3 — Dependency & Causal Analysis**: Builds directed execution dependency graphs (`NetworkX`) to track input/output lineage and rank candidate error steps.
4. **Engine 4 — LLM Diagnosis Assistant**: Uses structured LLM prompts (`Gemini API`) anchored to trace evidence IDs to explain root-cause hypotheses.
5. **Engine 5 — Replay Lab & Interventions**: Safely tests counterfactual interventions (replace input/output/mock tool result, modify prompt) in an isolated sandbox.
6. **Engine 6 — Fix Validation & Regression**: Evaluates candidate fixes against labelled test suites (5 failing cases, 5 passing controls) to measure rescue and break rates.

---

## 👥 Team Workstreams & Ownership

| Member | Role | Primary Ownership |
|---|---|---|
| **Avinash Singh Pal** | Core Builder 1 — Agent & Backend Lead | LangGraph demo agent, trace instrumentation, FastAPI app, MongoDB persistence, API integration |
| **Jamuna T.G.** | Core Builder 2 — Investigation & AI Lead | Failure detection rules, dependency analysis (`NetworkX`), LLM diagnosis contracts, candidate ranking, system coordination |
| **K. Monisha** | Replay & Validation Engineer | Isolated sandbox replay runner, intervention types, mock tools & fixtures, regression test suite |
| **Harshit Malik** | Frontend & Visualization Engineer | React dashboard, timeline explorer, React Flow dependency graph, Replay comparison UI, reports |

---

## 📁 Project Directory Structure

```text
AgentAutopsy/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entrypoint
│   │   ├── api/                     # REST API routers (runs, trace, autopsy, experiments, fixes, reports)
│   │   ├── agents/                  # LangGraph support demo agent & mock tools
│   │   ├── tracing/                 # Trace logger, hooks & normalizer
│   │   ├── schemas/                 # Pydantic data models & contracts
│   │   ├── db/                      # MongoDB client & collection repositories
│   │   ├── diagnosis/               # Assertions, rule engine, ranker & LLM diagnosis
│   │   ├── dependency/              # NetworkX dependency graph builder
│   │   ├── replay/                  # Sandbox runner, intervention handlers
│   │   ├── evaluation/              # Regression runner & metrics calculator
│   │   └── reports/                 # Autopsy report generator
│   └── requirements.txt             # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/                   # Main views (Overview, Runs, Autopsy, Replay, Reports)
│   │   ├── components/              # Shared UI components
│   │   ├── features/                # Domain-specific modules (timeline, graph, replay, etc.)
│   │   ├── api/                     # API client services
│   │   └── types/                   # TypeScript interfaces matching backend schemas
│   └── package.json
├── tests/
│   ├── unit/                        # Unit tests for engines
│   ├── integration/                 # End-to-end API & integration tests
│   └── scenarios/                   # 10 labelled test cases (F01-F05, P01-P05)
├── sample_traces/                   # Saved trace fixtures for testing & offline development
├── docs/                            # Design documents, architecture diagrams & schemas
├── .env.example                     # Environment configuration template
├── docker-compose.yml               # Local development stack (App + MongoDB)
└── README.md
```

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp ../.env.example .env
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
