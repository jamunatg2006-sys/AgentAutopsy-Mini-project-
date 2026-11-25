/**
 * Matches backend AgentRun schema (backend/app/schemas/run.py)
 */

export type RunStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AgentRun {
  run_id: string;
  scenario_id?: string | null;
  agent_name: string;
  status: RunStatus;
  input_summary: string;
  task_input: Record<string, any>;
  expected_outcome: Record<string, any>;
  actual_outcome: Record<string, any>;
  failure_detected: boolean;
  total_events: number;
  start_time: string;
  end_time?: string | null;
  tags?: Record<string, any>;
}
