/**
 * Matches backend Replay schema (backend/app/schemas/experiment.py)
 */

export interface InterventionSpec {
  type: 'replace_output' | 'replace_input' | 'replace_tool_result' | 'prompt_variant' | 'skip_step';
  target_event_id: string;
  replacement_payload: Record<string, any>;
}

export interface ReplayExperiment {
  experiment_id: string;
  baseline_run_id: string;
  replay_run_id: string;
  intervention: InterventionSpec;
  baseline_verdict: string;
  replay_verdict: string;
  hypothesis_supported: boolean;
  changed_events_count: number;
  created_at: string;
}
