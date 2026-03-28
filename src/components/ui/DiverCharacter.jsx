import React from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '../../hooks/useMousePosition'

export default function DiverCharacter({ scrollData }) {
  const { x: mouseX, y: mouseY } = useMousePosition()

  const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 1000
  const innerHeight = typeof window !== 'undefined' ? window.innerHeight : 1000

  const progress = scrollData?.progress || 0
  const zoneName = scrollData?.zone?.name || 'Surface'
  const zoneIndex = scrollData?.zoneIndex || 0
  if (zoneIndex === 4 && progress > 0.9) return null
  const easeInOut = (t) => t * t * (3 - 2 * t)

  // Determine state based on zone
  let state = 'surface'
  let isDiving = progress > 0 && progress < 0.05
  let isStanding = progress === 0

  if (zoneName === 'Twilight') state = 'twilight'
  if (zoneName === 'Midnight') state = 'midnight'
  if (zoneName === 'Abyss') state = 'abyss'
  if (zoneName === 'Hadal') state = 'hadal'

  if (state === 'hadal') return null

  if (state === 'hadal' && progress > 0.93) return null

  // Trajectory logic
  let topPosition = 15 + (progress * 55) // Default descent behavior
  let leftPositionPercent = 50
  let scale = 1

  if (isStanding) {
    topPosition = 55;
    leftPositionPercent = 15;
  } else if (isDiving) {
    const diveProgress = progress / 0.05
    const smoothDive = easeInOut(diveProgress)

    // Smooth forward movement off the cliff
    leftPositionPercent = 15 + (smoothDive * 35)

    // Smooth dive arc using sine
    topPosition = 55 - Math.sin(smoothDive * Math.PI) * 12 + smoothDive * 10
  } else {
    leftPositionPercent = 50;
    if (progress < 0.1) {
      const floatingUp = (progress - 0.05) / 0.05;
      const targetTop = 15 + (progress * 55);
      topPosition = 65 - (floatingUp * (65 - targetTop));
    }
    if (state === 'hadal') {
      scale = 1.2
    }
  }

  // Calculate actual screen coordinates of Diver
  const diverX = innerWidth * (leftPositionPercent / 100)
  const diverY = innerHeight * (topPosition / 100)

  // Tracking Math
  const dx = mouseX - diverX
  const dy = mouseY - diverY
  const angleRad = Math.atan2(dy, dx)
  const angleDeg = angleRad * (180 / Math.PI)

  let containerRotation = 0;
  let containerScaleX = 1;
  let localHeadRotate = 0;

  if (isStanding) {
    // Standing on the cliff edge
    containerRotation = -10;
    containerScaleX = 1;
    localHeadRotate = 0;
  } else if (isDiving) {
    const diveProgress = progress / 0.05
    const smoothDive = easeInOut(diveProgress)

    containerRotation = -10 + (smoothDive * 95)
    containerScaleX = 1
    localHeadRotate = 0
  } else {
    // Underwater - gracefully horizontal exploring position
    const isFacingRight = dx >= 0;
    containerScaleX = isFacingRight ? 1 : -1;

    if (isFacingRight) {
      containerRotation = 90 + (angleDeg * 0.15); // Pure horizontal is 90
      localHeadRotate = angleDeg * 0.85; // Head does most of the turning
    } else {
      let tiltAngle = angleDeg > 0 ? 180 - angleDeg : -180 - angleDeg;
      containerRotation = -90 - (tiltAngle * 0.15); // Pure horizontal is -90
      localHeadRotate = -tiltAngle * 0.85; // Negative rotates towards belly locally
    }
  }

  const isTorchOn = progress > 0.06
  const torchOpacity = Math.min(1, Math.max(0, (progress - 0.06) * 5))

  return (
    <motion.div
      className="fixed z-30 pointer-events-none flex flex-col items-center"
      style={{
        top: `${topPosition}%`,
        left: `${leftPositionPercent}%`,
      }}
      animate={!isStanding && !isDiving ? {
        x: '-50%',
        y: ['-50%', '-45%', '-50%'],
        rotateZ: containerRotation,
        scaleX: containerScaleX,
        scaleY: scale
      } : {
        x: '-50%',
        y: '-50%',
        rotateZ: containerRotation,
        scaleX: containerScaleX,
        scaleY: scale
      }}
      transition={{
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        rotateZ: { type: 'spring', stiffness: 100, damping: 20 },
        scaleX: { type: 'spring', stiffness: 150, damping: 20 }
      }}
    >
      {/* Dynamic Bubbles */}
      {!isStanding && !isDiving && (
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-8 h-32" style={{ transform: 'rotate(180deg)' }}>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/30 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{
                width: 3 + Math.random() * 5,
                height: 3 + Math.random() * 5,
                left: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, 100],
                opacity: [0, 1, 0],
                x: Math.random() * 30 - 15
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      )}

      {/* DIVER SVG */}
      <div className="relative" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' }}>

        {isStanding && (
          <svg width="80" height="150" viewBox="0 0 80 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tank */}
            <rect x="15" y="40" width="14" height="45" rx="6" fill="#050505" />
            <path d="M25 45 C 35 30, 45 35, 45 40" stroke="#050505" strokeWidth="2" fill="none" />
            {/* Body */}
            <path d="M30 40 Q 40 38 45 45 L 42 85 Q 35 90 28 85 Z" fill="#111" />
            {/* Head */}
            <circle cx="42" cy="30" r="10" fill="#111" />
            <path d="M47 25 Q 52 30 47 35" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            {/* Arms */}
            <path d="M35 45 L 30 65 L 32 80" stroke="#0A0A0A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 45 L 50 60 L 45 75" stroke="#111" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Legs */}
            <path d="M32 85 L 28 115 L 30 135" stroke="#0A0A0A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 85 L 45 110 L 42 135" stroke="#111" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            {/* Fins */}
            <path d="M28 135 L 20 148 L 35 145 Z" fill="#0A0A0A" />
            <path d="M40 135 L 35 150 L 52 146 Z" fill="#111" />
          </svg>
        )}

        {/* STREAMLINED DIVING / SWIMMING POSE */}
        {!isStanding && (
          <svg width="60" height="180" viewBox="0 0 60 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tank */}
            <rect x="16" y="50" width="12" height="45" rx="6" fill="#050505" />
            <path d="M22 50 C 22 40, 32 40, 32 45" stroke="#050505" strokeWidth="2" fill="none" />

            {/* Body */}
            <path d="M25 45 Q 32 40 38 45 L 35 100 Q 30 105 25 100 Z" fill="#111" />

            {/* Legs */}
            <motion.g animate={!isDiving ? { rotateZ: [-2, 2, -2] } : {}} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: '30px', originY: '100px' }}>
              <path d="M28 100 L 26 135 L 28 150" stroke="#0A0A0A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32 100 L 34 135 L 32 150" stroke="#111" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              {/* Fins */}
              <path d="M24 150 L 20 175 L 30 170 Z" fill="#0A0A0A" />
              <path d="M36 150 L 40 175 L 30 170 Z" fill="#111" />
            </motion.g>

            {/* Head + Arms Group (Tracks Mouse) */}
            <motion.g
              style={{ originX: '31px', originY: '35px' }}
              animate={{ rotateZ: localHeadRotate }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              {/* Head */}
              <circle cx="31" cy="35" r="9" fill="#111" />
              <path d="M26 38 C 26 42, 36 42, 36 38" stroke={isTorchOn ? "#00FF9F" : "#111"} strokeWidth="2" strokeLinecap="round" opacity="0.9" filter={isTorchOn ? "blur(1px)" : "none"} />

              {/* Arms Superman */}
              <path d="M28 45 L 25 20 L 30 5" stroke="#0A0A0A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M34 45 L 36 20 L 31 5" stroke="#111" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.g>
          </svg>
        )}
      </div>
    </motion.div>
  )
}
