import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Icosahedron } from "@react-three/drei";

const AnimatedMesh = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.08;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <Icosahedron ref={meshRef} args={[2.2, 1]} position={[2, 0, 0]}>
        <MeshDistortMaterial
          color="#7c3aed"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.4}
          wireframe
          transparent
          opacity={0.6}
        />
      </Icosahedron>
    </Float>
  );
};

const SecondaryMesh = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * -0.05;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.5, 32, 32]} position={[-3, -1, -2]}>
        <MeshDistortMaterial
          color="#06b6d4"
          attach="material"
          distort={0.25}
          speed={2}
          roughness={0.5}
          wireframe
          transparent
          opacity={0.4}
        />
      </Sphere>
    </Float>
  );
};

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#7c3aed" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#06b6d4" />
          <AnimatedMesh />
          <SecondaryMesh />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default HeroBackground;
