import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { Clock, Zap, AlertTriangle, AlertOctagon } from 'lucide-react';

export interface StepGroupNodeData {
  stepNumber: number;
  stepTitle: string;
  duration: string;
  tokens?: number;
  nodeCount: number;
  isSuspect?: boolean;
  isFailure?: boolean;
}

export const StepGroupNode = memo(({ data }: NodeProps) => {
  const groupData = data as unknown as StepGroupNodeData;

  return (
    <div
      className={`w-[350px] h-[800px] rounded-3xl border transition-all duration-300 pointer-events-none backdrop-blur-md ${
        groupData.isFailure
          ? 'bg-[#11182A]/70 border-[#FF647C]/40 shadow-[0_0_24px_rgba(255,100,124,0.12)]'
          : groupData.isSuspect
          ? 'bg-[#11182A]/70 border-[#FFBD59]/40 shadow-[0_0_24px_rgba(255,189,89,0.12)]'
          : 'bg-[#11182A]/50 border-[#25324E]/80 shadow-surface-elevation'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-[#25324E]/80 font-sans text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-base tracking-tight text-[#F4F5FF]">
            Step {groupData.stepNumber}
          </span>
          <span className="text-sm text-[#A7B0C5] truncate max-w-[140px]">
            {groupData.stepTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#A7B0C5] font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#737F98]" />
            {groupData.duration}
          </span>
          {groupData.tokens && (
            <span className="flex items-center gap-0.5 text-[#FFBD59] font-semibold">
              <Zap className="w-2.5 h-2.5" />
              {groupData.tokens}
            </span>
          )}
        </div>
      </div>

      {/* Alert Badges under header */}
      <div className="px-4 py-2.5 flex items-center gap-2">
        {groupData.isSuspect && (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#FFBD59]/15 border border-[#FFBD59]/40 text-[#FFBD59] text-xs font-mono font-bold rounded-full">
            <AlertTriangle className="w-2.5 h-2.5" />
            ROOT CAUSE STEP
          </span>
        )}
        {groupData.isFailure && (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-[#FF647C]/15 border border-[#FF647C]/40 text-[#FF647C] text-xs font-mono font-bold rounded-full">
            <AlertOctagon className="w-2.5 h-2.5" />
            INVARIANT FAILURE
          </span>
        )}
        <span className="text-xs text-[#737F98] font-mono ml-auto">
          {groupData.nodeCount} nodes
        </span>
      </div>
    </div>
  );
});
