import { useState } from "react";
import { Settings as SettingsIcon, Cpu, Monitor, Zap, RotateCcw, ShieldCheck, Database, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Settings() {
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [showSaved, setShowSaved] = useState(false);
  const [model, setModel] = useState(localStorage.getItem("ai_model") || "gemini-2.0-flash");
  const [refreshRate, setRefreshRate] = useState(localStorage.getItem("refresh_rate") || "3000");
  const [animations, setAnimations] = useState(localStorage.getItem("ui_animations") !== "false");
  const [density, setDensity] = useState(localStorage.getItem("ui_density") || "comfortable");

  const saveSetting = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  const handleToggleAnimations = () => {
    const newVal = !animations;
    setAnimations(newVal);
    localStorage.setItem("ui_animations", String(newVal));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-4xl mx-auto pb-20"
    >
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
          <SettingsIcon className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white">System Settings</h2>
          <p className="text-muted-foreground mt-1 font-mono text-sm tracking-wider uppercase">Kernel Configuration & User Interface Parameters</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* AI Configuration */}
        <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu className="w-24 h-24 text-blue-500" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">AI Neural Engine</h3>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Gemini Cloud API Token</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={geminiKey}
                  onChange={(e) => { 
                    setGeminiKey(e.target.value); 
                    saveSetting("gemini_api_key", e.target.value);
                    setShowSaved(true);
                    setTimeout(() => setShowSaved(false), 2000);
                  }}
                  placeholder="Enter AI Studio API Key..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-blue-300 focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all">
                  <ShieldCheck className="w-5 h-5" />
                </button>
              </div>
              <AnimatePresence>
                {showSaved && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 mt-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest pl-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Settings Synchronized to Local Kernel
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Target Model</label>
                <select 
                  value={model}
                  onChange={(e) => { setModel(e.target.value); saveSetting("ai_model", e.target.value); }}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none transition-all"
                >
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Default)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gemini-2.0-pro-exp">Gemini 2.0 Pro Experimental</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Inference Temp</label>
                <div className="flex items-center gap-4 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5">
                  <input type="range" min="0" max="1" step="0.1" className="flex-1 accent-blue-500" />
                  <span className="text-xs font-mono text-blue-400">0.7</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* UI & Performance */}
        <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">Interface & Performance</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
              <div>
                <h4 className="text-sm font-bold text-gray-200">Cinematic Animations</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Framer Motion Global Effects</p>
              </div>
              <button 
                onClick={handleToggleAnimations}
                className={`w-12 h-6 rounded-full transition-all relative ${animations ? 'bg-blue-600' : 'bg-gray-800'}`}
              >
                <motion.div 
                  animate={{ x: animations ? 24 : 4 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
              <div>
                <h4 className="text-sm font-bold text-gray-200">Layout Density</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Viewport Data Saturation</p>
              </div>
              <div className="flex bg-black rounded-lg p-1 border border-white/10">
                <button 
                  onClick={() => { setDensity("comfortable"); saveSetting("ui_density", "comfortable"); }}
                  className={`px-3 py-1 text-[10px] font-black rounded ${density === "comfortable" ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                >COMFY</button>
                <button 
                  onClick={() => { setDensity("compact"); saveSetting("ui_density", "compact"); }}
                  className={`px-3 py-1 text-[10px] font-black rounded ${density === "compact" ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                >COMPACT</button>
              </div>
            </div>
          </div>
        </section>

        {/* Telemetry & Synchronization */}
        <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">Telemetry & Sync</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Telemetry Refresh Interval</label>
              <div className="grid grid-cols-4 gap-2">
                {["1000", "3000", "5000", "10000"].map((rate) => (
                  <button 
                    key={rate}
                    onClick={() => { setRefreshRate(rate); saveSetting("refresh_rate", rate); }}
                    className={`py-3 rounded-xl border text-xs font-mono transition-all ${refreshRate === rate ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-black/50 border-white/5 text-gray-500 hover:border-white/20'}`}
                  >
                    {parseInt(rate)/1000}s
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Reset All Storage
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold hover:bg-green-500/20 transition-all">
                <Database className="w-4 h-4" /> Export System Logs
              </button>
            </div>
          </div>
        </section>
      </div>

    </motion.div>
  );
}
