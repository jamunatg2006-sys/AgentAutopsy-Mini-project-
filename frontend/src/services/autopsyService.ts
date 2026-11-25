import { AutopsyDiagnosis } from '../types/diagnosis';
import { MOCK_DIAGNOSES } from '../mocks/diagnosis';
import { USE_LIVE_API, request } from './api';

export async function fetchAutopsyDiagnosis(runId: string): Promise<AutopsyDiagnosis | null> {
  if (USE_LIVE_API) {
    return request<AutopsyDiagnosis>(`/runs/${runId}/autopsy`, { method: 'POST' });
  }
  const diag = MOCK_DIAGNOSES[runId] || MOCK_DIAGNOSES['run_f01_demo'] || null;
  return Promise.resolve(diag);
}
