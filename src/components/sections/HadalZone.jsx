import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ResurfaceButton from '../ui/ResurfaceButton'

const NARRATIVE_WORDS = [
  'Elena', 'was', 'right.', 'It', 'wasn\'t', 'the', 'pressure.',
  'It', 'isn\'t', 'a', 'monster.', 'It', 'is', 'ancient.',
  'It', 'is', 'beautiful.', 'And', 'it', 'has', 'been',
  'waiting', 'for', 'us...', 'to', 'just', 'look.'
]

// Epilogue typewriter component
function EpilogueTypewriter({ onComplete }) {
  const lines = [
    "Jacques Morel's boat was found empty.",
    "200 miles off the Pacific coast.",
    "No distress signal. No debris.",
    "No body ever recovered.",
    "",
    "His daughter Sophie received a package",
    "the next morning.",
    "No return address.",
    "",
    "Inside:",
    "A single deep-sea flower.",
    "Species unknown to science.",
    "Still alive. Still glowing.",
    "",
    "And a note in her father's handwriting:",
    "",
    "'I found everything, ma chérie.",
    "Everything.",
    "— Papa'",
    "",
    "Sophie walked to the beach.",
    "Stood where she stood at age 5.",
    "Looked at the ocean.",
    "",
    "'Thank you' she whispered.",
    "",
    "Far below, at 11,000 meters —",
    "something pulsed with warm gold light.",
    "",
    "Once.",
    "",
    "For her."
  ]

  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (visibleLines < lines.length) {
      const timer = setTimeout(() => {
        setVisibleLines(v => v + 1)
      }, visibleLines === 0 ? 1000 : 600)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(onComplete, 3000)
      return () => clearTimeout(timer)
    }
  }, [visibleLines, lines.length, onComplete])

  return (
    <div className="space-y-2 text-left max-h-screen overflow-hidden">
      {lines.slice(0, visibleLines).map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`font-serif ${line.startsWith("'") ? 'text-yellow-300 italic text-xl' :
            line === 'Once.' ? 'text-yellow-400 text-2xl text-center mt-8' :
              line === 'For her.' ? 'text-yellow-300 text-2xl text-center' :
                line === '' ? 'h-4' :
                  'text-white/80'
            }`}
        >
          {line}
        </motion.p>
      ))}
      {visibleLines === lines.length && (
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-2 h-6 bg-white inline-block"
        />
      )}
    </div>
  )
}

// Final screen text reveal
function FinalTextReveal() {
  const lines = [
    { text: "The ocean covers 71% of our planet.", delay: 1 },
    { text: "95% remains unexplored.", delay: 3 },
    { text: "We spent centuries fearing the deep.", delay: 5 },
    { text: "And still —", delay: 8 },
    { text: "when a frightened old man showed", delay: 9.5 },
    { text: "the oldest creature on Earth", delay: 11 },
    { text: "a photograph of his daughter —", delay: 12.5 },
    { text: "it understood.", delay: 14, gold: true },
    { text: "It has always understood.", delay: 16, gold: true },
    { text: "We just never stayed long enough", delay: 18 },
    { text: "to find out.", delay: 19.5 },
    { text: "REST DEEP, JACQUES MOREL.", delay: 23, big: true },
    { text: "THE OCEAN REMEMBERS.", delay: 25, big: true },
    { text: "THE KRAKEN REMEMBERS.", delay: 27, big: true },
    { text: "SOPHIE REMEMBERS.", delay: 29, big: true, gold: true },
  ]

  return (
    <div className="text-center space-y-4 max-w-2xl">
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: line.delay, duration: 1 }}
          className={`
            ${line.big ? 'text-2xl font-bold tracking-widest font-mono' : 'text-lg font-serif'}
            ${line.gold ? 'text-yellow-400' : 'text-white/80'}
          `}
        >
          {line.text}
        </motion.p>
      ))}

      {/* Final gold pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 32, duration: 2, repeat: Infinity, repeatDelay: 1 }}
        className="mt-12 w-4 h-4 rounded-full mx-auto"
        style={{ background: '#ffd700', boxShadow: '0 0 30px #ffd700' }}
      />
    </div>
  )
}

export default function HadalZone({ scrollData }) {
  let cumulativeDelay = 0;

  const getDelay = (word) => {
    let pause = 0.15;

    if (word.includes('right.')) pause += 0.5;
    if (word.includes('pressure.')) pause += 0.3;
    if (word.includes('ancient.')) pause += 0.5;
    if (word.includes('beautiful.')) pause += 0.7;
    if (word.includes('us...')) pause += 0.9;

    const currentDelay = cumulativeDelay;
    cumulativeDelay += pause;

    return currentDelay;
  };


  const [visibleWords, setVisibleWords] = useState(0)
  const [endingPhase, setEndingPhase] = useState(null) // null, 'terror', 'frightened', 'photograph', 'recognition', 'elena', 'message', 'farewell', 'epilogue', 'final'
  const [typewriterIndex, setTypewriterIndex] = useState(0)

  const progress = scrollData?.progress || 0

  // Calculate Eye open percentage - rapid open towards the very bottom (0.85 -> 1.0)
  const eyeOpenProgress = Math.min(1, Math.max(0, (progress - 0.85) / 0.15))

  useEffect(() => {
    if (!scrollData) return

    // Reset ending if user scrolls back up
    if (scrollData.progress < 0.95 && endingPhase) {
      setEndingPhase(null)
      return
    }

    if (scrollData.zoneIndex < 4) return
    const zoneProgress = Math.min(Math.max((scrollData.progress - 0.2) / 0.6, 0), 1)
    const wordCount = Math.floor(zoneProgress * NARRATIVE_WORDS.length)
    setVisibleWords(wordCount)

    // Trigger ending sequence at the absolute bottom
    if (scrollData.progress > 0.99 && !endingPhase) {
      setEndingPhase('terror')
    }
  }, [scrollData, endingPhase])

  // Phase transition logic
  useEffect(() => {
    if (!endingPhase) return

    let timer
    if (endingPhase === 'terror') {
      timer = setTimeout(() => setEndingPhase('frightened'), 6000) // Flicker (2s) + Black (3s) + Eye (1s)
    } else if (endingPhase === 'frightened') {
      timer = setTimeout(() => setEndingPhase('photograph'), 9000) // Flicker (2s) + Black (3s) + Eye (1s)
    } else if (endingPhase === 'photograph') {
      timer = setTimeout(() => setEndingPhase('recognition'), 8000) // Photo (3s) + Stillness (5s)
    } else if (endingPhase === 'recognition') {
      timer = setTimeout(() => setEndingPhase('elena'), 6000) // Color shift + Recognition
    } else if (endingPhase === 'elena') {
      // Waiting for user to click camera
    } else if (endingPhase === 'farewell') {
      timer = setTimeout(() => setEndingPhase('epilogue'), 8000)
    }

    return () => clearTimeout(timer)
  }, [endingPhase])

  const showResurface = progress > 0.95 && !endingPhase

  cumulativeDelay = 0;

  return (
    <section
      id="hadal"
      className="relative min-h-[160vh] py-32 flex flex-col items-center overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #010306 0%, rgba(0, ${Math.floor(40 * progress)}, ${Math.floor(25 * progress)}, 0.9) 100%)`,
      }}
      aria-label="Hadal Zone - The Kraken"
    >
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center pt-20">

        {/* Zone header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-[10px] tracking-[0.5em] mb-4" style={{ color: '#00FF9F' }}>
            ZONE 05 • 6000-11000M
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-widest mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
            <span style={{
              background: 'linear-gradient(135deg, #FFF, #00FF9F)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              CHALLENGER DEEP
            </span>
          </h2>
          <div className="text-xs tracking-[0.4em] font-mono" style={{ color: 'rgba(0, 255, 159, 0.4)' }}>
            11,000 METERS
          </div>
        </motion.div>

        {/* Word-by-word narrative - Epic realization */}
        <div className="my-24 min-h-[160px] max-w-2xl mx-auto">
          <p className="text-xl md:text-3xl leading-relaxed italic font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
            {NARRATIVE_WORDS.map((word, i) => (
              <React.Fragment key={i}>
                <motion.span
                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  animate={{
                    opacity: i < visibleWords ? 1 : 0,
                    y: i < visibleWords ? 0 : 10,
                    filter: i < visibleWords ? 'blur(0px)' : 'blur(5px)'
                  }}
                  transition={{
                    duration: 0.6,
                    delay: getDelay(word),
                    ease: "easeOut"
                  }}
                  className="inline-block mb-2"
                  style={{
                    color: i >= 21 ? '#00FF9F' : 'rgba(255, 255, 255, 0.9)',
                    textShadow: i >= 21 ? '0 0 20px rgba(0,255,159,0.5)' : 'none'
                  }}
                >
                  {word}
                </motion.span>
                {' '}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* The Kraken SVG Illustration */}
      <div className="absolute bottom-0 left-0 right-0 h-screen flex justify-center items-end pointer-events-none z-10">
        <motion.div
          className="relative w-full max-w-4xl flex justify-center items-end opacity-90"
          style={{ y: (1 - eyeOpenProgress) * 200 }} // Rises from bottom
        >
          {/* Eye Glow - Intensifies as eye opens */}
          <motion.div
            className="absolute bottom-40 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,159,0.4) 0%, transparent 60%)',
              opacity: eyeOpenProgress,
              scale: 0.5 + eyeOpenProgress
            }}
          />

          <svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10" style={{ filter: 'drop-shadow(0 -20px 50px rgba(0,255,159,0.2))' }}>
            {/* Giant Head / Mantle outline blending into black */}
            <path d="M50,400 C80,250 200,100 300,100 C400,100 520,250 550,400" stroke="#00FF9F" strokeWidth="2" opacity="0.3" fill="url(#krakenGrad)" />

            {/* The Eye Socket */}
            <ellipse cx="300" cy="250" rx="120" ry="60" fill="#02050A" stroke="#00FF9F" strokeWidth="3" opacity="0.5" />

            {/* The Eye Itself - Scales open */}
            <g style={{ transform: `scale(1, ${Math.max(0.01, eyeOpenProgress)})`, transformOrigin: '300px 250px', transition: 'transform 0.1s linear' }}>
              <ellipse cx="300" cy="250" rx="100" ry="50" fill="#0A3A25" />
              {/* Iris */}
              <circle cx="300" cy="250" r="40" fill="#00FF9F" filter="blur(2px)" />
              {/* Glowing Pupil Slit (Cuttlefish W-shape or just horizontal) */}
              <path d="M260,250 Q280,240 300,250 Q320,260 340,250 Q320,240 300,250 Q280,260 260,250 Z" fill="#FFF" filter="blur(1px)" />

              {/* Bioluminescent flecks in the eye */}
              <circle cx="280" cy="240" r="4" fill="#E0F7FA" opacity="0.8" />
              <circle cx="310" cy="265" r="2" fill="#00FF9F" opacity="0.8" />
            </g>

            {/* Bioluminescent patterns on skin */}
            <g opacity={0.3 + eyeOpenProgress * 0.7} style={{ transition: 'opacity 0.3s' }}>
              <circle cx="200" cy="180" r="5" fill="#00FF9F" filter="blur(2px)" />
              <circle cx="150" cy="250" r="8" fill="#00FF9F" filter="blur(3px)" />
              <circle cx="180" cy="300" r="4" fill="#00FF9F" filter="blur(1px)" />

              <circle cx="400" cy="180" r="5" fill="#00FF9F" filter="blur(2px)" />
              <circle cx="450" cy="250" r="8" fill="#00FF9F" filter="blur(3px)" />
              <circle cx="420" cy="300" r="4" fill="#00FF9F" filter="blur(1px)" />

              <path d="M120,380 C110,360 80,390 70,380" stroke="#00FF9F" strokeWidth="3" strokeLinecap="round" opacity="0.5" filter="blur(1px)" />
              <path d="M480,380 C490,360 520,390 530,380" stroke="#00FF9F" strokeWidth="3" strokeLinecap="round" opacity="0.5" filter="blur(1px)" />
            </g>

            <defs>
              <linearGradient id="krakenGrad" x1="300" y1="100" x2="300" y2="400" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FF9F" stopOpacity="0.1" />
                <stop offset="1" stopColor="#010306" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Floating bio-particles rising upwards towards the end */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {Array.from({ length: 40 }, (_, i) => (
          <motion.div
            key={`bio-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: '#00FF9F',
              boxShadow: '0 0 10px #00FF9F',
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 20 - 10}%`,
            }}
            animate={{
              y: [0, -(Math.random() * 1000 + 500)],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Resurface Button Area at very bottom */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center z-30 pointer-events-auto">
        <ResurfaceButton visible={showResurface} />
      </div>

      {/* Deep vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, #010306 100%)',
        }}
      />

      {/* --- CINEMATIC ENDING OVERLAYS --- */}
      <AnimatePresence>
        {endingPhase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[2000] bg-black flex items-center justify-center overflow-hidden"
          >
            {/* PHASE 1: TERROR */}
            {endingPhase === 'terror' && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* IMMEDIATE text to hold user attention during delay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 4, times: [0, 0.1, 0.8, 1] }}
                  className="absolute inset-0 flex flex-col items-center 
      justify-center z-40 text-center px-8"
                >
                  <motion.p
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-red-500 font-mono text-xs 
        tracking-[0.5em] uppercase mb-8"
                  >
                    ⚠ WARNING — CRITICAL DEPTH REACHED
                  </motion.p>
                  <p className="text-white/20 font-mono text-xs tracking-widest">
                    Jacques' torch is failing...
                  </p>
                </motion.div>
                {/* Torch flickering and dying */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1, 0.2, 0] }}
                  transition={{ duration: 2, times: [0, 0.1, 0.2, 0.5, 1] }}
                  className="absolute inset-0 z-50 pointer-events-none"
                  style={{ background: 'radial-gradient(circle 200px at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 100%)' }}
                />

                {/* Total black for 3 seconds happens via background of parent motion.div */}

                {/* The Eye Opens */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 4, duration: 1 }}
                  className="relative z-10 w-full max-w-4xl"
                >
                  <svg viewBox="0 0 800 600" className="w-full h-full">
                    {/* Giant Eye */}
                    <motion.g
                      initial={{ scaleY: 0.01 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 5, duration: 0.5, ease: "circOut" }}
                      style={{ transformOrigin: '400px 300px' }}
                    >
                      <ellipse cx="400" cy="300" rx="300" ry="150" fill="#200" stroke="#f00" strokeWidth="2" opacity="0.6" />
                      <circle cx="400" cy="300" r="120" fill="#700" />
                      <motion.rect
                        x="390" y="200" width="20" height="200" rx="10" fill="#000"
                        animate={{ scaleX: [1, 0.2, 1] }}
                        transition={{ delay: 5.5, duration: 0.4 }}
                      />
                    </motion.g>

                    {/* Tentacles Erupting */}
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 6 }}
                    >
                      {/* Placeholder paths for tentacles with "scars" */}
                      {[...Array(8)].map((_, i) => (
                        <motion.path
                          key={i}
                          d={`M ${100 + i * 100} 600 Q ${400} ${300} ${Math.random() * 800} ${Math.random() * 600}`}
                          stroke="rgba(255, 50, 50, 0.4)"
                          strokeWidth={40 + Math.random() * 60}
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 6 + i * 0.1, duration: 1 }}
                        />
                      ))}
                    </motion.g>
                  </svg>
                </motion.div>

                {/* Glitched UI */}
                <div className="absolute top-8 right-8 font-mono text-red-500 text-right space-y-2">
                  <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.1 }}>
                    CRITICAL FAILURE
                  </motion.div>
                  <div className="text-2xl">O2: 4%</div>
                  <motion.div
                    animate={{ x: [-2, 2, -2], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.05 }}
                    className="text-xl"
                  >
                    DEPTH: 11,042m ERROR
                  </motion.div>
                </div>
              </div>
            )}

            {/* PHASE 1.5: FRIGHTENED */}
            {endingPhase === 'frightened' && (
              <div className="relative w-full h-full flex items-center 
  justify-center overflow-hidden">

                {/* Kraken eye still visible - watching */}
                <div className="absolute inset-0 flex items-center 
    justify-center opacity-40">
                  <svg viewBox="0 0 800 600" className="w-full h-full">
                    <ellipse cx="400" cy="300" rx="300" ry="150"
                      fill="#200" stroke="#f00" strokeWidth="2" />
                    <circle cx="400" cy="300" r="120" fill="#700" />
                    <rect x="390" y="200" width="20" height="200"
                      rx="10" fill="#000" />
                  </svg>
                </div>

                {/* Screen shake - fear */}
                <motion.div
                  animate={{ x: [-3, 3, -2, 2, 0], y: [-2, 2, -1, 1, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="relative z-10 flex flex-col items-center"
                >
                  {/* Jacques silhouette - frozen in fear */}
                  <motion.div
                    animate={{ rotate: [-2, 2, -2], scale: [1, 0.98, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <svg viewBox="0 0 100 200" width="100" height="200">
                      <path
                        d="M50,20 Q65,20 70,40 L72,100 L65,180 
            L35,180 L28,100 L30,40 Q35,20 50,20 Z"
                        fill="#111"
                      />
                      <circle cx="50" cy="15" r="14" fill="#111" />
                      {/* Arms raised in shock */}
                      <path
                        d="M30,50 L10,30 M70,50 L90,30"
                        stroke="#111"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M40,100 L38,150 M60,100 L62,150"
                        stroke="#111"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <path d="M34,150 L28,170 L44,165 Z" fill="#0A0A0A" />
                      <path d="M56,150 L62,170 L46,165 Z" fill="#111" />
                    </svg>
                  </motion.div>

                  {/* Heartbeat */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 w-64"
                  >
                    <svg viewBox="0 0 200 40" className="w-full">
                      <motion.path
                        d="M0,20 L30,20 L40,5 L50,35 L60,20 
            L80,20 L90,5 L100,35 L110,20 L200,20"
                        stroke="#ff0000"
                        strokeWidth="2"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                      />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Jacques' thoughts - key change here */}
                <div className="absolute bottom-0 left-0 right-0 
    p-12 text-center">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-white/60 font-serif text-xl 
        italic mb-4"
                  >
                    "It's real. It's actually real."
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="text-white/40 font-serif text-lg 
        italic mb-4"
                  >
                    "I can't move. I can't breathe."
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5, duration: 1 }}
                    className="text-white/60 font-serif text-lg italic"
                  >
                    "I closed my eyes."
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 5, duration: 1 }}
                    className="text-white/40 font-serif text-base 
        italic mt-3"
                  >
                    "I reached inside my jacket."
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 5.8, duration: 1 }}
                    className="text-white/30 font-serif text-base 
        italic mt-2"
                  >
                    "If this was the end —"
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 6.5, duration: 1 }}
                    className="text-yellow-300/70 font-serif text-lg 
        italic mt-2"
                  >
                    "I wanted her face to be the last thing I saw."
                  </motion.p>
                </div>

                {/* O2 warning */}
                <div className="absolute top-8 right-8 font-mono text-right">
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                    className="text-red-500 text-sm"
                  >
                    O2: 4% — CRITICAL
                  </motion.div>
                </div>
              </div>
            )}

            {/* PHASE 2: THE PHOTOGRAPH */}
            {endingPhase === 'photograph' && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Enormous Eye (Frozen) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-60">
                  <svg viewBox="0 0 800 600" className="w-full h-full">
                    <ellipse cx="400" cy="300" rx="300" ry="150" fill="#200" stroke="#f00" strokeWidth="2" />
                    <circle cx="400" cy="300" r="120" fill="#700" />
                    <rect x="390" y="200" width="20" height="200" rx="10" fill="#000" />
                  </svg>
                </div>

                {/* Jacques' Hand with Photograph */}
                <motion.div
                  initial={{ y: 500, rotate: -20 }}
                  animate={{ y: 100, rotate: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="relative z-50"
                >
                  <div className="w-64 h-80 bg-white p-4 shadow-2xl skew-x-1 skew-y-1 border-8 border-gray-200">
                    <div className="w-full h-full bg-[#333] flex items-center justify-center overflow-hidden relative">
                      {/* Semi-transparent image placeholder representing Sophie */}
                      <div className="absolute inset-0 bg-sepia opacity-50 bg-[url('https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?q=80&w=500')] bg-cover bg-center" />
                      <div className="absolute bottom-2 left-2 text-[10px] text-white/50 font-serif">Sophie, 2022</div>
                    </div>
                  </div>
                  {/* Diver glove fingers */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#111] rounded-t-full border-t-4 border-gray-600 shadow-inner" />
                </motion.div>

                <div className="absolute bottom-10 text-white/30 font-mono text-xs tracking-widest uppercase">
                  Jacques reaches for the only thing that matters.
                </div>
              </div>
            )}

            {/* PHASE 3: RECOGNITION */}
            {endingPhase === 'recognition' && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* The Eye Transforms */}
                <motion.div
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <svg viewBox="0 0 800 600" className="w-full h-full">
                    <motion.ellipse
                      cx="400" cy="300" rx="300" ry="150"
                      animate={{ fill: ['#200', '#530', '#420'], stroke: ['#f00', '#fb0', '#fd0'] }}
                      transition={{ duration: 5 }}
                    />
                    <motion.circle
                      cx="400" cy="300" r="120"
                      animate={{ fill: ['#700', '#d80', '#fb0'] }}
                      transition={{ duration: 5 }}
                    />
                    <rect x="390" y="200" width="20" height="200" rx="10" fill="#000" />

                    {/* Bioluminescence transformation bubbles */}
                    {[...Array(20)].map((_, i) => (
                      <motion.circle
                        key={i}
                        cx={Math.random() * 800}
                        cy={Math.random() * 600}
                        r={Math.random() * 5 + 2}
                        animate={{
                          fill: ['#f00', '#0af', '#fb0'],
                          opacity: [0.2, 0.8, 0.2],
                          scale: [1, 1.5, 1]
                        }}
                        transition={{ duration: 4, delay: i * 0.1, repeat: Infinity }}
                      />
                    ))}
                  </svg>
                </motion.div>

                {/* Photograph still held */}
                <div className="relative z-50 scale-75 opacity-80">
                  <div className="w-64 h-80 bg-white p-4 shadow-2xl border-8 border-gray-200">
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?q=80&w=500')] bg-cover bg-center" />
                  </div>
                </div>

                <div className="absolute bottom-20 flex flex-col items-center gap-3 text-center px-6">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 2 }}
                    className="font-serif text-base italic"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    500 million years alone.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 2.5 }}
                    className="font-serif text-2xl italic"
                    style={{
                      color: '#fbbf24',
                      textShadow: '0 0 18px rgba(251,191,36,0.55), 0 0 40px rgba(251,191,36,0.2)'
                    }}
                  >
                    And now, for the first time — it understood.
                  </motion.p>
                </div>

              </div>
            )}

            {/* PHASE 4: ELENA REVEALED */}
            {endingPhase === 'elena' && (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-12 overflow-hidden">
                {/* Kraken moves aside */}
                <motion.div
                  animate={{ x: -1000, opacity: 0 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <svg viewBox="0 0 800 600" className="w-full h-full opacity-30">
                    <ellipse cx="400" cy="300" rx="300" ry="150" fill="#420" stroke="#fd0" strokeWidth="2" />
                    <circle cx="400" cy="300" r="120" fill="#fb0" />
                  </svg>
                </motion.div>

                {/* Elena reveal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: -80 }}
                  transition={{ delay: 1, duration: 2 }}
                  className="relative z-10 flex flex-col items-center"
                >

                  <div
                    className="mb-4 text-xs tracking-[0.35em] font-mono text-yellow-300/90 uppercase relative z-20"
                    style={{ textShadow: '0 0 10px rgba(255,200,0,0.45)' }}
                  >
                    Elena's Preserved Deep-Sea Dive Suit
                  </div>

                  {/* soft reveal glow behind suit */}
                  <div className="absolute inset-0 blur-3xl rounded-full bg-yellow-300/10 scale-125 z-0" />

                  <div className="absolute inset-0 pointer-events-none z-0">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-yellow-200/40"
                        style={{
                          width: `${Math.random() * 3 + 1}px`,
                          height: `${Math.random() * 3 + 1}px`,
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          filter: 'blur(1px)'
                        }}
                        animate={{
                          y: [0, -(Math.random() * 30 + 10)],
                          opacity: [0, 0.7, 0],
                        }}
                        transition={{
                          duration: Math.random() * 3 + 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>

                  {/* DIVER SUIT */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 0.5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 flex flex-col items-center"
                  >

                    <div className="relative w-[260px] h-[420px] mb-8">
                      <svg viewBox="0 0 260 420" className="w-full h-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
                        {/* tank behind */}
                        <rect x="98" y="78" width="64" height="122" rx="28" fill="#2e3440" stroke="#7c8596" strokeWidth="2" />
                        <rect x="110" y="62" width="40" height="24" rx="8" fill="#4b5563" />
                        <path d="M130 85 L130 115" stroke="#9ca3af" strokeWidth="4" />

                        {/* helmet outer */}
                        <circle cx="130" cy="82" r="52" fill="#394150" stroke="#bfa76a" strokeWidth="4" />

                        {/* visor */}
                        <ellipse cx="130" cy="85" rx="34" ry="28" fill="#8aa6bf" opacity="0.35" stroke="#d6e4f0" strokeWidth="2" />
                        <path d="M112 68 Q124 58 144 66" stroke="white" strokeWidth="3" opacity="0.35" fill="none" />

                        {/* helmet side bolts */}
                        <circle cx="88" cy="82" r="4" fill="#c9a94d" />
                        <circle cx="172" cy="82" r="4" fill="#c9a94d" />
                        <circle cx="130" cy="35" r="4" fill="#c9a94d" />

                        {/* neck ring */}
                        <rect x="104" y="126" width="52" height="16" rx="6" fill="#7b5e2e" stroke="#d4af37" strokeWidth="2" />

                        {/* torso */}
                        <path
                          d="M88 142
               Q96 132 108 132
               L152 132
               Q164 132 172 142
               L186 240
               Q188 258 175 270
               L85 270
               Q72 258 74 240
               Z"
                          fill="#4b5563"
                          stroke="#9ca3af"
                          strokeWidth="3"
                        />

                        {/* chest panel */}
                        <rect x="110" y="170" width="40" height="34" rx="6" fill="#1f2937" stroke="#6b7280" strokeWidth="2" />
                        <circle cx="120" cy="186" r="4" fill="#ef4444" />
                        <circle cx="130" cy="186" r="4" fill="#22c55e" />
                        <circle cx="140" cy="186" r="4" fill="#38bdf8" />

                        {/* hoses */}
                        <path d="M100 138 C90 155, 82 180, 84 205" stroke="#6b7280" strokeWidth="5" fill="none" />
                        <path d="M160 138 C170 155, 178 180, 176 205" stroke="#6b7280" strokeWidth="5" fill="none" />

                        {/* left arm */}
                        <path
                          d="M83 154 C58 175, 48 215, 56 248"
                          stroke="#7c8596"
                          strokeWidth="24"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <circle cx="58" cy="253" r="14" fill="#374151" stroke="#9ca3af" strokeWidth="2" />

                        {/* right arm */}
                        <path
                          d="M177 154 C202 175, 212 215, 204 248"
                          stroke="#7c8596"
                          strokeWidth="24"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <circle cx="204" cy="253" r="14" fill="#374151" stroke="#9ca3af" strokeWidth="2" />

                        {/* hips */}
                        <rect x="96" y="266" width="68" height="28" rx="10" fill="#374151" stroke="#9ca3af" strokeWidth="2" />

                        {/* left leg */}
                        <path
                          d="M112 292 L100 365"
                          stroke="#7c8596"
                          strokeWidth="28"
                          strokeLinecap="round"
                        />
                        <rect x="82" y="362" width="34" height="24" rx="8" fill="#1f2937" stroke="#9ca3af" strokeWidth="2" />

                        {/* right leg */}
                        <path
                          d="M148 292 L160 365"
                          stroke="#7c8596"
                          strokeWidth="28"
                          strokeLinecap="round"
                        />
                        <rect x="144" y="362" width="34" height="24" rx="8" fill="#1f2937" stroke="#9ca3af" strokeWidth="2" />

                        {/* subtle gold edge light */}
                        <path
                          d="M182 145 L190 240 Q192 262 175 274"
                          stroke="#fbbf24"
                          strokeWidth="3"
                          opacity="0.45"
                          fill="none"
                        />
                        <path
                          d="M153 133 Q165 133 172 143"
                          stroke="#fbbf24"
                          strokeWidth="3"
                          opacity="0.45"
                          fill="none"
                        />
                      </svg>
                    </div>

                    {/* NARRATIVE TEXT */}
                    <div className="max-w-md text-center text-white/50 text-sm italic mb-6 mt-2">
                      "Kraken kept it safe... Waiting for someone brave enough."
                    </div>

                    {/* CAMERA MODULE */}
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="relative flex flex-col items-center cursor-pointer group"
                      onClick={() => setEndingPhase('message')}
                    >
                      <div className="w-24 h-16 rounded-lg bg-slate-900 border border-yellow-500/30 group-hover:border-yellow-400 group-hover:shadow-[0_0_30px_rgba(255,200,0,0.3)] transition-all shadow-[0_0_20px_rgba(255,200,0,0.12)] flex items-center justify-center relative">
                        <div className="absolute left-3 w-3 h-3 rounded-full bg-red-600 animate-pulse group-hover:bg-red-500 group-hover:shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
                        <div className="w-8 h-8 rounded-full border-2 border-slate-500 bg-slate-800" />
                        <div className="absolute right-3 w-2 h-2 rounded-full bg-cyan-300/70" />
                      </div>

                      <div className="mt-4 font-mono text-[11px] tracking-[0.25em] text-yellow-300/80 text-center group-hover:text-yellow-300 transition-colors">
                        REC // UNIT 04-E // 847 DAYS
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4, duration: 1 }}
                        className="mt-4 text-[10px] tracking-widest text-white/50 uppercase group-hover:text-white transition-colors animate-pulse"
                      >
                         [ CLICK TO PLAY LAST LOG ]
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            )}

            {/* PHASE 5: JACQUES' FINAL MESSAGE */}
            {endingPhase === 'message' && (
              <div className="relative w-full h-full bg-[#050505] flex flex-col items-center justify-start pt-32 px-8">
                {/* Shaky camera effect overlay */}
                <motion.div
                  animate={{ x: [-1, 1, -0.5, 0.5, 0], y: [-1, 0.5, -0.5, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.2 }}
                  className="absolute inset-0 pointer-events-none border-4 border-red-900/10"
                />

                <div className="w-full max-w-2xl font-mono text-white/90 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-8">
                    <span className="text-red-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> REC
                    </span>
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-red-500"
                    >
                      O2: 2%
                    </motion.span>
                  </div>

                  <p className="text-xl md:text-2xl leading-relaxed">
                    "My name is Jacques Morel. 11,000 meters. O2 at 2%."
                  </p>

                  <p className="text-lg opacity-80 transition-opacity duration-1000">
                    "I found Elena. She is at peace."
                  </p>

                  <p className="text-lg opacity-80">
                    "I found the Kraken. Look at it. Really look. Every scar — we gave it. And still, when I showed it my daughter's photograph, it stopped. It understood love."
                  </p>

                  <p className="text-lg opacity-80">
                    "Sophie — ma chérie — you asked what was down here. Everything, I told you. I was right."
                  </p>

                  <p className="text-lg opacity-80">
                    "The ocean gave me my whole life. It is only right I give it back."
                  </p>

                  <p className="text-2xl font-bold mt-12">
                    "I love you. Tell the ocean thank you. — Papa"
                  </p>

                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 10, duration: 0.5 }}
                    className="text-3xl text-red-500 font-bold text-center mt-12"
                  >
                    O2: 1%
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 12 }}
                  className="mt-20 font-mono text-red-600 font-bold text-4xl"
                >
                  O2: 0%
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 14 }}
                  onClick={() => setEndingPhase('farewell')}
                  className="mt-12 px-8 py-4 border border-white/20 hover:border-white/50 text-white/50 hover:text-white transition-all text-xs tracking-[0.4em] uppercase"
                >
                  [ THE END ]
                </motion.button>
              </div>
            )}

            {/* PHASE 6: THE FAREWELL */}
            {endingPhase === 'farewell' && (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Deep ocean background */}
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(ellipse at center, #001a0a 0%, #000 100%)'
                }} />

                {/* Kraken tentacle wrapping */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                  className="absolute inset-0"
                >
                  <svg viewBox="0 0 800 600" className="w-full h-full">
                    {[...Array(5)].map((_, i) => (
                      <motion.path
                        key={i}
                        d={`M ${-100 + i * 200} 700 Q ${200 + i * 100} ${300 + i * 50} 400 300`}
                        stroke="#00FF9F"
                        strokeWidth="30"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.3 }}
                        transition={{ duration: 3, delay: i * 0.5 }}
                      />
                    ))}
                  </svg>
                </motion.div>

                {/* Jacques' silhouette glowing gold */}
                <motion.div
                  className="relative z-10 flex flex-col items-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Diver silhouette */}
                  <motion.div
                    animate={{
                      filter: [
                        'drop-shadow(0 0 5px rgba(0,255,159,0.3))',
                        'drop-shadow(0 0 30px rgba(255,200,0,0.8))',
                        'drop-shadow(0 0 60px rgba(255,200,0,1))'
                      ]
                    }}
                    transition={{ duration: 4, ease: "easeIn" }}
                  >
                    <svg viewBox="0 0 100 200" width="120" height="240">
                      {/* Body */}
                      <motion.path
                        d="M50,20 Q65,20 70,40 L72,100 L65,180 L35,180 L28,100 L30,40 Q35,20 50,20 Z"
                        animate={{ fill: ['#1a1a2e', '#ffd700', '#ffaa00'] }}
                        transition={{ duration: 4, ease: "easeIn" }}
                      />
                      {/* Head/Helmet */}
                      <motion.circle
                        cx="50" cy="15" r="14"
                        animate={{ fill: ['#1a1a2e', '#ffd700'] }}
                        transition={{ duration: 4 }}
                      />
                      {/* Arms outstretched peacefully */}
                      <motion.path
                        d="M30,60 L5,80 M70,60 L95,80"
                        stroke="#ffd700"
                        strokeWidth="8"
                        strokeLinecap="round"
                        animate={{ opacity: [0, 1] }}
                        transition={{ delay: 2, duration: 2 }}
                      />
                    </svg>
                  </motion.div>

                  {/* Gold bioluminescence spreading outward */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,200,0,0.4) 0%, transparent 70%)' }}
                    animate={{
                      width: ['100px', '600px'],
                      height: ['100px', '600px'],
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{ duration: 5, ease: "easeOut" }}
                  />
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3, duration: 2 }}
                  className="absolute bottom-20 text-center px-8"
                >
                  <p className="text-2xl font-serif italic" style={{ color: '#ffd700' }}>
                    "He became part of the deep."
                  </p>
                  <p className="text-sm mt-4 tracking-widest font-mono" style={{ color: 'rgba(255,200,0,0.4)' }}>
                    "Part of the ocean that made him."
                  </p>
                </motion.div>

                {/* Depth meter final reading */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 5, duration: 1 }}
                  className="absolute top-8 right-8 font-mono text-right"
                >
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: 2 }}
                    style={{ color: '#ffd700' }}
                  >
                    DIVER: J. MOREL
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 6, duration: 1 }}
                    style={{ color: '#ff0000' }}
                  >
                    O2: 0%
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 7, duration: 2 }}
                    style={{ color: '#ffd700' }}
                    className="text-lg"
                  >
                    THE DEEP REMEMBERS
                  </motion.div>
                </motion.div>
              </div>
            )}

            {/* EPILOGUE: THREE DAYS LATER */}
            {endingPhase === 'epilogue' && (
              <div className="relative w-full h-full bg-black flex items-center justify-center px-8">
                <div className="max-w-2xl text-center">
                  <EpilogueTypewriter onComplete={() => setEndingPhase('final')} />
                </div>
              </div>
            )}

            {/* FINAL SCREEN */}
            {endingPhase === 'final' && (
              <div className="relative w-full h-full bg-black flex flex-col items-center justify-center px-8">
                {/* Gold pulse from depth meter */}
                <motion.div
                  className="absolute rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(255,200,0,0.3) 0%, transparent 70%)' }}
                  animate={{
                    width: ['50px', '400px'],
                    height: ['50px', '400px'],
                    opacity: [0.8, 0]
                  }}
                  transition={{ duration: 2, repeat: 3, repeatDelay: 1 }}
                />

                {/* Final text word by word */}
                <FinalTextReveal />
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 35, duration: 1 }}
                  onClick={() => {
                    setEndingPhase(null)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="mt-16 px-8 py-4 border border-yellow-400/30 
  hover:border-yellow-400 text-yellow-400/50 
  hover:text-yellow-400 transition-all text-xs 
  tracking-[0.4em] uppercase font-mono"
                >
                  [ RETURN TO SURFACE ]
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
