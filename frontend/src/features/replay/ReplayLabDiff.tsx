import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  GitCompare,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers
} from 'lucide-react';
import { TraceEvent } from '../../types/event';
import { Badge } from '../../components/Badge';

interface ReplayLabDiffProps {
  baselineEvents: TraceEvent[];
}

export const ReplayLabDiff: React.FC<ReplayLabDiffProps> = ({ baselineEvents }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [replayExecuted, setReplayExecuted] = useState(true);
  const [selectedIntervention, setSelectedIntervention] = useState<'replace_output' | 'replace_input' | 'prompt_variant'>('replace_output');

  // Simulated Replay Trace
  const replayEvents: TraceEvent[] = baselineEvents.map((evt) => {
    if (evt.event_id === 'evt_004') {
      return {
        ...evt,
        status: 'success',
        output: {
          eligible: false,
          source: 'official_policy_2026',
          reason: 'Order delivered 50 days ago; strictly exceeds 30-day limit. Chat override ignored.',
        },
        metadata: { ...evt.metadata, is_intervened: true },
      };
    }
    if (evt.event_id === 'evt_005') {
      return {
        ...evt,
        status: 'skipped',
        error_details: null,
        output: {
          refund_issued: false,
          reason: 'blocked_ineligible_order',
        },
      };
    }
    if (evt.event_id === 'evt_006') {
      return {
        ...evt,
        status: 'success',
        output: {
          message: 'We checked your order SYN-1042 against our official 30-day return policy. Since 50 days have elapsed, we cannot process a refund.',
        },
      };
    }
    return evt;
  });

  const handleRunReplay = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setReplayExecuted(true);
    }, 700);
  };

  return (
    <div className="h-full overflow-y-auto px-6 lg:px-10 py-7 font-sans space-y-7 select-none w-full bg-[#0B1020]">
      {/* Top Controller Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-[#11182A] border border-[#25324E] rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden shadow-surface-elevation"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF647C] via-[#42D9F5] to-[#4DDBA5]" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#4DDBA5]/10 text-[#4DDBA5] border border-[#4DDBA5]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DDBA5] animate-pulse" />
              Counterfactual Sandbox
            </span>
            <span className="text-xs text-[#42D9F5] font-mono">
              // Intervention Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-[#F4F5FF] tracking-tight">
            Before vs After Causal Diff
          </h1>
          <p className="text-base text-[#A7B0C5] max-w-2xl font-normal leading-relaxed">
            Test whether safely modifying the decisive step at <strong className="text-[#FFBD59] font-mono font-semibold">#evt_004</strong> flips the failure into a verified pass without mutation side effects.
          </p>
        </div>

        {/* Experiment Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#171F35] border border-[#25324E] rounded-xl text-sm">
            <Sliders className="w-3.5 h-3.5 text-[#9B72FF]" />
            <span className="text-xs text-[#737F98] font-mono uppercase">Action:</span>
            <select
              value={selectedIntervention}
              onChange={(e) => setSelectedIntervention(e.target.value as any)}
              className="bg-transparent text-[#F4F5FF] font-medium text-sm outline-none cursor-pointer focus:ring-0"
            >
              <option value="replace_output" className="bg-[#171F35] text-[#F4F5FF]">Replace step output (eligible: false)</option>
              <option value="replace_input" className="bg-[#171F35] text-[#F4F5FF]">Force verified policy context</option>
              <option value="prompt_variant" className="bg-[#171F35] text-[#F4F5FF]">Inject trust boundary guardrail</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRunReplay}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#4DDBA5] hover:bg-[#3ec492] text-[#0B1020] font-display font-semibold text-sm rounded-xl shadow-glow-mint transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <RotateCcw className="w-4 h-4 animate-spin text-[#0B1020]" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{isRunning ? 'Simulating Replay...' : 'Run Replay Simulation'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Proof Banner */}
      {replayExecuted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 bg-[#11182A]/90 border border-[#4DDBA5]/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glow-mint/30"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#4DDBA5]/10 border border-[#4DDBA5]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#4DDBA5]" />
            </div>
            <div>
              <div className="text-base font-display font-bold text-[#4DDBA5] flex items-center gap-2">
                Hypothesis Experimentally Validated
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#4DDBA5]/15 text-[#4DDBA5] font-normal">
                  Zero Side Effects
                </span>
              </div>
              <p className="text-sm text-[#A7B0C5] mt-1 font-sans leading-relaxed">
                By enforcing 30-day policy validity at <strong className="text-[#F4F5FF] font-mono">evt_004</strong>, the wrongful refund call on <strong className="text-[#F4F5FF] font-mono">evt_005</strong> was safely bypassed.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-mono text-[#737F98]">Original: <strong className="text-[#FF647C]">FAIL</strong></span>
            <ArrowRight className="w-3.5 h-3.5 text-[#737F98]" />
            <span className="text-sm font-mono text-[#737F98]">Replay: <strong className="text-[#4DDBA5]">PASS</strong></span>
          </div>
        </motion.div>
      )}

      {/* Side-by-Side Execution Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* =========================================
            LEFT COLUMN: ORIGINAL BASELINE (FAIL)
           ========================================= */}
        <div className="p-5 bg-[#11182A] border border-[#FF647C]/30 rounded-2xl space-y-4 shadow-glow-coral/20">
          <div className="flex items-center justify-between pb-3 border-b border-[#25324E]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF647C] animate-pulse shadow-glow-coral" />
              <span className="text-base font-display font-bold text-[#F4F5FF]">Original Baseline Execution</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#FF647C]/10 text-[#FF647C] border border-[#FF647C]/30">
              FAIL
            </span>
          </div>

          <div className="space-y-3">
            {baselineEvents.map((evt) => {
              const isFail = evt.status === 'failure';
              const isWarning = evt.status === 'warning';

              return (
                <div
                  key={evt.event_id}
                  className={`p-3.5 rounded-xl border text-sm space-y-2 transition-all ${
                    isFail
                      ? 'bg-[#171F35] border-[#FF647C]/50 text-[#F4F5FF]'
                      : isWarning
                      ? 'bg-[#171F35] border-[#FFBD59]/50 text-[#F4F5FF]'
                      : 'bg-[#171F35]/50 border-[#25324E] text-[#A7B0C5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-sm text-[#F4F5FF] flex items-center gap-1.5">
                      <span className="font-mono text-xs text-[#737F98]">#{evt.sequence}</span>
                      {evt.component}
                    </span>
                    <span className="text-xs font-mono uppercase">
                      {isFail ? (
                        <span className="text-[#FF647C] font-semibold flex items-center gap-1">
                          ● Critical Failure
                        </span>
                      ) : isWarning ? (
                        <span className="text-[#FFBD59] font-semibold flex items-center gap-1">
                          ▲ Invariant Violation
                        </span>
                      ) : (
                        <span className="text-[#737F98]">Normal</span>
                      )}
                    </span>
                  </div>

                  <div className="text-sm font-mono bg-[#0B1020]/60 p-2.5 rounded-lg border border-white/5">
                    {evt.event_id === 'evt_004' && (
                      <span className="text-[#FFBD59] block">
                        output.eligible: true (overridden by prompt injection directive)
                      </span>
                    )}
                    {evt.event_id === 'evt_005' && (
                      <span className="text-[#FF647C] block font-semibold">
                        execute_refund: $300 payout triggered for expired 50-day order!
                      </span>
                    )}
                    {evt.event_id !== 'evt_004' && evt.event_id !== 'evt_005' && (
                      <span className="text-[#737F98]">{JSON.stringify(evt.output).slice(0, 110)}...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: REPLAY RUN (PASS)
           ========================================= */}
        <div className="p-5 bg-[#11182A] border border-[#4DDBA5]/30 rounded-2xl space-y-4 shadow-glow-mint/20">
          <div className="flex items-center justify-between pb-3 border-b border-[#25324E]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4DDBA5] shadow-glow-mint" />
              <span className="text-base font-display font-bold text-[#F4F5FF]">
                Sandbox Replay with Safe Fix
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#4DDBA5]/10 text-[#4DDBA5] border border-[#4DDBA5]/30">
              PASS
            </span>
          </div>

          <div className="space-y-3">
            {replayEvents.map((evt) => {
              const isIntervened = evt.metadata?.is_intervened;
              const isSkipped = evt.status === 'skipped';

              return (
                <div
                  key={evt.event_id}
                  className={`p-3.5 rounded-xl border text-sm space-y-2 transition-all ${
                    isIntervened
                      ? 'bg-[#171F35] border-[#9B72FF]/50 text-[#F4F5FF]'
                      : isSkipped
                      ? 'bg-[#171F35] border-[#4DDBA5]/50 text-[#F4F5FF]'
                      : 'bg-[#171F35]/50 border-[#25324E] text-[#A7B0C5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-sm text-[#F4F5FF] flex items-center gap-1.5">
                      <span className="font-mono text-xs text-[#737F98]">#{evt.sequence}</span>
                      {evt.component}
                    </span>
                    <span className="text-xs font-mono">
                      {isIntervened ? (
                        <span className="text-[#9B72FF] font-semibold flex items-center gap-1">
                          ◈ Intervened
                        </span>
                      ) : isSkipped ? (
                        <span className="text-[#4DDBA5] font-semibold flex items-center gap-1">
                          ✓ Prevented
                        </span>
                      ) : (
                        <span className="text-[#737F98]">Normal</span>
                      )}
                    </span>
                  </div>

                  <div className="text-sm font-mono bg-[#0B1020]/60 p-2.5 rounded-lg border border-white/5">
                    {evt.event_id === 'evt_004' && (
                      <span className="text-[#4DDBA5] block font-semibold">
                        output.eligible: false (enforced 30-day limit strictly)
                      </span>
                    )}
                    {evt.event_id === 'evt_005' && (
                      <span className="text-[#4DDBA5] block">
                        execute_refund: SKIPPED (ineligible order payout successfully halted)
                      </span>
                    )}
                    {evt.event_id !== 'evt_004' && evt.event_id !== 'evt_005' && (
                      <span className="text-[#737F98]">{JSON.stringify(evt.output).slice(0, 110)}...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
