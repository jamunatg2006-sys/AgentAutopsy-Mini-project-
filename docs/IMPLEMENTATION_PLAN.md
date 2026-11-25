# Agent Autopsy: Comprehensive Implementation Plan

> **Owners:** Avinash Singh Pal & Jamuna T.G.  
> **Target Execution Strategy:** Backend-First (Engine 1 through 6 + APIs) followed by Frontend (React + React Flow + Tailwind).

---

## 🗺️ Architectural Workflow Recap

```
TRACE  ➔  INVESTIGATE  ➔  INTERVENE SAFELY  ➔  COMPARE  ➔  VALIDATE
```

1. **Execution**: LangGraph Support Agent runs against Mock Tools (Orders, Refunds, Policies) and records trace events to MongoDB.
2. **Investigation**: Outcome Evaluator & Invariant Rules check assertions -> NetworkX Dependency Graph traces backward -> Candidate Step Ranker scores suspects -> Gemini LLM Assistant explains the root cause with evidence citations.
3. **Experimentation**: Replay Lab applies an isolated counterfactual intervention -> Sandbox reruns the agent -> Baseline vs. Replay diff proves or disproves the hypothesis -> Regression Runner checks all 10 scenarios (Rescue & Break rates) -> Autopsy Report is generated.

---

## 📋 The 7 Backend Phases

- **Phase 1**: Schemas, Data Models & Database Layer (MongoDB)
- **Phase 2**: LangGraph Support Demo Agent, Mock Tools & 10 Benchmark Scenarios (`F01-F05`, `P01-P05`)
- **Phase 3**: Trace Capture, Normalizer & Core API Endpoints (`/api/runs`, `/api/runs/{id}/trace`)
- **Phase 4**: Failure Detection (Engine 2) & NetworkX Dependency Graph (Engine 3)
- **Phase 5**: Gemini LLM Diagnosis Assistant (Engine 4) with Evidence Citations
- **Phase 6**: Sandbox Replay Lab & Counterfactual Interventions (Engine 5)
- **Phase 7**: Regression Lab (Engine 6) & Autopsy Report Generator

---

## 💻 Frontend Plan (Phases 8 - 10)

- **Phase 8**: Vite + React + Tailwind + React Flow Setup
- **Phase 9**: Core Screens:
  - Runs Explorer & Scenario Launcher
  - Chronological Execution Timeline
  - React Flow Dependency Graph
  - Autopsy Diagnosis Cards
  - Side-by-Side Replay Diff Comparator
  - Regression Matrix & Markdown Autopsy Report Export
- **Phase 10**: Integration, End-to-End Testing & Demo Rehearsal


---

## 👥 Division of Work & Status

| Area | Avinash | Jamuna (Status) |
|---|---|---|
| **Core Agent & Mocks** | LangGraph demo agent, mock tools, state management | `[x]` Fault injection scenario definitions (`F01-F05`, `P01-P05`) & synthetic data fixtures |
| **Tracing & DB** | Logger callbacks, CEF normalizer, MongoDB client & repository CRUD | `[x]` Validation of trace schemas & invariant tags |
| **Investigation** | Trace extraction APIs & backend wiring | `[x]` Deterministic assertions, NetworkX graph builder, candidate ranker |
| **LLM & Diagnosis** | Gemini API wrapper integration | `[x]` Prompt engineering, structured diagnosis schema & evidence linking |
| **Replay & Sandbox** | Checkpoint state restoration & mock execution engine | `[x]` Intervention handlers, sandbox safety & baseline vs. replay diffing |
| **Evaluation** | Regression runner service | `[x]` Test matrix metrics (rescue/break rates) & Autopsy report logic |
| **Frontend** | API integration, Timeline & React Flow graph integration | `[x]` AI Forensics Lab theme, Black Box Timeline, React Flow Graph, Autopsy Lab, Replay Diff & Reports |

> Complete detailed progress checklist is tracked in [`docs/PROGRESS_TRACKER.md`](./PROGRESS_TRACKER.md).
