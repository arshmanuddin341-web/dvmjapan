"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshTransmissionMaterial,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  MeshReflectorMaterial,
  TorusKnot,
  Box,
  Cylinder
} from "@react-three/drei";
import * as THREE from "three";

function LuxuryCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <TorusKnot ref={meshRef} args={[1, 0.35, 256, 32]}>
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={1}
          roughness={0}
          thickness={0.25}
          ior={1.2}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
          color="#fbbf24"
        />
      </TorusKnot>
    </Float>
  );
}

function FloatingArtifacts() {
  const group = useRef<THREE.Group>(null);
  const count = 15;

  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 0.4 + 0.1
    }));
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <Float key={i} speed={item.speed} rotationIntensity={1} floatIntensity={1}>
          <Box position={item.position} rotation={item.rotation} scale={[item.scale, item.scale * 4, item.scale]}>
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.2}
              metalness={1}
              roughness={0}
            />
          </Box>
        </Float>
      ))}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={60}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#101010"
        metalness={0.5}
        mirror={0}
      />
    </mesh>
  );
}

export default function WebGLHero() {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />

          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} color="#fbbf24" intensity={1} />

          <LuxuryCore />
          <FloatingArtifacts />

          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.4}
            scale={15}
            blur={2}
            far={4.5}
          />

          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
