import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import { useClue } from '../../context/ClueContext'
import glowingFish from '../../assets/lottie/glowing-fish.json'
import fish from '../../assets/lottie/fish.json'

const CREATURES = [
  { name: 'Lanternfish', depth: '400m', desc: '"Just a lanternfish. Nothing to worry about. Elena used to sketch them."', emoji: '🐟' },
  { name: 'Hatchetfish', depth: '600m', desc: '"They look upwards for descending shadows. Right now, I am a very big shadow."', emoji: '🔪' },
  { name: 'Swordfish', depth: '800m', desc: '"A swordfish? It is usually much too deep for them here. Something chased it down."', emoji: '⚔️' },
]

export default function TwilightZone({ scrollData }) {
  const sectionRef = useRef(null)
  const [hoveredClue, setHoveredClue] = useState(false)
  const { collectedClues, collectClue } = useClue()
  const isCollected = collectedClues.tank

  const depthInZone = scrollData
    ? Math.round(200 + Math.min(Math.max((scrollData.progress - 0.2) / 0.2, 0), 1) * 800)
    : 200

  return (
    <section
      ref={sectionRef}
      id="twilight"
      className="relative min-h-[150vh] flex flex-col justify-center items-center py-32"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #06111C 100%)',
      }}
      aria-label="Twilight Zone - The First Clue"
    >

      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2"
        animate={{
          x: [-50, 50, -50],   // reduced movement
          y: [-30, 30, -30],
          rotate: [-2, 2, -2]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <Player
          autoplay
          loop
          src={fish}
          className="w-screen h-auto opacity-80 pointer-events-none"
          style={{
            filter: 'drop-shadow(0 0 25px rgba(79,195,247,0.6))',
          }}
        />
      </motion.div>

      {/* Ambient background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              background: 'rgba(79, 195, 247, 0.2)',
              left: `${Math.random() * 100}%`,
              bottom: 0,
            }}
            animate={{ y: [0, -(Math.random() * 800 + 400)], opacity: [0, 0.4, 0], x: Math.random() * 40 - 20 }}
            transition={{ duration: Math.random() * 10 + 5, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Narrative Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          <div className="text-[10px] tracking-[0.5em] mb-4" style={{ color: '#4FC3F7' }}>
            ZONE 02 • 200-1000M
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-widest mb-8" style={{ color: '#E0F7FA', fontFamily: "'Cinzel', serif" }}>
            TWILIGHT
          </h2>

          <div className="space-y-6 text-sm md:text-lg font-light italic max-w-[85%] lg:max-w-none" style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(224, 247, 250, 0.8)' }}>
            <p>"I'm entering the Twilight Zone. The last rays of the sun die here."</p>
            <p>"We sent Dr. Elena Vasquez down here three weeks ago. She was mapping the trench vents."</p>
            <p className="text-[#4FC3F7]">"She never surfaced."</p>
          </div>

          <div className="mt-8 lg:mt-12">
            <div className="text-sm font-mono tracking-widest" style={{ color: '#1A6B8A' }}>
              CURRENT DEPTH: {depthInZone.toLocaleString()}m
            </div>
          </div>
        </motion.div>

        {/* Interactive Clue Right Column */}
        <motion.div
          className="relative flex justify-center items-center min-h-[300px] lg:h-[400px]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: true }}
        >

          <motion.div
            className="absolute"
            animate={{
              x: [-50, 50, -50],
              y: [-20, 20, -20]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <Player
              autoplay
              loop
              src={glowingFish}
              className="w-24 h-24 md:w-32 md:h-32 opacity-80 pointer-events-none"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(79,195,247,0.6))',
              }}
            />
          </motion.div>

          {/* Dr Vasquez Oxygen Tank SVG */}
          <motion.div
            className="relative cursor-pointer z-10"
            onClick={() => collectClue('tank')}
            onHoverStart={() => setHoveredClue(true)}
            onHoverEnd={() => setHoveredClue(false)}
            onTouchStart={() => setHoveredClue(true)}
            onTouchEnd={() => setTimeout(() => setHoveredClue(false), 3000)}
            whileHover={{ scale: 1.05 }}
            animate={{ y: [-10, 10, -10], rotateZ: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* The Clue Tooltip */}
            <motion.div
              className="absolute -top-28 lg:-top-24 left-1/2 -translate-x-1/2 w-[220px] md:w-64 p-4 glass rounded-lg border border-[#4FC3F7]/30 pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: hoveredClue ? 1 : 0, y: hoveredClue ? 0 : 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-[10px] font-mono tracking-widest mb-2 border-b pb-1 flex justify-between items-center" style={{ color: isCollected ? '#00FF9F' : '#4FC3F7', borderColor: isCollected ? '#00FF9F30' : '#4FC3F730' }}>
                <span>CLUE 01: {isCollected ? 'COLLECTED' : 'ABANDONED TANK'}</span>
                {isCollected && <span className="text-[8px]">✓</span>}
              </div>
              <p className="text-[11px] md:text-xs text-white/80 font-light italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                "It's empty. But the valve... the valve was forced closed from the outside."
              </p>
            </motion.div>

            {/* Tank SVG Illustration */}
            <svg width="50" height="150" viewBox="0 0 60 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: hoveredClue ? (isCollected ? 'drop-shadow(0 0 20px rgba(0,255,159,0.6))' : 'drop-shadow(0 0 20px rgba(79,195,247,0.6))') : (isCollected ? 'drop-shadow(0 15px 20px rgba(0,255,159,0.2))' : 'drop-shadow(0 15px 20px rgba(0,0,0,0.8))'), transition: 'filter 0.3s ease' }}>
              <rect x="15" y="30" width="30" height="130" rx="15" fill="url(#tank-grad)" />
              <rect x="22" y="10" width="16" height="20" fill="#333" />
              <circle cx="30" cy="8" r="8" fill="#555" />
              <path d="M40 8 L50 15" stroke="#777" strokeWidth="3" />
              <path d="M20 60 L35 75 M25 100 L40 90 M22 130 L38 140" stroke="#111" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <defs>
                <linearGradient id="tank-grad" x1="15" y1="30" x2="45" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1A2938" />
                  <stop offset="0.5" stopColor="#304860" />
                  <stop offset="1" stopColor="#0F1722" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing hint indicator */}
            {!hoveredClue && !isCollected && (
              <motion.div
                className="absolute inset-0 rounded-full border border-[#4FC3F7] mix-blend-screen"
                animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Creature label cards representing Jacques' thoughts */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
        {CREATURES.map((creature, i) => (
          <motion.div
            key={creature.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true, margin: '-50px' }}
            className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform duration-300"
            style={{
              padding: '1rem',
              borderColor: 'rgba(26, 107, 138, 0.3)',
              background: 'linear-gradient(135deg, rgba(26,107,138,0.1) 0%, rgba(6,17,28,0.8) 100%)'
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-mono tracking-widest text-[#4FC3F7]">
                {creature.name.toUpperCase()}
              </h3>
              <div className="text-[10px] tracking-widest text-[#4FC3F7]/50 font-mono">
                {creature.depth}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#E0F7FA]/70 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              {creature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
