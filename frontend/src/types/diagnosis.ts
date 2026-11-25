/**
 * Matches backend Diagnosis schema (backend/app/schemas/diagnosis.py)
 */

export interface DiagnosisCandidate {
  candidate_step_id: string;
  rank: number;
  category: string;
  confidence: 'high' | 'medium' | 'low' | 'inconclusive';
  causal_hypothesis: string;
  evidence_event_ids: string[];
  downstream_impact_step_ids: string[];
  recommended_intervention?: {
    type: 'replace_output' | 'replace_input' | 'replace_tool_result' | 'prompt_variant';
    target_event_id: string;
    replacement_payload: Record<string, any>;
  };
}

export interface AutopsyDiagnosis {
  diagnosis_id: string;
  run_id: string;
  verdict: 'PASS' | 'FAIL' | 'INCONCLUSIVE';
  failure_symptoms: string[];
  candidates: DiagnosisCandidate[];
  summary: string;
  created_at: string;
}
