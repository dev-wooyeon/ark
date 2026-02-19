'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Element {
  value: number;
  status:
    | 'default'
    | 'left-pointer'
    | 'right-pointer'
    | 'both-pointers'
    | 'found'
    | 'checked';
}

// 3D Box with pointer
function Box3DWithPointer({
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
    if (
      meshRef.current &&
      (status === 'left-pointer' ||
        status === 'right-pointer' ||
        status === 'both-pointers')
    ) {
      const scale = 1 + Math.sin(Date.now() * 0.008) * 0.1;
      meshRef.current.scale.setScalar(scale);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  const color =
    status === 'found'
      ? '#6bcf7f'
      : status === 'both-pointers'
        ? '#e74c3c'
        : status === 'left-pointer'
          ? '#3498db'
          : status === 'right-pointer'
            ? '#f39c12'
            : status === 'checked'
              ? '#95a5a6'
              : '#4a90e2';

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
      {(status === 'left-pointer' || status === 'both-pointers') && (
        <group position={[0, 1.3, 0]}>
          <mesh rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.2, 0.4, 3]} />
            <meshStandardMaterial
              color="#3498db"
              emissive="#3498db"
              emissiveIntensity={0.5}
            />
          </mesh>
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.25}
            color="#3498db"
            anchorX="center"
            anchorY="middle"
          >
            L
          </Text>
        </group>
      )}
      {(status === 'right-pointer' || status === 'both-pointers') && (
        <group position={[0, -1.3, 0]}>
          <mesh>
            <coneGeometry args={[0.2, 0.4, 3]} />
            <meshStandardMaterial
              color="#f39c12"
              emissive="#f39c12"
              emissiveIntensity={0.5}
            />
          </mesh>
          <Text
            position={[0, -0.5, 0]}
            fontSize={0.25}
            color="#f39c12"
            anchorX="center"
            anchorY="middle"
          >
            R
          </Text>
        </group>
      )}
    </group>
  );
}

// Scene component
function TwoPointerScene({ elements }: { elements: Element[] }) {
  const spacing = 1.2;
  const startX = (-(elements.length - 1) * spacing) / 2;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {elements.map((element, index) => (
        <Box3DWithPointer
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

export default function TwoPointerVisualization() {
  const [elements, setElements] = useState<Element[]>([]);
  const [target, setTarget] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [speed, setSpeed] = useState(800);

  // Initialize sorted array
  const initializeArray = () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const newElements: Element[] = arr.map((val) => ({
      value: val,
      status: 'default',
    }));
    setElements(newElements);
    setTarget(15); // Default target sum
    setMessage('');
    setIsPlaying(false);
  };

  useEffect(() => {
    initializeArray();
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const twoPointerSearch = async () => {
    setIsPlaying(true);
    const arr = [...elements];
    let left = 0;
    let right = arr.length - 1;
    let steps = 0;

    // Reset all to default
    arr.forEach((el) => (el.status = 'default'));
    setElements([...arr]);
    await sleep(speed);

    while (left < right) {
      steps++;

      // Mark checked elements
      for (let i = 0; i < left; i++) {
        if (arr[i].status !== 'found') arr[i].status = 'checked';
      }
      for (let i = right + 1; i < arr.length; i++) {
        if (arr[i].status !== 'found') arr[i].status = 'checked';
      }

      // Mark pointers
      if (left === right) {
        arr[left].status = 'both-pointers';
      } else {
        arr[left].status = 'left-pointer';
        arr[right].status = 'right-pointer';
      }

      setElements([...arr]);
      const sum = arr[left].value + arr[right].value;
      setMessage(
        `Step ${steps}: arr[${left}] + arr[${right}] = ${arr[left].value} + ${arr[right].value} = ${sum}`
      );
      await sleep(speed);

      if (sum === target) {
        arr[left].status = 'found';
        arr[right].status = 'found';
        setElements([...arr]);
        setMessage(
          `✅ 찾았습니다! [${arr[left].value}, ${arr[right].value}] = ${target} (${steps}번 만에 발견)`
        );
        setIsPlaying(false);
        return;
      }

      if (sum < target) {
        setMessage(`${sum} < ${target} → Left 포인터 이동 (오른쪽으로)`);
        await sleep(speed * 0.7);
        left++;
      } else {
        setMessage(`${sum} > ${target} → Right 포인터 이동 (왼쪽으로)`);
        await sleep(speed * 0.7);
        right--;
      }
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
                  목표 합:
                </label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  disabled={isPlaying}
                  className="px-3 py-2 bg-slate-700 text-white rounded-lg w-20 text-center font-bold disabled:opacity-50"
                  min="3"
                  max="19"
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
                onClick={twoPointerSearch}
                disabled={isPlaying}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
              >
                {isPlaying ? (
                  '탐색 중...'
                ) : (
                  <>
                    <span className="tossface mr-1">▶</span>탐색 시작
                  </>
                )}
              </button>
              <button
                onClick={initializeArray}
                disabled={isPlaying}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 disabled:opacity-50 transition-all"
              >
                <span className="tossface mr-1">🔄</span>초기화
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-white text-sm font-mono">{message}</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm">
              <span className="tossface mr-1">💡</span>
              <strong>투 포인터 알고리즘:</strong> 정렬된 배열에서 두
              포인터를 양 끝에서 시작하여, 합이 목표값보다 작으면 왼쪽 포인터를
              오른쪽으로, 크면 오른쪽 포인터를 왼쪽으로 이동합니다.
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
              <span>Left 포인터</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f39c12]"></div>
              <span>Right 포인터</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#95a5a6]"></div>
              <span>확인 완료</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6bcf7f]"></div>
              <span>정답!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
          <color attach="background" args={['#0f172a']} />
          <TwoPointerScene elements={elements} />
        </Canvas>
      </div>
    </div>
  );
}
