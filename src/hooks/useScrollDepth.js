import { useState, useEffect, useCallback } from 'react'

const ZONES = [
  { name: 'Surface', minDepth: 0, maxDepth: 200, color: '#4FC3F7' },
  { name: 'Twilight Zone', minDepth: 200, maxDepth: 1000, color: '#1A6B8A' },
  { name: 'Midnight Zone', minDepth: 1000, maxDepth: 4000, color: '#1A1A4E' },
  { name: 'The Abyss', minDepth: 4000, maxDepth: 6000, color: '#0D0D2B' },
  { name: 'Hadal Zone', minDepth: 6000, maxDepth: 11000, color: '#050510' },
]

export function useScrollDepth() {
  const [scrollData, setScrollData] = useState({
    progress: 0,
    depth: 0,
    zone: ZONES[0],
    zoneIndex: 0,
    zoneProgress: 0,
  })

  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollTop = window.scrollY
    const progress = Math.min(scrollTop / scrollHeight, 1)
    const depth = Math.round(progress * 11000)

    let zoneIndex = 0
    for (let i = ZONES.length - 1; i >= 0; i--) {
      if (depth >= ZONES[i].minDepth) {
        zoneIndex = i
        break
      }
    }

    const zone = ZONES[zoneIndex]
    const zoneRange = zone.maxDepth - zone.minDepth
    const zoneProgress = Math.min((depth - zone.minDepth) / zoneRange, 1)

    setScrollData({ progress, depth, zone, zoneIndex, zoneProgress })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return scrollData
}

export { ZONES }
