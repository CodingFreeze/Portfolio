import { useMemo } from 'react';
import { motion } from 'framer-motion';

const GalaxyBackground = ({ darkMode }) => {
  // Generate background galaxies - memoized to avoid recreating on every render
  const galaxies = useMemo(() => {
    return Array.from({ length: 3 }).map(() => ({  // Reduced from 5 to 3 galaxies
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 60 + 40,
      rotation: Math.random() * 360,
      delay: Math.random() * 4,
      // Random colors for galaxies
      color: darkMode ? [
        `rgba(${50 + Math.random() * 100}, ${20 + Math.random() * 50}, ${100 + Math.random() * 155}, 0.06)`,
        `rgba(${20 + Math.random() * 50}, ${50 + Math.random() * 100}, ${150 + Math.random() * 105}, 0.06)`,
        `rgba(${100 + Math.random() * 155}, ${20 + Math.random() * 50}, ${100 + Math.random() * 155}, 0.06)`
      ] : [
        `rgba(${180 + Math.random() * 50}, ${200 + Math.random() * 30}, ${220 + Math.random() * 30}, 0.04)`,
        `rgba(${200 + Math.random() * 40}, ${220 + Math.random() * 20}, ${230 + Math.random() * 20}, 0.04)`,
        `rgba(${210 + Math.random() * 30}, ${210 + Math.random() * 30}, ${230 + Math.random() * 20}, 0.04)`
      ],
      animationDuration: 20 + Math.random() * 60,
      spiralArms: Array.from({ length: 3 }).map((_, i) => ({  // Reduced to 3 arms
        rotation: (i * (360 / 3)) + (Math.random() * 30 - 15),
        width: 60 + Math.random() * 70,
        height: 1 + Math.random() * 4,
        opacity: darkMode ? (0.12 + Math.random() * 0.2) : (0.08 + Math.random() * 0.12),
        curve: 0.4 + Math.random() * 0.8
      }))
    }));
  }, [darkMode]);
  
  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none opacity-80">
      {/* Galaxy/Nebula Background Elements */}
      {galaxies.map((galaxy, index) => (
        <motion.div
          key={`galaxy-${index}`}
          className="absolute rounded-full overflow-hidden"
          style={{
            left: `${galaxy.left}%`,
            top: `${galaxy.top}%`,
            width: `${galaxy.size}px`,
            height: `${galaxy.size}px`,
            transform: `rotate(${galaxy.rotation}deg) translateZ(0)`,  // Force GPU acceleration
            willChange: "transform",
            transformStyle: "preserve-3d"
          }}
          animate={{
            rotate: [`${galaxy.rotation}deg`, `${galaxy.rotation + 360}deg`]
          }}
          transition={{
            duration: galaxy.animationDuration,
            repeat: Infinity,
            ease: "linear",
            delay: galaxy.delay
          }}
        >
          {galaxy.color.map((color, colorIndex) => (
            <motion.div
              key={`galaxy-${index}-layer-${colorIndex}`}
              className="absolute inset-0 rounded-full"
              style={{
                background: color,
                opacity: 0.8,
                transform: "translateZ(0)",
                willChange: "transform, opacity"
              }}
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: galaxy.animationDuration / 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            />
          ))}
          
          {/* Galaxy core - bright center */}
          <motion.div
            className="absolute w-1/4 h-1/4 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              background: `radial-gradient(circle, ${galaxy.color[0].replace('0.06', '0.3')} 0%, transparent 100%)`,
              transform: "translateZ(0)",
              willChange: "transform, opacity"
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: galaxy.animationDuration / 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
          
          {/* Spiral arms for galaxy effect */}
          {galaxy.spiralArms.map((arm, armIndex) => (
            <motion.div
              key={`galaxy-${index}-arm-${armIndex}`}
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                width: `${arm.width}%`,
                height: `${arm.height}px`,
                background: `linear-gradient(90deg, transparent, ${galaxy.color[armIndex % galaxy.color.length].replace('0.06', arm.opacity)}, transparent)`,
                borderRadius: '100%',
                transform: `translateX(-2px) translateY(-50%) rotate(${arm.rotation}deg) translateZ(0)`,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity"
              }}
              animate={{
                scaleX: [1, 1 + arm.curve * 0.1, 1],
                scaleY: [1, 1 + arm.curve * 0.05, 1]
              }}
              transition={{
                duration: galaxy.animationDuration * (0.7 + arm.curve * 0.3),
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default GalaxyBackground; 