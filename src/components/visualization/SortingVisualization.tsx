'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Bar {
    value: number;
    status: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
}

// 3D Bar component
function Bar3D({
    position,
    height,
    status
}: {
    position: [number, number, number];
    height: number;
    status: string;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            if (status === 'swapping') {
                const scale = 1 + Math.sin(Date.now() * 0.01) * 0.1;
                meshRef.current.scale.set(1, scale, 1);
            } else {
                meshRef.current.scale.set(1, 1, 1);
            }
        }
    });

    const color =
        status === 'sorted' ? '#6bcf7f' :
            status === 'comparing' ? '#ffd93d' :
                status === 'swapping' ? '#ff6b6b' :
                    status === 'pivot' ? '#9b59b6' :
                        '#4a90e2';

    return (
        <group position={position}>
            <mesh ref={meshRef} position={[0, height / 2, 0]}>
                <boxGeometry args={[0.8, height, 0.8]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.3}
                    roughness={0.3}
                    metalness={0.6}
                />
            </mesh>
            <Text
                position={[0, -0.5, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {Math.round(height * 10)}
            </Text>
        </group>
    );
}

// Scene component
function SortingScene({ bars }: { bars: Bar[] }) {
    const spacing = 1.2;
    const startX = -(bars.length - 1) * spacing / 2;

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            {bars.map((bar, index) => (
                <Bar3D
                    key={index}
                    position={[startX + index * spacing, 0, 0]}
                    height={bar.value}
                    status={bar.status}
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

export default function SortingVisualization() {
    const [algorithm, setAlgorithm] = useState<'quick' | 'merge' | 'heap'>('quick');
    const [bars, setBars] = useState<Bar[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    // Initialize random array
    const initializeArray = () => {
        const newBars: Bar[] = [];
        for (let i = 0; i < 10; i++) {
            newBars.push({
                value: Math.random() * 5 + 1,
                status: 'default'
            });
        }
        setBars(newBars);
        setIsPlaying(false);
    };

    useEffect(() => {
        initializeArray();
    }, []);

    // Quick Sort
    const quickSort = async () => {
        const arr = [...bars];

        async function partition(low: number, high: number): Promise<number> {
            const pivot = arr[high].value;
            arr[high].status = 'pivot';
            setBars([...arr]);
            await sleep(speed);

            let i = low - 1;

            for (let j = low; j < high; j++) {
                arr[j].status = 'comparing';
                setBars([...arr]);
                await sleep(speed);

                if (arr[j].value < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    arr[i].status = 'swapping';
                    arr[j].status = 'swapping';
                    setBars([...arr]);
                    await sleep(speed);
                }

                arr[j].status = 'default';
            }

            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            arr[i + 1].status = 'sorted';
            arr[high].status = 'default';
            setBars([...arr]);
            await sleep(speed);

            return i + 1;
        }

        async function quickSortHelper(low: number, high: number) {
            if (low < high) {
                const pi = await partition(low, high);
                await quickSortHelper(low, pi - 1);
                await quickSortHelper(pi + 1, high);
            } else if (low === high) {
                arr[low].status = 'sorted';
                setBars([...arr]);
            }
        }

        await quickSortHelper(0, arr.length - 1);

        // Mark all as sorted
        arr.forEach(bar => bar.status = 'sorted');
        setBars([...arr]);
        setIsPlaying(false);
    };

    // Merge Sort
    const mergeSort = async () => {
        const arr = [...bars];

        async function merge(left: number, mid: number, right: number) {
            const leftArr = arr.slice(left, mid + 1);
            const rightArr = arr.slice(mid + 1, right + 1);

            let i = 0, j = 0, k = left;

            while (i < leftArr.length && j < rightArr.length) {
                arr[k].status = 'comparing';
                setBars([...arr]);
                await sleep(speed);

                if (leftArr[i].value <= rightArr[j].value) {
                    arr[k] = { ...leftArr[i], status: 'swapping' };
                    i++;
                } else {
                    arr[k] = { ...rightArr[j], status: 'swapping' };
                    j++;
                }
                setBars([...arr]);
                await sleep(speed);
                arr[k].status = 'default';
                k++;
            }

            while (i < leftArr.length) {
                arr[k] = { ...leftArr[i], status: 'swapping' };
                setBars([...arr]);
                await sleep(speed);
                arr[k].status = 'default';
                i++;
                k++;
            }

            while (j < rightArr.length) {
                arr[k] = { ...rightArr[j], status: 'swapping' };
                setBars([...arr]);
                await sleep(speed);
                arr[k].status = 'default';
                j++;
                k++;
            }
        }

        async function mergeSortHelper(left: number, right: number) {
            if (left < right) {
                const mid = Math.floor((left + right) / 2);
                await mergeSortHelper(left, mid);
                await mergeSortHelper(mid + 1, right);
                await merge(left, mid, right);
            }
        }

        await mergeSortHelper(0, arr.length - 1);

        arr.forEach(bar => bar.status = 'sorted');
        setBars([...arr]);
        setIsPlaying(false);
    };

    // Heap Sort
    const heapSort = async () => {
        const arr = [...bars];

        async function heapify(n: number, i: number) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n) {
                arr[left].status = 'comparing';
                setBars([...arr]);
                await sleep(speed);

                if (arr[left].value > arr[largest].value) {
                    largest = left;
                }
                arr[left].status = 'default';
            }

            if (right < n) {
                arr[right].status = 'comparing';
                setBars([...arr]);
                await sleep(speed);

                if (arr[right].value > arr[largest].value) {
                    largest = right;
                }
                arr[right].status = 'default';
            }

            if (largest !== i) {
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                arr[i].status = 'swapping';
                arr[largest].status = 'swapping';
                setBars([...arr]);
                await sleep(speed);
                arr[i].status = 'default';
                arr[largest].status = 'default';

                await heapify(n, largest);
            }
        }

        // Build heap
        for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
            await heapify(arr.length, i);
        }

        // Extract elements from heap
        for (let i = arr.length - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];
            arr[0].status = 'swapping';
            arr[i].status = 'sorted';
            setBars([...arr]);
            await sleep(speed);
            arr[0].status = 'default';

            await heapify(i, 0);
        }

        arr[0].status = 'sorted';
        setBars([...arr]);
        setIsPlaying(false);
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleStart = async () => {
        setIsPlaying(true);

        if (algorithm === 'quick') {
            await quickSort();
        } else if (algorithm === 'merge') {
            await mergeSort();
        } else if (algorithm === 'heap') {
            await heapSort();
        }
    };

    const handleAlgorithmChange = (newAlgorithm: 'quick' | 'merge' | 'heap') => {
        setAlgorithm(newAlgorithm);
        initializeArray();
    };

    return (
        <div className="w-full space-y-4">
            {/* Controls */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-xl">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAlgorithmChange('quick')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${algorithm === 'quick'
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            퀵 정렬
                        </button>
                        <button
                            onClick={() => handleAlgorithmChange('merge')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${algorithm === 'merge'
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            병합 정렬
                        </button>
                        <button
                            onClick={() => handleAlgorithmChange('heap')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${algorithm === 'heap'
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            힙 정렬
                        </button>
                    </div>

                    <div className="flex gap-2 items-center">
                        <label className="text-white text-sm">속도:</label>
                        <input
                            type="range"
                            min="100"
                            max="1000"
                            step="100"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-32"
                            disabled={isPlaying}
                        />
                        <button
                            onClick={handleStart}
                            disabled={isPlaying}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
                        >
                            {isPlaying ? '정렬 중...' : '▶ 시작'}
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

                {/* Legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-white text-sm mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#4a90e2]"></div>
                        <span>기본</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ffd93d]"></div>
                        <span>비교 중</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff6b6b]"></div>
                        <span>교환 중</span>
                    </div>
                    {algorithm === 'quick' && (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#9b59b6]"></div>
                            <span>피벗</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#6bcf7f]"></div>
                        <span>정렬 완료</span>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
                    <color attach="background" args={['#0f172a']} />
                    <SortingScene bars={bars} />
                </Canvas>
            </div>
        </div>
    );
}
