import { useEffect, useState } from "react";
import { Terminal, ShieldAlert, CheckCircle2, Info, Trash2, AlertTriangle } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

interface AgentLog {
  id?: string;
  level: string;
  message: string;
  agentName: string;
  timestamp: string;
  reason?: string;
}


export function Logs() {
  const [logs, setLogs] = useState<AgentLog[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/v1/logs");
      const data = await res.json();
      setLogs(data.reverse()); // Newest first
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 0);
    const interval = setInterval(() => {
      fetchLogs();
    }, 1000); 
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);



  const getLogIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'WARN': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'SUCCESS': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'border-red-500/30 bg-red-500/5 text-red-200';
      case 'WARN': return 'border-orange-500/30 bg-orange-500/5 text-orange-200';
      case 'SUCCESS': return 'border-green-500/30 bg-green-500/5 text-green-200';
      default: return 'border-blue-500/30 bg-blue-500/5 text-blue-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col"
    >
      <div className="flex items-center gap-4 border-b border-border/50 pb-4 shrink-0">
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <Terminal className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500"
          >
            Terminal Output
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-1 font-mono text-sm"
          >
            Live systemic bus reflecting agent decisions, network topological sorts, and execution integrity bounds.
          </motion.p>
        </div>
        <div className="ml-auto">
          <button 
            onClick={async () => {
              if (confirm("Permanently wipe all systemic logs from the database?")) {
                await fetch("http://localhost:8081/api/v1/logs", { method: "DELETE" });
                fetchLogs();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all font-bold text-xs uppercase tracking-wider"
          >
            <Trash2 className="w-4 h-4" /> Clear Logs
          </button>
        </div>
      </div>


      <div className="flex-1 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-inner overflow-hidden flex pl-1">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {logs.map((log, idx) => (
              <motion.div 
                key={log.id || idx}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 p-3 rounded-lg border backdrop-blur-sm ${getLogColor(log.level)} transition-all hover:bg-white/5`}
              >
                <div className="shrink-0 mt-0.5">
                  {getLogIcon(log.level)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-white/10 text-white uppercase border border-white/10">
                      {log.agentName}
                    </span>
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${log.level === 'ERROR' ? 'text-red-400' : log.level === 'WARN' ? 'text-orange-400' : log.level === 'SUCCESS' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      [{log.level}]
                    </span>
                  </div>
                  <div className="text-gray-200 font-medium">
                    {log.message}
                  </div>
                  {log.reason && (
                    <div className="text-[10px] text-gray-500 italic pl-3 border-l-2 border-white/10 mt-1 leading-snug">
                      ↳ {log.reason}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="flex items-center justify-center h-full opacity-50 text-muted-foreground flex-col gap-4">
              <Terminal className="w-12 h-12 mb-2 animate-pulse" />
              <p>Awaiting MCP cluster initialization...</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

