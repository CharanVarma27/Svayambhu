import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-[#09090b] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative flex items-center justify-center mb-8"
      >
        {/* Pulsing Aura */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-3xl"
        />
        {/* Logo */}
        <img src="/logo.jpg" alt="Svayambhu Logo" className="w-[1000px] h-auto object-contain rounded-3xl relative z-10 shadow-3xl border border-white/10" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 mb-6 drop-shadow-sm"
      >
        <span className="text-blue-500"></span>
      </motion.h1>
      
      <motion.div 
        className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-6 flex flex-col items-center space-y-2"
      >
        <p className="text-xs text-blue-400 font-mono tracking-widest uppercase animate-pulse">
          Booting Multi-Agent Cluster...
        </p>
        <p className="text-[10px] text-gray-500 font-mono tracking-wider">
          ESTABLISHING STATE GRAPH &gt; ALIGNING NEURAL PATHWAYS &gt; READY
        </p>
      </motion.div>
    </motion.div>
  );
}
