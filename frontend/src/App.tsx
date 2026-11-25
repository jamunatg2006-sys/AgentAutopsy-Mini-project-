import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ScenarioLauncherModal } from './components/ScenarioLauncherModal';
import { TraceUploadModal } from './components/TraceUploadModal';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { RunsExplorerPage } from './pages/RunsExplorerPage';
import { BlackBoxTimeline } from './features/timeline/BlackBoxTimeline';
import { ForensicFlowGraph } from './features/graph/ForensicFlowGraph';
import { AutopsyWorkspace } from './features/autopsy/AutopsyWorkspace';
import { ReplayLabDiff } from './features/replay/ReplayLabDiff';
import { RegressionMatrix } from './features/regression/RegressionMatrix';
import { ForensicReportPage } from './pages/ForensicReportPage';

import { MOCK_RUNS } from './mocks/runs';
import { MOCK_EVENTS } from './mocks/events';
import { MOCK_DIAGNOSES } from './mocks/diagnosis';
import { MOCK_REGRESSION_REPORT } from './mocks/regression';
import { launchScenarioRun } from './services/runService';
import { AgentRun } from './types/run';
import { TraceEvent } from './types/event';

function AppContent() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState(MOCK_RUNS);
  const [eventsMap, setEventsMap] = useState<Record<string, TraceEvent[]>>(MOCK_EVENTS);
  const [activeRunId, setActiveRunId] = useState('run_f01_demo');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const activeRun = runs.find((r) => r.run_id === activeRunId) || runs[0];
  const activeEvents = eventsMap[activeRunId] || eventsMap['run_f01_demo'] || [];
  const activeDiagnosis = MOCK_DIAGNOSES[activeRunId] || MOCK_DIAGNOSES['run_f01_demo'];

  const handleLaunchScenario = async (scenarioId: string) => {
    const newRun = await launchScenarioRun(scenarioId);
    setRuns([newRun, ...runs]);
    setActiveRunId(newRun.run_id);
    navigate('/timeline');
  };

  const handleTraceImported = (importedRun: AgentRun, importedEvents: TraceEvent[]) => {
    setRuns([importedRun, ...runs]);
    setEventsMap((prev) => ({ ...prev, [importedRun.run_id]: importedEvents }));
    setActiveRunId(importedRun.run_id);
    navigate('/timeline');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0B1020] text-[#F4F5FF]">
      {/* Top Forensic Intelligence Header */}
      <Header
        activeRunId={activeRun.run_id}
        onLaunchScenarioClick={() => setIsScenarioModalOpen(true)}
        onUploadTraceClick={() => setIsUploadModalOpen(true)}
      />

      {/* Main Workstation Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Route Workspace */}
        <main className="flex-1 overflow-hidden bg-[#0B1020] relative">
          <Routes>
            <Route
              path="/"
              element={
                <CommandCenterPage
                  runs={runs}
                  onLaunchScenarioClick={() => setIsScenarioModalOpen(true)}
                  onUploadTraceClick={() => setIsUploadModalOpen(true)}
                />
              }
            />
            <Route
              path="/runs"
              element={
                <RunsExplorerPage
                  runs={runs}
                  onSelectRun={(id) => setActiveRunId(id)}
                  onLaunchScenarioClick={() => setIsScenarioModalOpen(true)}
                />
              }
            />
            <Route
              path="/timeline"
              element={
                <BlackBoxTimeline
                  events={activeEvents}
                  onFocusNodeInGraph={() => navigate('/graph')}
                />
              }
            />
            <Route
              path="/graph"
              element={<ForensicFlowGraph events={activeEvents} />}
            />
            <Route
              path="/autopsy"
              element={
                <AutopsyWorkspace
                  run={activeRun}
                  diagnosis={activeDiagnosis}
                  onSelectEventForEvidence={() => navigate('/timeline')}
                />
              }
            />
            <Route
              path="/replay"
              element={<ReplayLabDiff baselineEvents={activeEvents} />}
            />
            <Route
              path="/regression"
              element={<RegressionMatrix report={MOCK_REGRESSION_REPORT} />}
            />
            <Route
              path="/reports"
              element={
                <ForensicReportPage
                  run={activeRun}
                  diagnosis={activeDiagnosis}
                  regressionReport={MOCK_REGRESSION_REPORT}
                />
              }
            />
          </Routes>
        </main>
      </div>

      {/* Benchmark Injection Modal */}
      <ScenarioLauncherModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        onLaunch={handleLaunchScenario}
      />

      {/* Trace JSON Normalization & Import Modal */}
      <TraceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onTraceImported={handleTraceImported}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
