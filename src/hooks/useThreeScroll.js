import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function useThreeScroll(scrollData) {
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 5))
  const fogDensity = useRef(0.002)
  const fogColor = useRef(new THREE.Color('#0D47A1'))

  const ZONE_COLORS = [
    new THREE.Color('#0D47A1'),
    new THREE.Color('#1565C0'),
    new THREE.Color('#0A1628'),
    new THREE.Color('#070D18'),
    new THREE.Color('#030509'),
  ]

  const update = useCallback((state) => {
    if (!scrollData) return

    const { progress, zoneIndex, zoneProgress } = scrollData
    
    // Camera Y position: 0 → -60
    const targetY = -progress * 60
    cameraTarget.current.y = THREE.MathUtils.lerp(
      cameraTarget.current.y,
      targetY,
      0.05
    )
    state.camera.position.y = cameraTarget.current.y

    // Fog density: 0.002 → 0.08
    const targetDensity = 0.002 + progress * 0.078
    fogDensity.current = THREE.MathUtils.lerp(fogDensity.current, targetDensity, 0.05)

    // Fog color transitions
    if (zoneIndex < ZONE_COLORS.length - 1) {
      fogColor.current.lerpColors(
        ZONE_COLORS[zoneIndex],
        ZONE_COLORS[zoneIndex + 1],
        zoneProgress
      )
    }

    if (state.scene.fog) {
      state.scene.fog.density = fogDensity.current
      state.scene.fog.color.copy(fogColor.current)
    }
  }, [scrollData])

  return { update, cameraTarget, fogDensity, fogColor }
}
