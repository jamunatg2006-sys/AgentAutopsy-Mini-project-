import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Wrench, 
  Sparkles, 
  CheckSquare, 
  User,
  Brain,
  CheckCircle2,
  Clock,
  Zap,
  PackageCheck
} from 'lucide-react';
import { TraceEvent } from '../../types/event';

export interface ForensicNodeData {
  event: TraceEvent;
  categoryType: 'user' | 'assistant' | 'thinking' | 'tool_use' | 'tool_result' | 'validation' | 'result';
  isCausalPath?: boolean;
  isDecisiveMistake?: boolean;
  isFailureSymptom?: boolean;
  isSelected?: boolean;
  tokensIn?: number;
  tokensOut?: number;
}

export const CustomForensicNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as ForensicNodeData;
  const event = nodeData.event;
  if (!event) return null;

  const isFailure = event.status === 'failure' || nodeData.isFailureSymptom;
  const isDecisive = nodeData.isDecisiveMistake || event.metadata?.is_decisive_mistake;
  const isCausal = nodeData.isCausalPath;

  const getCategoryMeta = () => {
    switch (nodeData.categoryType) {
      case 'user':
        return {
          label: 'User Intent',
          icon: <User className="w-3.5 h-3.5 text-[#42D9F5]" />,
          color: 'text-[#42D9F5]',
        };
      case 'assistant':
        return {
          label: 'Model Call',
          icon: <Sparkles className="w-3.5 h-3.5 text-[#9B72FF]" />,
          color: 'text-[#9B72FF]',
        };
      case 'thinking':
        return {
          label: 'Reasoning',
          icon: <Brain className="w-3.5 h-3.5 text-[#FFBD59]" />,
          color: 'text-[#FFBD59]',
        };
      case 'tool_use':
        return {
          label: 'Tool Execution',
          icon: <Wrench className="w-3.5 h-3.5 text-[#42D9F5]" />,
          color: 'text-[#42D9F5]',
        };
      case 'tool_result':
        return {
          label: 'Fixture Data',
          icon: <PackageCheck className="w-3.5 h-3.5 text-[#4DDBA5]" />,
          color: 'text-[#4DDBA5]',
        };
      case 'validation':
        return {
          label: 'Invariant Policy',
          icon: <CheckSquare className="w-3.5 h-3.5 text-[#FFBD59]" />,
          color: 'text-[#FFBD59]',
        };
      case 'result':
        return {
          label: 'Final Response',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#9B72FF]" />,
          color: 'text-[#9B72FF]',
        };
      default:
        return {
          label: 'Agent Action',
          icon: <Sparkles className="w-3.5 h-3.5 text-[#42D9F5]" />,
          color: 'text-[#42D9F5]',
        };
    }
  };

  const meta = getCategoryMeta();

  // Subtle Matte + Glow Border Finish (Creative Direction)
  const getCardBorder = () => {
    if (isDecisive) {
      return 'border-2 border-[#FFBD59] shadow-[0_0_20px_rgba(255,189,89,0.3)] bg-[#171F35]';
    }
    if (isFailure) {
      return 'border-2 border-[#FF647C] shadow-[0_0_20px_rgba(255,100,124,0.3)] bg-[#171F35]';
    }
    if (selected) {
      return 'border-2 border-[#42D9F5] shadow-[0_0_15px_rgba(66,217,245,0.25)] bg-[#171F35]';
    }
    if (isCausal) {
      return 'border border-[#42D9F5]/40 bg-[#11182A]';
    }
    return 'border border-[#25324E] bg-[#11182A]/90 hover:border-[#42D9F5]/30';
  };

  const tokensIn = nodeData.tokensIn || (event.metadata?.tokens ? Math.floor(event.metadata.tokens * 0.6) : null);
  const tokensOut = nodeData.tokensOut || (event.metadata?.tokens ? Math.floor(event.metadata.tokens * 0.4) : null);

  return (
    <div
      className={`w-80 p-4 rounded-2xl font-sans text-sm select-none transition-all duration-200 backdrop-blur-md ${getCardBorder()}`}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!bg-[#42D9F5] !w-2.5 !h-2.5 !border-2 !border-[#0B1020]" />
      <Handle type="source" position={Position.Right} className="!bg-[#42D9F5] !w-2.5 !h-2.5 !border-2 !border-[#0B1020]" />
      <Handle type="target" position={Position.Top} className="!bg-[#42D9F5] !w-2.5 !h-2.5 !border-2 !border-[#0B1020]" />
      <Handle type="source" position={Position.Bottom} className="!bg-[#42D9F5] !w-2.5 !h-2.5 !border-2 !border-[#0B1020]" />

      {/* Header Tag Row */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#25324E]/80">
        <div className="flex items-center gap-2">
          {meta.icon}
          <span className={`text-sm font-semibold ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        {isDecisive && (
          <span className="px-2 py-0.5 bg-[#FFBD59]/20 text-[#FFBD59] text-xs font-mono font-bold rounded-full">
            ROOT CAUSE
          </span>
        )}
        {isFailure && (
          <span className="px-2 py-0.5 bg-[#FF647C]/20 text-[#FF647C] text-xs font-mono font-bold rounded-full">
            CRITICAL FAIL
          </span>
        )}
      </div>

      {/* Latency & Tokens */}
      <div className="flex items-center gap-3 text-xs text-[#A7B0C5] mb-2 font-mono">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#737F98]" />
          {(event.duration_ms / 1000).toFixed(2)}s
        </span>
        {event.metadata?.tokens && (
          <span className="flex items-center gap-1 text-[#FFBD59]">
            <Zap className="w-3 h-3" />
            {event.metadata.tokens} tokens
          </span>
        )}
      </div>

      {/* Component Title */}
      <div className="font-display font-bold text-[#F4F5FF] text-base mb-1.5 truncate">
        {event.component}
      </div>

      {/* Snippet Description */}
      <div className="text-sm text-[#A7B0C5] bg-[#0B1020]/80 p-2.5 rounded-xl border border-[#25324E]/80 mb-2 leading-relaxed">
        {isFailure ? (
          <span className="text-[#FF647C] font-mono text-sm font-semibold">
            {typeof event.error_details === 'string'
              ? event.error_details
              : 'DomainInvariantError: Exceeded 30-day refund policy'}
          </span>
        ) : isDecisive ? (
          <span className="text-[#FFBD59] font-mono text-xs">
            Overridden by untrusted customer directive text
          </span>
        ) : (
          <span className="line-clamp-2">
            {JSON.stringify(event.output || event.input).slice(0, 95)}...
          </span>
        )}
      </div>

      {/* In / Out Token Badges */}
      {(tokensIn || tokensOut) && (
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#25324E]/80 text-xs font-mono">
          {tokensIn && (
            <span className="px-1.5 py-0.2 bg-[#4DDBA5]/15 text-[#4DDBA5] rounded font-semibold">
              in {tokensIn}
            </span>
          )}
          {tokensOut && (
            <span className="px-1.5 py-0.2 bg-[#42D9F5]/15 text-[#42D9F5] rounded font-semibold">
              out {tokensOut}
            </span>
          )}
          <span className="ml-auto text-xs text-[#737F98]">
            #{event.event_id}
          </span>
        </div>
      )}
    </div>
  );
});
