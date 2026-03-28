import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import WaterSurface from './WaterSurface'
import LightRays from './LightRays'
import BioParticles from './BioParticles'
import Creatures from './Creatures'
import DepthFog from './DepthFog'
import AbyssTerrain from './AbyssTerrain'
import { useThreeScroll } from '../../hooks/useThreeScroll'
import { useFrame } from '@react-three/fiber'

function SceneController({ scrollData }) {
  const { update } = useThreeScroll(scrollData)

  useFrame((state) => {
    update(state)
  })

  return null
}

export default function OceanCanvas({ scrollData, onLoaded }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 200 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2('#4FC3F7', 0.002)
          scene.background = new THREE.Color('#050510')
          if (onLoaded) onLoaded()
        }}
      >
        <Suspense fallback={null}>
          <SceneController scrollData={scrollData} />
          <DepthFog scrollData={scrollData} />
          <ambientLight intensity={0.15} />

          {/* Surface zone */}
          <WaterSurface scrollData={scrollData} />
          <LightRays scrollData={scrollData} />

          {/* All zones */}
          <BioParticles scrollData={scrollData} isMobile={isMobile} />
          <Creatures scrollData={scrollData} />
          <AbyssTerrain scrollData={scrollData} />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
