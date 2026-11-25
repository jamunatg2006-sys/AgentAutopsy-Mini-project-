import { AgentRun } from '../types/run';
import { TraceEvent } from '../types/event';
import { MOCK_RUNS } from '../mocks/runs';
import { MOCK_EVENTS } from '../mocks/events';
import { MOCK_SCENARIOS } from '../mocks/scenarios';
import { USE_LIVE_API, request } from './api';

export async function fetchRuns(): Promise<AgentRun[]> {
  if (USE_LIVE_API) {
    return request<AgentRun[]>('/runs');
  }
  return Promise.resolve(MOCK_RUNS);
}

export async function fetchRunById(runId: string): Promise<AgentRun | null> {
  if (USE_LIVE_API) {
    return request<AgentRun>(`/runs/${runId}`);
  }
  const run = MOCK_RUNS.find(r => r.run_id === runId);
  return Promise.resolve(run || null);
}

export async function fetchRunTrace(runId: string): Promise<TraceEvent[]> {
  if (USE_LIVE_API) {
    return request<TraceEvent[]>(`/runs/${runId}/trace`);
  }
  const events = MOCK_EVENTS[runId] || MOCK_EVENTS['run_f01_demo'] || [];
  return Promise.resolve(events);
}

export async function launchScenarioRun(scenarioId: string): Promise<AgentRun> {
  if (USE_LIVE_API) {
    return request<AgentRun>('/runs', {
      method: 'POST',
      body: JSON.stringify({ scenario_id: scenarioId }),
    });
  }

  const scenario = MOCK_SCENARIOS.find(s => s.scenario_id === scenarioId);
  const isFailure = scenario?.expected_verdict === 'FAIL';
  
  const newRun: AgentRun = {
    run_id: `run_${scenarioId.toLowerCase()}_${Date.now().toString().slice(-4)}`,
    scenario_id: scenarioId,
    agent_name: 'CustomerSupportRefundAgent',
    status: isFailure ? 'failed' : 'completed',
    input_summary: scenario?.description || 'Scenario execution run',
    task_input: { order_id: scenario?.order_id, customer_message: scenario?.customer_message },
    expected_outcome: { expected_verdict: scenario?.expected_verdict },
    actual_outcome: isFailure ? { error: scenario?.expected_failure_symptom } : { status: 'success' },
    failure_detected: isFailure,
    total_events: 6,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 4500).toISOString(),
    tags: { fault_type: scenario?.fault_type }
  };

  MOCK_RUNS.unshift(newRun);
  return Promise.resolve(newRun);
}
