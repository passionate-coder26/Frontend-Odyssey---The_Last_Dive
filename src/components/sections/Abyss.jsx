import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import { useClue } from '../../context/ClueContext'
import bubbleBurst from '../../assets/lottie/bubble-burst.json'

export default function Abyss({ scrollData }) {
  const [hoveredClue, setHoveredClue] = useState(false)
  const [turnBackClicked, setTurnBackClicked] = useState(false)
  const { collectedClues, collectClue } = useClue()
  const isCollected = collectedClues.helmet

  const progress = scrollData?.progress || 0

  // Flashing red critical alarms mapping
  const warningOpacity = Math.max(0, (progress - 0.4) * 2)

  const handleTurnBack = () => {
    setTurnBackClicked(true)
    setTimeout(() => setTurnBackClicked(false), 4000)
  }

  return (
    <section
      id="abyss"
      className="relative min-h-[180vh] py-32 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #030810 0%, #010306 100%)',
      }}
      aria-label="The Abyss - The Final Warning"
    >

      <motion.img
        src="/shipwreck.png"
        alt="Abyss object"
        className="absolute top-0 right-[53%] w-[clamp(280px,55vw,700px)] pointer-events-none z-[4]"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        animate={{ y: [-18, 18, -18] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          opacity: 0.92,
          filter: `
      brightness(0.95)
      contrast(1.35)
      saturate(0.45)
      grayscale(0.35)
      sepia(0.15)
      drop-shadow(0 35px 80px rgba(0,0,0,0.95))
    `
        }}
      />

      <motion.div
        className="absolute top-12 right-[50%] rounded-full pointer-events-none z-[3]"
        style={{
          width: 'clamp(200px, 40vw, 520px)',
          height: 'clamp(200px, 40vw, 520px)',
          background: `
      radial-gradient(circle,
        rgba(255,255,255,0.9) 0%,
        rgba(220,255,245,0.55) 16%,
        rgba(0,255,159,0.22) 38%,
        rgba(0,255,159,0.08) 55%,
        transparent 78%)
    `,
          filter: 'blur(95px)'
        }}
        animate={{ opacity: [0.7, 1, 0.78] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-20 right-[56%] rounded-full pointer-events-none z-[5]"
        style={{
          width: 'clamp(100px, 18vw, 220px)',
          height: 'clamp(100px, 18vw, 220px)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 35%, transparent 72%)',
          filter: 'blur(35px)'
        }}
        animate={{ opacity: [0.45, 0.8, 0.55] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* fog */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: `
      radial-gradient(circle at 40% 50%, rgba(0,255,159,0.02), transparent 35%),
      radial-gradient(circle at 55% 60%, rgba(180,255,240,0.08), transparent 40%)
    `,
          filter: 'blur(120px)'
        }}
        animate={{
          x: [-80, 80, -80],
          y: [-30, 40, -30],
          opacity: [0.3, 0.5, 0.4]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background: 'radial-gradient(circle at 45% 45%, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }}
      />


      {/* Background Tentacle Shadows (Massive & Blurry) */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none opacity-50"
        style={{
          y: progress * -200, // Moves up slowly as we scroll down
        }}
      >

        {/* Massive Moving Shadow (Creature Presence) */}
        <motion.div
          className="absolute right-0 top-0 w-[60%] h-full z-[2] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 70% 50%, rgba(0,0,0,0.6), transparent 70%)'
          }}
          animate={{
            x: [200, -200],
            opacity: [0, 0.4, 0.2, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ filter: 'blur(14px)' }}>
          <motion.path
            d="M-200,800 Q300,500 800,900"
            stroke="rgba(0,255,159,0.18)" strokeWidth="80" fill="none" strokeLinecap="round"
            animate={{ d: ["M-200,800 Q300,500 800,900", "M-200,750 Q400,600 900,850", "M-200,800 Q300,500 800,900"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M1200,400 Q700,700 200,300"
            stroke="rgba(0,255,159,0.18)" strokeWidth="120" fill="none" strokeLinecap="round"
            animate={{ d: ["M1200,400 Q700,700 200,300", "M1100,450 Q600,600 150,350", "M1200,400 Q700,700 200,300"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* Critical Equipment Red Flashing Vignette */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(255, 0, 0, 0.15) 100%)`,
          opacity: warningOpacity
        }}
        animate={{ opacity: [warningOpacity * 0.5, warningOpacity, warningOpacity * 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Marine Snow Particles */}
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none z-[2]"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3 + 0.2,
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: [0, 200],
            x: [0, Math.random() * 10 - 5],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: 'linear',
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Narrative Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="text-[10px] tracking-[0.5em] mb-4" style={{ color: '#FF4444' }}>
            ZONE 04 • 4000-6000M
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-widest mb-8" style={{ color: '#FFF', fontFamily: "'Cinzel', serif" }}>
            THE ABYSS
          </h2>

          <div className="space-y-6 text-base md:text-lg font-light italic" style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255, 255, 255, 0.7)' }}>
            <p>"4,000 meters. The pressure alarms have been screaming for an hour. System integrity dropping."</p>
            <p>"I found her helmet. It's crushed. But tucked inside the padding... she left a note."</p>
            <p className="text-[#00FF9F] font-normal">"Everyone told me to turn back. I'm not turning back."</p>
          </div>

          {/* Interactive Turn Back Bait */}
          <div className="mt-12 relative">
            <button
              onClick={handleTurnBack}
              className="px-6 py-3 border border-red-500/50 bg-red-500/10 text-red-500 text-[10px] tracking-[0.3em] font-mono hover:bg-red-500/20 hover:border-red-500 transition-all cursor-pointer rounded uppercase"
            >
              [ INITIATE EMERGENCY ASCENT ]
            </button>

            <AnimatePresence>
              {turnBackClicked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-16 left-0 text-[#00FF9F] font-mono text-[10px] tracking-widest bg-black/80 px-4 py-2 border border-[#00FF9F]/30"
                >
                  &gt; SYSTEM OVERRIDDEN. HE CONTINUES.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Interactive Clue Right Column */}
        <motion.div
          className="relative flex justify-center items-center min-h-[300px] lg:h-[500px]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Cracked Helmet SVG */}
          <motion.div
            className="relative cursor-pointer z-10"
            onClick={() => collectClue('helmet')}
            onHoverStart={() => setHoveredClue(true)}
            onHoverEnd={() => setHoveredClue(false)}
            onTouchStart={() => setHoveredClue(true)}
            onTouchEnd={() => setTimeout(() => setHoveredClue(false), 3000)}
            whileHover={{ scale: 1.05 }}
            animate={{ y: [-10, 10, -10], rotateZ: [-3, 3, -3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* The Clue Tooltip */}
            <motion.div
              className="absolute -top-36 left-1/2 -translate-x-1/2 w-80 p-5 glass rounded-lg border border-[#00FF9F]/40 pointer-events-none z-20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: hoveredClue ? 1 : 0, y: hoveredClue ? 0 : 10 }}
              transition={{ duration: 0.3 }}
              style={{ background: 'rgba(5, 10, 20, 0.9)' }}
            >
              <div className="text-[10px] font-mono tracking-widest mb-3 border-b pb-2 flex justify-between items-center" style={{ color: isCollected ? '#00FF9F' : '#00FF9F', borderColor: isCollected ? '#00FF9F60' : '#00FF9F30' }}>
                <span>CLUE 03: {isCollected ? 'COLLECTED' : "ELENA'S HELMET"}</span>
                {isCollected && <span className="text-[8px]">✓</span>}
              </div>
              <p className="text-sm text-[#E0F7FA]/90 font-light italic leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                "If anyone finds this... it's not a monster. It's beautiful. It's ancient. And it has been waiting for us."
              </p>
            </motion.div>

            {/* Helmet SVG Illustration */}
            <svg width="180" height="200" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: hoveredClue ? 'drop-shadow(0 0 30px rgba(0,255,159,0.3))' : 'drop-shadow(0 20px 30px rgba(0,0,0,0.9))', transition: 'filter 0.3s ease' }}>
              {/* Helmet Dome */}
              <path d="M20,100 C20,30 160,30 160,100 C160,150 140,180 90,180 C40,180 20,150 20,100 Z" fill="#1A1F24" stroke="#2C3A47" strokeWidth="4" />
              {/* Visor Area (Smashed) */}
              <path d="M40,90 C40,60 140,60 140,90 C140,130 110,140 90,140 C70,140 40,130 40,90 Z" fill="#0A0F14" stroke="#444" strokeWidth="3" />
              {/* Massive Crack in Visor */}
              <path d="M120,70 L95,95 L110,110 L80,135 M50,85 L80,105 L70,120" stroke="#00FF9F" strokeWidth="2" opacity="0.8" filter="blur(1px)" />
              <path d="M120,70 L95,95 L110,110 L80,135" stroke="#FFF" strokeWidth="1" opacity="0.9" />
              {/* Scratches & Dents */}
              <path d="M30,110 L45,115 M150,120 L135,110 M90,35 L100,50 L85,45" stroke="#111" strokeWidth="3" strokeLinecap="round" />
              {/* Small green glow from inside */}
              <circle cx="85" cy="115" r="15" fill="#00FF9F" opacity="0.3" filter="blur(8px)" />
            </svg>

            {/* Glowing hint indicator */}
            {!hoveredClue && !isCollected && (
              <motion.div
                className="absolute inset-0 rounded-full border border-[#00FF9F] mix-blend-screen"
                animate={{ scale: [1, 1.25, 1.5], opacity: [0.5, 0.2, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
