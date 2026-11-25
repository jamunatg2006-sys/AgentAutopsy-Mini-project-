import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ArrowRight, AlertOctagon, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { TraceEvent } from '../../types/event';
import { Badge } from '../../components/Badge';
import { JsonViewer } from '../../components/JsonViewer';

interface EvidenceInspectorPanelProps {
  event: TraceEvent | null;
  onClose: () => void;
  onOpenInGraph?: (eventId: string) => void;
}

export const EvidenceInspectorPanel: React.FC<EvidenceInspectorPanelProps> = ({
  event,
  onClose,
  onOpenInGraph,
}) => {
  if (!event) return null;

  const isFailure = event.status === 'failure';
  const isWarning = event.status === 'warning' || event.metadata?.is_decisive_mistake;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 420, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-[450px] bg-[#11182A] border-l border-[#25324E] flex flex-col h-full z-30 shadow-2xl font-mono text-sm select-text"
      >
        {/* Drawer Header */}
        <div className="p-4 bg-[#0B1020] border-b border-[#25324E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Badge
              variant={isFailure ? 'failure' : isWarning ? 'suspicious' : 'flow'}
              size="md"
              dot
            >
              STEP #{event.sequence}
            </Badge>
            <span className="font-bold text-base text-[#F4F5FF] tracking-wider">
              {event.event_id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#171F35] hover:bg-[#202B43] text-[#A7B0C5] hover:text-[#F4F5FF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Component & Type */}
          <div className="p-4 bg-[#171F35] border border-[#25324E] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-sm text-[#A7B0C5]">
              <span className="font-semibold uppercase tracking-wider">COMPONENT</span>
              <span className="uppercase text-[#42D9F5] font-bold px-2 py-0.5 bg-[#42D9F5]/15 rounded border border-[#42D9F5]/40">
                {event.event_type}
              </span>
            </div>
            <div className="text-lg font-extrabold text-[#F4F5FF]">
              {event.component}
            </div>
            <div className="flex items-center gap-3 text-sm text-[#A7B0C5] pt-2 border-t border-[#25324E]">
              <span className="flex items-center gap-1 font-mono text-[#42D9F5]">
                <Clock className="w-3.5 h-3.5" />
                {event.duration_ms}ms
              </span>
              <span>•</span>
              <span className="font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Confirmed Failure Banner */}
          {event.error_details && (
            <div className="p-4 bg-red-950/70 border-2 border-red-500 rounded-xl space-y-1.5 shadow-neon-crimson">
              <div className="flex items-center gap-2 text-red-300 font-extrabold text-sm uppercase tracking-wider">
                <AlertOctagon className="w-5 h-5 animate-pulse text-red-500" />
                <span>CONFIRMED INVARIANT FAILURE</span>
              </div>
              <p className="text-red-200 text-sm font-sans leading-relaxed">
                {typeof event.error_details === 'string'
                  ? event.error_details
                  : JSON.stringify(event.error_details, null, 2)}
              </p>
            </div>
          )}

          {/* Suspect Invariant Rule violation notice */}
          {event.metadata?.violation && (
            <div className="p-4 bg-orange-950/70 border-2 border-[#FFBD59] rounded-xl space-y-1.5 shadow-neon-orange">
              <div className="flex items-center gap-2 text-orange-200 font-extrabold text-sm uppercase tracking-wider">
                <ShieldAlert className="w-5 h-5 text-[#FFBD59]" />
                <span>DECISIVE RULE BREACH DETECTED</span>
              </div>
              <p className="text-orange-200 text-sm font-sans leading-relaxed">
                Rule violated: <strong className="text-white underline">{event.metadata.violation}</strong>
              </p>
            </div>
          )}

          {/* Parent Dependency */}
          {event.parent_event_id && (
            <div className="flex items-center justify-between p-3 bg-[#171F35] border border-[#25324E] rounded-lg text-sm">
              <span className="text-[#A7B0C5] uppercase font-semibold">PARENT DEPENDENCY:</span>
              <span className="text-[#42D9F5] font-bold font-mono">{event.parent_event_id}</span>
            </div>
          )}

          {/* Input Inspection */}
          <JsonViewer data={event.input} title="EVENT INPUT PARAMETERS" />

          {/* Output Inspection */}
          <JsonViewer data={event.output} title="EVENT PRODUCED OUTPUT" />
        </div>

        {/* Drawer Action Footer */}
        {onOpenInGraph && (
          <div className="p-4 bg-[#0B1020] border-t border-[#25324E]">
            <button
              onClick={() => onOpenInGraph(event.event_id)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FFBD59] hover:bg-orange-500 text-[#0B1020] rounded-xl text-sm font-extrabold tracking-wider transition-all shadow-neon-orange"
            >
              <span>FOCUS NODE IN DEPENDENCY GRAPH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
