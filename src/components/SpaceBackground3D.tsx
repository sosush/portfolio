import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Constellation data (simplified coordinates)
const URSA_MAJOR = [
  [-2, 1, 0], [-1, 1.2, 0], [0, 1, 0], [1, 0.8, 0], 
  [1.5, 0, 0], [2.5, -0.5, 0], [2, -1.5, 0]
];

const SAGITTARIUS = [
  [3, 2, 0], [3.5, 1.5, 0], [4, 2, 0], [3.5, 2.5, 0],
  [4.5, 1, 0], [5, 1.5, 0], [4.5, 2, 0]
];

function Constellation({ points, color = "#ffffff", size = 0.07 }) {
  const linePoints = useMemo(() => points.map(p => new THREE.Vector3(...p)), [points]);
  
  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={1} />
        </mesh>
      ))}
      <line>
        <bufferGeometry attach="geometry" setFromPoints={linePoints} />
        {/* Changed constellation lines to white as requested */}
        <lineBasicMaterial attach="material" color="#ffffff" transparent opacity={0.7} linewidth={4} />
      </line>
    </group>
  );
}

function Galaxy({ position, color, size = 1, rotationSpeed = 0.02 }) {
  const ref = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    // 4000 points for a very dense, clustered look
    const p = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      const angle = i * 0.02;
      // Very tight distance spread for intense clustering
      const distance = (i * 0.002 * size) + (Math.random() * 0.2);
      const x = Math.cos(angle) * distance;
      const y = (Math.random() - 0.5) * 0.15;
      const z = Math.sin(angle) * distance;
      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
    }
    return p;
  }, [size]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Points positions={points} stride={3}>
        <PointMaterial
          transparent
          color={color}
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      {/* Intense core glow */}
      <mesh scale={1.2}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function StarClusters() {
  const ref = useRef<THREE.Points>(null);
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const r = 25 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={points} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function Scene({ moving = true }: { moving?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const galaxy1Ref = useRef<THREE.Group>(null);
  const galaxy2Ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Even stronger cursor responsive rotation for the whole scene
      const targetRotX = moving ? state.mouse.y * 0.3 : 0;
      const targetRotY = moving ? state.mouse.x * 0.3 : 0;
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;

      // Add a positional "slide" to the whole scene for more direct movement feel
      const targetPosX = moving ? state.mouse.x * 3 : 0;
      const targetPosY = moving ? state.mouse.y * 3 : 0;
      groupRef.current.position.x += (targetPosX - groupRef.current.position.x) * 0.05;
      groupRef.current.position.y += (targetPosY - groupRef.current.position.y) * 0.05;
    }

    // Enhanced individual parallax for galaxies
    if (galaxy1Ref.current) {
      const targetGX1 = moving ? -18 + state.mouse.x * 4 : -18;
      const targetGY1 = moving ? 10 + state.mouse.y * 4 : 10;
      galaxy1Ref.current.position.x += (targetGX1 - galaxy1Ref.current.position.x) * 0.05;
      galaxy1Ref.current.position.y += (targetGY1 - galaxy1Ref.current.position.y) * 0.05;
    }
    if (galaxy2Ref.current) {
      const targetGX2 = moving ? 18 - state.mouse.x * 4 : 18;
      const targetGY2 = moving ? -10 - state.mouse.y * 4 : -10;
      galaxy2Ref.current.position.x += (targetGX2 - galaxy2Ref.current.position.x) * 0.05;
      galaxy2Ref.current.position.y += (targetGY2 - galaxy2Ref.current.position.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={0} />
      
      {/* URSA MAJOR - Top Right Side */}
      <group position={[15, 8, -5]} rotation={[0, 0, Math.PI / 6]} scale={0.6}>
        <Constellation points={URSA_MAJOR} color="#01cdfe" />
      </group>
      
      {/* SAGITTARIUS - Bottom Left Side */}
      <group position={[-15, -8, -5]} rotation={[0, Math.PI / 4, 0]} scale={0.8}>
        <Constellation points={SAGITTARIUS} color="#ff71ce" />
      </group>

      {/* Galaxies with individual refs for parallax */}
      <group ref={galaxy1Ref}>
        <Galaxy position={[0, 0, -15]} color="#ff71ce" size={2} rotationSpeed={0.04} />
      </group>
      <group ref={galaxy2Ref}>
        <Galaxy position={[0, 0, -12]} color="#01cdfe" size={2.5} rotationSpeed={-0.03} />
      </group>

      <StarClusters />
    </group>
  );
}

export default function SpaceBackground3D({ moving = true }: { moving?: boolean }) {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#050507]">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 60 }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
      >
        <color attach="background" args={['#050507']} />
        <ambientLight intensity={0.5} />
        <Scene moving={moving} />
      </Canvas>
    </div>
  );
}
