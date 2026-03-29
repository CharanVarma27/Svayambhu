import { useEffect, useState } from "react";
import { Activity, PlayCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard() {
  const [stats, setStats] = useState({ total: 0, flowing: 0, completed: 0, failed: 0 });

  const fetchStats = () => {
    fetch("http://localhost:8081/api/v1/workflows")
      .then(res => res.json())
      .then((data: any[]) => {
        setStats({
          total: data.length,
          flowing: data.filter(w => w.status === 'flowing' || w.status === 'pending' || w.status === 'recovering').length,
          completed: data.filter(w => w.status === 'completed').length,
          failed: data.filter(w => w.status === 'failed').length,
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchStats();
    const rate = parseInt(localStorage.getItem("refresh_rate") || "3000");
    const interval = setInterval(fetchStats, rate);
    return () => clearInterval(interval);
  }, []);



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        >
          System Overview
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-muted-foreground mt-1"
        >Real-time telemetry from the Svayambhu global AI cluster.</motion.p>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        initial="hidden" animate="show"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="rounded-xl border border-border bg-background/50 backdrop-blur-md p-6 shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground group-hover:text-blue-400 transition-colors">Global Requests</h3>
            <Activity className="h-5 w-5 text-blue-500 group-hover:scale-125 transition-transform" />
          </div>
          <div className="mt-4 relative z-10 flex items-end justify-between">
            <span className="text-5xl font-black tabular-nums">{stats.total}</span>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="rounded-xl border border-border bg-background/50 backdrop-blur-md p-6 shadow-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground group-hover:text-purple-400 transition-colors">Active Subroutines</h3>
            <PlayCircle className="h-5 w-5 text-purple-500 group-hover:scale-125 transition-transform" />
          </div>
          <div className="mt-4 relative z-10 flex items-end justify-between">
            <span className="text-5xl font-black tabular-nums">{stats.flowing}</span>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="rounded-xl border border-border bg-background/50 backdrop-blur-md p-6 shadow-sm hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:border-green-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground group-hover:text-green-400 transition-colors">Completed</h3>
            <CheckCircle className="h-5 w-5 text-green-500 group-hover:scale-125 transition-transform" />
          </div>
          <div className="mt-4 relative z-10 flex items-end justify-between">
            <span className="text-5xl font-black tabular-nums">{stats.completed}</span>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="rounded-xl border border-border bg-background/50 backdrop-blur-md p-6 shadow-sm hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground group-hover:text-orange-400 transition-colors">Recovering / Blocked</h3>
            <AlertTriangle className="h-5 w-5 text-orange-500 group-hover:scale-125 transition-transform" />
          </div>
          <div className="mt-4 relative z-10 flex items-end justify-between">
            <span className="text-5xl font-black tabular-nums">{stats.failed}</span>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 pt-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-black/40 backdrop-blur-xl p-8 col-span-4 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-colors"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-blue-500/10 transition-all duration-700" />
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse" />
            Global Compute Fabric
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md">The neural DAG topology orchestrating complex enterprise workflows concurrently with sub-millisecond dispatch times.</p>
          <div className="h-[220px] w-full flex items-center justify-center border border-white/5 rounded-xl bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group-hover:border-white/10 transition-colors">
            <motion.img 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src="/logo.jpg" alt="Svayambhu Logo" className="h-32 w-auto opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 drop-shadow-2xl mix-blend-screen" 
            />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-black/40 backdrop-blur-xl p-8 col-span-3 shadow-sm hover:border-purple-500/30 transition-colors relative overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-32 -mb-32" />
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
            Node Status Sync
          </h3>
          <div className="space-y-4 relative z-10">
            {["Planner DAG", "Execution Environment", "SLA Predictor", "Self-Healing Recovery", "Cryptographic Verifier"].map((agent, i) => (
              <motion.div 
                key={agent} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center justify-between group py-3 px-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <span className="text-sm font-semibold tracking-wide transition-colors">{agent}</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)] group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                  Optimal
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
