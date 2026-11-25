import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Activity, 
  ArrowRight, 
  Play, 
  GitFork, 
  Repeat, 
  Sparkles, 
  BarChart3, 
  ShieldCheck, 
  Search, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink,
  Flame,
  Zap,
  Target,
  FileSearch,
  Eye,
  Microscope,
  Terminal
} from 'lucide-react';
import { AgentRun } from '../types/run';
import { Badge } from '../components/Badge';

interface CommandCenterPageProps {
  runs: AgentRun[];
  onLaunchScenarioClick: () => void;
  onUploadTraceClick?: () => void;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({
  runs,
  onLaunchScenarioClick,
  onUploadTraceClick,
}) => {
  const navigate = useNavigate();

  const totalRuns = runs.length;
  const failedRuns = runs.filter((r) => r.status === 'failed' || r.failure_detected);
  const passedRuns = runs.filter((r) => r.status === 'completed' && !r.failure_detected);
  const rootCausesFound = failedRuns.length; // Decisive mistakes pinpointed

  return (
    <div className="h-full overflow-y-auto px-8 py-7 space-y-7 select-none w-full max-w-[1700px] mx-auto font-sans">
      {/* ========================================================
          1. IMMERSIVE HERO SECTION: FORENSIC INVESTIGATION RADAR
         ======================================================== */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative p-8 rounded-3xl bg-gradient-to-br from-[#11182A] via-[#171F35] to-[#11182A] border border-[#25324E] shadow-surface-elevation overflow-hidden"
      >
        {/* Atmospheric Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#9B72FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#42D9F5]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full text-sm font-mono font-semibold bg-[#9B72FF]/15 text-[#9B72FF] border border-[#9B72FF]/30 shadow-glow-violet">
                AI Agent Autopsy Platform
              </span>
              <span className="text-sm text-[#A7B0C5] font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4DDBA5] animate-pulse" />
                Active Diagnostic Environment
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#F4F5FF] tracking-tight leading-tight">
              Investigate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B72FF] via-[#42D9F5] to-[#639BFF]">why AI agents fail</span>, pinpoint earlier decisive mistakes.
            </h1>

            <p className="text-base text-[#A7B0C5] leading-relaxed max-w-2xl">
              Turn opaque multi-step agent traces into evidence-backed causal graphs. Separate early decisive policy errors from downstream symptoms, then safely verify fixes in isolated replay.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onLaunchScenarioClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FF647C] hover:bg-[#ff4e68] text-white font-semibold text-base rounded-xl shadow-[0_0_20px_rgba(255,100,124,0.35)] transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Inject Scenario</span>
              </button>

              <button
                onClick={() => navigate('/autopsy')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#171F35] hover:bg-[#202B43] border border-[#25324E] text-[#F4F5FF] font-medium text-base rounded-xl transition-all"
              >
                <Microscope className="w-4 h-4 text-[#9B72FF]" />
                <span>Open Autopsy Lab</span>
              </button>

              {onUploadTraceClick && (
                <button
                  onClick={onUploadTraceClick}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#A7B0C5] hover:text-[#42D9F5] font-mono transition-colors"
                >
                  <span>Or drop custom JSON trace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Hero Right Visual: Connected Evidence Fragments & Failure Signal */}
          <div className="lg:col-span-5 relative">
            <div className="p-5 rounded-2xl bg-[#0B1020]/90 border border-[#25324E] shadow-2xl relative space-y-3 font-mono text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#25324E] text-xs text-[#A7B0C5]">
                <span className="flex items-center gap-1.5 text-[#42D9F5]">
                  <Activity className="w-3.5 h-3.5" />
                  EVIDENCE LINEAGE
                </span>
                <span className="text-[#FF647C] font-semibold">SIGNAL: CORRUPTED POLICY</span>
              </div>

              {/* Dynamic node pathway graphic */}
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#11182A] border border-[#25324E]/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#42D9F5]" />
                    <span className="text-[#F4F5FF]">01 Input Context</span>
                  </div>
                  <span className="text-xs text-[#4DDBA5]">Verified</span>
                </div>

                <div className="flex justify-center -my-1 text-[#42D9F5]">↓</div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#11182A] border border-[#25324E]/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#42D9F5]" />
                    <span className="text-[#F4F5FF]">02 Policy Lookup</span>
                  </div>
                  <span className="text-xs text-[#4DDBA5]">Authoritative 30D</span>
                </div>

                <div className="flex justify-center -my-1 text-[#FFBD59]">↓</div>

                {/* Highlighted Decisive Mistake Node */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FFBD59]/10 border border-[#FFBD59]/50 shadow-[0_0_15px_rgba(255,189,89,0.2)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFBD59] animate-pulse" />
                    <span className="text-[#FFBD59] font-bold">03 Decisive Policy Decision</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-[#FFBD59]/20 text-[#FFBD59] rounded font-bold">
                    ROOT CAUSE
                  </span>
                </div>

                <div className="flex justify-center -my-1 text-[#FF647C]">↓</div>

                {/* Visible Failure Symptom */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#FF647C]/10 border border-[#FF647C]/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF647C]" />
                    <span className="text-[#FF647C] font-semibold">04 Execute Refund ($300)</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-[#FF647C]/20 text-[#FF647C] rounded font-bold">
                    FAILED INVARIANT
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#25324E] text-xs text-[#A7B0C5] flex items-center justify-between">
                <span>Localization: <strong>Top-1 Match</strong></span>
                <span className="text-[#42D9F5]">98.2% Confidence</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================================
          2. METRICS ROW (Space Grotesk Numbers + SVG Sparklines)
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Executions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-5 bg-[#11182A] border border-[#25324E] rounded-2xl space-y-2 hover:border-[#42D9F5]/40 transition-all shadow-surface-elevation"
        >
          <div className="flex items-center justify-between text-sm text-[#A7B0C5] font-medium">
            <span>Total Executions</span>
            <Activity className="w-4 h-4 text-[#42D9F5]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-display font-bold text-[#F4F5FF]">{totalRuns}</span>
            <span className="text-xs text-[#4DDBA5] font-mono flex items-center gap-0.5 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +100%
            </span>
          </div>
          {/* Subtle SVG sparkline */}
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
              <path d="M0,18 Q20,15 40,19 T80,8 T100,5" fill="none" stroke="#42D9F5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-sm text-[#737F98]">Recorded in immutable CEF store</div>
        </motion.div>

        {/* Metric 2: Confirmed Failures */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 bg-[#11182A] border border-[#25324E] border-t-2 border-t-[#FF647C] rounded-2xl space-y-2 shadow-surface-elevation hover:border-[#FF647C]/40 transition-all"
        >
          <div className="flex items-center justify-between text-sm text-[#A7B0C5] font-medium">
            <span>Confirmed Failures</span>
            <AlertOctagon className="w-4 h-4 text-[#FF647C]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-display font-bold text-[#FF647C]">{failedRuns.length}</span>
            <span className="text-xs text-[#FF647C] font-mono font-semibold">3 Active</span>
          </div>
          {/* Sparkline */}
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
              <path d="M0,8 Q25,12 50,7 T75,18 T100,16" fill="none" stroke="#FF647C" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-sm text-[#737F98]">Invariant rule violations flagged</div>
        </motion.div>

        {/* Metric 3: Verified Passes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-5 bg-[#11182A] border border-[#25324E] border-t-2 border-t-[#4DDBA5] rounded-2xl space-y-2 shadow-surface-elevation hover:border-[#4DDBA5]/40 transition-all"
        >
          <div className="flex items-center justify-between text-sm text-[#A7B0C5] font-medium">
            <span>Verified Passes</span>
            <CheckCircle2 className="w-4 h-4 text-[#4DDBA5]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-display font-bold text-[#4DDBA5]">{passedRuns.length}</span>
            <span className="text-xs text-[#4DDBA5] font-mono font-semibold">100% Intact</span>
          </div>
          {/* Sparkline */}
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
              <path d="M0,20 Q30,16 60,10 T100,4" fill="none" stroke="#4DDBA5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-sm text-[#737F98]">Passing control runs preserved</div>
        </motion.div>

        {/* Metric 4: Root Causes Identified */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 bg-[#11182A] border border-[#25324E] border-t-2 border-t-[#9B72FF] rounded-2xl space-y-2 shadow-surface-elevation hover:border-[#9B72FF]/40 transition-all"
        >
          <div className="flex items-center justify-between text-sm text-[#A7B0C5] font-medium">
            <span>Root Causes Isolated</span>
            <Target className="w-4 h-4 text-[#9B72FF]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-display font-bold text-[#9B72FF]">{rootCausesFound}</span>
            <span className="text-xs text-[#9B72FF] font-mono font-semibold">Gemini 2.5</span>
          </div>
          {/* Sparkline */}
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
              <path d="M0,15 Q35,8 70,12 T100,5" fill="none" stroke="#9B72FF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-sm text-[#737F98]">Evidence-linked hypotheses proven</div>
        </motion.div>
      </div>

      {/* ========================================================
          3. ACTIVE INVESTIGATION: INTERACTIVE JOURNEY (Section 04)
         ======================================================== */}
      <div className="p-6 bg-[#11182A] border border-[#25324E] rounded-3xl space-y-5 shadow-surface-elevation">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#25324E]">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Badge variant="failure" dot size="sm">
                Active Investigation
              </Badge>
              <span className="text-sm text-[#A7B0C5] font-mono">Case #run_f01_demo (F01)</span>
            </div>
            <h2 className="text-xl font-display font-bold text-[#F4F5FF]">
              Customer Prompt Injection / Trust Boundary Override
            </h2>
          </div>

          <button
            onClick={() => navigate('/autopsy')}
            className="flex items-center gap-2 px-4 py-2 bg-[#202B43] hover:bg-[#283552] border border-[#25324E] hover:border-[#9B72FF]/50 text-[#F4F5FF] rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <span>View Full Evidence</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#9B72FF]" />
          </button>
        </div>

        {/* Interactive Execution Journey: INPUT → RETRIEVAL → POLICY CHECK → ACTION → RESPONSE */}
        <div>
          <div className="text-sm font-mono uppercase text-[#737F98] tracking-wider mb-3">
            Execution Progression & Failure Localization:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {/* Stage 1: Input */}
            <div className="p-4 rounded-2xl bg-[#171F35] border border-[#4DDBA5]/40 space-y-1.5 relative">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#4DDBA5] font-bold">01 INPUT</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4DDBA5]" />
              </div>
              <div className="font-display font-semibold text-[#F4F5FF] text-base">Customer Intent</div>
              <p className="text-sm text-[#A7B0C5] line-clamp-2">Order SYN-1042 inquiry parsed cleanly.</p>
              <span className="text-xs font-mono text-[#737F98] block pt-1">Completed (120ms)</span>
            </div>

            {/* Stage 2: Retrieval */}
            <div className="p-4 rounded-2xl bg-[#171F35] border border-[#4DDBA5]/40 space-y-1.5 relative">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#4DDBA5] font-bold">02 RETRIEVAL</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4DDBA5]" />
              </div>
              <div className="font-display font-semibold text-[#F4F5FF] text-base">Policy & Order</div>
              <p className="text-sm text-[#A7B0C5] line-clamp-2">Fetched 30-day policy & 50-day order date.</p>
              <span className="text-xs font-mono text-[#737F98] block pt-1">Completed (195ms)</span>
            </div>

            {/* Stage 3: Policy Check (ROOT CAUSE DECISIVE MISTAKE) */}
            <div className="p-4 rounded-2xl bg-[#FFBD59]/10 border-2 border-[#FFBD59] space-y-1.5 relative shadow-glow-amber">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#FFBD59] font-bold">03 POLICY CHECK</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFBD59] text-[#0B1020] font-bold uppercase">
                  ROOT CAUSE
                </span>
              </div>
              <div className="font-display font-bold text-[#FFBD59] text-base">Eligibility Validated</div>
              <p className="text-sm text-[#F4F5FF] leading-snug">
                <strong>Decisive Mistake:</strong> Prompt override treated as official policy source.
              </p>
              <span className="text-sm font-mono text-[#FFBD59] block pt-1 font-bold">Decisive Error (410ms)</span>
            </div>

            {/* Stage 4: Action (FAILED SYMPTOM) */}
            <div className="p-4 rounded-2xl bg-[#FF647C]/10 border-2 border-[#FF647C] space-y-1.5 relative shadow-glow-coral">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#FF647C] font-bold">04 ACTION</span>
                <AlertOctagon className="w-3.5 h-3.5 text-[#FF647C] animate-pulse" />
              </div>
              <div className="font-display font-bold text-[#FF647C] text-base">Execute Refund</div>
              <p className="text-sm text-[#F4F5FF] leading-snug">
                <strong>Failure Symptom:</strong> Issued $300 for order delivered 50 days ago.
              </p>
              <span className="text-xs font-mono text-[#FF647C] block pt-1 font-bold">Invariant Violated (540ms)</span>
            </div>

            {/* Stage 5: Response */}
            <div className="p-4 rounded-2xl bg-[#171F35] border border-[#25324E] space-y-1.5 relative opacity-80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#737F98] font-bold">05 RESPONSE</span>
                <Clock className="w-3.5 h-3.5 text-[#737F98]" />
              </div>
              <div className="font-display font-semibold text-[#A7B0C5] text-base">Customer Payout</div>
              <p className="text-sm text-[#737F98] line-clamp-2">Erroneous refund confirmed to customer.</p>
              <span className="text-xs font-mono text-[#737F98] block pt-1">Completed (290ms)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. BOTTOM SECTION: 3 DISTINCTLY DESIGNED AREAS
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area 1: Recent Investigations (4 Cols) */}
        <div className="lg:col-span-5 p-6 bg-[#11182A] border border-[#25324E] rounded-3xl space-y-4 shadow-surface-elevation">
          <div className="flex items-center justify-between pb-3 border-b border-[#25324E]">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#42D9F5]" />
              <h3 className="font-display font-bold text-lg text-[#F4F5FF]">Recent Investigations</h3>
            </div>
            <button
              onClick={() => navigate('/runs')}
              className="text-sm text-[#42D9F5] hover:underline font-mono"
            >
              View all ({runs.length})
            </button>
          </div>

          <div className="space-y-3">
            {runs.slice(0, 4).map((r) => {
              const isFail = r.status === 'failed' || r.failure_detected;
              return (
                <div
                  key={r.run_id}
                  onClick={() => navigate('/timeline')}
                  className="p-3.5 rounded-2xl bg-[#171F35] hover:bg-[#202B43] border border-[#25324E] hover:border-[#42D9F5]/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#F4F5FF]">#{r.run_id}</span>
                      {r.scenario_id && (
                        <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full font-bold ${
                          isFail ? 'bg-[#FF647C]/15 text-[#FF647C]' : 'bg-[#4DDBA5]/15 text-[#4DDBA5]'
                        }`}>
                          {r.scenario_id}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#A7B0C5] line-clamp-1">{r.input_summary}</p>
                  </div>

                  <div className="text-right pl-3">
                    <Badge variant={isFail ? 'failure' : 'verified'} size="sm" dot>
                      {isFail ? 'Fail' : 'Pass'}
                    </Badge>
                    <div className="text-xs text-[#737F98] font-mono mt-1">{r.total_events} steps</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Area 2: Fault Taxonomy Breakdown (4 Cols) */}
        <div className="lg:col-span-4 p-6 bg-[#11182A] border border-[#25324E] rounded-3xl space-y-4 shadow-surface-elevation flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#25324E]">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-[#FFBD59]" />
                <h3 className="font-display font-bold text-lg text-[#F4F5FF]">Fault Taxonomy</h3>
              </div>
              <span className="text-sm font-mono text-[#FFBD59]">5 Invariants</span>
            </div>

            <div className="space-y-3 pt-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F4F5FF] font-medium">Policy / Trust Boundary (F01)</span>
                  <span className="font-mono text-[#FF647C] font-semibold">1 Case</span>
                </div>
                <div className="h-1.5 bg-[#0B1020] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF647C] rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F4F5FF] font-medium">Retrieval / Stale Policy (F02)</span>
                  <span className="font-mono text-[#FFBD59] font-semibold">1 Case</span>
                </div>
                <div className="h-1.5 bg-[#0B1020] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFBD59] rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F4F5FF] font-medium">Tool Schema Error (F03)</span>
                  <span className="font-mono text-[#42D9F5] font-semibold">1 Case</span>
                </div>
                <div className="h-1.5 bg-[#0B1020] rounded-full overflow-hidden">
                  <div className="h-full bg-[#42D9F5] rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F4F5FF] font-medium">State Contamination (F04)</span>
                  <span className="font-mono text-[#639BFF] font-semibold">1 Case</span>
                </div>
                <div className="h-1.5 bg-[#0B1020] rounded-full overflow-hidden">
                  <div className="h-full bg-[#639BFF] rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F4F5FF] font-medium">Skipped Eligibility (F05)</span>
                  <span className="font-mono text-[#9B72FF] font-semibold">1 Case</span>
                </div>
                <div className="h-1.5 bg-[#0B1020] rounded-full overflow-hidden">
                  <div className="h-full bg-[#9B72FF] rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/regression')}
            className="w-full py-2.5 rounded-xl bg-[#171F35] hover:bg-[#202B43] text-sm font-semibold text-[#42D9F5] border border-[#25324E] transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Open Regression Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Area 3: Agent Autopsy AI Insights (3 Cols) */}
        <div className="lg:col-span-3 p-6 bg-gradient-to-br from-[#171F35] to-[#11182A] border border-[#9B72FF]/30 rounded-3xl space-y-4 shadow-glow-violet flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#9B72FF]">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-display font-bold text-lg text-[#F4F5FF]">Gemini AI Insights</h3>
            </div>

            <p className="text-sm text-[#A7B0C5] leading-relaxed">
              Automated root-cause analysis isolates semantic failures that simple error catchers miss.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#0B1020]/90 border border-[#25324E] space-y-2 text-sm">
              <span className="text-[#FFBD59] font-bold block text-xs uppercase font-mono">
                Key Pattern Detected:
              </span>
              <p className="text-[#F4F5FF] leading-relaxed">
                Prompt injection directives in customer text are causing trust-boundary breaches prior to tool execution.
              </p>
              <div className="text-xs font-mono text-[#9B72FF] pt-1">
                Recommended: Boundary Policy Guard
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/autopsy')}
            className="w-full py-2.5 rounded-xl bg-[#9B72FF] hover:bg-[#885cf8] text-[#0B1020] text-sm font-bold transition-all shadow-[0_0_15px_rgba(155,114,255,0.3)] flex items-center justify-center gap-1.5"
          >
            <span>Review Full Diagnosis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
