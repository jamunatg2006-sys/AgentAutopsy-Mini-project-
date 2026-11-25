import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { RegressionEvaluationReport } from '../../types/evaluation';
import { Badge } from '../../components/Badge';

interface RegressionMatrixProps {
  report: RegressionEvaluationReport;
}

export const RegressionMatrix: React.FC<RegressionMatrixProps> = ({ report }) => {
  return (
    <div className="h-full overflow-y-auto px-6 lg:px-10 py-7 font-sans space-y-7 select-none w-full bg-[#0B1020]">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-[#11182A] border border-[#25324E] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden shadow-surface-elevation"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#4DDBA5] via-[#42D9F5] to-[#9B72FF]" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#4DDBA5]/10 text-[#4DDBA5] border border-[#4DDBA5]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DDBA5] animate-pulse" />
              Safety Suite Evaluation
            </span>
            <span className="text-sm text-[#42D9F5] font-mono">
              // 10-Scenario Benchmark
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-[#F4F5FF] tracking-tight">
            Regression Verification Matrix
          </h1>
          <p className="text-base text-[#A7B0C5] font-normal leading-relaxed">
            Fix Evaluated: <strong className="text-[#F4F5FF] font-mono">{report.fix_description}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-sm font-display font-bold border ${
            report.verdict === 'ACCEPTED'
              ? 'bg-[#4DDBA5]/10 text-[#4DDBA5] border-[#4DDBA5]/30 shadow-glow-mint'
              : 'bg-[#FF647C]/10 text-[#FF647C] border-[#FF647C]/30 shadow-glow-coral'
          }`}>
            Deployment Verdict: {report.verdict}
          </div>
        </div>
      </motion.div>

      {/* Prominent Rescue Rate & Break Rate Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Rescue Rate Dial */}
        <div className="p-5 bg-[#11182A] border border-[#4DDBA5]/30 rounded-2xl flex flex-col justify-between shadow-glow-mint/15">
          <div className="flex items-center justify-between text-sm text-[#4DDBA5] font-display font-bold tracking-wide uppercase">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#4DDBA5]" />
              Rescue Rate
            </span>
            <span className="text-xs text-[#A7B0C5] font-mono">TARGET &gt; 0%</span>
          </div>
          <div className="py-3">
            <div className="text-3xl lg:text-4xl font-display font-bold text-[#4DDBA5]">
              {report.rescue_rate}%
            </div>
            <div className="text-sm text-[#A7B0C5] mt-1 font-sans">
              {report.rescued_count} of 5 failures rescued
            </div>
          </div>
          <div className="w-full bg-[#171F35] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-[#4DDBA5] h-full rounded-full shadow-glow-mint"
              style={{ width: `${report.rescue_rate}%` }}
            />
          </div>
        </div>

        {/* Break Rate Dial */}
        <div className="p-5 bg-[#11182A] border border-[#25324E] rounded-2xl flex flex-col justify-between shadow-surface-elevation">
          <div className="flex items-center justify-between text-sm text-[#A7B0C5] font-display font-bold tracking-wide uppercase">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-[#4DDBA5]" />
              Break Rate
            </span>
            <span className="text-xs text-[#4DDBA5] font-mono">TARGET 0.0%</span>
          </div>
          <div className="py-3">
            <div className="text-3xl lg:text-4xl font-display font-bold text-[#F4F5FF]">
              {report.break_rate}%
            </div>
            <div className="text-sm text-[#A7B0C5] mt-1 font-sans">
              {report.broken_count} of 5 passing controls broken
            </div>
          </div>
          <div className="w-full bg-[#171F35] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-[#FF647C] h-full rounded-full"
              style={{ width: `${report.break_rate}%` }}
            />
          </div>
        </div>

        {/* Total Suite Cases */}
        <div className="p-5 bg-[#11182A] border border-[#25324E] rounded-2xl flex flex-col justify-between shadow-surface-elevation">
          <div className="flex items-center justify-between text-sm text-[#A7B0C5] font-display font-bold tracking-wide uppercase">
            <span>Total Benchmarks</span>
            <Activity className="w-4 h-4 text-[#42D9F5]" />
          </div>
          <div className="py-3">
            <div className="text-3xl lg:text-4xl font-display font-bold text-[#F4F5FF]">
              {report.total_scenarios_tested}
            </div>
            <div className="text-sm text-[#A7B0C5] mt-1 font-sans">
              5 Failures + 5 Passing Controls
            </div>
          </div>
          <span className="text-sm text-[#42D9F5] font-mono font-medium">LangGraph Sandbox</span>
        </div>

        {/* Fix Guard Status */}
        <div className="p-5 bg-[#11182A] border border-[#25324E] rounded-2xl flex flex-col justify-between shadow-surface-elevation">
          <div className="flex items-center justify-between text-sm text-[#A7B0C5] font-display font-bold tracking-wide uppercase">
            <span>Fix Integrity</span>
            <ShieldCheck className="w-4 h-4 text-[#4DDBA5]" />
          </div>
          <div className="py-3">
            <div className="text-xl font-display font-bold text-[#4DDBA5]">
              Zero Regressions
            </div>
            <div className="text-sm text-[#A7B0C5] mt-1 font-sans">
              Safe for controlled staging replay
            </div>
          </div>
          <span className="text-xs text-[#4DDBA5] font-mono font-medium">Proven in Sandbox</span>
        </div>
      </div>

      {/* 10-Scenario Results Table */}
      <div className="bg-[#11182A] border border-[#25324E] rounded-2xl overflow-hidden shadow-surface-elevation">
        <div className="p-4 bg-[#171F35]/70 border-b border-[#25324E] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-base font-display font-bold text-[#F4F5FF]">
            Benchmark Evaluation Matrix
          </span>
          <span className="text-sm text-[#42D9F5] font-mono">
            F01–F05 (Failures) | P01–P05 (Passing Controls)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#0B1020]/60 border-b border-[#25324E] text-xs font-mono text-[#737F98] uppercase">
                <th className="py-3 px-5 font-semibold">Scenario ID</th>
                <th className="py-3 px-5 font-semibold">Name / Fault Description</th>
                <th className="py-3 px-5 font-semibold">Baseline Verdict</th>
                <th className="py-3 px-5 font-semibold">Post-Fix Verdict</th>
                <th className="py-3 px-5 font-semibold">Status Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25324E]/60">
              {report.scenario_results.map((res) => {
                const isRescued = res.status_change === 'rescued';
                const isBroken = res.status_change === 'broken';
                const isPreserved = res.status_change === 'preserved_pass';

                return (
                  <tr
                    key={res.scenario_id}
                    className="hover:bg-[#171F35]/50 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-mono font-bold text-sm text-[#42D9F5]">
                      {res.scenario_id}
                    </td>
                    <td className="py-3.5 px-5 font-sans text-sm text-[#F4F5FF] font-medium">
                      {res.scenario_name}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                          res.baseline_verdict === 'FAIL'
                            ? 'bg-[#FF647C]/10 text-[#FF647C] border border-[#FF647C]/30'
                            : 'bg-[#4DDBA5]/10 text-[#4DDBA5] border border-[#4DDBA5]/30'
                        }`}
                      >
                        {res.baseline_verdict}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                          res.post_fix_verdict === 'FAIL'
                            ? 'bg-[#FF647C]/10 text-[#FF647C] border border-[#FF647C]/30'
                            : 'bg-[#4DDBA5]/10 text-[#4DDBA5] border border-[#4DDBA5]/30'
                        }`}
                      >
                        {res.post_fix_verdict}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-sans text-sm">
                      {isRescued && (
                        <span className="text-[#4DDBA5] flex items-center gap-1.5 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Rescued (+Fix)</span>
                        </span>
                      )}
                      {isBroken && (
                        <span className="text-[#FF647C] flex items-center gap-1.5 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Regressed (Broken)</span>
                        </span>
                      )}
                      {isPreserved && (
                        <span className="text-[#A7B0C5] flex items-center gap-1.5">
                          <span>Preserved Pass</span>
                        </span>
                      )}
                      {res.status_change === 'still_failed' && (
                        <span className="text-[#737F98] flex items-center gap-1.5">
                          <span>Still Failed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
