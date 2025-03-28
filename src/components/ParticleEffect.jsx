import { useState } from "react";
import { motion } from "framer-motion";

// Optimized particle effect with reduced particles and animations
const ParticleEffect = ({ className }) => {
  const [particles] = useState(() => 
    [...Array(6)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      xOffset: Math.random() * 40 - 20,
      yOffset: Math.random() * 40 - 20,
      delay: i * 0.1
    }))
  );
  
  return (
    <div className={`absolute pointer-events-none ${className || ''}`}>
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full will-change-transform"
          initial={{ 
            opacity: 0, 
            scale: 0,
            transform: "translateZ(0)"  // Force GPU acceleration
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.8, 0],
            x: particle.xOffset,
            y: particle.yOffset,
          }}
          transition={{
            duration: 0.8,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: 2
          }}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            backgroundColor: 'var(--accent)',
            boxShadow: '0 0 5px var(--accent)'
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect; 