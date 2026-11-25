import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, AlertTriangle, CheckCircle, ShieldAlert, FlaskConical, ArrowRight, Zap, Target } from 'lucide-react';
import { MOCK_SCENARIOS } from '../mocks/scenarios';
import { BenchmarkScenario } from '../types/scenario';

interface ScenarioLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (scenarioId: string) => void;
}

export const ScenarioLauncherModal: React.FC<ScenarioLauncherModalProps> = ({
  isOpen,
  onClose,
  onLaunch,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<BenchmarkScenario>(MOCK_SCENARIOS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#11182A] border border-[#25324E] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 bg-[#171F35] border-b border-[#25324E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF647C]/15 border border-[#FF647C]/40 flex items-center justify-center text-[#FF647C]">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-[#F4F5FF]">
                Benchmark Experiment Injector
              </h2>
              <p className="text-sm text-[#A7B0C5]">
                Inject a controlled fault scenario into the customer support agent pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#737F98] hover:text-[#F4F5FF] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 space-y-5">
          {/* Scenario Selection Cards Grid */}
          <div>
            <div className="flex items-center justify-between text-sm font-mono text-[#A7B0C5] uppercase font-semibold mb-2.5">
              <span>Select Injected Fault Scenario</span>
              <span className="text-[#42D9F5]">10 Benchmark Suites Available</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
              {MOCK_SCENARIOS.map((sc) => {
                const isSelected = selectedScenario.scenario_id === sc.scenario_id;
                const isFail = sc.expected_verdict === 'FAIL';

                return (
                  <button
                    key={sc.scenario_id}
                    onClick={() => setSelectedScenario(sc)}
                    className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'bg-[#171F35] border-[#42D9F5] shadow-glow-cyan'
                        : 'bg-[#0B1020] border-[#25324E] hover:border-[#42D9F5]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono font-bold text-sm text-[#F4F5FF]">{sc.scenario_id}</span>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded-full font-bold ${
                          isFail
                            ? 'bg-[#FF647C]/20 text-[#FF647C]'
                            : 'bg-[#4DDBA5]/20 text-[#4DDBA5]'
                        }`}
                      >
                        {sc.expected_verdict}
                      </span>
                    </div>
                    <span className="text-sm text-[#A7B0C5] font-sans line-clamp-2 leading-tight">
                      {sc.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Experiment Deep Dive Card */}
          <div className="p-5 bg-[#0B1020] border border-[#25324E] rounded-2xl space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#25324E]">
              <div>
                <span className="font-display font-bold text-base text-[#F4F5FF]">{selectedScenario.name}</span>
                <div className="text-xs text-[#FFBD59] font-mono mt-0.5">
                  Category: {selectedScenario.fault_type}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#A7B0C5] font-mono">TARGET ORDER:</span>
                <span className="text-sm font-bold font-mono text-[#42D9F5] block">{selectedScenario.order_id}</span>
              </div>
            </div>

            <p className="text-sm text-[#A7B0C5] leading-relaxed">
              {selectedScenario.description}
            </p>

            <div className="p-3 bg-[#11182A] rounded-xl border border-[#25324E]/80 text-sm space-y-1">
              <span className="text-[#737F98] font-mono font-semibold uppercase block">Simulated Customer Input:</span>
              <p className="text-[#F4F5FF] font-sans italic">"{selectedScenario.customer_message}"</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4 bg-[#171F35] border-t border-[#25324E]">
          <span className="text-sm text-[#737F98] font-mono">
            Environment: <strong className="text-[#F4F5FF]">LangGraph Isolated Mock Sandbox</strong>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#A7B0C5] hover:text-[#F4F5FF] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onLaunch(selectedScenario.scenario_id);
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF647C] hover:bg-[#ff4e68] text-white text-sm font-semibold rounded-xl shadow-[0_0_15px_rgba(255,100,124,0.35)] transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Experiment</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
