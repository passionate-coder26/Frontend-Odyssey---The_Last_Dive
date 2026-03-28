import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const particleVertexShader = `
attribute float size;
attribute vec3 customColor;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = customColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (200.0 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 1.0, 30.0);
  gl_Position = projectionMatrix * mvPosition;
  vAlpha = smoothstep(200.0, 5.0, -mvPosition.z);
}
`

const particleFragmentShader = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  // Circular particle with smooth glow falloff
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  if (dist > 0.5) discard;
  
  float alpha = smoothstep(0.5, 0.05, dist) * 0.6 * vAlpha;
  vec3 glow = vColor * (1.0 + smoothstep(0.3, 0.0, dist) * 1.5);
  
  gl_FragColor = vec4(glow, alpha);
}
`

export default function BioParticles({ scrollData, isMobile }) {
  const meshRef = useRef()
  const particleCount = isMobile ? 300 : (typeof window !== 'undefined' && window.innerWidth < 1024) ? 1000 : 3000
  
  const { positions, colors, sizes, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    
    const bioColor = new THREE.Color('#00FF9F')
    const blueColor = new THREE.Color('#4FC3F7')
    const purpleColor = new THREE.Color('#7B68EE')
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 30
      positions[i3 + 1] = -Math.random() * 70
      positions[i3 + 2] = (Math.random() - 0.5) * 30
      
      const colorChoice = Math.random()
      const color = colorChoice < 0.4 ? bioColor : colorChoice < 0.7 ? blueColor : purpleColor
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      
      sizes[i] = Math.random() * 1.0 + 0.3
      
      velocities[i3] = (Math.random() - 0.5) * 0.008
      velocities[i3 + 1] = Math.random() * 0.004 + 0.001
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.008
    }
    
    return { positions, colors, sizes, velocities }
  }, [particleCount])

  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const posArr = meshRef.current.geometry.attributes.position.array
    const t = clock.getElapsedTime()
    const speedMult = scrollData ? 1 + scrollData.progress * 2 : 1
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      posArr[i3] += velocities[i3] * speedMult + Math.sin(t * 0.5 + i) * 0.0005
      posArr[i3 + 1] += velocities[i3 + 1] * speedMult
      posArr[i3 + 2] += velocities[i3 + 2] * speedMult
      
      // Wrap particles
      if (posArr[i3 + 1] > 5) posArr[i3 + 1] = -70
      if (Math.abs(posArr[i3]) > 20) posArr[i3] *= -0.9
      if (Math.abs(posArr[i3 + 2]) > 20) posArr[i3 + 2] *= -0.9
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true
    
    // Pulsing size
    const sizeArr = meshRef.current.geometry.attributes.size.array
    for (let i = 0; i < particleCount; i++) {
      sizeArr[i] = sizes[i] * (0.8 + Math.sin(t * 2 + i * 0.1) * 0.2)
    }
    meshRef.current.geometry.attributes.size.needsUpdate = true
  })

  return (
    <points ref={meshRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-customColor"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  )
}
