import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function HydrothermalVent({ position, scrollData }) {
  const particlesRef = useRef()
  const count = 200

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = position[0] + (Math.random() - 0.5) * 0.5
      positions[i3 + 1] = position[1] + Math.random() * 3
      positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.5

      velocities[i3] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 1] = Math.random() * 0.02 + 0.01
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01
    }

    return { positions, velocities }
  }, [position])

  useFrame(() => {
    if (!particlesRef.current) return
    if (!scrollData || scrollData.progress < 0.55 || scrollData.progress > 0.9) {
      particlesRef.current.visible = false
      return
    }
    particlesRef.current.visible = true

    const posArr = particlesRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      posArr[i3] += velocities[i3]
      posArr[i3 + 1] += velocities[i3 + 1]
      posArr[i3 + 2] += velocities[i3 + 2]

      if (posArr[i3 + 1] > position[1] + 5) {
        posArr[i3] = position[0] + (Math.random() - 0.5) * 0.5
        posArr[i3 + 1] = position[1]
        posArr[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.5
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FF4500"
        size={1.5}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

export default function AbyssTerrain({ scrollData }) {
  const terrainRef = useRef()
  const visible = scrollData && scrollData.progress > 0.5

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(40, 40, 64, 64)
    const posAttr = geo.attributes.position

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i)
      const y = posAttr.getY(i)

      // Procedural terrain height
      let height = 0
      height += Math.sin(x * 0.3) * Math.cos(y * 0.3) * 2
      height += Math.sin(x * 0.8 + 1) * Math.cos(y * 0.6 + 2) * 1
      height += Math.sin(x * 1.5 + 3) * Math.cos(y * 1.2 + 1) * 0.5

      // Canyon in center
      const distFromCenter = Math.abs(x) * 0.15
      height -= Math.max(0, 3 - distFromCenter * distFromCenter) * 2

      posAttr.setZ(i, height)
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame(() => {
    if (!terrainRef.current) return
    if (!visible) {
      terrainRef.current.visible = false
      return
    }
    terrainRef.current.visible = true
    // Rise terrain on scroll
    const riseProgress = Math.min((scrollData.progress - 0.5) / 0.3, 1)
    terrainRef.current.position.y = -45 + (1 - riseProgress) * 10
  })

  return (
    <group>
      <mesh
        ref={terrainRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -45, 0]}
        geometry={geometry}
      >
        <meshStandardMaterial
          color="#0D0D2B"
          roughness={0.9}
          metalness={0.1}
          emissive="#1a0a0a"
          emissiveIntensity={0.1}
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </mesh>

      <HydrothermalVent position={[3, -43, -2]} scrollData={scrollData} />
      <HydrothermalVent position={[-5, -43, 1]} scrollData={scrollData} />
      <HydrothermalVent position={[0, -43, 4]} scrollData={scrollData} />
    </group>
  )
}
