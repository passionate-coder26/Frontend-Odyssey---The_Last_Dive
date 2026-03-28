import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import seagullsAnimation from '../../assets/lottie/seagulls.json'
import bubbleBurst from '../../assets/lottie/bubble-burst.json'
import dolphinJumping from '../../assets/lottie/dolphin_jumping.json'

export default function Surface({ scrollData }) {
  const [titleVisible, setTitleVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    // Delay slightly to let loading screen finish
    const timer = setTimeout(() => setTitleVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const progress = scrollData?.progress || 0
  const surfaceOpacity = Math.max(0, 1 - progress * 4)
  const parallaxY = progress * 500

  // Dolphins won't follow you down. They fade rapidly as scroll starts.
  const dolphinOpacity = Math.max(0, 1 - progress * 25)

  const storyLines = [
    "I've run from this long enough",
    "Fear has had its turn",
    "Now it's mine",
    "I have left my life, my daughter behind for this",
    "I have to see whats beneath.",
  ]

  return (
    <section
      ref={sectionRef}
      id="surface"
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden"
      aria-label="Surface - The Last Breath"
    >
      {/* Sky to Ocean Gradient Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to bottom, #87CEEB 0%, #4FC3F7 25%, #1976D2 50%, #0D47A1 75%, #0A1628 100%)',
          opacity: surfaceOpacity,
          y: -parallaxY * 0.3
        }}
      />

      {/* Cinematic Rocky Cliff (Left Side) - Fades out very quickly on scroll */}
      <motion.div
        className="absolute left-0 pointer-events-none z-[25] hidden md:flex items-start"
        style={{
          top: '55%', 
          height: '100vh',
          width: '25vw',
          minWidth: '200px',
          opacity: Math.max(0, 1 - progress * 15),
          y: -parallaxY * 1.5 
        }}
      >
        <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="w-full h-full" style={{ filter: 'drop-shadow(15px 0 25px rgba(0,0,0,0.8))' }}>
          <path d="M 0,0 L 80,0 L 70,10 L 90,30 L 75,50 L 95,75 L 85,100 L 100,150 L 90,200 L 0,200 Z" fill="#030812" />
          <path d="M 20,0 L 30,50 M 40,20 L 50,80 M 10,70 L 30,150 M 60,30 L 55,70 M 70,100 L 80,140" stroke="#081020" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 80,0 L 70,10 L 90,30 L 75,50" stroke="#4FC3F7" strokeWidth="1" fill="none" opacity="0.3" />
        </svg>
      </motion.div>
 
      {/* ... (skipping some waves and sun code) */}
 
      {/* Main content - Awwwards Quality */}
      <div className="relative z-12 text-center px-6 flex flex-col items-center" style={{ opacity: surfaceOpacity }}>
        {/* Title - Cinematic Serif */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={titleVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="text-4xl sm:text-7xl lg:text-[7rem] font-bold mb-6 tracking-[0.1em]"
          style={{
            fontFamily: "'Cinzel', 'Playfair Display', serif",
            color: '#E0F7FA',
            textShadow: '0 0 20px rgba(224, 247, 250, 0.4), 0 0 40px rgba(79, 195, 247, 0.2), 0 10px 20px rgba(0,0,0,0.5)',
          }}
        >
          THE LAST DIVE
        </motion.h1>
 
        {/* Story Monologue */}
        <div
          className="text-sm md:text-xl font-light mb-16 italic max-w-[90vw] md:max-w-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'rgba(224, 247, 250, 0.9)',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {storyLines.map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={titleVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.5 + i * 1.5, duration: 1.5 }}
              className="block mb-2"
            >
              {line}
            </motion.span>
          ))}
        </div>


        {/* Zone badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 7.5, duration: 0.8 }}
          className="inline-block px-6 py-2 rounded-full text-[10px] tracking-[0.4em] mb-20 shadow-2xl"
          style={{
            border: '1px solid rgba(224, 247, 250, 0.15)',
            color: 'rgba(224, 247, 250, 0.9)',
            background: 'rgba(10, 22, 40, 0.4)',
            backdropFilter: 'blur(8px)',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            marginTop: '1rem',
          }}
        >
          THE WORLD ABOVE • 0m
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={titleVisible ? { opacity: 1 } : {}}
          transition={{ delay: 8.5, duration: 1 }}
          className="flex flex-col items-center gap-4 cursor-pointer"
        >
          <span className="text-[9px] tracking-[0.4em] font-medium" style={{ color: 'rgba(224, 247, 250, 0.6)', position: 'relative', top: '2rem' }}>
            SCROLL TO DESCEND
          </span>
          <motion.div
            className="animate-bounce-arrow text-2xl font-light"
            style={{
              color: '#4FC3F7',
              textShadow: '0 0 15px rgba(79, 195, 247, 0.4)'
            }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* Bubble burst when entering water (hits exactly when Diver's head enters water around progress 0.05) */}
      {progress > 0.04 && progress < 0.1 && (
        <div className="fixed top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[40]">
          <Player
            src={bubbleBurst}
            autoplay
            style={{ width: 'clamp(200px, 50vw, 600px)', height: 'auto', opacity: 0.8 }}
          />
        </div>
      )}

      <div
        className="absolute bottom-0 left-0 w-full h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #0A1628)',
          zIndex: 20
        }}
      />
    </section>
  )
}
