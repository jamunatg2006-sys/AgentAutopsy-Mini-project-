import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListOrdered,
  Clock,
  GitFork,
  Microscope,
  Repeat,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Binary,
  Flame,
  Radio
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Command Center', path: '/', icon: LayoutDashboard },
  { name: 'Runs Explorer', path: '/runs', icon: ListOrdered },
  { name: 'Black Box Timeline', path: '/timeline', icon: Clock, badge: 'TRACE', badgeColor: 'bg-[#42D9F5]/10 text-[#42D9F5] border-[#42D9F5]/30' },
  { name: 'Dependency Graph', path: '/graph', icon: GitFork, badge: 'DAG', badgeColor: 'bg-[#FF647C]/10 text-[#FF647C] border-[#FF647C]/30' },
  { name: 'Autopsy Lab', path: '/autopsy', icon: Microscope, badge: 'AI', badgeColor: 'bg-[#9B72FF]/10 text-[#9B72FF] border-[#9B72FF]/30' },
  { name: 'Replay Lab', path: '/replay', icon: Repeat },
  { name: 'Regression Matrix', path: '/regression', icon: CheckCircle2 },
  { name: 'Forensic Reports', path: '/reports', icon: FileText },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-[#11182A]/70 border-r border-[#25324E] flex flex-col justify-between select-none h-[calc(100vh-72px)] sticky top-[72px] backdrop-blur-xl">
      {/* Navigation Links */}
      <div className="p-4 space-y-1.5">
        <div className="px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider text-[#737F98] uppercase">
          Investigation Modules
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-sans font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-[#171F35] text-[#F4F5FF] font-semibold shadow-inner-light text-[#9B72FF] after:absolute after:left-0 after:top-2 after:bottom-2 after:w-1 after:bg-[#9B72FF] after:rounded-r-full after:shadow-[0_0_12px_#9B72FF]'
                    : 'text-[#A7B0C5] hover:text-[#F4F5FF] hover:bg-[#171F35]/50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-[18px] h-[18px] text-[#A7B0C5] group-hover:text-[#42D9F5] transition-colors" />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full font-semibold border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Forensic Telemetry Box in Footer */}
      <div className="p-4 border-t border-[#25324E]/80 bg-[#0B1020]/60 text-sm font-sans space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[#A7B0C5]">
            <ShieldCheck className="w-4 h-4 text-[#4DDBA5]" />
            <span>Active Invariants</span>
          </span>
          <span className="text-[#4DDBA5] font-semibold font-mono">5 Rules</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[#A7B0C5]">
            <Binary className="w-4 h-4 text-[#42D9F5]" />
            <span>Benchmark Cases</span>
          </span>
          <span className="text-[#F4F5FF] font-semibold font-mono">10 Scenarios</span>
        </div>

        <div className="p-2.5 bg-[#11182A] rounded-xl border border-[#25324E] text-sm text-[#A7B0C5] leading-relaxed">
          <span className="text-[#FFBD59] font-semibold block mb-0.5">Isolated Sandbox</span>
          Live external tools are safely diverted to deterministic test fixtures.
        </div>
      </div>
    </aside>
  );
};
