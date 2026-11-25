import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileCode, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { TraceEvent } from '../types/event';
import { AgentRun } from '../types/run';

interface TraceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTraceImported: (run: AgentRun, events: TraceEvent[]) => void;
}

export const TraceUploadModal: React.FC<TraceUploadModalProps> = ({
  isOpen,
  onClose,
  onTraceImported,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<{ runId: string; eventCount: number } | null>(null);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setJsonText(text);
    setError(null);
    if (!text.trim()) {
      setParsedPreview(null);
      return;
    }
    try {
      const data = JSON.parse(text);
      const events = Array.isArray(data) ? data : data.events || [];
      const runId = data.run_id || (events[0] && events[0].run_id) || `run_imported_${Date.now().toString().slice(-4)}`;
      setParsedPreview({ runId, eventCount: events.length });
    } catch (e: any) {
      setParsedPreview(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleTextChange(content);
    };
    reader.readAsText(file);
  };

  const handleNormalizeAndIngest = () => {
    try {
      const data = JSON.parse(jsonText);
      const rawEvents = Array.isArray(data) ? data : data.events || [];
      const runId = data.run_id || (rawEvents[0] && rawEvents[0].run_id) || `run_import_${Date.now().toString().slice(-4)}`;

      // Normalize events into Agent Autopsy Common Event Format (CEF)
      const normalizedEvents: TraceEvent[] = rawEvents.map((e: any, index: number) => ({
        event_id: e.event_id || `evt_${String(index + 1).padStart(3, '0')}`,
        run_id: runId,
        sequence: e.sequence || index + 1,
        parent_event_id: e.parent_event_id || (index > 0 ? `evt_${String(index).padStart(3, '0')}` : null),
        event_type: e.event_type || 'tool',
        component: e.component || e.name || 'unnamed_component',
        input: e.input || e.arguments || {},
        output: e.output || e.result || {},
        status: e.status || (e.error ? 'failure' : 'success'),
        error_details: e.error_details || e.error || null,
        duration_ms: e.duration_ms || Math.floor(Math.random() * 250 + 50),
        timestamp: e.timestamp || new Date().toISOString(),
        metadata: {
          schema_version: '1.0',
          normalized: true,
          ...e.metadata,
        },
      }));

      const hasFailure = normalizedEvents.some((e) => e.status === 'failure');

      const importedRun: AgentRun = {
        run_id: runId,
        scenario_id: data.scenario_id || 'CUSTOM_IMPORT',
        agent_name: data.agent_name || 'ImportedAgentWorkflow',
        status: hasFailure ? 'failed' : 'completed',
        input_summary: data.input_summary || data.task_goal || 'Imported custom agent execution trace',
        task_input: data.task_input || {},
        expected_outcome: data.expected_outcome || {},
        actual_outcome: data.actual_outcome || (hasFailure ? { error: 'Execution trace contained failure status' } : { status: 'success' }),
        failure_detected: hasFailure,
        total_events: normalizedEvents.length,
        start_time: normalizedEvents[0]?.timestamp || new Date().toISOString(),
        end_time: normalizedEvents[normalizedEvents.length - 1]?.timestamp || new Date().toISOString(),
        tags: { imported: true, format: 'CEF_v1.0' },
      };

      onTraceImported(importedRun, normalizedEvents);
      onClose();
    } catch (err: any) {
      setError(`Invalid JSON structure: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#11182A] border border-[#25324E] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden font-sans text-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#171F35] border-b border-[#25324E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#42D9F5]/10 border border-[#42D9F5]/30 flex items-center justify-center">
              <Upload className="w-4 h-4 text-[#42D9F5]" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-[#F4F5FF]">Import Execution Trace</h2>
              <p className="text-sm text-[#A7B0C5]">Normalize raw agent JSON logs into the Agent Autopsy event schema</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#737F98] hover:text-[#F4F5FF] transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#A7B0C5] uppercase tracking-wider font-mono">
              Raw Trace JSON Payload
            </label>
            <label className="text-sm font-mono text-[#42D9F5] hover:underline cursor-pointer flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5" />
              <span>Upload file</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={`{\n  "run_id": "run_custom_001",\n  "events": [\n    {\n      "event_id": "evt_001",\n      "component": "lookup_customer",\n      "input": {"id": "CUST-99"},\n      "output": {"status": "ok"}\n    }\n  ]\n}`}
            rows={10}
            className="w-full bg-[#0B1020] border border-[#25324E] focus:border-[#42D9F5] rounded-xl p-3.5 font-mono text-sm text-[#F4F5FF] placeholder-[#737F98] outline-none transition-colors"
          />

          {error && (
            <div className="p-3 bg-[#FF647C]/10 border border-[#FF647C]/30 rounded-xl text-sm text-[#FF647C] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {parsedPreview && (
            <div className="p-3.5 bg-[#4DDBA5]/10 border border-[#4DDBA5]/30 rounded-xl flex items-center justify-between text-sm text-[#4DDBA5]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Ready to normalize: <strong>{parsedPreview.eventCount} events</strong> mapped to Run <strong>#{parsedPreview.runId}</strong></span>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 bg-[#4DDBA5]/20 rounded-full font-bold">CEF v1.0</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#171F35] border-t border-[#25324E]">
          <span className="text-sm text-[#737F98]">Normalizes components, parents, and invariant tags</span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#A7B0C5] hover:text-[#F4F5FF] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNormalizeAndIngest}
              disabled={!parsedPreview}
              className="flex items-center gap-2 px-5 py-2 bg-[#42D9F5] hover:bg-[#32c5e0] disabled:opacity-40 disabled:cursor-not-allowed text-[#0B1020] font-bold text-sm rounded-xl shadow-glow-cyan transition-all"
            >
              <span>Normalize & Ingest Trace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
