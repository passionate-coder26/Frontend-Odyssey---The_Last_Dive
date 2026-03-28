import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AudioButton({ isMuted, toggleMute, isStarted }) {
  return (
    <motion.div
      className="fixed bottom-6 left-6 z-[200] flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
    >
      <motion.button
        onClick={toggleMute}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-11 h-11 rounded-full flex items-center justify-center glass border border-white/10 shadow-lg"
        style={{
          background: isStarted
            ? isMuted
              ? 'rgba(239,68,68,0.15)'
              : 'rgba(0,255,159,0.08)'
            : 'rgba(255,255,255,0.05)',
          borderColor: isStarted
            ? isMuted ? 'rgba(239,68,68,0.35)' : 'rgba(0,255,159,0.25)'
            : 'rgba(255,255,255,0.1)',
          boxShadow: isStarted && !isMuted
            ? '0 0 18px rgba(0,255,159,0.2)'
            : 'none',
        }}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        title={!isStarted ? 'Click to start audio' : isMuted ? 'Unmute' : 'Mute'}
      >
        {/* Pulse ring when active */}
        <AnimatePresence>
          {isStarted && !isMuted && (
            <motion.div
              className="absolute inset-0 rounded-full border border-[#00FF9F]/30"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        <span className="text-lg select-none" role="img" aria-hidden>
          {!isStarted ? '🔈' : isMuted ? '🔇' : '🔊'}
        </span>
      </motion.button>

      {/* Label */}
      <span
        className="text-[8px] font-mono tracking-[0.2em] uppercase"
        style={{ color: 'rgba(224,247,250,0.35)' }}
      >
        {!isStarted ? 'AUDIO' : isMuted ? 'MUTED' : 'AUDIO'}
      </span>
    </motion.div>
  )
}
