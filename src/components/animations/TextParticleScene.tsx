'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  originalPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  index: number;
}

function TextParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mouseRef = useRef({ x: 0, y: 0, isExploding: false });
  const particlesRef = useRef<Particle[]>([]);
  const explosionTimeRef = useRef(0);
  const introTimeRef = useRef(0);
  const isIntroCompleteRef = useRef(false);

  // 텍스트를 파티클로 변환
  const particles = useMemo(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // 캔버스 크기 설정
    canvas.width = 400;
    canvas.height = 120;

    // 텍스트 렌더링
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('eunu', canvas.width / 2, canvas.height / 2);

    // 픽셀 데이터 추출
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const particles: Particle[] = [];

    // 샘플링 간격 (성능 최적화)
    const gap = 3;

    for (let y = 0; y < canvas.height; y += gap) {
      for (let x = 0; x < canvas.width; x += gap) {
        const index = (y * canvas.width + x) * 4;
        const alpha = imageData.data[index + 3];

        // 알파값이 있는 픽셀만 파티클로 변환
        if (alpha > 128) {
          const posX = (x - canvas.width / 2) * 0.015;
          const posY = -(y - canvas.height / 2) * 0.015;

          particles.push({
            position: new THREE.Vector3(posX, posY, 0),
            originalPosition: new THREE.Vector3(posX, posY, 0),
            velocity: new THREE.Vector3(0, 0, 0),
            index: particles.length,
          });
        }
      }
    }

    return particles;
  }, []);

  // 파티클 초기화
  useEffect(() => {
    particlesRef.current = particles.map(p => {
      // 랜덤한 시작 위치 (화면 밖에서 날아옴)
      const randomRadius = 8 + Math.random() * 4;
      const randomAngle = Math.random() * Math.PI * 2;
      const startX = Math.cos(randomAngle) * randomRadius;
      const startY = Math.sin(randomAngle) * randomRadius;

      return {
        position: new THREE.Vector3(startX, startY, (Math.random() - 0.5) * 2),
        originalPosition: p.originalPosition.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        index: p.index,
      };
    });

    // 초기 위치 설정
    if (meshRef.current) {
      const matrix = new THREE.Matrix4();
      particlesRef.current.forEach((particle, i) => {
        matrix.setPosition(particle.position);
        meshRef.current!.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [particles]);

  // 마우스 이벤트 핸들러
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleClick = () => {
      mouseRef.current.isExploding = true;
      explosionTimeRef.current = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // 애니메이션 루프
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const matrix = new THREE.Matrix4();
    const mouse3D = new THREE.Vector3(
      mouseRef.current.x * 3,
      mouseRef.current.y * 3,
      0
    );

    // 진입 애니메이션 (2초)
    if (!isIntroCompleteRef.current) {
      introTimeRef.current += delta;
      const progress = Math.min(introTimeRef.current / 2, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      particlesRef.current.forEach((particle, i) => {
        const toOriginal = particle.originalPosition.clone().sub(particle.position);
        particle.velocity.add(toOriginal.multiplyScalar(0.08 * easeProgress));
        particle.velocity.multiplyScalar(0.88);
        particle.position.add(particle.velocity);

        matrix.setPosition(particle.position);
        meshRef.current!.setMatrixAt(i, matrix);
      });

      if (progress >= 1) {
        isIntroCompleteRef.current = true;
      }

      meshRef.current.instanceMatrix.needsUpdate = true;
      return;
    }

    particlesRef.current.forEach((particle, i) => {
      // 폭발 효과
      if (mouseRef.current.isExploding) {
        explosionTimeRef.current += delta;

        if (explosionTimeRef.current < 1) {
          // 폭발 중
          const direction = particle.position.clone().sub(mouse3D).normalize();
          particle.velocity.add(direction.multiplyScalar(0.5));
        } else if (explosionTimeRef.current < 2) {
          // 복원 중
          const toOriginal = particle.originalPosition.clone().sub(particle.position);
          particle.velocity.add(toOriginal.multiplyScalar(0.1));
        } else {
          // 폭발 종료
          mouseRef.current.isExploding = false;
          explosionTimeRef.current = 0;
        }
      } else {
        // 마우스 repulsion (밀어내기)
        const distance = particle.position.distanceTo(mouse3D);
        const repulsionRadius = 1.5;

        if (distance < repulsionRadius) {
          const direction = particle.position.clone().sub(mouse3D).normalize();
          const force = (1 - distance / repulsionRadius) * 0.03;
          particle.velocity.add(direction.multiplyScalar(force));
        }

        // Spring physics (원래 위치로 복원)
        const toOriginal = particle.originalPosition.clone().sub(particle.position);
        particle.velocity.add(toOriginal.multiplyScalar(0.05));
      }

      // 속도 감쇠
      particle.velocity.multiplyScalar(0.92);

      // 위치 업데이트
      particle.position.add(particle.velocity);

      // 매트릭스 설정
      matrix.setPosition(particle.position);
      meshRef.current!.setMatrixAt(i, matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    // 전체 회전 효과 (미묘하게)
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particles.length]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial
        color="#2563EB"
        emissive="#1E40AF"
        emissiveIntensity={0.3}
        roughness={0.3}
        metalness={0.8}
      />
    </instancedMesh>
  );
}

export default function TextParticleScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#60A5FA" />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#ffffff" />
      <TextParticles />
    </Canvas>
  );
}
