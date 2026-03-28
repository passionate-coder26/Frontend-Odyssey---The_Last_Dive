import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CreatureCard({ name, description, icon, color = '#00FF9F' }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="relative w-64 h-80 cursor-pointer perspective-[1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      aria-label={`Learn about ${name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setIsFlipped(!isFlipped)
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-2xl glass flex flex-col items-center justify-center gap-4 p-6"
          style={{
            backfaceVisibility: 'hidden',
            border: `1px solid ${color}22`,
          }}
        >
          <div className="text-5xl">{icon}</div>
          <h3 className="text-lg font-semibold tracking-wider" style={{ color }}>
            {name}
          </h3>
          <div className="w-8 h-0.5 rounded-full" style={{ background: color }} />
          <p className="text-xs tracking-widest" style={{ color: 'rgba(224, 247, 250, 0.4)' }}>
            HOVER TO EXPLORE
          </p>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-2xl glass flex flex-col items-center justify-center gap-4 p-6"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            border: `1px solid ${color}33`,
            background: `linear-gradient(180deg, rgba(0,0,0,0.3), ${color}11)`,
          }}
        >
          {/* Animated bioluminescent glow (replaces creature-glow lottie) */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${color}55 0%, ${color}22 40%, transparent 70%)`,
                filter: 'blur(8px)',
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${color}88 0%, ${color}33 50%, transparent 80%)`,
                filter: 'blur(4px)',
              }}
              animate={{
                scale: [1.2, 0.9, 1.2],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
            <motion.div
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: color,
                boxShadow: `0 0 15px ${color}, 0 0 30px ${color}88`,
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <h3 className="text-sm font-semibold tracking-wider" style={{ color }}>
            {name}
          </h3>
          <p className="text-xs leading-relaxed text-center" style={{ color: '#E0F7FA' }}>
            {description}
          </p>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{ background: color }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
