# Agent Autopsy: Project Progress Tracker & Checklist

> **Current Status:** Jamuna's Core Investigation Engines Completed & Verified ✅  
> **Next Up:** Avinash's LangGraph Agent, Mock Tools & MongoDB Backend APIs

---

## Jamuna's Deliverables Checklist (Investigation, AI & Testing)

| Status | Task / Component | Target File | Description |
|:---:|---|---|---|
| [x] | **10 Benchmark Scenarios & Taxonomy** | [`backend/app/agents/fixtures.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/agents/fixtures.py) | Created 5 injected failure scenarios (`F01–F05`) and 5 passing controls (`P01–P05`). |
| [x] | **Synthetic Data Fixtures** | [`backend/app/agents/fixtures.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/agents/fixtures.py) | Mock orders (`SYN-1001` to `SYN-1042`), 2026 authoritative policy, and 2021 deprecated policy. |
| [x] | **Trace Event Schema (CEF)** | [`backend/app/schemas/event.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/schemas/event.py) | Common Event Format with sequence numbers, component, inputs, outputs, timestamps, and parent links. |
| [x] | **Run & Scenario Schemas** | [`backend/app/schemas/run.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/schemas/run.py), [`backend/app/schemas/scenarios.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/schemas/scenarios.py) | Data contracts for agent runs, lifecycle states, and benchmark scenario models. |
| [x] | **Deterministic Invariant Rules (Engine 2)** | [`backend/app/diagnosis/rules.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/diagnosis/rules.py) | Rule checks for trust boundary overrides, stale policy retrieval, schema errors, and state leaks. |
| [x] | **Outcome Evaluator (Engine 2)** | [`backend/app/diagnosis/outcome_evaluator.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/diagnosis/outcome_evaluator.py) | Verifies pass/fail status, flags invariant violations, and compiles suspicious event IDs. |
| [x] | **NetworkX Dependency Graph (Engine 3)** | [`backend/app/dependency/graph_builder.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/dependency/graph_builder.py) | Directed graph builder with backward ancestor tracing and direct React Flow UI export. |
| [x] | **Candidate Step Ranker (Engine 3)** | [`backend/app/diagnosis/ranker.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/diagnosis/ranker.py) | Scores and ranks candidate error steps by rule severity and graph proximity. |
| [x] | **LLM Diagnosis Assistant (Engine 4)** | [`backend/app/diagnosis/llm_assistant.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/diagnosis/llm_assistant.py), [`backend/app/schemas/diagnosis.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/schemas/diagnosis.py) | Structured Gemini prompt requiring evidence event citations, with offline fallback. |
| [x] | **Interventions & Sandbox (Engine 5)** | [`backend/app/replay/interventions.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/replay/interventions.py), [`backend/app/replay/sandbox.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/replay/sandbox.py) | Counterfactual modification handlers (`replace_output`, `replace_input`, etc.) with strict safety isolation. |
| [x] | **Replay Runner & Diffing (Engine 5)** | [`backend/app/replay/runner.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/replay/runner.py), [`backend/app/schemas/experiment.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/schemas/experiment.py) | Reruns downstream execution, evaluates replay outcome, and confirms hypothesis proof. |
| [x] | **Regression Runner & Metrics (Engine 6)** | [`backend/app/evaluation/metrics.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/evaluation/metrics.py), [`backend/app/evaluation/regression_runner.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/evaluation/regression_runner.py) | Calculates Rescue Rate and Break Rate across all 10 scenarios. |
| [x] | **Autopsy Report Generator** | [`backend/app/reports/generator.py`](file:///d:/AgentAutopsy(MINI%20Project)/backend/app/reports/generator.py) | Produces structured Markdown reports distinguishing observed facts, hypotheses, and replay findings. |
| [x] | **Automated Engine Verification Test** | [`tests/scenarios/test_scenarios.py`](file:///d:/AgentAutopsy(MINI%20Project)/tests/scenarios/test_scenarios.py) | End-to-end unit test verifying the entire investigation and replay loop (100% assertions passed). |

---

## 👨‍💻 Avinash's Deliverables Checklist (Agent, Backend & APIs)

| Status | Task / Component | Target File | Description |
|:---:|---|---|---|
| [ ] | **FastAPI Server Setup & Health Check** | `backend/app/main.py` | FastAPI app initialization, CORS middleware, and `/health` route. |
| [ ] | **MongoDB Connection & Client** | `backend/app/db/mongodb.py` | Async Motor client connection with auto-reconnect and database lifecycle. |
| [ ] | **Database Repositories** | `backend/app/db/repositories.py` | CRUD operations for runs, events, diagnoses, and experiments. |
| [ ] | **Mock Tools Execution** | `backend/app/agents/mock_tools.py` | Order lookup, policy fetching, and safe mock refund execution tools. |
| [ ] | **LangGraph Customer Support Agent** | `backend/app/agents/support_agent.py` | Multi-step agent graph (intent -> context -> validate -> action -> respond). |
| [ ] | **Trace Event Logger & Hooks** | `backend/app/tracing/logger.py` | LangGraph callbacks capturing model, tool, state, and validation events to MongoDB. |
| [ ] | **Runs & Trace REST APIs** | `backend/app/api/runs.py`, `backend/app/api/trace.py` | Endpoints to launch runs, list runs, get run details, and fetch ordered trace events. |
| [ ] | **Autopsy & Investigation REST APIs** | `backend/app/api/autopsy.py` | Endpoint to trigger failure analysis and fetch diagnosis cards. |
| [ ] | **Replay & Experiments REST APIs** | `backend/app/api/experiments.py` | Endpoint to launch replay experiments and fetch baseline-vs-replay diff. |
| [ ] | **Fixes & Regression REST APIs** | `backend/app/api/fixes.py`, `backend/app/api/reports.py` | Endpoints to submit fixes, run 10-scenario regression, and download autopsy reports. |

---

## 💻 Frontend Deliverables Checklist (AI Forensics Workstation UI)

| Status | Task / Component | Target File | Description |
|:---:|---|---|---|
| [x] | **AI Forensics Design System & Theme** | [`frontend/tailwind.config.js`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/tailwind.config.js) | Dark charcoal `#06090e`, technical typography (JetBrains Mono & Inter), and high-contrast semantic color coding. |
| [x] | **Shared UI & Semantic Badges** | [`frontend/src/components/Badge.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/components/Badge.tsx), [`Header.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/components/Header.tsx), [`Sidebar.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/components/Sidebar.tsx) | Live telemetry topbar, forensic navigation, and high-contrast semantic badges (Red, Orange, Yellow, Violet, Cyan, Green). |
| [x] | **Data Contracts & Typed Services** | [`frontend/src/types/`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/types/), [`frontend/src/services/api.ts`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/services/api.ts) | 100% aligned with backend Pydantic schemas, ready to switch between mock and live FastAPI with one boolean flag. |
| [x] | **Overview: Command Center** | [`frontend/src/pages/CommandCenterPage.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/pages/CommandCenterPage.tsx) | Real-time Failure Activity Map, execution KPI counters, and fault taxonomy distribution. |
| [x] | **Runs Explorer & Scenario Launcher** | [`frontend/src/pages/RunsExplorerPage.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/pages/RunsExplorerPage.tsx), [`ScenarioLauncherModal.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/components/ScenarioLauncherModal.tsx) | Filterable run table with one-click injection of all 10 benchmark scenarios (`F01–F05`, `P01–P05`). |
| [x] | **Black Box Execution Timeline** | [`frontend/src/features/timeline/BlackBoxTimeline.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/features/timeline/BlackBoxTimeline.tsx), [`EvidenceInspectorPanel.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/features/timeline/EvidenceInspectorPanel.tsx) | Microsecond event stream with expandable Evidence Inspector drawer showing raw JSON inputs/outputs and invariant breaches. |
| [x] | **React Flow Dependency Graph** | [`frontend/src/features/graph/ForensicFlowGraph.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/features/graph/ForensicFlowGraph.tsx), [`CustomNode.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/features/graph/CustomNode.tsx) | Signature visual DAG highlighting the decisive causal failure chain in Red/Orange and muting unrelated steps. |
| [x] | **Autopsy Lab: Root Cause Workspace** | [`frontend/src/features/autopsy/AutopsyWorkspace.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/features/autopsy/AutopsyWorkspace.tsx) | 3-section evidence workbench: 1. Observed Facts, 2. Gemini Grounded Hypotheses, 3. Audit Status & Replay Recommendation. |
| [x] | **Replay Lab: Before vs After Diff** | [`frontend/src/features/replay/ReplayLabDiff.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/features/replay/ReplayLabDiff.tsx) | Side-by-side execution comparison (Baseline Fail vs Replay Pass) proving counterfactual fix. |
| [x] | **Regression Benchmark Matrix** | [`frontend/src/features/regression/RegressionMatrix.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/features/regression/RegressionMatrix.tsx) | 10-scenario before/after matrix with prominent Rescue Rate and Break Rate gauges. |
| [x] | **Forensic Dossier Report Export** | [`frontend/src/pages/ForensicReportPage.tsx`](file:///d:/AgentAutopsy(MINI%20Project)/frontend/src/pages/ForensicReportPage.tsx) | Printable and exportable markdown autopsy audit report. |

