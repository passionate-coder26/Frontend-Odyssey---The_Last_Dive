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
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative max-w-2xl w-full glass p-8 rounded-2xl border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden"
          >
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

            <div className="space-y-6 font-mono text-sm leading-relaxed text-white/70">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 border-l-2 border-white/10 pl-4 py-1"
              >
                <span className="text-[#4FC3F7] min-w-[60px]">01 TANK</span>
                <p>"Valve forced closed from the exterior. She was being locked in... or out."</p>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex gap-4 border-l-2 border-white/10 pl-4 py-1"
              >
                <span className="text-[#00FF9F] min-w-[60px]">02 HULL</span>
                <p>"Titanium shredded like paper by organic mandibles. Pressure did not do this."</p>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.9 }}
                className="flex gap-4 border-l-2 border-white/10 pl-4 py-1"
              >
                <span className="text-red-500 min-w-[60px]">03 NOTE</span>
                <p className="italic text-white">"It's not a monster... it's beautiful. It's ancient. And it has been waiting for us."</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5 }}
                className="mt-12 p-6 bg-red-500/5 rounded-lg border border-red-500/20"
              >
                <span className="text-red-500 text-[10px] tracking-[0.3em] font-bold block mb-4 uppercase">Data Synthesis Conclusion</span>
                <p className="text-red-400 text-lg italic leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                  "Elena wasn't taken by force. She was claimed. Biometric echoes at the trench bottom show her heart rate stopped for seven minutes... before restarting as a chorus of a thousand pulses."
                </p>
                <p className="mt-4 text-red-600 font-bold text-xl tracking-widest text-right">
                  SHE HAS BECOME THE ABYSS.
                </p>
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
