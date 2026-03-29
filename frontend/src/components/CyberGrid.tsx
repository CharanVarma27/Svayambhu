import { motion } from 'framer-motion';

interface Particle {
  x: string;
  y: string;
  duration: number;
  targetY: string;
}

const STATIC_PARTICLES: Particle[] = [...Array(20)].map(() => ({
  x: (Math.random() * 100).toFixed(2) + '%',
  y: (Math.random() * 100).toFixed(2) + '%',
  duration: Math.random() * 10 + 10,
  targetY: (Math.random() * 100).toFixed(2) + '%'
}));

export function CyberGrid() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#020203]">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.10]" 
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
        }}
      />
      
      {/* Moving Particles */}
      {STATIC_PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: p.x, 
            y: p.y,
            opacity: 0 
          }}
          animate={{ 
            y: [p.y, p.targetY],
            opacity: [0, 0.3, 0]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-[1px] h-[60px] bg-gradient-to-b from-blue-500/40 to-transparent"
        />
      ))}


      {/* Radial Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px]" />
      
      {/* Scanline Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-50 overflow-hidden">
        <div className="h-[2px] w-full bg-blue-500/20 absolute top-0 animate-[scan_8s_linear_infinite]" />
      </div>
    </div>
  );
}

