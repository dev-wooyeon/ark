'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();

    // 마우스 위치에 따른 회전
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouseRef.current.y * 0.3,
      0.05
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouseRef.current.x * 0.3,
      0.05
    );

    // 자동 회전 (부드럽게)
    meshRef.current.rotation.z = t * 0.1;
  });

  // 마우스 이벤트 핸들러
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    });
  }

  return (
    <Sphere ref={meshRef} args={[1, 100, 100]} scale={3.5} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#2563EB"
        attach="material"
        distort={0.5}
        speed={1.5}
        roughness={0.1}
        metalness={0.9}
      />
    </Sphere>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight position={[-10, -10, -5]} intensity={0.7} color="#60A5FA" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#ffffff" />
      <AnimatedSphere />
    </Canvas>
  );
}
