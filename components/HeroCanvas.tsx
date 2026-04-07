'use client';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars, Text3D, Center, Torus, Ring } from '@react-three/drei';
import * as THREE from 'three';

// Rotating DNA double helix
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 24;
  const radius = 1.4;

  const positions = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const t = (i / count) * Math.PI * 4;
      const y = (i / count) * 10 - 5;
      return {
        left: [Math.cos(t) * radius, y, Math.sin(t) * radius] as [number, number, number],
        right: [Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius] as [number, number, number],
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  const colors = [
    { sphere: '#A855F7', emit: '#7C3AED' },
    { sphere: '#F97316', emit: '#EA580C' },
    { sphere: '#818CF8', emit: '#6366F1' },
  ];

  return (
    <group ref={groupRef} position={[3.5, 0, -1]}>
      {positions.map((pos, i) => {
        const c = colors[i % 3];
        return (
          <group key={i}>
            <mesh position={pos.left}>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshStandardMaterial color={c.sphere} emissive={c.emit} emissiveIntensity={0.6} roughness={0.1} metalness={0.9} />
            </mesh>
            <mesh position={pos.right}>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshStandardMaterial color={colors[(i + 1) % 3].sphere} emissive={colors[(i + 1) % 3].emit} emissiveIntensity={0.6} roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Rung */}
            <mesh
              position={[(pos.left[0] + pos.right[0]) / 2, (pos.left[1] + pos.right[1]) / 2, (pos.left[2] + pos.right[2]) / 2]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.012, 0.012, radius * 2, 8]} />
              <meshStandardMaterial color="#C4B5FD" emissive="#7C3AED" emissiveIntensity={0.3} transparent opacity={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Medical cross 3D object
function MedicalCross({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.4;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <group ref={ref} position={position} scale={0.5}>
        {/* Horizontal bar */}
        <mesh>
          <boxGeometry args={[1.8, 0.5, 0.2]} />
          <meshStandardMaterial color="#7C3AED" emissive="#5B21B6" emissiveIntensity={0.4} roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Vertical bar */}
        <mesh>
          <boxGeometry args={[0.5, 1.8, 0.2]} />
          <meshStandardMaterial color="#7C3AED" emissive="#5B21B6" emissiveIntensity={0.4} roughness={0.1} metalness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

// Floating pill capsule
function PillCapsule({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.6;
      ref.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} floatIntensity={0.8} rotationIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <capsuleGeometry args={[0.18, 0.45, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.1} metalness={0.7} transparent opacity={0.9} />
      </mesh>
    </Float>
  );
}

// Glowing orb
function GlowOrb({ position, color, size = 0.3 }: { position: [number, number, number]; color: string; size?: number }) {
  return (
    <Float speed={1.2} floatIntensity={1} rotationIntensity={0.3}>
      <mesh position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0}
          metalness={0.3}
          distort={0.35}
          speed={2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

// Ring/torus
function MedicalRing({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.5;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.8} floatIntensity={0.6}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[0.5, 0.08, 16, 64]} />
        <meshStandardMaterial color="#F97316" emissive="#EA580C" emissiveIntensity={0.5} roughness={0} metalness={1} />
      </mesh>
    </Float>
  );
}

// Particle field
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 1200;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const purple = new THREE.Color('#A855F7');
    const orange = new THREE.Color('#F97316');
    const white = new THREE.Color('#FFFFFF');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const choice = Math.random();
      const c = choice < 0.5 ? purple : choice < 0.8 ? orange : white;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// Moving camera rig
function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 0.4, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 0.2, 0.03);
  });
  return null;
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 8, 5]} color="#A855F7" intensity={3} />
      <pointLight position={[-8, -4, 3]} color="#F97316" intensity={2} />
      <pointLight position={[2, -6, 8]} color="#818CF8" intensity={1.5} />
      <spotLight position={[0, 10, 0]} color="#ffffff" intensity={0.5} angle={0.5} penumbra={1} />

      <Stars radius={100} depth={60} count={4000} factor={3} fade speed={0.3} />

      <DNAHelix />

      {/* Medical crosses */}
      <MedicalCross position={[-5, 2, -2]} />
      <MedicalCross position={[-3, -3, 0]} />

      {/* Pills */}
      <PillCapsule position={[-6, 1, 1]} color="#A855F7" />
      <PillCapsule position={[-4, 3.5, -1]} color="#F97316" />
      <PillCapsule position={[1, -3, 2]} color="#818CF8" />
      <PillCapsule position={[6, 2, -2]} color="#EC4899" />

      {/* Glowing orbs */}
      <GlowOrb position={[-7, -1, -3]} color="#7C3AED" size={0.35} />
      <GlowOrb position={[-2, -4, -1]} color="#F97316" size={0.25} />
      <GlowOrb position={[5, -2, 0]} color="#A855F7" size={0.4} />
      <GlowOrb position={[-5, 4, -2]} color="#EA580C" size={0.2} />

      {/* Rings */}
      <MedicalRing position={[-6, -2, -1]} />
      <MedicalRing position={[4, 3, -3]} />

      <Particles />
      <CameraRig />
    </Canvas>
  );
}
