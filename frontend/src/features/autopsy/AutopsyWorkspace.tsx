import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertOctagon,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Repeat,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  FileCheck,
  Zap,
  Activity,
  Code2,
  Terminal,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { AutopsyDiagnosis } from '../../types/diagnosis';
import { AgentRun } from '../../types/run';
import { Badge } from '../../components/Badge';

interface AutopsyWorkspaceProps {
  run: AgentRun;
  diagnosis: AutopsyDiagnosis;
  onSelectEventForEvidence?: (eventId: string) => void;
}

export const AutopsyWorkspace: React.FC<AutopsyWorkspaceProps> = ({
  run,
  diagnosis,
  onSelectEventForEvidence,
}) => {
  const navigate = useNavigate();
  const topCandidate = diagnosis.candidates[0];

  return (
    <div className="h-full overflow-y-auto px-8 py-7 space-y-7 select-none w-full max-w-[1700px] mx-auto font-sans">
      {/* Dossier Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-[#11182A] border border-[#25324E] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-surface-elevation relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF647C] via-[#FFBD59] to-[#9B72FF]" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <Badge variant="failure" dot size="sm">
              Investigation Active
            </Badge>
            <span className="text-sm text-[#A7B0C5] font-mono">
              Dossier #{diagnosis.diagnosis_id}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-[#F4F5FF] tracking-tight">
            Root Cause Autopsy: {run.input_summary}
          </h1>
          <p className="text-sm text-[#A7B0C5]">
            Target Agent: <strong className="text-[#F4F5FF] font-mono">{run.agent_name}</strong> • Scenario:{' '}
            <strong className="text-[#42D9F5] font-mono">{run.scenario_id || 'F01'}</strong> • Evaluated by Gemini 2.5
          </p>
        </div>

        {/* Action Button: Jump into Replay Lab */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/replay')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#9B72FF] hover:bg-[#885cf8] text-[#0B1020] font-bold text-sm rounded-xl shadow-glow-violet transition-all"
        >
          <Repeat className="w-4 h-4" />
          <span>Open in Replay Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </motion.div>

      {/* 3 Forensic Sections Grid (Section 05) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================
            LEFT (4 Cols) — OBSERVED EVIDENCE (FACTS)
           ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-4 p-6 bg-[#11182A] border border-[#25324E] rounded-3xl space-y-5 shadow-surface-elevation"
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-[#25324E]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FF647C]/10 border border-[#FF647C]/30 flex items-center justify-center text-[#FF647C]">
                <Fingerprint className="w-4 h-4" />
              </div>
              <h2 className="font-display font-bold text-lg text-[#F4F5FF]">Observed Evidence</h2>
            </div>
            <span className="text-xs font-mono text-[#737F98] uppercase">Immutable Facts</span>
          </div>

          <p className="text-sm text-[#A7B0C5] leading-relaxed">
            Directly recorded execution facts and domain invariant assertion breaches evaluated across execution steps.
          </p>

          {/* Actual Error Details */}
          <div className="space-y-2">
            <span className="text-sm font-mono text-[#FF647C] uppercase font-bold tracking-wider block">
              Flagged Invariant Breaches:
            </span>
            {diagnosis.failure_symptoms.map((symptom, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#FF647C]/10 border border-[#FF647C]/30 rounded-2xl text-sm text-[#FF647C] leading-relaxed"
              >
                ⚠️ {symptom}
              </div>
            ))}
          </div>

          {/* Domain Assertions */}
          <div className="space-y-2 pt-2 border-t border-[#25324E]">
            <span className="text-sm font-mono text-[#A7B0C5] uppercase font-bold tracking-wider block">
              Domain Assertions Tested:
            </span>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0B1020] text-[#A7B0C5]">
                <span>Order delivery date &le; 30 days</span>
                <span className="font-mono text-[#FF647C] font-semibold">50d (Violated)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0B1020] text-[#A7B0C5]">
                <span>Policy source authoritative</span>
                <span className="font-mono text-[#FFBD59] font-semibold">Tampered</span>
              </div>
            </div>
          </div>

          {/* Relevant Events Cited */}
          <div className="space-y-2 pt-2 border-t border-[#25324E]">
            <span className="text-sm font-mono text-[#A7B0C5] uppercase font-bold tracking-wider block">
              Supporting Trace Event IDs:
            </span>
            <div className="flex flex-wrap gap-2">
              {topCandidate?.evidence_event_ids.map((eid) => (
                <button
                  key={eid}
                  onClick={() => onSelectEventForEvidence?.(eid)}
                  className="px-3 py-1 bg-[#171F35] hover:bg-[#202B43] border border-[#42D9F5]/40 text-[#42D9F5] font-mono text-sm font-bold rounded-lg transition-colors"
                >
                  #{eid}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            CENTRE (4 Cols) — ROOT CAUSE INVESTIGATION (DECISIVE STEP)
           ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-4 p-6 bg-[#11182A] border-2 border-[#9B72FF]/50 rounded-3xl space-y-5 shadow-glow-violet relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-[#25324E]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#9B72FF]/15 border border-[#9B72FF]/40 flex items-center justify-center text-[#9B72FF]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-display font-bold text-lg text-[#F4F5FF]">Root Cause Attribution</h2>
            </div>
            <Badge variant="analysis" size="sm">
              Gemini 2.5
            </Badge>
          </div>

          {/* Decisive Mistake Callout */}
          {topCandidate ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFBD59]/10 border-2 border-[#FFBD59]/70 space-y-1.5 shadow-[0_0_15px_rgba(255,189,89,0.15)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#FFBD59] font-bold uppercase tracking-wider">
                    DECISIVE ERROR LOCATION
                  </span>
                  <span className="text-xs font-mono text-[#FFBD59] font-bold">
                    Confidence: High (98%)
                  </span>
                </div>
                <div className="text-xl font-display font-bold text-[#F4F5FF]">
                  {topCandidate.candidate_step_id} ({topCandidate.category})
                </div>
                <div className="text-sm text-[#FFBD59] font-mono">
                  Component: validate_eligibility
                </div>
              </div>

              {/* Evidence-Linked Reasoning */}
              <div className="p-4 rounded-2xl bg-[#0B1020] border border-[#25324E] space-y-2 text-sm">
                <span className="text-[#9B72FF] font-mono font-bold block text-sm uppercase">
                  Evidence-Linked Causal Rationale:
                </span>
                <p className="text-[#F4F5FF] leading-relaxed">
                  {topCandidate.causal_hypothesis}
                </p>
              </div>

              {/* Downstream Impact Steps */}
              <div className="space-y-2 text-sm">
                <span className="text-[#A7B0C5] font-mono font-bold uppercase text-xs block">
                  Downstream Impacted Steps:
                </span>
                <div className="flex flex-wrap gap-2">
                  {topCandidate.downstream_impact_step_ids.map((did) => (
                    <span
                      key={did}
                      className="px-2.5 py-1 bg-[#FF647C]/15 border border-[#FF647C]/30 text-[#FF647C] rounded-lg font-mono text-sm font-semibold"
                    >
                      #{did} (symptom)
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#9B72FF]/10 rounded-xl border border-[#9B72FF]/30 text-sm text-[#A7B0C5]">
                💡 <em>Gemini explanations link directly to recorded event IDs; counterfactual replay validates the fix.</em>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#737F98]">No candidate identified.</div>
          )}
        </motion.div>

        {/* ========================================================
            RIGHT (4 Cols) — CONCLUSION AND FIX (Section 05)
           ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-4 p-6 bg-[#11182A] border border-[#25324E] rounded-3xl space-y-5 shadow-surface-elevation"
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-[#25324E]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#4DDBA5]/10 border border-[#4DDBA5]/30 flex items-center justify-center text-[#4DDBA5]">
                <FileCheck className="w-4 h-4" />
              </div>
              <h2 className="font-display font-bold text-lg text-[#F4F5FF]">Conclusion & Fix</h2>
            </div>
            <span className="text-xs font-mono text-[#4DDBA5] uppercase">Actionable Fix</span>
          </div>

          <div className="space-y-4 text-sm">
            {/* Confirmed Facts */}
            <div className="p-3.5 bg-[#0B1020] rounded-2xl border border-[#25324E] space-y-1">
              <div className="flex items-center gap-1.5 text-[#4DDBA5] font-semibold text-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed Facts:</span>
              </div>
              <p className="text-[#A7B0C5] leading-relaxed">
                Order SYN-1042 delivery elapsed 50 days. Official policy POL-CURRENT-2026 strictly allows only 30 days.
              </p>
            </div>

            {/* Uncertain Assumptions */}
            <div className="p-3.5 bg-[#0B1020] rounded-2xl border border-[#25324E] space-y-1">
              <div className="flex items-center gap-1.5 text-[#FFBD59] font-semibold text-sm">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Uncertain Assumptions:</span>
              </div>
              <p className="text-[#A7B0C5] leading-relaxed">
                Does correcting the policy source at Step 4 alone avert the illegal payout without raising downstream schema errors?
              </p>
            </div>

            {/* Recommended Intervention Code/Config Fix */}
            <div className="p-4 bg-[#4DDBA5]/10 border border-[#4DDBA5]/30 rounded-2xl space-y-3 shadow-glow-mint">
              <div className="flex items-center gap-2 text-[#4DDBA5] font-bold uppercase tracking-wider text-xs">
                <Code2 className="w-4 h-4" />
                <span>Suggested Intervention Fix:</span>
              </div>

              <div className="bg-[#0B1020] p-3 rounded-xl border border-[#25324E] font-mono text-sm text-[#F4F5FF] overflow-auto">
                <span className="text-[#737F98]">// Patch output for evt_004</span>
                <pre className="text-[#4DDBA5] mt-1">{`{
  "eligible": false,
  "source": "official_policy_2026",
  "reason": "Exceeded 30-day window"
}`}</pre>
              </div>

              <button
                onClick={() => navigate('/replay')}
                className="w-full py-2.5 bg-[#4DDBA5] hover:bg-[#3ec493] text-[#0B1020] font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(77,219,165,0.25)] transition-all flex items-center justify-center gap-2"
              >
                <span>Run Replay Experiment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
