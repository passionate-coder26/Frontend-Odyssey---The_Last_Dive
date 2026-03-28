import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { name: 'Surface', depth: 0 },
  { name: 'Twilight', depth: 0.15 },
  { name: 'Midnight', depth: 0.35 },
  { name: 'Abyss', depth: 0.6 },
  { name: 'Hadal', depth: 0.82 },
]

export default function Navbar({ scrollData }) {
  const [hidden, setHidden] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      setHidden(current > lastScroll && current > 100)
      setLastScroll(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScroll])

  const scrollToSection = (progress) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: scrollHeight * progress, behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{
        borderBottom: '1px solid rgba(79, 195, 247, 0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
        </motion.div>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item, i) => {
            const isActive = scrollData && scrollData.zoneIndex === i
            return (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.depth)}
                className="relative px-3 py-1.5 text-xs tracking-widest transition-colors duration-300 rounded-md hover:bg-white/10"
                style={{
                  color: isActive ? '#E0F7FA' : 'rgba(224, 247, 250, 0.6)',
                  fontWeight: isActive ? 600 : 400
                }}
                aria-label={`Navigate to ${item.name} zone`}
              >
                {item.name.toUpperCase()}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: '#4FC3F7' }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Mobile depth indicator */}
        <div
          className="md:hidden text-xs tracking-widest font-semibold"
          style={{ color: 'rgba(224, 247, 250, 0.6)' }}
        >
          {scrollData ? `${scrollData.depth.toLocaleString()}m` : '0m'}
        </div>
      </div>
    </motion.nav>
  )
}
