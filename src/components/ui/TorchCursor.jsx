import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '../../hooks/useMousePosition'

export default function TorchCursor({ scrollData }) {
  const { x, y, isPresent } = useMousePosition()
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch-primary devices
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches)
    }
    checkTouch()
    window.matchMedia('(pointer: coarse)').addEventListener('change', checkTouch)
    return () => window.matchMedia('(pointer: coarse)').removeEventListener('change', checkTouch)
  }, [])

  const progress = scrollData?.progress || 0

  let darkness = 0
  if (progress > 0.05) {
    darkness = Math.min(0.95, (progress - 0.05) * 1.5)
  }

  // On touch devices use a larger spotlight radius centered on screen
  const spotlightRadius = isTouchDevice ? '45vw' : '350px'
  const spotX = isTouchDevice ? '50vw' : `${x}px`
  const spotY = isTouchDevice ? '50vh' : `${y}px`
  const spotVisible = isTouchDevice ? true : isPresent

  // If mouse is not on screen, everything is dark, no Spotlight reveals anything.
  const gradientStr = spotVisible
    ? `radial-gradient(circle ${spotlightRadius} at ${spotX} ${spotY}, transparent 0%, rgba(2, 5, 10, ${darkness * 0.7}) 50%, rgba(0, 2, 8, ${darkness}) 100%)`
    : `rgba(0, 2, 8, ${darkness})` // solid black vignette/darkness if cursor isn't there!

  return (
    <>
      {/* Only hide cursor on pointer (mouse) devices */}
      {!isTouchDevice && (
        <style>{`
          * { cursor: none !important; }
        `}</style>
      )}

      {/* The Darkness Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[20] transition-colors duration-500"
        style={{
          background: gradientStr,
        }}
      />

      {/* The Torch Beam Center Glowing Cursor — hidden on touch */}
      {!isTouchDevice && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[100] -ml-2.5 -mt-2.5"
          animate={{
            x,
            y,
            opacity: isPresent ? 1 : 0
          }}
          transition={{
            x: { type: 'spring', stiffness: 400, damping: 25 },
            y: { type: 'spring', stiffness: 400, damping: 25 },
            opacity: { duration: 0.2 }
          }}
        >
          <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_20px_10px_rgba(255,255,255,0.7)]"
            style={{ filter: 'blur(2px)' }} />
        </motion.div>
      )}
    </>
  )
}
