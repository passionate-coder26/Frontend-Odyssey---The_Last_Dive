import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClue } from '../../context/ClueContext'

const CLUE_INFO = {
  tank: { label: 'Abandoned Tank', icon: '🛢️', color: '#4FC3F7' },
  hull: { label: 'Titanium Hull', icon: '🛡️', color: '#00FF9F' },
  helmet: { label: "Elena's Helmet", icon: '🪖', color: '#FF4444' }
}

export default function ClueHUD() {
  const { collectedClues } = useClue()
  const collectedCount = Object.values(collectedClues).filter(Boolean).length
  const totalCount = Object.keys(collectedClues).length

  return (
    <div className="fixed top-12 md:top-24 right-2 md:right-6 z-[100] pointer-events-none">
      <motion.div 
        className="glass p-2 md:p-4 rounded-xl border border-white/10 flex flex-col gap-2 md:gap-3 min-w-[100px] md:min-w-[180px]"

        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
            Clues Collected
          </span>
          <span className="text-xs font-mono font-bold text-[#4FC3F7]">
            {collectedCount}/{totalCount}
          </span>
        </div>

        <div className="flex gap-4 justify-center py-1">
          {Object.entries(CLUE_INFO).map(([id, info]) => (
            <div key={id} className="relative group pointer-events-auto">
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                <span className="text-[9px] font-mono text-white/80">{info.label}</span>
              </div>

              <motion.div
                className="w-10 h-10 rounded-lg flex items-center justify-center border transition-colors relative overflow-hidden"
                style={{
                  background: collectedClues[id] ? `${info.color}20` : 'rgba(255,255,255,0.05)',
                  borderColor: collectedClues[id] ? info.color : 'rgba(255,255,255,0.1)',
                  boxShadow: collectedClues[id] ? `0 0 15px ${info.color}40` : 'none'
                }}
                animate={collectedClues[id] ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
              >
                <span className={`text-xl transition-opacity ${collectedClues[id] ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                  {info.icon}
                </span>

                {/* Shimmer effect for collected clues */}
                {collectedClues[id] && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {collectedCount === totalCount && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-mono text-center text-[#00FF9F] tracking-[0.2em] animate-pulse"
          >
            &gt; ALL CLUES RETRIEVED
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
