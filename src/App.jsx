import React, { useState, useEffect } from 'react'
import LoadingScreen from './components/ui/LoadingScreen'
import Navbar from './components/ui/Navbar'
import DepthMeter from './components/ui/DepthMeter'
import DiverCharacter from './components/ui/DiverCharacter'
import TorchCursor from './components/ui/TorchCursor'
import AudioButton from './components/ui/AudioButton'
import OceanCanvas from './components/canvas/OceanCanvas'
import Surface from './components/sections/Surface'
import TwilightZone from './components/sections/TwilightZone'
import MidnightZone from './components/sections/MidnightZone'
import Abyss from './components/sections/Abyss'
import HadalZone from './components/sections/HadalZone'
import { useScrollDepth } from './hooks/useScrollDepth'
import { ClueProvider } from './context/ClueContext'
import ClueHUD from './components/ui/ClueHUD'
import ElenaConclusion from './components/ui/ElenaConclusion'
import { useAudioManager } from './hooks/useAudioManager'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [canvasLoaded, setCanvasLoaded] = useState(false)
  const scrollData = useScrollDepth()
  const { isMuted, toggleMute, isStarted } = useAudioManager(scrollData)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const handleCanvasLoaded = () => {
    setCanvasLoaded(true)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const scrollStep = window.innerHeight * 0.3
      if (e.key === 'ArrowDown') {
        window.scrollBy({ top: scrollStep, behavior: 'smooth' })
      } else if (e.key === 'ArrowUp') {
        window.scrollBy({ top: -scrollStep, behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ClueProvider>
      <div className="relative">
        {/* Loading screen */}
        <LoadingScreen onComplete={handleLoadingComplete} />

        {/* Three.js background canvas */}
        <OceanCanvas scrollData={scrollData} onLoaded={handleCanvasLoaded} />

        {/* Fixed UI */}
        <Navbar scrollData={scrollData} />
        <DepthMeter scrollData={scrollData} />
        <ClueHUD />
        <ElenaConclusion />
        <AudioButton isMuted={isMuted} toggleMute={toggleMute} isStarted={isStarted} />

        {/* Global custom cursor that projects light */}
        <TorchCursor scrollData={scrollData} />

        {/* Global Diver Character taking the journey */}
        <DiverCharacter scrollData={scrollData} />

        {/* Main scroll content */}
        <main className="relative z-10">
          <Surface scrollData={scrollData} />
          <TwilightZone scrollData={scrollData} />
          <MidnightZone scrollData={scrollData} />
          <Abyss scrollData={scrollData} />
          <HadalZone scrollData={scrollData} />
        </main>

        {/* Bottom gradient */}
        <div
          className="fixed bottom-0 left-0 right-0 h-16 z-30 pointer-events-none"
          style={{
            background: 'linear-gradient(transparent, rgba(5, 5, 16, 0.5))',
          }}
        />
      </div>
    </ClueProvider>
  )
}
