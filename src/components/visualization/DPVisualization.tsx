'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface DPCell {
  index: number;
  value: number | null;
  status: 'empty' | 'calculating' | 'computed' | 'using';
}

function createInitialCells(limit: number): DPCell[] {
  const newCells: DPCell[] = [];
  for (let i = 0; i <= limit; i++) {
    newCells.push({
      index: i,
      value: null,
      status: 'empty',
    });
  }

  return newCells;
}

// 3D Cell component
function Cell3D({
  position,
  index,
  value,
  status,
}: {
  position: [number, number, number];
  index: number;
  value: number | null;
  status: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && status === 'calculating') {
      const scale = 1 + Math.sin(Date.now() * 0.01) * 0.15;
      meshRef.current.scale.setScalar(scale);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  const color =
    status === 'computed'
      ? '#6bcf7f'
      : status === 'calculating'
        ? '#ff6b6b'
        : status === 'using'
          ? '#ffd93d'
          : '#4a90e2';

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.9, 0.9, 0.3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={status === 'calculating' ? 0.6 : 0.3}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
      {/* Index label */}
      <Text
        position={[0, 0.7, 0.2]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        F({index})
      </Text>
      {/* Value */}
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value !== null ? value : '?'}
      </Text>
    </group>
  );
}

// Arrow component
function Arrow({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const direction = new THREE.Vector3(
    to[0] - from[0],
    to[1] - from[1],
    to[2] - from[2]
  );
  const length = direction.length();
  direction.normalize();

  const arrowHelper = new THREE.ArrowHelper(
    direction,
    new THREE.Vector3(...from),
    length,
    0xffd93d,
    0.3,
    0.2
  );

  return <primitive object={arrowHelper} />;
}

// Scene component
function DPScene({
  cells,
  showArrows,
  arrowFrom,
  arrowTo,
}: {
  cells: DPCell[];
  showArrows: boolean;
  arrowFrom: number[];
  arrowTo: number;
}) {
  const spacing = 1.3;
  const startX = (-(cells.length - 1) * spacing) / 2;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Cells */}
      {cells.map((cell, index) => (
        <Cell3D
          key={index}
          position={[startX + index * spacing, 0, 0]}
          index={cell.index}
          value={cell.value}
          status={cell.status}
        />
      ))}

      {/* Arrows showing dependencies */}
      {showArrows &&
        arrowFrom.map((fromIdx, i) => {
          if (
            fromIdx >= 0 &&
            fromIdx < cells.length &&
            arrowTo >= 0 &&
            arrowTo < cells.length
          ) {
            return (
              <Arrow
                key={i}
                from={[startX + fromIdx * spacing, -0.5, 0.2]}
                to={[startX + arrowTo * spacing, 0.5, 0.2]}
              />
            );
          }
          return null;
        })}

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

export default function DPVisualization() {
  const [n, setN] = useState(8);
  const [cells, setCells] = useState<DPCell[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [speed, setSpeed] = useState(800);
  const [showArrows, setShowArrows] = useState(false);
  const [arrowFrom, setArrowFrom] = useState<number[]>([]);
  const [arrowTo, setArrowTo] = useState(-1);

  // Initialize DP table
  const initializeTable = () => {
    setCells(createInitialCells(n));
    setMessage('');
    setIsPlaying(false);
    setShowArrows(false);
    setArrowFrom([]);
    setArrowTo(-1);
  };

  useEffect(() => {
    setCells(createInitialCells(n));
    setMessage('');
    setIsPlaying(false);
    setShowArrows(false);
    setArrowFrom([]);
    setArrowTo(-1);
  }, [n]);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fibonacci = async () => {
    setIsPlaying(true);
    const dp = [...cells];

    // Base cases
    dp[0].value = 0;
    dp[0].status = 'calculating';
    setCells([...dp]);
    setMessage('F(0) = 0 (기저 사례)');
    await sleep(speed);
    dp[0].status = 'computed';
    setCells([...dp]);
    await sleep(speed * 0.5);

    dp[1].value = 1;
    dp[1].status = 'calculating';
    setCells([...dp]);
    setMessage('F(1) = 1 (기저 사례)');
    await sleep(speed);
    dp[1].status = 'computed';
    setCells([...dp]);
    await sleep(speed * 0.5);

    // Fill table
    for (let i = 2; i <= n; i++) {
      dp[i].status = 'calculating';
      setCells([...dp]);
      setMessage(`F(${i}) 계산 중...`);
      await sleep(speed);

      // Show dependencies
      dp[i - 1].status = 'using';
      dp[i - 2].status = 'using';
      setShowArrows(true);
      setArrowFrom([i - 2, i - 1]);
      setArrowTo(i);
      setCells([...dp]);
      setMessage(
        `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1].value} + ${dp[i - 2].value}`
      );
      await sleep(speed * 1.5);

      // Calculate
      dp[i].value = dp[i - 1].value! + dp[i - 2].value!;
      dp[i].status = 'computed';
      dp[i - 1].status = 'computed';
      dp[i - 2].status = 'computed';
      setShowArrows(false);
      setCells([...dp]);
      setMessage(`F(${i}) = ${dp[i].value} ✓`);
      await sleep(speed);
    }

    setMessage(`✅ 완료! F(${n}) = ${dp[n].value}`);
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
                  N 값:
                </label>
                <input
                  type="number"
                  value={n}
                  onChange={(e) =>
                    setN(Math.max(2, Math.min(12, Number(e.target.value))))
                  }
                  disabled={isPlaying}
                  className="px-3 py-2 bg-slate-700 text-white rounded-lg w-16 text-center font-bold disabled:opacity-50"
                  min="2"
                  max="12"
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
                onClick={fibonacci}
                disabled={isPlaying}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
              >
                {isPlaying ? (
                  '계산 중...'
                ) : (
                  <>
                    <span className="tossface mr-1">▶</span>시작
                  </>
                )}
              </button>
              <button
                onClick={initializeTable}
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
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <p className="text-purple-300 text-sm">
              <span className="tossface mr-1">💡</span>
              <strong>동적 프로그래밍 (DP):</strong> 작은 부분 문제의 결과를
              테이블에 저장하고 재사용하여, 중복 계산을 제거합니다. 피보나치는
              O(2ⁿ) → O(n)으로 최적화됩니다.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-white text-sm pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4a90e2]"></div>
              <span>미계산</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff6b6b]"></div>
              <span>계산 중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffd93d]"></div>
              <span>참조 중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6bcf7f]"></div>
              <span>계산 완료</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
          <color attach="background" args={['#0f172a']} />
          <DPScene
            cells={cells}
            showArrows={showArrows}
            arrowFrom={arrowFrom}
            arrowTo={arrowTo}
          />
        </Canvas>
      </div>
    </div>
  );
}
