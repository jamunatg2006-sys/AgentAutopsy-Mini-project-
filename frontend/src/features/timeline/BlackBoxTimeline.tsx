import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  Wrench, 
  Sparkles, 
  CheckSquare, 
  Layers, 
  Terminal,
  Zap, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Flame,
  Radio,
  ArrowRight
} from 'lucide-react';
import { TraceEvent } from '../../types/event';
import { JsonViewer } from '../../components/JsonViewer';

interface BlackBoxTimelineProps {
  events: TraceEvent[];
  onFocusNodeInGraph?: (eventId: string) => void;
}

export const BlackBoxTimeline: React.FC<BlackBoxTimelineProps> = ({
  events,
  onFocusNodeInGraph,
}) => {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'payload' | 'invariants' | 'sandbox'>('payload');
  const [guardActive, setGuardActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeEvent = events[activeEventIndex] || events[0];
  const isFailure = activeEvent?.status === 'failure';
  const isSuspicious = activeEvent?.status === 'warning' || activeEvent?.metadata?.is_decisive_mistake;

  // Autoplay Scrubber Simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveEventIndex((prev) => {
          if (prev >= events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, events.length]);

  // Audio/Visual Oscilloscope Waveform Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2.5;

      // Color shifts based on current step status
      ctx.strokeStyle = isFailure 
        ? '#ff1744' 
        : isSuspicious 
        ? '#ff6600' 
        : '#00f0ff';

      ctx.beginPath();
      const height = canvas.height;
      const width = canvas.width;
      const frequency = isFailure ? 0.08 : isSuspicious ? 0.05 : 0.025;
      const amplitude = isFailure ? 16 : isSuspicious ? 12 : 7;

      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * frequency + phase) * amplitude * Math.sin(x / 30);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isFailure ? 0.12 : isSuspicious ? 0.08 : 0.035;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isFailure, isSuspicious]);

  const getEventIcon = (type: string, status: string) => {
    if (status === 'failure') return <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" />;
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-[#FFBD59]" />;

    switch (type) {
      case 'tool':
        return <Wrench className="w-5 h-5 text-[#42D9F5]" />;
      case 'model':
        return <Sparkles className="w-5 h-5 text-[#9B72FF]" />;
      case 'validation':
        return <CheckSquare className="w-5 h-5 text-[#FFBD59]" />;
      case 'state':
        return <Layers className="w-5 h-5 text-[#737F98]" />;
      default:
        return <Terminal className="w-5 h-5 text-[#737F98]" />;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0B1020] text-[#F4F5FF] select-none">
      {/* ========================================================
          1. SLEEK SEAMLESS HEADER (NO NESTED BOXES)
         ======================================================== */}
      <div className="px-8 py-4 border-b border-[#25324E] bg-[#11182A]/95 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Live Status */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isFailure ? 'bg-red-400' : isSuspicious ? 'bg-orange-400' : 'bg-cyan-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              isFailure ? 'bg-red-500' : isSuspicious ? 'bg-orange-500' : 'bg-cyan-400'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black tracking-widest text-white uppercase font-mono">
                BLACK BOX FLIGHT RECORDER
              </h1>
              <span className="text-xs font-mono font-bold tracking-wider text-[#42D9F5]">
                // LIVE RECONSTRUCTION
              </span>
            </div>
            <p className="text-sm text-[#A7B0C5] font-sans mt-0.5">
              Playback agent trajectory • Step #{activeEventIndex + 1} of {events.length} active
            </p>
          </div>
        </div>

        {/* Playback Controls (Clean Pill, No Harsh Box Borders) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#171F35] px-4 py-2 rounded-full border border-[#25324E] backdrop-blur-md">
            <button
              onClick={() => setActiveEventIndex(Math.max(0, activeEventIndex - 1))}
              disabled={activeEventIndex === 0}
              className="p-1 hover:text-[#42D9F5] disabled:opacity-30 transition-colors"
              title="Previous Step"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3.5 py-1 bg-[#42D9F5] text-black font-extrabold text-sm rounded-full shadow-glow-cyan hover:bg-cyan-300 transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={() => setActiveEventIndex(Math.min(events.length - 1, activeEventIndex + 1))}
              disabled={activeEventIndex === events.length - 1}
              className="p-1 hover:text-[#42D9F5] disabled:opacity-30 transition-colors"
              title="Next Step"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            <div className="flex items-center gap-1 text-xs font-mono">
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                    playbackSpeed === s ? 'text-[#42D9F5]' : 'text-slate-500 hover:text-[#F4F5FF]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Quick Jump Buttons (Clean Colored Pills) */}
          <button
            onClick={() => setActiveEventIndex(3)}
            className="px-3.5 py-1.5 bg-[#FFBD59]/15 hover:bg-[#FFBD59]/25 text-[#FFBD59] border border-[#FFBD59]/40 rounded-full text-sm font-mono font-bold transition-all shadow-glow-amber flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ROOT CAUSE</span>
          </button>

          <button
            onClick={() => setActiveEventIndex(4)}
            className="px-3.5 py-1.5 bg-[#FF647C]/15 hover:bg-[#FF647C]/25 text-[#FF647C] border border-[#FF647C]/40 rounded-full text-sm font-mono font-bold transition-all shadow-[0_0_12px_rgba(255,23,68,0.25)] flex items-center gap-1.5"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>CRASH</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. MAIN FLUID WORKSPACE (NO BOX IN BOX)
         ======================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================
            LEFT COLUMN: FLUID TIMELINE STREAM (SEAMLESS THREAD)
           ======================================================== */}
        <div className="w-[52%] overflow-y-auto px-8 py-6 space-y-2">
          <div className="text-sm font-mono uppercase tracking-widest text-[#737F98] pb-3 flex items-center justify-between">
            <span>EXECUTION THREAD</span>
            <span className="text-[#42D9F5]">SELECT STEP TO INSPECT</span>
          </div>

          <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-[#42D9F5] before:via-[#FFBD59] before:to-[#FF647C]">
            {events.map((event, idx) => {
              const isActive = idx === activeEventIndex;
              const isEventFail = event.status === 'failure';
              const isEventSuspect = event.status === 'warning' || event.metadata?.is_decisive_mistake;

              return (
                <div
                  key={event.event_id}
                  onClick={() => {
                    setActiveEventIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive
                      ? isEventFail
                        ? 'bg-red-950/30 border-l-4 border-l-red-500 shadow-[0_0_20px_rgba(255,23,68,0.2)]'
                        : isEventSuspect
                        ? 'bg-orange-950/30 border-l-4 border-l-[#FFBD59] shadow-[0_0_20px_rgba(255,189,89,0.2)]'
                        : 'bg-cyan-950/20 border-l-4 border-l-[#42D9F5] shadow-[0_0_20px_rgba(66,217,245,0.2)]'
                      : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
                  }`}
                >
                  {/* Glowing Node Dot on Timeline Rail */}
                  <div
                    className={`absolute -left-[29px] top-5 w-3.5 h-3.5 rounded-full border-2 border-black transition-all ${
                      isActive
                        ? isEventFail
                          ? 'bg-red-500 scale-125 shadow-[0_0_10px_#ff1744]'
                          : isEventSuspect
                          ? 'bg-[#FFBD59] scale-125 shadow-[0_0_10px_#FFBD59]'
                          : 'bg-[#42D9F5] scale-125 shadow-[0_0_10px_#42D9F5]'
                        : 'bg-slate-700'
                    }`}
                  />

                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#737F98]">
                        #{event.sequence}
                      </span>
                      <span className={`font-mono text-base font-black ${
                        isEventFail
                          ? 'text-red-400'
                          : isEventSuspect
                          ? 'text-[#FFBD59]'
                          : isActive
                          ? 'text-[#42D9F5]'
                          : 'text-white'
                      }`}>
                        {event.component}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-mono text-[#A7B0C5]">
                      <span className="text-[#42D9F5]/90 font-bold">{event.duration_ms}ms</span>
                      <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                      {getEventIcon(event.event_type, event.status)}
                    </div>
                  </div>

                  {/* Clean Content (No mini-boxes!) */}
                  <div className="mt-1 text-sm font-sans text-[#F4F5FF] leading-relaxed pl-6">
                    {isEventFail ? (
                      <span className="text-red-300 font-mono font-bold block">
                        💥 CRITICAL BREACH: {typeof event.error_details === 'string' ? event.error_details : 'Domain assertion violated'}
                      </span>
                    ) : isEventSuspect ? (
                      <span className="text-orange-300 font-mono font-bold block">
                        ⚠️ ROOT CAUSE: Customer prompt injection override accepted as policy source
                      </span>
                    ) : (
                      <span className="text-[#A7B0C5] font-mono line-clamp-2">
                        {JSON.stringify(event.output || event.input).slice(0, 140)}...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: STREAMLINED FORENSIC TERMINAL (NO BOX IN BOX)
           ======================================================== */}
        <div className="w-[48%] flex flex-col border-l border-[#25324E] bg-[#11182A]/90 backdrop-blur-xl">
          {/* Signal Oscilloscope Wave (Seamless Ambient Header) */}
          <div className="px-6 py-3 border-b border-[#25324E] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-[#42D9F5] animate-pulse" />
              <span className="text-sm font-mono font-bold tracking-wider text-[#F4F5FF] uppercase">
                SIGNAL WAVEFORM // STEP #{activeEvent?.sequence}
              </span>
            </div>
            <canvas ref={canvasRef} width={160} height={30} className="rounded" />
          </div>

          {/* Clean Segmented Navigation (No Heavy Box Tabs) */}
          <div className="flex px-6 pt-3 gap-6 border-b border-[#25324E] text-sm font-mono font-bold">
            <button
              onClick={() => setActiveTab('payload')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'payload'
                  ? 'text-[#42D9F5] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#42D9F5]'
                  : 'text-[#A7B0C5] hover:text-white'
              }`}
            >
              PAYLOAD DATA
            </button>
            <button
              onClick={() => setActiveTab('invariants')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'invariants'
                  ? 'text-[#FFBD59] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FFBD59]'
                  : 'text-[#A7B0C5] hover:text-white'
              }`}
            >
              INVARIANT AUDIT
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'sandbox'
                  ? 'text-[#4DDBA5] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#4DDBA5]'
                  : 'text-[#A7B0C5] hover:text-white'
              }`}
            >
              LIVE FIX SIMULATOR
            </button>
          </div>

          {/* Tab 1: Payload Data */}
          {activeTab === 'payload' && (
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 font-mono text-sm">
              <div className="flex items-center justify-between text-[#A7B0C5] pb-2 border-b border-[#25324E]">
                <span className="text-white font-bold">{activeEvent.component}</span>
                <span className="text-[#42D9F5] font-bold">{activeEvent.event_id}</span>
              </div>

              {/* Input */}
              <div className="space-y-1">
                <div className="text-xs text-[#A7B0C5] uppercase font-bold tracking-wider">
                  INPUT PARAMETERS
                </div>
                <div className="bg-[#0B1020] p-4 rounded-xl border border-[#25324E] text-[#F4F5FF]">
                  <pre className="whitespace-pre-wrap break-words">{JSON.stringify(activeEvent.input, null, 2)}</pre>
                </div>
              </div>

              {/* Output */}
              <div className="space-y-1">
                <div className="text-xs text-[#A7B0C5] uppercase font-bold tracking-wider">
                  PRODUCED OUTPUT
                </div>
                <div className="bg-[#0B1020] p-4 rounded-xl border border-[#25324E] text-[#F4F5FF]">
                  <pre className="whitespace-pre-wrap break-words">{JSON.stringify(activeEvent.output, null, 2)}</pre>
                </div>
              </div>

              {activeEvent.error_details && (
                <div className="p-4 bg-red-950/30 border border-red-500/40 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-red-400 font-bold uppercase">
                    <AlertOctagon className="w-4 h-4" />
                    <span>RECORDED STACK EXCEPTION</span>
                  </div>
                  <pre className="text-red-200 font-mono overflow-auto max-h-32 text-xs">
                    {JSON.stringify(activeEvent.error_details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Invariant Audit */}
          {activeTab === 'invariants' && (
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 font-mono text-sm">
              <div>
                <h3 className="text-white font-bold text-base">DETERMINISTIC INVARIANT AUDIT</h3>
                <p className="text-sm text-[#A7B0C5] font-sans mt-0.5">
                  Verifies system business logic and boundary rules without subjective guesswork.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#171F35]/60 border border-[#25324E]">
                  <span className="font-bold text-[#F4F5FF]">TrustBoundaryViolationRule</span>
                  {isSuspicious ? (
                    <span className="text-[#FFBD59] font-bold font-mono">VIOLATED (FAIL)</span>
                  ) : (
                    <span className="text-[#4DDBA5] font-bold font-mono">PASSED</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#171F35]/60 border border-[#25324E]">
                  <span className="font-bold text-[#F4F5FF]">ToolSchemaValidationRule</span>
                  <span className="text-[#4DDBA5] font-bold font-mono">PASSED</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#171F35]/60 border border-[#25324E]">
                  <span className="font-bold text-[#F4F5FF]">PayoutPolicyLimitRule (30 Days)</span>
                  {isFailure ? (
                    <span className="text-red-400 font-bold font-mono">BREACHED (FAIL)</span>
                  ) : (
                    <span className="text-[#4DDBA5] font-bold font-mono">PASSED</span>
                  )}
                </div>
              </div>

              {isSuspicious && (
                <div className="p-4 bg-[#FFBD59]/10 border border-[#FFBD59]/40 rounded-xl space-y-2 text-orange-200 text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#FFBD59] block">
                    ROOT CAUSE EXPLANATION:
                  </span>
                  <p className="font-sans leading-relaxed text-slate-200">
                    Customer provided text with <code>[SPECIAL OVERRIDE DIRECTIVE]</code>. The agent mistakenly prioritized customer prompt instructions over authoritative return policy POL-CURRENT-2026.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Live Fix Simulator */}
          {activeTab === 'sandbox' && (
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 font-mono text-sm">
              <div>
                <h3 className="text-white font-bold text-base">INTERACTIVE REPAIR SIMULATOR</h3>
                <p className="text-sm text-[#A7B0C5] font-sans mt-0.5">
                  Toggle the counterfactual fix live to observe downstream neutralization.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#F4F5FF] font-bold">ENFORCE 30-DAY POLICY GUARD:</span>
                  <button
                    onClick={() => setGuardActive(!guardActive)}
                    className={`px-4 py-1.5 rounded-full font-bold text-xs font-mono transition-all ${
                      guardActive
                        ? 'bg-[#4DDBA5] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]'
                        : 'bg-white/10 text-[#F4F5FF] hover:bg-white/20'
                    }`}
                  >
                    {guardActive ? 'GUARD ACTIVE' : 'ACTIVATE GUARD'}
                  </button>
                </div>

                <div className="p-3 bg-black/50 rounded text-xs font-mono">
                  {guardActive ? (
                    <span className="text-[#4DDBA5] font-bold">
                      output.eligible: false (Order 50 days &gt; 30-day limit)
                    </span>
                  ) : (
                    <span className="text-[#FFBD59] font-bold">
                      output.eligible: true (Prompt injection override accepted)
                    </span>
                  )}
                </div>
              </div>

              {guardActive ? (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#4DDBA5] font-bold uppercase">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>SIMULATED OUTCOME: FAILURE NEUTRALIZED</span>
                  </div>
                  <p className="text-[#F4F5FF] font-sans leading-relaxed">
                    With the policy guard activated, Step 5 (execute_refund) is skipped automatically, preventing the $300 illegal payout.
                  </p>
                  <button
                    onClick={onFocusNodeInGraph ? () => onFocusNodeInGraph('evt_004') : undefined}
                    className="w-full py-2.5 bg-[#4DDBA5] text-black font-extrabold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                  >
                    <span>VIEW IN DEPENDENCY GRAPH</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#171F35]/60 border border-[#25324E] text-[#A7B0C5] font-sans text-xs">
                  Click <strong>ACTIVATE GUARD</strong> above to test whether neutralizing the decisive mistake fixes the crash.
                </div>
              )}
            </div>
          )}

          {/* Bottom Action Rail */}
          <div className="px-6 py-4 border-t border-[#25324E] flex items-center justify-between bg-[#0B1020]/80">
            <span className="text-xs text-[#A7B0C5] font-mono">
              STEP #{activeEvent?.sequence} // {activeEvent?.component}
            </span>
            {onFocusNodeInGraph && (
              <button
                onClick={() => onFocusNodeInGraph(activeEvent?.event_id)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FFBD59] text-black font-extrabold text-xs rounded-full shadow-[0_0_12px_rgba(255,102,0,0.4)] hover:bg-orange-400 transition-all"
              >
                <span>FOCUS IN GRAPH</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
