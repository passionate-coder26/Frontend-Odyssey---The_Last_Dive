import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import { useClue } from '../../context/ClueContext'
import CreatureCard from '../ui/CreatureCard'
import bubbleBurst from '../../assets/lottie/bubble-burst.json'

const DEEP_CREATURES = [
  {
    name: 'Anglerfish',
    description: '"A female anglerfish. So patient in the dark. She hangs there like a trap. What is she waiting for? What is... everything waiting for?"',
    icon: '🐡',
    color: '#00FF9F',
  }
]


export default function MidnightZone({ scrollData }) {
  const [hoveredClue, setHoveredClue] = useState(false)
  const { collectedClues, collectClue } = useClue()
  const isCollected = collectedClues.hull

  const progress = scrollData?.progress || 0
  // Shadow grows as you descend through the zone
  const shadowOpacity = Math.min(1, Math.max(0, (progress - 0.3) / 0.3))

  const fishSwarm = [
    { id: 1, top: '10%', left: '5%', width: 110, duration: 24, delay: 0, opacity: 0.15, flip: true, blur: 2.5 },
    { id: 2, top: '24%', left: '68%', width: 150, duration: 28, delay: 5, opacity: 0.2, flip: false, blur: 1.8 },
    { id: 3, top: '50%', left: '12%', width: 220, duration: 35, delay: 2, opacity: 0.3, flip: true, blur: 1.2 },
    { id: 4, top: '66%', left: '72%', width: 130, duration: 21, delay: 7, opacity: 0.18, flip: false, blur: 2.0 },
  ]

  return (
    <section
      id="midnight"
      className="relative min-h-[180vh] py-32 flex flex-col items-center"
      style={{
        background: 'linear-gradient(180deg, #06111C 0%, #030810 100%)',
      }}
      aria-label="Midnight Zone - The Second Clue"
    >
      {/* Massive ambient shadow growing from below */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-full pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, transparent 60%)',
          opacity: shadowOpacity
        }}
      />

      {/* Random ambient bursts */}
      {scrollData && scrollData.zoneIndex === 2 && (
        <div className="fixed top-1/4 right-1/4 pointer-events-none z-20">
          <Player src={bubbleBurst} autoplay loop style={{ width: 100, height: 100, opacity: 0.15 }} />
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
        {fishSwarm.map((fish) => (
          <motion.img
            key={fish.id}
            src="/dangerous_fish.png"
            alt=""
            className="absolute select-none"
            style={{
              top: fish.top,
              left: fish.left,
              width: fish.width,
              opacity: fish.opacity,
              transform: fish.flip ? 'scaleX(-1)' : 'scaleX(1)',
              filter: `blur(${fish.blur}px) brightness(0.8) contrast(1.1) drop-shadow(0 10px 10px rgba(0,0,0,0.5))`,
            }}
            animate={{
              x: fish.flip ? [-40, 220, 180, 260, -40] : [40, -180, -140, -220, 40],
              y: [0, -18, 30, -5, 0],
              rotate: fish.flip ? [-3, 5, -8, 2, -3] : [3, -5, 8, -2, 3],
              scale: [1, 1.05, 0.98, 1.08, 1],
            }}
            transition={{
              duration: fish.duration,
              delay: fish.delay,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.4, 0.5, 0.8, 1],
            }}
          />
        ))}
      </div>


      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.img
          src="/dangerous_fish.png"
          alt="Dangerous deep sea fish"
          className="hidden lg:block absolute -top-12 -left-20 w-[min(480px,40vw)] scale-x-[-1] opacity-70 pointer-events-none select-none z-[4]"
          initial={{ opacity: 0, x: -120, scale: 0.85 }}
          whileInView={{ opacity: 0.7, x: 0, scale: 1 }}
          animate={{
            x: [-150, 60, 45, 120, -150],
            y: [0, -20, 15, -40, 0],
            rotate: [-6, 3, -8, 6, -6],
            scaleX: [1, 1.05, 0.98, 1.08, 1],
            opacity: [0.6, 0.9, 0.7, 0.95, 0.6],
          }}
          transition={{
             x: { duration: 28, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.35, 0.7, 1] },
             y: { duration: 22, repeat: Infinity, ease: "easeInOut" },
             rotate: { duration: 25, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.35, 0.8, 1] },
             scaleX: { duration: 28, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.35, 0.7, 1] },
             opacity: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            transformOrigin: "center",
            filter: "brightness(0.85) contrast(1.2) saturate(0.9) drop-shadow(10px 15px 20px rgba(0,0,0,0.7)) blur(0.5px)",
          }}
        />

        {/* Interactive Clue Left Column */}
        <motion.div
          className="relative flex justify-center items-center min-h-[300px] lg:h-[500px]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        >
          {/* Shattered Submarine SVG */}
          <motion.div
            className="relative cursor-pointer z-10"
            onClick={() => collectClue('hull')}
            onHoverStart={() => setHoveredClue(true)}
            onHoverEnd={() => setHoveredClue(false)}
            onTouchStart={() => setHoveredClue(true)}
            onTouchEnd={() => setTimeout(() => setHoveredClue(false), 3000)}
            whileHover={{ scale: 1.05 }}
            animate={{ y: [-15, 15, -15], rotateZ: [1, -1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* The Clue Tooltip */}
            <motion.div
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-72 p-4 glass rounded-lg border border-[#00FF9F]/30 pointer-events-none z-20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: hoveredClue ? 1 : 0, y: hoveredClue ? 0 : 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-[10px] font-mono tracking-widest mb-2 border-b pb-1 flex justify-between items-center" style={{ color: isCollected ? '#00FF9F' : '#00FF9F', borderColor: isCollected ? '#00FF9F60' : '#00FF9F30' }}>
                <span>CLUE 02: {isCollected ? 'COLLECTED' : 'THE NEREID'}</span>
                {isCollected && <span className="text-[8px]">✓</span>}
              </div>
              <p className="text-xs text-white/80 font-light italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                "The titanium hull is shredded. Standard atmospheric pressure crush doesn't create horizontal slash patterns..."
              </p>
            </motion.div>

            {/* Submarine SVG Illustration */}
            <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: hoveredClue ? 'drop-shadow(0 0 25px rgba(0,255,159,0.4))' : 'drop-shadow(0 20px 30px rgba(0,0,0,0.9))', transition: 'filter 0.3s ease' }}>
              {/* Main Hull (Broken) */}
              <path d="M20,60 C20,30 60,30 100,30 L110,35 L120,30 C160,30 190,40 200,60 C190,80 160,90 120,90 L115,80 L105,90 C60,90 20,80 20,60 Z" fill="#222" stroke="#444" strokeWidth="2" />
              <path d="M60,20 L80,30 M150,25 L160,30" stroke="#444" strokeWidth="3" />
              {/* Viewport (Dark/Broken) */}
              <circle cx="170" cy="60" r="15" fill="#111" stroke="#333" strokeWidth="3" />
              {/* Slashes / Monster Damage */}
              <path d="M80,40 C100,45 120,40 140,50" stroke="#00FF9F" strokeWidth="3" strokeLinecap="round" opacity="0.6" filter="blur(1px)" />
              <path d="M75,55 C105,65 130,55 150,70" stroke="#00FF9F" strokeWidth="4" strokeLinecap="round" opacity="0.8" filter="blur(1px)" />
              <path d="M70,70 C90,75 110,70 130,85" stroke="#00FF9F" strokeWidth="2" strokeLinecap="round" opacity="0.5" filter="blur(1px)" />

              {/* Torn Metal details */}
              <path d="M110,35 L115,50 L105,60 L120,70 L115,80" stroke="#111" strokeWidth="4" fill="none" />
            </svg>

            {/* Glowing hint indicator */}
            {!hoveredClue && !isCollected && (
              <motion.div
                className="absolute inset-0 rounded-full border border-[#00FF9F] mix-blend-screen"
                animate={{ scale: [1, 1.2, 1.4], opacity: [0.6, 0.2, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* Narrative Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="text-[10px] tracking-[0.5em] mb-4" style={{ color: '#00FF9F' }}>
            ZONE 03 • 1000-4000M
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-widest mb-8" style={{ color: '#E0F7FA', fontFamily: "'Cinzel', serif" }}>
            MIDNIGHT
          </h2>

          <div className="space-y-6 text-base md:text-lg font-light italic" style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(224, 247, 250, 0.7)' }}>
            <p>"1,000 meters down. The crushing weight of the ocean is absolute. Nothing could survive here."</p>
            <p>"I found the Nereid. Elena's submarine."</p>
            <p className="text-[#00FF9F] font-normal">"Her hull is compressed like a tin can... but whatever did this wasn't pressure. Pressure doesn't leave teeth marks."</p>
          </div>

          {/* Darkness indicator */}
          <motion.div
            className="mt-12 inline-flex items-center gap-3 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(0,255,159,0.1)]"
            style={{ border: '1px solid rgba(0,255,159,0.2)', background: 'rgba(0,0,0,0.5)' }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00FF9F', boxShadow: '0 0 10px #00FF9F' }} />
            <span className="text-[10px] tracking-[0.3em] font-mono font-bold" style={{ color: '#00FF9F' }}>BIOLUMINESCENCE DETECTED</span>
          </motion.div>
        </motion.div>

      </div>

      {/* Creature flip cards - Anglerfish only */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 mt-32 flex justify-center">
        {DEEP_CREATURES.map((creature, i) => (
          <motion.div
            key={creature.name}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <CreatureCard
              name={creature.name}
              description={creature.description}
              icon={creature.icon}
              color={creature.color}
            />
          </motion.div>
        ))}
      </div>

    </section>
  )
}
