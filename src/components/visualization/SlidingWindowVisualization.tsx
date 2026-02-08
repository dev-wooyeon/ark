'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Element {
  value: number;
  status: 'default' | 'in-window' | 'max-window' | 'passed';
}

// 3D Box component
function Box3DWindow({
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
    if (meshRef.current && status === 'max-window') {
      const scale = 1 + Math.sin(Date.now() * 0.008) * 0.12;
      meshRef.current.scale.setScalar(scale);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  const color =
    status === 'max-window'
      ? '#6bcf7f'
      : status === 'in-window'
        ? '#3498db'
        : status === 'passed'
          ? '#95a5a6'
          : '#4a90e2';

  const opacity = status === 'passed' ? 0.4 : 1;

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={status === 'max-window' ? 0.6 : 0.3}
          roughness={0.3}
          metalness={0.6}
          transparent={status === 'passed'}
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
    </group>
  );
}

// Window frame component
function WindowFrame({
  position,
  width,
}: {
  position: [number, number, number];
  width: number;
}) {
  return (
    <group position={position}>
      {/* Top bar */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[width + 0.2, 0.1, 0.1]} />
        <meshStandardMaterial
          color="#e74c3c"
          emissive="#e74c3c"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Bottom bar */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[width + 0.2, 0.1, 0.1]} />
        <meshStandardMaterial
          color="#e74c3c"
          emissive="#e74c3c"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Left bar */}
      <mesh position={[-(width + 0.2) / 2, 0, 0]}>
        <boxGeometry args={[0.1, 1.3, 0.1]} />
        <meshStandardMaterial
          color="#e74c3c"
          emissive="#e74c3c"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Right bar */}
      <mesh position={[(width + 0.2) / 2, 0, 0]}>
        <boxGeometry args={[0.1, 1.3, 0.1]} />
        <meshStandardMaterial
          color="#e74c3c"
          emissive="#e74c3c"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// Scene component
function SlidingWindowScene({
  elements,
  windowStart,
  windowSize,
}: {
  elements: Element[];
  windowStart: number;
  windowSize: number;
}) {
  const spacing = 1.2;
  const startX = (-(elements.length - 1) * spacing) / 2;
  const windowCenterX = startX + (windowStart + windowSize / 2 - 0.5) * spacing;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Window frame */}
      {windowStart >= 0 && (
        <WindowFrame
          position={[windowCenterX, 0, -0.3]}
          width={windowSize * spacing - 0.3}
        />
      )}

      {/* Elements */}
      {elements.map((element, index) => (
        <Box3DWindow
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

export default function SlidingWindowVisualization() {
  const [elements, setElements] = useState<Element[]>([]);
  const [windowSize, setWindowSize] = useState(3);
  const [windowStart, setWindowStart] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [maxSum, setMaxSum] = useState(0);
  const [maxWindowStart, setMaxWindowStart] = useState(-1);
  const [speed, setSpeed] = useState(800);

  // Initialize array
  const initializeArray = () => {
    const newElements: Element[] = [];
    for (let i = 0; i < 10; i++) {
      newElements.push({
        value: Math.floor(Math.random() * 9) + 1,
        status: 'default',
      });
    }
    setElements(newElements);
    setWindowStart(-1);
    setMaxSum(0);
    setMaxWindowStart(-1);
    setMessage('');
    setIsPlaying(false);
  };

  useEffect(() => {
    initializeArray();
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const slidingWindow = async () => {
    setIsPlaying(true);
    const arr = [...elements];
    let currentMax = 0;
    let currentMaxStart = 0;

    // Reset all to default
    arr.forEach((el) => (el.status = 'default'));
    setElements([...arr]);
    await sleep(speed);

    // Calculate first window
    let windowSum = 0;
    for (let i = 0; i < windowSize; i++) {
      windowSum += arr[i].value;
      arr[i].status = 'in-window';
    }

    setWindowStart(0);
    setElements([...arr]);
    currentMax = windowSum;
    currentMaxStart = 0;
    setMaxSum(currentMax);
    setMaxWindowStart(currentMaxStart);
    setMessage(`초기 윈도우 [0-${windowSize - 1}]: 합 = ${windowSum}`);
    await sleep(speed * 1.5);

    // Slide window
    for (let i = windowSize; i < arr.length; i++) {
      const step = i - windowSize + 1;

      // Remove leftmost element from window
      arr[i - windowSize].status = 'passed';

      // Add rightmost element to window
      arr[i].status = 'in-window';

      // Update sum
      windowSum = windowSum - arr[i - windowSize].value + arr[i].value;

      setWindowStart(step);
      setElements([...arr]);
      setMessage(
        `윈도우 [${step}-${i}]: 합 = ${windowSum} (제거: ${arr[i - windowSize].value}, 추가: ${arr[i].value})`
      );
      await sleep(speed);

      // Update max
      if (windowSum > currentMax) {
        // Reset previous max window
        for (let j = currentMaxStart; j < currentMaxStart + windowSize; j++) {
          if (arr[j].status === 'max-window') {
            arr[j].status = j < step ? 'passed' : 'in-window';
          }
        }

        currentMax = windowSum;
        currentMaxStart = step;
        setMaxSum(currentMax);
        setMaxWindowStart(currentMaxStart);

        // Mark new max window
        for (let j = step; j <= i; j++) {
          arr[j].status = 'max-window';
        }
        setElements([...arr]);
        setMessage(
          `✨ 새로운 최대값 발견! 윈도우 [${step}-${i}]: 합 = ${windowSum}`
        );
        await sleep(speed * 1.5);
      }
    }

    setMessage(
      `✅ 완료! 최대 합: ${currentMax} (윈도우 [${currentMaxStart}-${currentMaxStart + windowSize - 1}])`
    );
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
                  윈도우 크기:
                </label>
                <input
                  type="number"
                  value={windowSize}
                  onChange={(e) =>
                    setWindowSize(
                      Math.max(2, Math.min(5, Number(e.target.value)))
                    )
                  }
                  disabled={isPlaying}
                  className="px-3 py-2 bg-slate-700 text-white rounded-lg w-16 text-center font-bold disabled:opacity-50"
                  min="2"
                  max="5"
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
                onClick={slidingWindow}
                disabled={isPlaying}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
              >
                {isPlaying ? '실행 중...' : '▶ 시작'}
              </button>
              <button
                onClick={initializeArray}
                disabled={isPlaying}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 disabled:opacity-50 transition-all"
              >
                🔄 새 배열
              </button>
            </div>
          </div>

          {/* Stats */}
          {maxSum > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-300 text-sm">
                  <strong>현재 윈도우:</strong>{' '}
                  {windowStart >= 0
                    ? `[${windowStart}-${windowStart + windowSize - 1}]`
                    : '-'}
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-300 text-sm">
                  <strong>최대 합:</strong> {maxSum} (윈도우 [{maxWindowStart}-
                  {maxWindowStart + windowSize - 1}])
                </p>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-white text-sm font-mono">{message}</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <p className="text-purple-300 text-sm">
              💡 <strong>슬라이딩 윈도우:</strong> 고정 크기의 윈도우를 한 칸씩
              이동하며, 이전 계산 결과를 재사용하여 O(n) 시간에 최대/최소값을
              찾습니다.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-white text-sm pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4a90e2]"></div>
              <span>미확인</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3498db]"></div>
              <span>현재 윈도우</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6bcf7f]"></div>
              <span>최대 합 윈도우</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#95a5a6]"></div>
              <span>지나감</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
          <color attach="background" args={['#0f172a']} />
          <SlidingWindowScene
            elements={elements}
            windowStart={windowStart}
            windowSize={windowSize}
          />
        </Canvas>
      </div>
    </div>
  );
}
