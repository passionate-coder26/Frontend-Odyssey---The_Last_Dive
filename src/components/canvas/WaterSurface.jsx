import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  float wave1 = sin(pos.x * uFrequency + uTime * 0.8) * uAmplitude;
  float wave2 = cos(pos.y * uFrequency * 0.7 + uTime * 0.6) * uAmplitude * 0.5;
  float wave3 = sin((pos.x + pos.y) * uFrequency * 0.5 + uTime * 1.2) * uAmplitude * 0.3;
  float wave4 = cos(pos.x * uFrequency * 1.5 - uTime * 0.4) * uAmplitude * 0.2;
  
  pos.z += wave1 + wave2 + wave3 + wave4;
  vElevation = pos.z;
  
  float eps = 0.01;
  float dx = sin((pos.x + eps) * uFrequency + uTime * 0.8) * uAmplitude - wave1;
  float dy = cos((pos.y + eps) * uFrequency * 0.7 + uTime * 0.6) * uAmplitude * 0.5 - wave2;
  vNormal = normalize(vec3(-dx / eps, -dy / eps, 1.0));
  vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform vec3 uDeepColor;
uniform vec3 uSurfaceColor;
uniform float uFresnelPower;
varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), uFresnelPower);
  
  float caustic1 = sin(vUv.x * 30.0 + uTime * 2.0) * cos(vUv.y * 30.0 + uTime * 1.5);
  float caustic2 = sin(vUv.x * 20.0 - uTime * 1.0) * cos(vUv.y * 25.0 + uTime * 0.8);
  float caustics = (caustic1 + caustic2) * 0.15 + 0.1;
  
  vec3 baseColor = mix(uDeepColor, uSurfaceColor, vElevation * 2.0 + 0.5);
  baseColor += caustics * vec3(0.3, 0.6, 0.8);
  
  vec3 fresnelColor = mix(baseColor, vec3(0.6, 0.9, 1.0), fresnel * 0.6);
  
  float sparkle = pow(caustic1 * caustic2 + 0.5, 8.0) * 0.3;
  fresnelColor += sparkle * vec3(1.0, 1.0, 1.0);
  
  gl_FragColor = vec4(fresnelColor, 0.85);
}
`

export default function WaterSurface({ scrollData }) {
  const meshRef = useRef()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAmplitude: { value: 0.3 },
    uFrequency: { value: 2.0 },
    uDeepColor: { value: new THREE.Color('#0A1628') },
    uSurfaceColor: { value: new THREE.Color('#1565C0') },
    uFresnelPower: { value: 3.0 },
  }), [])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      uniforms.uTime.value = clock.getElapsedTime()
      // Fade out water surface as we dive deeper
      const opacity = scrollData ? Math.max(0, 1 - scrollData.progress * 5) : 1
      meshRef.current.visible = opacity > 0.01
      if (meshRef.current.material) {
        meshRef.current.material.opacity = opacity
      }
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[40, 40, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
