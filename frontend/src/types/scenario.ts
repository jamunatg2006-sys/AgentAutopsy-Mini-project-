/**
 * Matches backend Scenario schema (backend/app/schemas/scenarios.py)
 */

export interface BenchmarkScenario {
  scenario_id: string;
  fault_type: string;
  name: string;
  description: string;
  order_id: string;
  customer_message: string;
  expected_verdict: 'PASS' | 'FAIL';
  decisive_step_type?: string;
  decisive_step_component?: string;
  expected_failure_symptom?: string;
}
