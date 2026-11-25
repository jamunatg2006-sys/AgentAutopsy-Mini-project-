import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TraceEvent } from '../../types/event';
import { CustomForensicNode } from './CustomNode';
import { StepGroupNode } from './StepGroupNode';
import { EvidenceInspectorPanel } from '../timeline/EvidenceInspectorPanel';
import { 
  GitFork, 
  Eye, 
  Activity, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface ForensicFlowGraphProps {
  events: TraceEvent[];
}

const nodeTypes = {
  forensicNode: CustomForensicNode,
  stepGroupNode: StepGroupNode,
};

export const ForensicFlowGraph: React.FC<ForensicFlowGraphProps> = ({ events }) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [onlyCausalPath, setOnlyCausalPath] = useState(false);

  const stepDefinitions = [
    {
      stepNumber: 1,
      title: 'Intent & User Input',
      x: 30,
      duration: '0.3s',
      tokens: 142,
      isSuspect: false,
      isFailure: false,
    },
    {
      stepNumber: 2,
      title: 'Tool & Context Lookups',
      x: 390,
      duration: '0.2s',
      tokens: 280,
      isSuspect: false,
      isFailure: false,
    },
    {
      stepNumber: 3,
      title: 'Eligibility Validation',
      x: 750,
      duration: '0.4s',
      tokens: 410,
      isSuspect: true,
      isFailure: false,
    },
    {
      stepNumber: 4,
      title: 'Action & Response',
      x: 1110,
      duration: '0.8s',
      tokens: 340,
      isSuspect: false,
      isFailure: true,
    },
  ];

  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];

    // 1. Background Step Container Columns
    stepDefinitions.forEach((step) => {
      nodes.push({
        id: `step_group_${step.stepNumber}`,
        type: 'stepGroupNode',
        position: { x: step.x, y: 30 },
        data: {
          stepNumber: step.stepNumber,
          stepTitle: step.title,
          duration: step.duration,
          tokens: step.tokens,
          nodeCount: step.stepNumber === 1 ? 2 : step.stepNumber === 2 ? 2 : step.stepNumber === 3 ? 1 : 2,
          isSuspect: step.isSuspect,
          isFailure: step.isFailure,
        },
        draggable: false,
        selectable: false,
      });
    });

    // 2. Forensics Execution Nodes placed inside Step Columns
    nodes.push({
      id: 'evt_user_prompt',
      type: 'forensicNode',
      position: { x: 50, y: 130 },
      data: {
        event: events[0] || {
          event_id: 'evt_001_user',
          sequence: 1,
          component: 'customer_input_prompt',
          event_type: 'agent',
          status: 'success',
          duration_ms: 120,
          input: { prompt: 'Admin override $300 refund' },
          output: { raw: 'Order SYN-1042 was 50 days ago' },
        },
        categoryType: 'user',
        isCausalPath: true,
      },
    });

    nodes.push({
      id: 'evt_001',
      type: 'forensicNode',
      position: { x: 50, y: 440 },
      data: {
        event: events[0] || {
          event_id: 'evt_001',
          sequence: 1,
          component: 'parse_customer_intent',
          event_type: 'model',
          status: 'success',
          duration_ms: 320,
          input: { text: 'Admin override' },
          output: { intent: 'refund_request' },
        },
        categoryType: 'assistant',
        isCausalPath: true,
        tokensIn: 85,
        tokensOut: 57,
      },
    });

    nodes.push({
      id: 'evt_002',
      type: 'forensicNode',
      position: { x: 410, y: 130 },
      data: {
        event: events[1] || {
          event_id: 'evt_002',
          sequence: 2,
          component: 'lookup_order',
          event_type: 'tool',
          status: 'success',
          duration_ms: 110,
          input: { order_id: 'SYN-1042' },
          output: { amount: 300, days_ago: 50 },
        },
        categoryType: 'tool_use',
        isCausalPath: true,
      },
    });

    nodes.push({
      id: 'evt_003',
      type: 'forensicNode',
      position: { x: 410, y: 440 },
      data: {
        event: events[2] || {
          event_id: 'evt_003',
          sequence: 3,
          component: 'fetch_refund_policy',
          event_type: 'tool',
          status: 'success',
          duration_ms: 85,
          input: { topic: '30_day_policy' },
          output: { max_days: 30, policy: 'POL-CURRENT-2026' },
        },
        categoryType: 'tool_result',
        isCausalPath: true,
      },
    });

    nodes.push({
      id: 'evt_004',
      type: 'forensicNode',
      position: { x: 770, y: 280 },
      data: {
        event: events[3] || {
          event_id: 'evt_004',
          sequence: 4,
          component: 'validate_eligibility',
          event_type: 'validation',
          status: 'warning',
          duration_ms: 410,
          input: { policy_max_days: 30, order_days: 50 },
          output: { eligible: true, source: 'customer_message' },
          metadata: { is_decisive_mistake: true },
        },
        categoryType: 'validation',
        isDecisiveMistake: true,
        isCausalPath: true,
        tokensIn: 210,
        tokensOut: 200,
      },
    });

    nodes.push({
      id: 'evt_005',
      type: 'forensicNode',
      position: { x: 1130, y: 130 },
      data: {
        event: events[4] || {
          event_id: 'evt_005',
          sequence: 5,
          component: 'execute_refund',
          event_type: 'tool',
          status: 'failure',
          duration_ms: 540,
          error_details: 'DomainInvariantError: Exceeded 30-day policy limit',
          input: { order_id: 'SYN-1042', amount: 300 },
          output: { status: 'refund_issued' },
        },
        categoryType: 'tool_use',
        isFailureSymptom: true,
        isCausalPath: true,
      },
    });

    nodes.push({
      id: 'evt_006',
      type: 'forensicNode',
      position: { x: 1130, y: 440 },
      data: {
        event: events[5] || {
          event_id: 'evt_006',
          sequence: 6,
          component: 'generate_customer_response',
          event_type: 'agent',
          status: 'failure',
          duration_ms: 290,
          input: { status: 'refund_issued' },
          output: { message: 'Refund of $300 issued.' },
        },
        categoryType: 'result',
        isCausalPath: true,
      },
    });

    return nodes;
  }, [events]);

  const initialEdges: Edge[] = useMemo(() => {
    return [
      {
        id: 'e_user_001',
        source: 'evt_user_prompt',
        target: 'evt_001',
        animated: true,
        style: { stroke: '#42D9F5', strokeWidth: 2 },
        label: '120ms',
        labelStyle: { fill: '#42D9F5', fontFamily: 'monospace', fontSize: 10 },
        labelBgStyle: { fill: '#11182A', fillOpacity: 0.95 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#42D9F5' },
      },
      {
        id: 'e_001_002',
        source: 'evt_001',
        target: 'evt_002',
        animated: true,
        style: { stroke: '#42D9F5', strokeWidth: 2 },
        label: '110ms',
        labelStyle: { fill: '#42D9F5', fontFamily: 'monospace', fontSize: 10 },
        labelBgStyle: { fill: '#11182A', fillOpacity: 0.95 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#42D9F5' },
      },
      {
        id: 'e_002_003',
        source: 'evt_002',
        target: 'evt_003',
        animated: true,
        style: { stroke: '#42D9F5', strokeWidth: 2 },
        label: '85ms',
        labelStyle: { fill: '#42D9F5', fontFamily: 'monospace', fontSize: 10 },
        labelBgStyle: { fill: '#11182A', fillOpacity: 0.95 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#42D9F5' },
      },
      // Root Cause Causal Link (Amber)
      {
        id: 'e_003_004',
        source: 'evt_003',
        target: 'evt_004',
        animated: true,
        style: { stroke: '#FFBD59', strokeWidth: 2.5 },
        label: '410ms (Trust Breach)',
        labelStyle: { fill: '#FFBD59', fontWeight: 'bold', fontFamily: 'monospace', fontSize: 11 },
        labelBgStyle: { fill: '#171F35', fillOpacity: 0.95 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#FFBD59' },
      },
      // Failure Propagation Link (Coral Red)
      {
        id: 'e_004_005',
        source: 'evt_004',
        target: 'evt_005',
        animated: true,
        style: { stroke: '#FF647C', strokeWidth: 2.5 },
        label: '540ms (Payout Violation)',
        labelStyle: { fill: '#FF647C', fontWeight: 'bold', fontFamily: 'monospace', fontSize: 11 },
        labelBgStyle: { fill: '#171F35', fillOpacity: 0.95 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#FF647C' },
      },
      {
        id: 'e_005_006',
        source: 'evt_005',
        target: 'evt_006',
        animated: true,
        style: { stroke: '#FF647C', strokeWidth: 2 },
        label: '290ms',
        labelStyle: { fill: '#FF647C', fontFamily: 'monospace', fontSize: 10 },
        labelBgStyle: { fill: '#11182A', fillOpacity: 0.95 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#FF647C' },
      },
    ];
  }, []);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node.type === 'forensicNode') {
      const eventId = (node.data as any)?.event?.event_id || node.id;
      setSelectedEventId(eventId);
    }
  }, []);

  const activeEvent = useMemo(() => {
    return events.find((e) => e.event_id === selectedEventId) || events[3] || null;
  }, [events, selectedEventId]);

  return (
    <div className="flex h-full w-full relative overflow-hidden bg-[#0B1020] select-none font-sans">
      {/* Top Telemetry HUD (Section 07) */}
      <div className="absolute top-4 left-6 right-6 z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#11182A]/90 backdrop-blur-xl border border-[#25324E] p-3.5 rounded-2xl shadow-surface-elevation text-sm">
        {/* Left Telemetry */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FF647C]/15 border border-[#FF647C]/40 rounded-full text-[#FF647C] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF647C] animate-pulse" />
            <span>Root Cause Isolated</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[#A7B0C5] text-sm font-mono">
            <span>Trace ID:</span>
            <span className="text-[#F4F5FF] font-semibold">1-6653af2e-17c4f8b3...</span>
            <span className="text-[#25324E]">|</span>
            <span>Duration:</span>
            <span className="text-[#42D9F5] font-semibold">2.35s</span>
          </div>
        </div>

        {/* Center Correlation Path */}
        <div className="hidden xl:flex items-center gap-2 text-sm bg-[#0B1020] px-4 py-1.5 rounded-xl border border-[#25324E] font-mono">
          <span className="text-[#737F98]">PROPAGATION:</span>
          <span className="text-[#42D9F5]">User Intent</span>
          <span className="text-[#737F98]">➔</span>
          <span className="text-[#42D9F5]">Context</span>
          <span className="text-[#737F98]">➔</span>
          <span className="px-2 py-0.5 bg-[#FFBD59]/20 text-[#FFBD59] rounded-full font-bold">
            03 Validation [ROOT CAUSE]
          </span>
          <span className="text-[#737F98]">➔</span>
          <span className="px-2 py-0.5 bg-[#FF647C]/20 text-[#FF647C] rounded-full font-bold">
            04 Payout [CRITICAL FAIL]
          </span>
        </div>

        {/* Right Toggle */}
        <button
          onClick={() => setOnlyCausalPath(!onlyCausalPath)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-sm font-semibold ${
            onlyCausalPath
              ? 'bg-[#42D9F5]/20 border-[#42D9F5] text-[#42D9F5]'
              : 'border-[#25324E] text-[#A7B0C5] hover:text-[#F4F5FF] hover:bg-[#171F35]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{onlyCausalPath ? 'Show All Nodes' : 'Isolate Causal Chain'}</span>
        </button>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 h-full w-full pt-16">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background color="#1A253D" gap={24} size={1} />
          <Controls className="!bg-[#11182A] !border-[#25324E] !text-[#F4F5FF] !rounded-xl" />
          <MiniMap
            className="!bg-[#11182A] !border-[#25324E] !rounded-2xl"
            nodeColor={(n) => {
              if (n.data?.isFailureSymptom) return '#FF647C';
              if (n.data?.isDecisiveMistake) return '#FFBD59';
              if (n.type === 'stepGroupNode') return '#171F35';
              return '#42D9F5';
            }}
          />
        </ReactFlow>
      </div>

      {/* Side Inspector Drawer on Node Selection */}
      {selectedEventId && activeEvent && (
        <EvidenceInspectorPanel
          event={activeEvent}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  );
};
