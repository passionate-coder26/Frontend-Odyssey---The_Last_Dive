import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function PressureGauge({ scrollData }) {
  const [gaugeProgress, setGaugeProgress] = useState(0)
  const [pressure, setPressure] = useState(0)
  const [temp, setTemp] = useState(20)
  const [visibility, setVisibility] = useState(100)

  useEffect(() => {
    if (!scrollData) return
    // Only active in Abyss zone (zone index 3-4, depth 0.6-1.0)
    const abyssStart = 0.55
    const abyssEnd = 0.9
    const progress = Math.max(0, Math.min((scrollData.progress - abyssStart) / (abyssEnd - abyssStart), 1))
    
    setGaugeProgress(progress)
    setPressure(Math.round(progress * 600))
    setTemp(Math.round(20 - progress * 18))
    setVisibility(Math.round(100 - progress * 100))
  }, [scrollData])

  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference * (1 - gaugeProgress)

  const gaugeColor = gaugeProgress < 0.5 ? '#4FC3F7' : gaugeProgress < 0.8 ? '#FF9800' : '#FF4500'

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Circular gauge */}
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background track */}
          <circle
            cx="80" cy="80" r="70"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <motion.circle
            cx="80" cy="80" r="70"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 8px ${gaugeColor})`,
            }}
          />
          {/* Tick marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * 360
            const rad = (angle * Math.PI) / 180
            const x1 = 80 + Math.cos(rad) * 58
            const y1 = 80 + Math.sin(rad) * 58
            const x2 = 80 + Math.cos(rad) * 63
            const y2 = 80 + Math.sin(rad) * 63
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
            )
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-mono font-bold" style={{ color: gaugeColor }}>
            {Math.round(gaugeProgress * 100)}
          </span>
          <span className="text-[10px] tracking-[0.3em]" style={{ color: 'rgba(224, 247, 250, 0.5)' }}>
            PRESSURE %
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        <StatCounter label="PRESSURE" value={pressure} unit="atm" color={gaugeColor} />
        <StatCounter label="TEMP" value={temp} unit="°C" color="#4FC3F7" />
        <StatCounter label="VISIBILITY" value={visibility} unit="m" color="#1A6B8A" />
      </div>
    </div>
  )
}

function StatCounter({ label, value, unit, color }) {
  return (
    <div className="text-center">
      <div className="text-lg md:text-xl font-mono font-bold tabular-nums" style={{ color }}>
        {value.toLocaleString()}
        <span className="text-[10px] ml-0.5 font-normal">{unit}</span>
      </div>
      <div className="text-[8px] tracking-[0.2em] mt-1" style={{ color: 'rgba(224, 247, 250, 0.3)' }}>
        {label}
      </div>
    </div>
  )
}
