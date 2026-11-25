/**
 * Matches backend Evaluation schema (backend/app/schemas/evaluation.py)
 */

export interface ScenarioResult {
  scenario_id: string;
  scenario_name: string;
  expected_verdict: 'PASS' | 'FAIL';
  baseline_verdict: 'PASS' | 'FAIL';
  post_fix_verdict: 'PASS' | 'FAIL';
  status_change: 'rescued' | 'broken' | 'preserved_pass' | 'still_failed';
}

export interface RegressionEvaluationReport {
  evaluation_id: string;
  fix_id: string;
  fix_description: string;
  total_scenarios_tested: number;
  rescue_rate: number;
  break_rate: number;
  rescued_count: number;
  broken_count: number;
  scenario_results: ScenarioResult[];
  verdict: 'ACCEPTED' | 'REJECTED';
  evaluated_at: string;
}

export interface ProposedFix {
  fix_id: string;
  name: string;
  description: string;
  category: string;
  patch_details?: Record<string, any>;
}
