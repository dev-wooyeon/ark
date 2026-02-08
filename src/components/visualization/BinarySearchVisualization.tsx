'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Element {
  value: number;
  status: 'default' | 'left' | 'right' | 'mid' | 'found' | 'excluded';
}

// 3D Box component
function Box3D({
  position,
  value,
  status,
}: {
  position: [number, number, number];
  value: number;
  status: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && status === 'mid') {
      const scale = 1 + Math.sin(Date.now() * 0.005) * 0.15;
      meshRef.current.scale.setScalar(scale);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  const color =
    status === 'found'
      ? '#6bcf7f'
      : status === 'mid'
        ? '#ff6b6b'
        : status === 'left'
          ? '#ffd93d'
          : status === 'right'
            ? '#ffd93d'
            : status === 'excluded'
              ? '#2c3e50'
              : '#4a90e2';

  const opacity = status === 'excluded' ? 0.3 : 1;

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={status === 'found' ? 0.6 : 0.3}
          roughness={0.3}
          metalness={0.6}
          transparent={status === 'excluded'}
          opacity={opacity}
        />
      </mesh>
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
      {status === 'left' && (
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.25}
          color="#ffd93d"
          anchorX="center"
          anchorY="middle"
        >
          L
        </Text>
      )}
      {status === 'right' && (
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.25}
          color="#ffd93d"
          anchorX="center"
          anchorY="middle"
        >
          R
        </Text>
      )}
      {status === 'mid' && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.3}
          color="#ff6b6b"
          anchorX="center"
          anchorY="middle"
        >
          MID
        </Text>
      )}
    </group>
  );
}

// Scene component
function BinarySearchScene({ elements }: { elements: Element[] }) {
  const spacing = 1.2;
  const startX = (-(elements.length - 1) * spacing) / 2;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {elements.map((element, index) => (
        <Box3D
          key={index}
          position={[startX + index * spacing, 0, 0]}
          value={element.value}
          status={element.status}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={20}
      />
    </>
  );
}

export default function BinarySearchVisualization() {
  const [elements, setElements] = useState<Element[]>([]);
  const [target, setTarget] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [speed, setSpeed] = useState(800);

  // Initialize sorted array
  const initializeArray = () => {
    const newElements: Element[] = [];
    for (let i = 0; i < 12; i++) {
      newElements.push({
        value: (i + 1) * 5,
        status: 'default',
      });
    }
    setElements(newElements);
    setTarget(
      newElements[Math.floor(Math.random() * newElements.length)].value
    );
    setMessage('');
    setIsPlaying(false);
  };

  useEffect(() => {
    initializeArray();
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const binarySearch = async () => {
    setIsPlaying(true);
    const arr = [...elements];
    let left = 0;
    let right = arr.length - 1;
    let steps = 0;

    // Reset all to default
    arr.forEach((el) => (el.status = 'default'));
    setElements([...arr]);
    await sleep(speed);

    while (left <= right) {
      steps++;

      // Mark excluded regions
      for (let i = 0; i < left; i++) {
        arr[i].status = 'excluded';
      }
      for (let i = right + 1; i < arr.length; i++) {
        arr[i].status = 'excluded';
      }

      // Mark left and right pointers
      arr[left].status = 'left';
      arr[right].status = 'right';
      setElements([...arr]);
      setMessage(`Step ${steps}: 탐색 범위 [${left}, ${right}]`);
      await sleep(speed);

      const mid = Math.floor((left + right) / 2);

      // Mark mid
      arr[mid].status = 'mid';
      setElements([...arr]);
      setMessage(
        `Step ${steps}: mid = ${mid}, arr[${mid}] = ${arr[mid].value}, target = ${target}`
      );
      await sleep(speed * 1.5);

      if (arr[mid].value === target) {
        arr[mid].status = 'found';
        setElements([...arr]);
        setMessage(`✅ 찾았습니다! ${steps}번 만에 발견 (인덱스: ${mid})`);
        setIsPlaying(false);
        return;
      }

      if (arr[mid].value < target) {
        setMessage(`${arr[mid].value} < ${target} → 오른쪽 탐색`);
        left = mid + 1;
      } else {
        setMessage(`${arr[mid].value} > ${target} → 왼쪽 탐색`);
        right = mid - 1;
      }

      await sleep(speed);
    }

    setMessage(`❌ 찾지 못했습니다 (${steps}번 탐색)`);
    setIsPlaying(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-xl">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-white text-sm font-semibold">
                  찾을 값:
                </label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  disabled={isPlaying}
                  className="px-3 py-2 bg-slate-700 text-white rounded-lg w-20 text-center font-bold disabled:opacity-50"
                  min="5"
                  max="60"
                  step="5"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-white text-sm">속도:</label>
                <input
                  type="range"
                  min="300"
                  max="1500"
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-32"
                  disabled={isPlaying}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={binarySearch}
                disabled={isPlaying}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
              >
                {isPlaying ? '탐색 중...' : '▶ 탐색 시작'}
              </button>
              <button
                onClick={initializeArray}
                disabled={isPlaying}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 disabled:opacity-50 transition-all"
              >
                🔄 초기화
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-white text-sm font-mono">{message}</p>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-white text-sm pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4a90e2]"></div>
              <span>탐색 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffd93d]"></div>
              <span>Left / Right</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff6b6b]"></div>
              <span>Mid (비교 중)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2c3e50]"></div>
              <span>제외됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6bcf7f]"></div>
              <span>찾음!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
          <color attach="background" args={['#0f172a']} />
          <BinarySearchScene elements={elements} />
        </Canvas>
      </div>
    </div>
  );
}
