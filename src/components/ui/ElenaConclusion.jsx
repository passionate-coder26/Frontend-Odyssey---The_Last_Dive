import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClue } from '../../context/ClueContext'

export default function ElenaConclusion() {
  const { collectedClues } = useClue()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const allCollected = Object.values(collectedClues).every(Boolean)

  useEffect(() => {
    if (allCollected && !dismissed) {
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [allCollected, dismissed])

  if (!show) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
        >
          {/* Static Background Effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uWUqnW6re/giphy.gif')] bg-cover" />

          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="relative max-w-2xl w-full bg-[#0a0505]/95 p-12 rounded-lg border border-red-900 shadow-[0_0_80px_rgba(220,38,38,0.15)] overflow-hidden"
          >
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            {/* Flickering Red Header */}
            <motion.div 
              animate={{ opacity: [1, 0.8, 1, 0.5, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
              className="text-red-500 text-xs font-mono tracking-[0.5em] mb-6 flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              SYSTEM OVERRIDE: LOG_SYNTHESIS_77-B
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-8 tracking-tighter" style={{ fontFamily: "'Cinzel', serif" }}>
              THE FATE OF ELENA VASQUEZ
            </h2>

            <div className="space-y-4 font-mono text-xs leading-relaxed">
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-6 border-l-2 border-red-900/40 pl-6 py-2 bg-white/[0.02] items-start"
              >
                <div className="flex flex-col min-w-[80px]">
                  <span className="text-red-500 font-bold opacity-50 text-[10px]">TRACE 01</span>
                  <span className="text-[#4FC3F7] font-bold">TANK</span>
                </div>
                <p className="text-white/80">"Valve forced closed from the exterior. She was being locked in... or out."</p>
              </motion.div>
 
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex gap-6 border-l-2 border-red-900/40 pl-6 py-2 bg-white/[0.02] items-start"
              >
                <div className="flex flex-col min-w-[80px]">
                  <span className="text-red-500 font-bold opacity-50 text-[10px]">TRACE 02</span>
                  <span className="text-[#00FF9F] font-bold">HULL</span>
                </div>
                <p className="text-white/80">"Titanium shredded like paper by organic mandibles. Pressure did not do this."</p>
              </motion.div>
 
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.9 }}
                className="flex gap-6 border-l-2 border-red-900/40 pl-6 py-2 bg-white/[0.02] items-start"
              >
                <div className="flex flex-col min-w-[80px]">
                  <span className="text-red-500 font-bold opacity-50 text-[10px]">TRACE 03</span>
                  <span className="text-red-500 font-bold">NOTE</span>
                </div>
                <p className="italic text-white">"It's not a monster... it's beautiful. It's ancient. And it has been waiting for us."</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.5, duration: 0.8 }}
                className="mt-10 p-8 bg-red-950/20 rounded-lg border border-red-600/30 relative"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                <span className="text-red-500 text-[10px] tracking-[0.4em] font-bold block mb-4 uppercase opacity-80">
                  Data Synthesis Conclusion
                </span>
                <p className="text-red-400 text-xl italic leading-relaxed font-serif">
                  "Elena wasn't taken by force. She was claimed. Biometric echoes at the trench bottom show her heart rate stopped for seven minutes... before restarting as a chorus of a thousand pulses."
                </p>
                <motion.p 
                  animate={{ opacity: [1, 0.6, 1] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-6 text-red-600 font-bold text-2xl tracking-[0.2em] text-right"
                >
                  SHE HAS BECOME THE ABYSS.
                </motion.p>
              </motion.div>
            </div>


            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(239,68,68,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShow(false)
                setDismissed(true)
              }}
              className="mt-12 w-full py-4 border border-red-500/50 text-red-500 font-mono text-xs tracking-widest uppercase hover:text-white transition-colors"
            >
              [ DISMISS LOG AND CONTINUE DESCENT ]
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
