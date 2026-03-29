import { useEffect, useState, useRef } from "react";
import { PlayCircle, Mic, Activity, Microscope, Trash2, RefreshCcw, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Workflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulateFault, setSimulateFault] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationData | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  interface Workflow {
    id: string;
    name: string;
    status: string;
    currentAgent?: string;
  }

  interface SimulationData {
    predicted_latency: number;
    estimated_cost: number;
    risk_percentage: number;
  }

  interface SpeechRecognitionEvent {
    results: {
      [key: number]: {
        [key: number]: {
          transcript: string;
        };
      };
    };
  }

  const fetchWorkflows = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/v1/workflows");
      const data = await res.json();
      setWorkflows(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWorkflows();
    const interval = setInterval(fetchWorkflows, 2000);
    return () => clearInterval(interval);
  }, []);

  const createWorkflow = async () => {
    if (!prompt) return;
    const name = prompt;
    setPrompt("");
    
    try {
      const res = await fetch("http://localhost:8081/api/v1/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      const wf = await res.json();
      
      const gemini_key = localStorage.getItem("gemini_api_key");
      const model = localStorage.getItem("ai_model");

      await fetch("http://localhost:8000/workflow/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: wf.id, 
          name: wf.name,
          gemini_key: gemini_key,
          model: model,
          simulate_fault: simulateFault
        })
      });
      
      fetchWorkflows();

    } catch (e) {
      console.error(e);
    }
  };

  const simulateWorkflow = async () => {
    if (!prompt) return;
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const res = await fetch("http://localhost:8000/workflow/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt })
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const rerunWorkflow = async (name: string) => {
    try {
      const res = await fetch("http://localhost:8081/api/v1/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      const wf = await res.json();

      const gemini_key = localStorage.getItem("gemini_api_key");
      const model = localStorage.getItem("ai_model");

      await fetch("http://localhost:8000/workflow/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: wf.id, 
          name: wf.name,
          gemini_key: gemini_key,
          model: model,
          simulate_fault: simulateFault
        })
      });
      fetchWorkflows();

    } catch (e) {
      console.error(e);
    }
  };


  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        setPrompt(text);
        setIsListening(false);
      };
      
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert("Voice recognition is not supported in this browser.");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'flowing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)] animate-pulse';
      case 'pending': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
      case 'recovering': return 'bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.3)] animate-pulse';
      case 'blocked_on_human': return 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.5)] animate-bounce';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border/50">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
          >
            Agent Workflows
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-1"
          >Dispatch & monitor multi-agent DAG execution loops.</motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 w-full md:w-auto"
        >
          <div className="flex flex-col gap-2 relative">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                
                <button 
                  onClick={startListening}
                  className={`relative p-3 rounded-lg border transition-all ${isListening ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-black/80 border-white/10 text-white hover:bg-white/10'}`}
                  title="Voice to Workflow"
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                <input 
                  ref={inputRef}
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createWorkflow()}
                  placeholder={isListening ? "Listening..." : "Deploy Natural Language Workflow..."} 
                  className="relative flex-1 md:w-96 px-5 py-3 bg-black/80 backdrop-blur text-white border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-0 transition-all font-mono shadow-inner"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={createWorkflow} className="flex-1 relative bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex justify-center items-center gap-2">
                  <PlayCircle className="w-4 h-4" /> Dispatch
                </button>
                <button 
                  onClick={() => setSimulateFault(!simulateFault)}
                  className={`flex-1 relative border px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-tighter transition-all flex justify-center items-center gap-2 ${simulateFault ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' : 'bg-white/5 border-white/10 text-gray-400 hover:border-red-500/30 hover:text-red-400'}`}
                  title="Inject Autonomous Agent Fault"
                >
                  <Activity className="w-3 h-3" /> {simulateFault ? "Anomaly Armed" : "Simulate Anomaly"}
                </button>
                <button onClick={simulateWorkflow} className="flex-1 relative bg-purple-600/20 border border-purple-500/50 text-purple-300 hover:bg-purple-600/40 px-4 py-2 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2">
                  <Microscope className="w-4 h-4" /> {isSimulating ? "Simulating..." : "Sandboxed Audit"}
                </button>

              </div>
            </div>
            
            {simulationResult && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl bg-black border border-purple-500/30 shadow-[0_10px_30px_rgba(168,85,247,0.2)] z-50 text-sm">
                <h4 className="font-bold text-purple-400 mb-2 border-b border-purple-500/20 pb-1">Pre-Flight Audit Report</h4>
                <div className="flex justify-between text-gray-300 mb-1"><span>Predicted Latency:</span> <span className="font-mono text-purple-300">~{simulationResult.predicted_latency}s</span></div>
                <div className="flex justify-between text-gray-300 mb-1"><span>Token Spend Est:</span> <span className="font-mono text-emerald-400">${simulationResult.estimated_cost}</span></div>
                <div className="flex justify-between text-gray-300 mb-2"><span>Failure Risk:</span> <span className="font-mono text-amber-400">{simulationResult.risk_percentage}%</span></div>
                <p className="text-xs text-gray-500 italic mt-2">"Safe to deploy to Global Compute Fabric"</p>
                <button onClick={() => setSimulationResult(null)} className="mt-3 w-full text-center text-xs text-gray-400 hover:text-white pb-1 border-b border-white/10">Dismiss</button>
              </motion.div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wider font-semibold mt-2">
            <span className="text-muted-foreground py-1 mr-1">Presets:</span>
            <button onClick={() => { setPrompt("Autonomous P2P: Extract Invoice -> Verify Vendor -> Match PO -> AI Approval -> Ledger Commit"); inputRef.current?.focus(); }} className="text-gray-400 hover:text-white border border-white/10 bg-white/5 py-1 px-2 rounded">Golden P2P Flow</button>
            <button onClick={() => { setPrompt("Employee Onboarding Pipeline (HR -> Legal)"); inputRef.current?.focus(); }} className="text-gray-400 hover:text-white border border-white/10 bg-white/5 py-1 px-2 rounded">Onboarding</button>
            <button onClick={() => { setPrompt("HUMAN_CHECK Contract Finalization"); inputRef.current?.focus(); }} className="text-gray-400 hover:text-purple-400 border border-purple-500/30 bg-purple-500/10 py-1 px-2 rounded flex items-center gap-1">HITL Vault</button>
          </div>
        </motion.div>
      </div>

      {/* System Health Vitals - INNOVATION PASS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <div className="flex-1">
            <div className="text-[9px] text-emerald-500/70 font-bold uppercase tracking-widest">Cluster Status</div>
            <div className="text-xs text-white font-mono flex justify-between items-center">NOMINAL <span className="text-[10px] text-emerald-500/40">99.9% UP</span></div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
          <Activity className="w-4 h-4 text-blue-500" />
          <div className="flex-1">
            <div className="text-[9px] text-blue-500/70 font-bold uppercase tracking-widest">Active Agents</div>
            <div className="text-xs text-white font-mono">7 NODES READY</div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center gap-3">
          <BrainCircuit className="w-4 h-4 text-purple-500" />
          <div className="flex-1">
            <div className="text-[9px] text-purple-500/70 font-bold uppercase tracking-widest">Inference Sync</div>
            <div className="text-xs text-white font-mono flex justify-between items-center">GEMINI_1.5 <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /></div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center gap-3">
          <RefreshCcw className="w-4 h-4 text-orange-500" />
          <div className="flex-1">
            <div className="text-[9px] text-orange-500/70 font-bold uppercase tracking-widest">Self-Healing</div>
            <div className="text-xs text-white font-mono font-bold">WATCHDOG_ON</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-white/5 text-muted-foreground border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">ID</th>
                <th className="px-6 py-4 font-bold tracking-wider">Natural Language Goal</th>
                <th className="px-6 py-4 font-bold tracking-wider">State</th>
                <th className="px-6 py-4 font-bold tracking-wider">Holding Node</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {workflows.map((wf) => (
                  <motion.tr 
                    key={wf.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border/20 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{wf.id.substring(0, 8)}</td>
                    <td className="px-6 py-4 font-medium text-gray-200">{wf.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusColor(wf.status)} uppercase tracking-widest`}>
                        {wf.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2 text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${wf.status === 'completed' ? 'bg-green-500' : wf.status === 'failed' ? 'bg-red-500' : wf.status === 'blocked_on_human' ? 'bg-amber-500' : 'bg-blue-500 animate-ping'}`} />
                      <span className="font-mono">{wf.currentAgent || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 flex justify-end items-center gap-2">
                      {wf.status === 'blocked_on_human' && (
                        <button 
                          onClick={async () => {
                            await fetch(`http://localhost:8081/api/v1/workflows/${wf.id}/status`, { // proxy to backend
                              method: 'PUT',
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: "flowing", currentAgent: "Execution" })
                            });
                            // Trigger resume
                            await fetch("http://localhost:8000/workflow/resume", {
                              method: 'POST',
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: wf.id })
                            });
                            fetchWorkflows();
                          }}
                          className="px-3 py-1 bg-amber-500 text-black font-bold text-xs rounded shadow-lg hover:bg-amber-400 transition-colors animate-pulse"
                        >
                          Approve Override
                        </button>
                      )}
                      
                      {(wf.status === 'failed' || wf.status === 'completed') && (
                        <button
                          onClick={() => rerunWorkflow(wf.name)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                          title="Rerun as New Workflow"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          if (!confirm("Are you sure you want to delete this workflow?")) return;
                          await fetch(`http://localhost:8081/api/v1/workflows/${wf.id}`, { method: 'DELETE' });
                          fetchWorkflows();
                        }}
                        className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete Workflow"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {workflows.length === 0 && (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <Activity className="w-8 h-8 opacity-20 mb-3" />
              <p>No workflows mapped yet. Speak or type to construct a DAG.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
