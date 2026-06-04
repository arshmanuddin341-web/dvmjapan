"use client";

import { Suspense, useMemo } from "react";
import { OrbitControls, Environment, MeshDistortMaterial, Sphere, Float } from "@react-three/drei";

function AnimatedSphere() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[1, 64, 64]} scale={2}>
        <MeshDistortMaterial
          color="#fbbf24"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#fbbf24" transparent opacity={0.6} />
    </points>
  );
}

export default function AnimatedScene() {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <AnimatedSphere />
      <ParticleField />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      <Environment preset="night" />
    </Suspense>
  );
}
