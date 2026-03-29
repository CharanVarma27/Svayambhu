import { useState } from 'react';
import ReactFlow, { Background, Controls, MarkerType, type Node, type Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';

const initialNodes: Node[] = [
  { id: 'start', type: 'input', data: { label: 'Natural Language Input' }, position: { x: 250, y: 0 }, 
    style: { background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid #3b82f6', borderRadius: '12px', padding: '12px', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)', width: 160 } },
  { id: 'planner', data: { label: 'Planner (DAG Generator)' }, position: { x: 250, y: 100 }, 
    style: { background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', border: '1px solid #a855f7', borderRadius: '12px', padding: '12px', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)', width: 160 } },
  { id: 'sla', data: { label: 'SLA Predictor' }, position: { x: 80, y: 220 }, 
    style: { background: 'rgba(100, 116, 139, 0.1)', color: '#94a3b8', border: '1px solid #64748b', borderRadius: '12px', padding: '12px', fontSize: '10px', fontWeight: 'bold', width: 140 } },
  { id: 'exec', data: { label: 'Execution Engine' }, position: { x: 250, y: 220 }, 
    style: { background: 'rgba(234, 179, 8, 0.1)', color: '#fde047', border: '1px solid #eab308', borderRadius: '12px', padding: '12px', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 0 20px rgba(234, 179, 8, 0.2)', width: 160 } },
  { id: 'err', data: { label: 'Random Exception' }, position: { x: 420, y: 220 }, 
    style: { background: 'rgba(239, 68, 68, 0.05)', color: '#f87171', border: '1px dashed #ef4444', borderRadius: '12px', padding: '12px', fontSize: '10px', fontWeight: 'bold', width: 140 } },
  { id: 'recovery', data: { label: 'Dynamic Recovery' }, position: { x: 250, y: 340 }, 
    style: { background: 'rgba(249, 115, 22, 0.1)', color: '#fb923c', border: '1px solid #f97316', borderRadius: '12px', padding: '12px', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 0 15px rgba(249, 115, 22, 0.2)', width: 160 } },
  { id: 'verify', data: { label: 'Security Verification' }, position: { x: 250, y: 440 }, 
    style: { background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: '1px solid #22c55e', borderRadius: '12px', padding: '12px', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)', width: 160 } },
  { id: 'end', type: 'output', data: { label: 'Workflow Success' }, position: { x: 250, y: 550 }, 
    style: { background: '#22c55e', color: '#000', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '11px', fontWeight: 'black', width: 180, textAlign: 'center' } },
  { id: 'log', data: { label: 'MySQL / Audit Logs' }, position: { x: 500, y: 400 }, 
    style: { background: '#000', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '12px', padding: '10px', fontSize: '9px', fontWeight: 'normal', opacity: 0.6, width: 120 } },
];

const initialEdges: Edge[] = [
  { id: 'e-start', source: 'start', target: 'planner', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e-p-sla', source: 'planner', target: 'sla', animated: true, style: { stroke: '#64748b' } },
  { id: 'e-p-exec', source: 'planner', target: 'exec', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
  { id: 'e-exec-err', source: 'exec', target: 'err', animated: true, style: { stroke: '#ef4444', strokeDasharray: '5,5' }, label: 'Fault', labelStyle: { fill: '#ef4444', fontSize: 10, fontWeight: 'bold' } },
  { id: 'e-err-rec', source: 'err', target: 'recovery', animated: true, style: { stroke: '#f97316' } },
  { id: 'e-rec-verify', source: 'recovery', target: 'verify', animated: true, style: { stroke: '#22c55e', strokeWidth: 2 } },
  { id: 'e-verify-end', source: 'verify', target: 'end', animated: true, style: { stroke: '#22c55e', strokeWidth: 3 } },
  { id: 'e-l1', source: 'planner', target: 'log', style: { stroke: '#3b82f6', opacity: 0.2, strokeDasharray: '2,2' } },
  { id: 'e-l2', source: 'exec', target: 'log', style: { stroke: '#3b82f6', opacity: 0.2, strokeDasharray: '2,2' } },
  { id: 'e-l3', source: 'recovery', target: 'log', style: { stroke: '#3b82f6', opacity: 0.2, strokeDasharray: '2,2' } },
  { id: 'e-l4', source: 'verify', target: 'log', style: { stroke: '#3b82f6', opacity: 0.2, strokeDasharray: '2,2' } },
];

export function GraphView() {
  const [nodes] = useState<Node[]>(initialNodes);
  const [edges] = useState<Edge[]>(initialEdges);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 h-[calc(100vh-8rem)] flex flex-col"
    >
      <div className="shrink-0 flex justify-between items-end border-b border-white/5 pb-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Autonomous Execution Graph</h2>
          <p className="text-muted-foreground mt-1 text-xs uppercase tracking-widest font-bold opacity-60">Model Context Protocol Topology Visualization</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Live Fabric Monitoring</span>
        </div>
      </div>
      
      <div className="flex-1 rounded-xl border border-white/10 overflow-hidden bg-black shadow-[0_0_50px_rgba(59,130,246,0.05)] relative group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)] pointer-events-none" />
        
        {/* Radar Circular Sweep */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] pointer-events-none z-10 overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2"
            style={{
              background: 'conic-gradient(from 0deg, rgba(59,130,246,0.15), transparent 40deg, transparent)',
              borderRadius: '50%'
            }}
          />
        </div>

        {/* Vertical Pulse Overlay */}
        <motion.div 
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" 
        />

        <ReactFlow nodes={nodes} edges={edges} fitView className="dark">
          <Background color="#111" gap={20} size={1} />
          <Controls className="bg-white/5 border-white/10 fill-white !shadow-none" />
        </ReactFlow>
      </div>
    </motion.div>
  );
}
