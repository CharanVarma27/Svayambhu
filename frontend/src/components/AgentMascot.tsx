import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export function AgentMascot() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-[100] group pointer-events-auto cursor-pointer"
    >
      <div className="relative">
        {/* Outer Glow Halo */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl"
        />
        
        {/* Main Body */}
        <div className="w-14 h-14 bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:border-blue-400 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all">
          <Cpu className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
        </div>

        {/* Animated "Eye" dots */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4 }} className="w-1 h-1 bg-blue-400 rounded-full" />
          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 4 }} className="w-1 h-1 bg-blue-400 rounded-full" />
        </div>

        {/* Floating Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <div className="bg-black/90 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-mono text-blue-300 uppercase tracking-widest pointer-events-none">
            MIND_SYNC_READY &gt; 99%
          </div>
        </div>
      </div>
    </motion.div>
  );
}
