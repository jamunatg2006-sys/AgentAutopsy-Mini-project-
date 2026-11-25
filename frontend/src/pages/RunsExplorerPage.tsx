import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Play, 
  ChevronRight,
  ShieldCheck,
  AlertOctagon,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { AgentRun } from '../types/run';
import { Badge } from '../components/Badge';

interface RunsExplorerPageProps {
  runs: AgentRun[];
  onSelectRun: (runId: string) => void;
  onLaunchScenarioClick: () => void;
}

export const RunsExplorerPage: React.FC<RunsExplorerPageProps> = ({
  runs,
  onSelectRun,
  onLaunchScenarioClick,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'failed' | 'completed'>('all');

  const filteredRuns = runs.filter((r) => {
    const matchesSearch =
      r.run_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.input_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.scenario_id && r.scenario_id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'failed'
        ? r.status === 'failed' || r.failure_detected
        : r.status === 'completed' && !r.failure_detected;

    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (runId: string) => {
    onSelectRun(runId);
    navigate('/timeline');
  };

  return (
    <div className="h-full overflow-y-auto px-6 lg:px-10 py-7 font-sans space-y-7 select-none w-full bg-[#0B1020]">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-[#11182A] border border-[#25324E] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden shadow-surface-elevation"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#42D9F5] via-[#9B72FF] to-[#4DDBA5]" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#42D9F5]/10 text-[#42D9F5] border border-[#42D9F5]/25">
              Trace Archive
            </span>
            <span className="text-xs text-[#A7B0C5] font-mono">
              // Execution Dossiers
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-[#F4F5FF] tracking-tight">
            Agent Execution Runs Explorer
          </h1>
          <p className="text-base text-[#A7B0C5] font-normal leading-relaxed">
            Search, filter, and inspect recorded multi-step agent trajectories and failure traces.
          </p>
        </div>

        <button
          onClick={onLaunchScenarioClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#42D9F5] hover:bg-[#34c7e2] text-[#0B1020] font-display font-semibold text-sm rounded-xl shadow-glow-cyan transition-all shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Inject Benchmark Scenario</span>
        </button>
      </motion.div>

      {/* Search & Filter Bar */}
      <div className="p-3 bg-[#11182A] border border-[#25324E] rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-surface-elevation">
        {/* Search Input */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#171F35] border border-[#25324E] rounded-xl w-full sm:w-96 text-sm focus-within:border-[#42D9F5]/50 transition-colors">
          <Search className="w-4 h-4 text-[#737F98]" />
          <input
            type="text"
            placeholder="Search run ID, scenario (F01), or customer goal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[#F4F5FF] outline-none w-full placeholder:text-[#737F98] text-sm font-sans"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto text-sm">
          <span className="text-[#737F98] text-xs font-mono mr-1 hidden sm:inline">STATUS:</span>
          {(['all', 'failed', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-sm font-display font-medium transition-all ${
                statusFilter === filter
                  ? 'bg-[#171F35] border border-[#42D9F5]/50 text-[#42D9F5] shadow-glow-cyan/20'
                  : 'bg-[#171F35]/40 border border-transparent text-[#A7B0C5] hover:text-[#F4F5FF]'
              }`}
            >
              {filter === 'all' ? 'All Trajectories' : filter === 'failed' ? 'Failed Only' : 'Passed Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Runs Table */}
      <div className="bg-[#11182A] border border-[#25324E] rounded-2xl overflow-hidden shadow-surface-elevation">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#171F35]/60 border-b border-[#25324E] text-xs font-mono text-[#737F98] uppercase">
                <th className="py-3 px-5 font-semibold">Run ID / Scenario</th>
                <th className="py-3 px-5 font-semibold">Agent & Goal</th>
                <th className="py-3 px-5 font-semibold">Status</th>
                <th className="py-3 px-5 font-semibold">Events</th>
                <th className="py-3 px-5 font-semibold">Timestamp</th>
                <th className="py-3 px-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25324E]/50">
              {filteredRuns.map((r) => {
                const isFail = r.status === 'failed' || r.failure_detected;

                return (
                  <tr
                    key={r.run_id}
                    onClick={() => handleRowClick(r.run_id)}
                    className="hover:bg-[#171F35]/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-mono font-bold text-sm text-[#F4F5FF] flex items-center gap-2">
                        <span>{r.run_id}</span>
                        {r.scenario_id && (
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                              isFail
                                ? 'bg-[#FF647C]/10 text-[#FF647C] border border-[#FF647C]/30'
                                : 'bg-[#4DDBA5]/10 text-[#4DDBA5] border border-[#4DDBA5]/30'
                            }`}
                          >
                            {r.scenario_id}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-5 font-sans max-w-md">
                      <div className="font-mono text-xs text-[#737F98]">
                        {r.agent_name}
                      </div>
                      <div className="text-[#A7B0C5] group-hover:text-[#F4F5FF] line-clamp-1 mt-0.5 text-sm transition-colors">
                        {r.input_summary}
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <Badge variant={isFail ? 'failure' : 'verified'} size="sm" dot>
                        {isFail ? 'FAIL' : 'PASS'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-5 text-[#A7B0C5] font-mono text-sm">
                      {r.total_events} steps
                    </td>

                    <td className="py-3.5 px-5 text-[#737F98] text-xs font-mono">
                      {new Date(r.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center gap-1 text-[#42D9F5] font-display font-medium text-sm group-hover:translate-x-1 transition-transform">
                        <span>Inspect Trace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
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
