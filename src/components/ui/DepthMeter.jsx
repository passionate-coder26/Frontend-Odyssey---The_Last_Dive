import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import fishAnimation from '../../assets/lottie/fish.json'

export default function DepthMeter({ scrollData }) {
  const depthRef = useRef(null)
  const currentDepth = scrollData ? scrollData.depth : 0
  const zone = scrollData ? scrollData.zone : { name: 'Surface', color: '#4FC3F7' }
  const progress = scrollData ? scrollData.progress : 0

  // Narrative stats
  const oxygenLevel = Math.max(12, Math.round(100 - (progress * 88)))
  const isCritical = oxygenLevel <= 20

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3"
      aria-label="Depth meter"
    >
      {/* Zone name */}
      <motion.div
        className="text-[10px] tracking-[0.3em] text-center px-2 py-1 rounded-full"
        style={{
          color: zone.color,
          border: `1px solid ${zone.color}33`,
          background: `${zone.color}11`,
        }}
        key={zone.name}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {zone.name.toUpperCase()}
      </motion.div>

      {/* Diver Stats Block */}
      <div className="flex flex-col items-end gap-1 mb-2">
        <div className="text-[9px] tracking-[0.2em] font-mono text-[#81D4FA] opacity-70">
          DIVER: J. MOREL
        </div>
        <div className="text-[9px] tracking-[0.1em] font-mono text-[#81D4FA] opacity-50">
          T+ 04:12:00
        </div>
        <motion.div 
          className="text-[10px] tracking-widest font-mono font-bold mt-1"
          style={{ color: isCritical ? '#ef4444' : '#E0F7FA' }}
          animate={isCritical ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          O2: {oxygenLevel}%
        </motion.div>
      </div>

      {/* Vertical track */}
      <div className="relative w-0.5 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        {/* Progress fill */}
        <motion.div
          className="absolute top-0 left-0 w-full rounded-full"
          style={{
            height: `${progress * 100}%`,
            background: `linear-gradient(180deg, #4FC3F7, ${zone.color})`,
          }}
        />
        
        {/* Current position indicator */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          style={{
            top: `${progress * 100}%`,
            background: zone.color,
            boxShadow: `0 0 12px ${zone.color}`,
          }}
        />
        
        {/* Lottie fish swimming alongside */}
        <div
          className="absolute -left-8"
          style={{ top: `${Math.max(0, progress * 100 - 5)}%` }}
        >
          <Player
            src={fishAnimation}
            loop
            autoplay
            style={{ width: 24, height: 24, opacity: 0.7 }}
          />
        </div>
      </div>

      {/* Depth number */}
      <div className="text-center mt-2">
        <motion.div
          ref={depthRef}
          className="text-lg font-mono font-bold tabular-nums"
          style={{ color: zone.color }}
        >
          {currentDepth.toLocaleString()}
        </motion.div>
        <div className="text-[9px] tracking-[0.2em]" style={{ color: 'rgba(224, 247, 250, 0.4)' }}>
          METERS
        </div>
      </div>

      {/* Zone markers */}
      <div className="flex z-[45] flex-col gap-1 mt-1">
        {['S', 'T', 'M', 'A', 'H'].map((label, i) => {
          const colors = ['#4FC3F7', '#1A6B8A', '#1A1A4E', '#0D0D2B', '#050510']
          const isActive = scrollData && scrollData.zoneIndex >= i
          return (
            <div
              key={label}
              className="w-1.5 h-1.5 rounded-full transition-all duration-500"
              style={{
                background: isActive ? colors[i] : 'rgba(255,255,255,0.1)',
                boxShadow: isActive ? `0 0 6px ${colors[i]}` : 'none',
              }}
            />
          )
        })}
      </div>
    </motion.div>
  )
}
