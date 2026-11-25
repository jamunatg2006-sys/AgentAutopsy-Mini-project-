import { ReplayExperiment, InterventionSpec } from '../types/experiment';
import { USE_LIVE_API, request } from './api';

export async function executeReplayExperiment(
  runId: string,
  intervention: InterventionSpec
): Promise<ReplayExperiment> {
  if (USE_LIVE_API) {
    return request<ReplayExperiment>('/experiments', {
      method: 'POST',
      body: JSON.stringify({ run_id: runId, intervention }),
    });
  }

  // Realistic mock replay turnaround
  const experiment: ReplayExperiment = {
    experiment_id: `exp_${Math.random().toString(36).slice(2, 9)}`,
    baseline_run_id: runId,
    replay_run_id: `replay_${runId}_${Date.now().toString().slice(-4)}`,
    intervention,
    baseline_verdict: 'FAIL',
    replay_verdict: 'PASS',
    hypothesis_supported: true,
    changed_events_count: 2,
    created_at: new Date().toISOString()
  };

  return Promise.resolve(experiment);
}
