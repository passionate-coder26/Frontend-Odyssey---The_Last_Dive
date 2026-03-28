import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function LightRays({ scrollData }) {
  const groupRef = useRef()
  const raysRef = useRef([])

  const rays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      position: [(i - 2) * 3, 2, -2 + Math.random() * 2],
      angle: (Math.random() - 0.5) * 0.3,
      speed: 0.3 + Math.random() * 0.5,
      width: 0.8 + Math.random() * 1.2,
      opacity: 0.15 + Math.random() * 0.15,
    }))
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const fadeOut = scrollData ? Math.max(0, 1 - scrollData.progress * 4) : 1

    groupRef.current.children.forEach((ray, i) => {
      const config = rays[i]
      if (!config) return
      ray.material.opacity = config.opacity * fadeOut * (0.5 + Math.sin(t * config.speed) * 0.5)
      ray.rotation.z = Math.sin(t * 0.2 + i) * 0.05 + config.angle
    })
  })

  return (
    <group ref={groupRef}>
      {rays.map((ray, i) => (
        <mesh 
          key={i} 
          position={ray.position}
          rotation={[0, 0, ray.angle]}
        >
          <planeGeometry args={[ray.width, 20]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={ray.opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
