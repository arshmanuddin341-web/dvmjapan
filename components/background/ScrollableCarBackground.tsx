"use client";

import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  MeshReflectorMaterial,
  Stars,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

// Enhanced Car Model with more details
function CarModel({ scrollY }: { scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const wheelRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];

  useFrame((state) => {
    if (groupRef.current) {
      // Enhanced scroll-based rotation - more responsive
      groupRef.current.rotation.y = scrollY * 3 + state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2 + scrollY * 0.5;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      
      // Scale based on scroll
      const scale = 1 + scrollY * 0.3;
      groupRef.current.scale.set(scale, scale, scale);
    }

    // Rotate wheels faster
    wheelRefs.forEach((wheelRef) => {
      if (wheelRef.current) {
        wheelRef.current.rotation.x = state.clock.elapsedTime * 4 + scrollY * 5;
      }
    });

    // Enhanced body animation
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
      bodyRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Car Body - Main with gradient effect */}
      <mesh ref={bodyRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[2.5, 0.8, 1.2]} />
        <meshStandardMaterial
          color="#00D9FF"
          metalness={0.98}
          roughness={0.02}
          emissive="#00D9FF"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Car Roof */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[1.8, 0.6, 1]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Front Windshield - Glass effect */}
      <mesh position={[0, 1.1, 0.5]}>
        <boxGeometry args={[1.6, 0.5, 0.05]} />
        <MeshTransmissionMaterial
          backside
          samples={10}
          resolution={512}
          transmission={0.9}
          thickness={0.1}
          roughness={0.1}
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.1}
          color="#00D9FF"
        />
      </mesh>

      {/* Wheels */}
      {[
        { pos: [0.9, 0.2, 0.7] as const },
        { pos: [-0.9, 0.2, 0.7] as const },
        { pos: [0.9, 0.2, -0.7] as const },
        { pos: [-0.9, 0.2, -0.7] as const },
      ].map((wheel, i) => (
        <group key={i} position={wheel.pos}>
          <mesh ref={wheelRefs[i]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
            <meshStandardMaterial
              color="#0a0a0a"
              metalness={0.98}
              roughness={0.02}
            />
          </mesh>
          {/* Wheel Rim - Glowing */}
          <mesh>
            <cylinderGeometry args={[0.25, 0.25, 0.22, 32]} />
            <meshStandardMaterial
              color="#00D9FF"
              metalness={1}
              roughness={0}
              emissive="#00D9FF"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* Headlights - Brighter */}
      <mesh position={[0.4, 0.7, 0.6]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00D9FF"
          emissiveIntensity={5}
        />
      </mesh>
      <mesh position={[-0.4, 0.7, 0.6]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00D9FF"
          emissiveIntensity={5}
        />
      </mesh>

      {/* Enhanced Glow Effect */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.8, 1, 1.4]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0.6}
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={120}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.8}
        mirror={0.5}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const particles = useRef<THREE.Points>(null);
  const count = 200;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 25;
    positions[i + 1] = (Math.random() - 0.5) * 25;
    positions[i + 2] = (Math.random() - 0.5) * 25;
    
    // Cyan, purple, gold colors
    const color = [Math.random() > 0.5 ? 0 : 1, Math.random() > 0.5 ? 0.8 : 0.5, 1];
    colors[i] = color[0];
    colors[i + 1] = color[1];
    colors[i + 2] = color[2];
  }

  useFrame((state) => {
    if (particles.current) {
      particles.current.rotation.y = state.clock.elapsedTime * 0.15;
      particles.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
      particles.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

function OrbitingRings({ scrollY }: { scrollY: number }) {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring1.current) {
      ring1.current.rotation.x = state.clock.elapsedTime * 0.3 + scrollY * 2;
      ring1.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.y = state.clock.elapsedTime * 0.4 + scrollY * 3;
      ring2.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
    if (ring3.current) {
      ring3.current.rotation.z = state.clock.elapsedTime * 0.5 + scrollY * 4;
      ring3.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <>
      <mesh ref={ring1} position={[3, 2, -5]}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0}
        />
      </mesh>
      <mesh ref={ring2} position={[-3, -1, -4]}>
        <torusGeometry args={[1.2, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#A855F7"
          emissive="#A855F7"
          emissiveIntensity={0.4}
          metalness={1}
          roughness={0}
        />
      </mesh>
      <mesh ref={ring3} position={[0, 3, -6]}>
        <torusGeometry args={[1, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#FBBF24"
          emissive="#FBBF24"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </>
  );
}

export default function ScrollableCarBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scroll = Math.min(window.scrollY / (maxScroll || window.innerHeight * 2), 1);
      setScrollY(scroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ pointerEvents: "none" }}
    >
      {/* Static atmospheric glows – reduced visual noise */}
      <div className="absolute w-[720px] h-[720px] bg-cyan-500/8 -top-40 -right-40 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute w-[560px] h-[560px] bg-cyan-500/5 bottom-0 left-0 blur-[120px] rounded-full pointer-events-none" />

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 2, 8], fov: 50 }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />

          {/* Enhanced Lighting */}
          <ambientLight intensity={0.6} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.2}
            penumbra={1}
            intensity={3}
            castShadow
            color="#ffffff"
          />
          <pointLight position={[-10, 5, -10]} color="#00D9FF" intensity={3} />
          <pointLight position={[10, 5, 10]} color="#A855F7" intensity={2.5} />
          <pointLight position={[0, 10, 0]} color="#FBBF24" intensity={1} />
          <pointLight position={[0, -5, 5]} color="#00D9FF" intensity={1.5} />

          {/* Stars Background */}
          <Stars radius={100} depth={50} count={500} factor={4} fade speed={1} />

          {/* Car Model */}
          <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
            <CarModel scrollY={scrollY} />
          </Float>

          {/* Orbiting Rings */}
          <OrbitingRings scrollY={scrollY} />

          {/* Enhanced Particles */}
          <FloatingParticles />

          {/* Ground Reflection */}
          <Ground />

          {/* Enhanced Shadows */}
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.6}
            scale={25}
            blur={3}
            far={5}
            color="#000000"
          />

          {/* Environment */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}
