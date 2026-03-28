import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function DepthFog({ scrollData }) {
  const { scene } = useThree()

  useEffect(() => {
    if (!scene.fog) {
      scene.fog = new THREE.FogExp2('#0D47A1', 0.002)
    }
  }, [scene])

  useEffect(() => {
    if (!scene.fog || !scrollData) return
    
    const { progress, zoneIndex } = scrollData
    const density = 0.002 + progress * 0.078
    
    // Rich deep ocean blues mapping
    const colors = [
      new THREE.Color('#0D47A1'), // Surface
      new THREE.Color('#1565C0'), // Twilight
      new THREE.Color('#0A1628'), // Midnight
      new THREE.Color('#070D18'), // Abyss
      new THREE.Color('#030509'), // Hadal
    ]
    
    scene.fog.density = density
    
    if (zoneIndex < colors.length) {
      scene.fog.color.copy(colors[zoneIndex])
      scene.background = colors[zoneIndex].clone().multiplyScalar(0.3)
    }
  }, [scene, scrollData])

  return null
}
