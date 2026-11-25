import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Search, 
  Upload, 
  Play, 
  User, 
  Cpu, 
  Sparkles,
  Command
} from 'lucide-react';
import { Badge } from './Badge';

interface HeaderProps {
  activeRunId?: string;
  onLaunchScenarioClick?: () => void;
  onUploadTraceClick?: () => void;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRunId = 'run_f01_demo',
  onLaunchScenarioClick,
  onUploadTraceClick,
}) => {
  return (
    <header className="h-[72px] bg-[#11182A]/90 border-b border-[#25324E] px-6 flex items-center justify-between select-none sticky top-0 z-40 backdrop-blur-xl">
      {/* Brand & Active Case */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9B72FF] via-[#42D9F5] to-[#639BFF] p-[1.5px] shadow-glow-cyan">
            <div className="w-full h-full bg-[#0B1020] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#42D9F5]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-[#F4F5FF] tracking-tight">
                Agent Autopsy
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#9B72FF]/15 text-[#9B72FF] border border-[#9B72FF]/30">
                FORENSIC LAB
              </span>
            </div>
            <p className="text-sm text-[#A7B0C5] font-sans -mt-0.5">
              Autonomous Failure Investigation & Replay
            </p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-[1px] bg-[#25324E] hidden lg:block" />

        {/* Global Search Bar (Section 04 requirement) */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 bg-[#0B1020]/90 border border-[#25324E] hover:border-[#42D9F5]/50 rounded-xl text-sm w-80 transition-colors">
          <Search className="w-3.5 h-3.5 text-[#737F98]" />
          <input
            type="text"
            placeholder="Search traces, hypotheses, rules..."
            className="bg-transparent text-[#F4F5FF] placeholder-[#737F98] text-sm outline-none w-full"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-[#737F98] bg-[#171F35] rounded font-mono border border-[#25324E]">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>
      </div>

      {/* Telemetry Status & Actions */}
      <div className="flex items-center gap-4">
        {/* Telemetry Status Lights */}
        <div className="hidden xl:flex items-center gap-3.5 px-3.5 py-1.5 bg-[#0B1020] border border-[#25324E] rounded-xl text-sm font-sans">
          <div className="flex items-center gap-1.5 text-[#4DDBA5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4DDBA5] animate-pulse" />
            <span className="font-medium">Core Online</span>
          </div>
          <span className="text-[#25324E]">|</span>
          <div className="flex items-center gap-1.5 text-[#42D9F5]">
            <Cpu className="w-3.5 h-3.5 text-[#42D9F5]" />
            <span className="font-medium">Sandbox Isolated</span>
          </div>
          <span className="text-[#25324E]">|</span>
          <div className="flex items-center gap-1.5 text-[#FFBD59]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFBD59]" />
            <span className="font-medium">Side Effects Blocked</span>
          </div>
        </div>

        {/* Active Case Tag */}
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="failure" dot size="sm">
            Case #{activeRunId}
          </Badge>
        </div>

        {/* Import JSON button */}
        {onUploadTraceClick && (
          <button
            onClick={onUploadTraceClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171F35] hover:bg-[#202B43] border border-[#25324E] hover:border-[#42D9F5]/40 text-[#F4F5FF] text-sm font-medium rounded-xl transition-all"
            title="Upload raw JSON trace"
          >
            <Upload className="w-3.5 h-3.5 text-[#42D9F5]" />
            <span className="hidden sm:inline">Import Trace</span>
          </button>
        )}

        {/* Launch Scenario Action Button */}
        {onLaunchScenarioClick && (
          <button
            onClick={onLaunchScenarioClick}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#FF647C] hover:bg-[#ff4e68] text-white text-sm font-semibold rounded-xl shadow-[0_0_15px_rgba(255,100,124,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Inject Scenario</span>
          </button>
        )}

        {/* Investigator Console Session */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#25324E]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9B72FF] to-[#42D9F5] p-[1.5px]">
            <div className="w-full h-full bg-[#11182A] rounded-full flex items-center justify-center text-sm font-mono font-bold text-[#42D9F5]">
              OP
            </div>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-semibold text-[#F4F5FF]">Forensic Lab</div>
            <div className="text-xs text-[#737F98] leading-none">Station Active</div>
          </div>
        </div>
      </div>
    </header>
  );
};
