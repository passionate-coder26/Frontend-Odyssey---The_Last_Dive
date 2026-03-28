import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Anglerfish({ position, scrollData }) {
  const groupRef = useRef()
  const lureRef = useRef()
  const visible = scrollData && scrollData.progress > 0.25 && scrollData.progress < 0.65

  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return
    const t = clock.getElapsedTime()
    groupRef.current.position.x = position[0] + Math.sin(t * 0.3) * 1.5
    groupRef.current.position.z = position[2] + Math.cos(t * 0.2) * 0.8
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.3

    if (lureRef.current) {
      lureRef.current.intensity = 2 + Math.sin(t * 3) * 1.5
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#1a0a2e"
          roughness={0.4}
          metalness={0.2}
          emissive="#1a0a2e"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Mouth */}
      <mesh position={[0.6, -0.1, 0]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.5, 12, 12, 0, Math.PI]} />
        <meshStandardMaterial color="#0a0015" roughness={0.8} />
      </mesh>
      {/* Lure stalk */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#2a1a4e" />
      </mesh>
      {/* Lure light */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color="#00FF9F"
          emissive="#00FF9F"
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight ref={lureRef} position={[0, 1.3, 0]} color="#00FF9F" intensity={3} distance={8} decay={2} />
      {/* Fins */}
      <mesh position={[-0.5, 0.3, 0.4]} rotation={[0.3, 0, -0.5]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshStandardMaterial color="#1a0a2e" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.5, 0.3, -0.4]} rotation={[-0.3, 0, -0.5]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshStandardMaterial color="#1a0a2e" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Jellyfish({ position, color, scrollData, delay = 0 }) {
  const groupRef = useRef()
  const visible = scrollData && scrollData.progress > 0.2 && scrollData.progress < 0.7

  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return
    const t = clock.getElapsedTime() + delay
    // Bell contraction
    const pulse = Math.sin(t * 1.5) * 0.15
    groupRef.current.scale.set(1 + pulse, 1 - pulse * 0.5, 1 + pulse)
    groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.5
    groupRef.current.position.x = position[0] + Math.sin(t * 0.3 + delay) * 0.8
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.15
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Bell */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Tentacles */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 0.3
        const z = Math.sin(angle) * 0.3
        return (
          <mesh key={i} position={[x, -0.5, z]}>
            <cylinderGeometry args={[0.02, 0.01, 1.5, 6]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.4}
            />
          </mesh>
        )
      })}
      <pointLight color={color} intensity={1.5} distance={5} decay={2} />
    </group>
  )
}

function Viperfish({ position, scrollData }) {
  const groupRef = useRef()
  const visible = scrollData && scrollData.progress > 0.3 && scrollData.progress < 0.65

  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return
    const t = clock.getElapsedTime()
    groupRef.current.position.x = position[0] + Math.sin(t * 0.4) * 2
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.5 + Math.PI
    groupRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.3
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.15, 1.2, 8, 12]} />
        <meshStandardMaterial
          color="#0a0a3a"
          emissive="#1a1a6e"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Photophore dots along belly */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0, -0.15, -0.5 + i * 0.15]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#00FF9F"
            emissive="#00FF9F"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
      <pointLight color="#00FF9F" intensity={0.8} distance={3} decay={2} />
    </group>
  )
}

function Dragonfish({ position, scrollData }) {
  const groupRef = useRef()
  const visible = scrollData && scrollData.progress > 0.35 && scrollData.progress < 0.65

  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return
    const t = clock.getElapsedTime()
    groupRef.current.position.z = position[2] + Math.sin(t * 0.25) * 2.5
    groupRef.current.rotation.y = Math.cos(t * 0.25) * 0.6
    groupRef.current.position.y = position[1] + Math.cos(t * 0.4) * 0.4
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.12, 1.5, 8, 12]} />
        <meshStandardMaterial
          color="#0d0d1a"
          emissive="#330000"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {/* Red light organ */}
      <mesh position={[0, -0.12, 0.8]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color="#FF0000"
          emissive="#FF0000"
          emissiveIntensity={4}
        />
      </mesh>
      <pointLight position={[0, -0.12, 0.8]} color="#FF0000" intensity={2} distance={6} decay={2} />
      {/* Barbel */}
      <mesh position={[0, -0.1, 0.9]}>
        <cylinderGeometry args={[0.01, 0.005, 0.8, 6]} />
        <meshStandardMaterial color="#1a0000" />
      </mesh>
    </group>
  )
}

function MysteriousCreature({ position, scrollData }) {
  const groupRef = useRef()
  const visible = scrollData && scrollData.progress > 0.85

  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.05
    groupRef.current.scale.setScalar(0.8 + Math.sin(t * 0.3) * 0.1)
    // Slow reveal
    const revealProgress = Math.min((scrollData.progress - 0.85) / 0.15, 1)
    groupRef.current.children.forEach(child => {
      if (child.material) {
        child.material.opacity = revealProgress * 0.4
      }
    })
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Giant mysterious shape */}
      <mesh>
        <torusKnotGeometry args={[2, 0.5, 100, 16]} />
        <meshStandardMaterial
          color="#050520"
          emissive="#1a004e"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[1.5, 0.5, 1]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF4500"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[-1.5, 0.5, 1]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF4500"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight color="#1a004e" intensity={1} distance={10} decay={2} />
    </group>
  )
}

export default function Creatures({ scrollData }) {
  return (
    <group>
      <Anglerfish position={[3, -20, -2]} scrollData={scrollData} />

      <Jellyfish position={[-2, -18, 1]} color="#7B68EE" scrollData={scrollData} delay={0} />
      <Jellyfish position={[1, -22, -1]} color="#00CED1" scrollData={scrollData} delay={1.5} />
      <Jellyfish position={[-4, -25, 2]} color="#FF69B4" scrollData={scrollData} delay={3} />
      <Jellyfish position={[4, -20, 3]} color="#00FF9F" scrollData={scrollData} delay={4.5} />

      <Viperfish position={[-3, -28, -3]} scrollData={scrollData} />
      <Dragonfish position={[2, -30, 2]} scrollData={scrollData} />

      <MysteriousCreature position={[0, -55, -5]} scrollData={scrollData} />
    </group>
  )
}
