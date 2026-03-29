import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TrendingUp, Coins, Clock, BrainCircuit } from "lucide-react";

interface AgentLog {
  id: number;
  agentName: string;
  level: string;
  message: string;
  reason?: string;
  timestamp: string;
}

export function Analytics() {
  const [liveLogs, setLiveLogs] = useState<AgentLog[]>([]);

  useEffect(() => {
    const fetchLogs = () => {
      fetch("http://localhost:8081/api/v1/logs")
        .then(res => res.json())
        .then((data: AgentLog[]) => setLiveLogs(data.slice(0, 10)))
        .catch(() => {});
    };
    fetchLogs();
    const rate = parseInt(localStorage.getItem("refresh_rate") || "2000");
    const interval = setInterval(fetchLogs, rate);
    return () => clearInterval(interval);
  }, []);


  const levelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-400';
      case 'WARN': return 'text-amber-400';
      case 'SUCCESS': return 'text-emerald-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col"
    >
      <div className="shrink-0 pb-4 border-b border-white/10">
        <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Enterprise ROI &amp; Analytics</h2>
        <p className="text-muted-foreground mt-1">Live financial and operational telemetry driven by Agentic AI automation.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Hours Saved</h3>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-4xl font-black mb-2 relative z-10">4,821<span className="text-sm text-gray-500 ml-1 font-normal uppercase">hrs</span></div>
          <div className="h-12 flex items-end gap-1 mb-2">
            {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }} 
                animate={{ height: `${h}%` }} 
                transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm opacity-50" 
              />
            ))}
          </div>
          <p className="text-[10px] text-green-400 flex items-center gap-1 font-bold"><TrendingUp className="w-3 h-3"/> +12% Efficiency Gain</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Cost Avoidance</h3>
            <Coins className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-4xl font-black mb-2 relative z-10">$142<span className="text-sm text-gray-500 ml-1 font-normal uppercase">k</span></div>
          <div className="h-12 w-full relative mb-2">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1.5 }}
                d="M0 35 Q 20 10, 40 30 T 80 5 T 100 20" 
                fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"
              />
              <path d="M0 35 Q 20 10, 40 30 T 80 5 T 100 20" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" className="opacity-10" />
            </svg>
          </div>
          <p className="text-[10px] text-green-400 flex items-center gap-1 font-bold"><TrendingUp className="w-3 h-3"/> +8.4% Net Savings</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Agent Autonomy</h3>
            <BrainCircuit className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-end gap-3 mb-2 relative z-10">
            <div className="text-4xl font-black">99.2<span className="text-sm font-normal text-gray-500 ml-1">%</span></div>
            <div className="relative w-10 h-10 mb-1">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#444" strokeWidth="3" />
                <motion.path 
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: "99, 100" }}
                  transition={{ duration: 1.5, delay: 1.8 }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" 
                />
              </svg>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">Global Swarm Reliability Score</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Self-Heals</h3>
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-4xl font-black mb-2 relative z-10">1,204</div>
          <div className="flex gap-1 h-3 mt-4 mb-2">
            {[1,1,1,1,1,0,0,1].map((s, i) => (
              <div key={i} className={`flex-1 rounded-full ${s ? 'bg-orange-500/40 shadow-[0_0_5px_rgba(249,115,22,0.3)]' : 'bg-white/5'}`} />
            ))}
          </div>
          <p className="text-[10px] text-gray-400 font-medium">Critical Interventions Diversion</p>
        </motion.div>
      </div>
      
      <div className="flex-1 mt-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col overflow-hidden relative">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center relative z-10">
          <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 animate-pulse" /> Live Global Agentic Telemetry
          </h3>
          <span className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
            NODE_CLUSTER: ASIA-SOUTH-1
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            LIVE
          </span>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 relative z-10 overflow-hidden">
          <div className="flex-1 font-mono text-[10px] overflow-y-auto space-y-2 pr-2" style={{ scrollbarWidth: 'thin' }}>
            {liveLogs.length > 0 ? liveLogs.map((log, i) => (
              <motion.div
                key={log.id || i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex gap-2 items-start"
              >
                <span className="text-gray-600 shrink-0 tabular-nums">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-gray-500 shrink-0">{log.agentName}</span>
                <span className={`${levelColor(log.level)} opacity-80`}>{log.message}</span>
              </motion.div>
            )) : (
              <div className="space-y-2 opacity-50">
                <div className="text-emerald-500">[00:00] Nvidia-Nim-02 :: Pre-caching inference tensors for Workflow_821...</div>
                <div className="text-blue-500">[00:12] PlannerAgent :: Recalculating DAG topology for high-latency path...</div>
                <div className="text-purple-500">[00:25] RecoverySystem :: Checkpointing state to distributed ledger...</div>
                <div className="text-gray-500">[01:04] HealthMonitor :: Heartbeat received from 12 active workers...</div>
                <div className="text-amber-500">[02:56] SLAPredictor :: Bottleneck detected at 'Finalize_Transaction'...</div>
                <div className="text-emerald-500 animate-pulse">[LIVE] System :: Synchronizing context with Enterprise Data Cloud...</div>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-64 h-32 md:h-full bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <motion.path 
                  animate={{ d: [
                    "M0 80 Q 50 20, 100 80 T 200 80",
                    "M0 80 Q 50 120, 100 80 T 200 80",
                    "M0 80 Q 50 20, 100 80 T 200 80"
                  ]}}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  fill="none" stroke="#3b82f6" strokeWidth="1"
                />
              </svg>
            </div>
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 relative z-10">Projected Yield</h4>
            <div className="text-3xl font-black text-white relative z-10">82.4<span className="text-xs text-blue-500 ml-1">X</span></div>
            <p className="text-[9px] text-gray-500 mt-2 relative z-10 leading-tight">Projected ROI multiplier over 12-month autonomous deployment.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
