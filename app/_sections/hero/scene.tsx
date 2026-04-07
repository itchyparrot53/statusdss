'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const NODE_COUNT = 150
const CONNECTION_DISTANCE = 0.32
const FIELD_SIZE = 2.8

function generateNodes(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * FIELD_SIZE * 2
    positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_SIZE
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5
  }
  return positions
}

function buildConnections(
  positions: Float32Array,
  count: number
): Float32Array {
  const lines: number[] = []
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const ax = positions[i * 3] ?? 0
      const ay = positions[i * 3 + 1] ?? 0
      const az = positions[i * 3 + 2] ?? 0
      const bx = positions[j * 3] ?? 0
      const by = positions[j * 3 + 1] ?? 0
      const bz = positions[j * 3 + 2] ?? 0
      const dx = ax - bx
      const dy = ay - by
      const dz = az - bz
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (dist < CONNECTION_DISTANCE) {
        lines.push(ax, ay, az, bx, by, bz)
      }
    }
  }
  return new Float32Array(lines)
}

const nodePositions = generateNodes(NODE_COUNT)
const linePositions = buildConnections(nodePositions, NODE_COUNT)
// First 20 nodes used for brighter accent points
const accentPositions = nodePositions.slice(0, 20 * 3)

function NetworkMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.4
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.25
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.current.x,
      0.04
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.current.y,
      0.04
    )
    groupRef.current.position.y = Math.sin(t * 0.3) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* Main nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          color="#8b5cf6"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.3} />
      </lineSegments>

      {/* Bright accent nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[accentPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#c4b5fd"
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <NetworkMesh />
    </Canvas>
  )
}
