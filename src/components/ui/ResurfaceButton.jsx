import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import bubblesAnimation from '../../assets/lottie/bubbles.json'
import bubbleBurst from '../../assets/lottie/bubble-burst.json'

export default function ResurfaceButton({ visible }) {
  const [isResurfacing, setIsResurfacing] = useState(false)

  const handleResurface = () => {
    setIsResurfacing(true)
    
    // Dispatch event to trigger Kraken goodbye wave in HadalZone
    window.dispatchEvent(new Event('kraken-wave'))
    
    // Wait for the Kraken to wave before swooping up
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }, 2000)

    // Reset state after reaching surface
    setTimeout(() => setIsResurfacing(false), 5000)
  }

  return (
    <>
      <AnimatePresence>
        {visible && !isResurfacing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 159, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResurface}
            className="relative px-8 py-4 rounded-full font-bold text-xs md:text-sm tracking-[0.3em] cursor-pointer overflow-hidden animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 159, 0.2), rgba(0, 255, 159, 0.05))',
              border: '2px solid rgba(0, 255, 159, 0.6)',
              color: '#00FF9F',
              boxShadow: '0 0 15px rgba(0, 255, 159, 0.3), inset 0 0 10px rgba(0, 255, 159, 0.2)'
            }}
            aria-label="Resurface to the top"
          >
            {/* Lottie bubbles inside button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
              <Player
                src={bubblesAnimation}
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            
            <span className="relative z-10 text-white drop-shadow-[0_0_8px_#00FF9F]">🌊 Surface — Tell The World</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full screen atmospheric burst during resurface */}
      <AnimatePresence>
        {isResurfacing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, rgba(0, 255, 159, 0.1) 0%, transparent 70%)' }}
          >
            <Player
              src={bubbleBurst}
              autoplay
              loop={false}
              style={{ width: '100vw', height: '100vh', opacity: 0.8 }}
            />
            <motion.div
              className="absolute text-xl md:text-2xl font-bold tracking-[0.4em]"
              style={{ color: '#00FF9F', textShadow: '0 0 20px #00FF9F' }}
              animate={{ opacity: [0, 1, 0], y: [20, 0, -50], scale: [0.9, 1, 1.1] }}
              transition={{ duration: 3, delay: 1 }}
            >
              TELLING THE WORLD...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
