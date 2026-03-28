import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TypewriterText = ({ text, delay }) => {
  const characters = Array.from(text)
  return (
    <motion.p
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.04, delayChildren: delay }
        }
      }}
      className="text-[#E0F7FA] font-mono text-xs md:text-sm mb-3 tracking-[0.2em] text-center"
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  )
}

export default function LoadingScreen({ onComplete }) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleComplete = () => {
    setIsLoaded(true)
    setTimeout(() => {
      if (onComplete) onComplete()
    }, 1500) // Slow cinematic fade out duration
  }

  useEffect(() => {
    // Auto-complete after 15 seconds (allows all text to type and pause)
    const timer = setTimeout(() => {
      handleComplete()
    }, 15000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020205]"
        >
          {/* Subtle background glow */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(circle at center, #0D47A1 0%, transparent 60%)' }}
          />

          <div className="relative z-10 max-w-2xl px-6 flex flex-col items-center">
            <TypewriterText text="November 2026. The Pacific Ocean." delay={1.0} />
            <TypewriterText text="Legendary diver Jacques Morel, 67," delay={3.5} />
            <TypewriterText text="attempts his final solo dive." delay={6.0} />
            <TypewriterText text="Target depth: 11,000 meters." delay={8.5} />
            <TypewriterText text="No backup. No support team." delay={10.5} />
            <TypewriterText text="Just him. And whatever waits below." delay={12.5} />
          </div>

          <motion.button
            onClick={handleComplete}
            className="absolute bottom-10 text-[9px] font-mono tracking-widest text-white/30 hover:text-white/70 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
          >
            [ SKIP PROLOGUE ]
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
