'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

// Graph node structure
interface GraphNode {
    id: number;
    position: [number, number, number];
    connections: number[];
}

// Node component
function Node({
    position,
    label,
    isVisited,
    isActive,
    isQueued
}: {
    position: [number, number, number];
    label: string;
    isVisited: boolean;
    isActive: boolean;
    isQueued: boolean;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame(() => {
        if (meshRef.current) {
            // Pulse animation for active node
            if (isActive) {
                const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2;
                meshRef.current.scale.setScalar(scale);
            } else {
                meshRef.current.scale.setScalar(1);
            }
        }
    });

    const color = isActive
        ? '#ff6b6b'
        : isQueued
            ? '#ffd93d'
            : isVisited
                ? '#6bcf7f'
                : '#4a90e2';

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isActive ? 0.5 : 0.2}
                    roughness={0.3}
                    metalness={0.6}
                />
            </mesh>
            <Text
                position={[0, 0.6, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    );
}

// Edge component
function Edge({
    start,
    end,
    isTraversed
}: {
    start: [number, number, number];
    end: [number, number, number];
    isTraversed: boolean;
}) {
    const points = useMemo(() => [
        new THREE.Vector3(...start),
        new THREE.Vector3(...end)
    ], [start, end]);

    return (
        <Line
            points={points}
            color={isTraversed ? '#6bcf7f' : '#888888'}
            lineWidth={isTraversed ? 3 : 1}
            opacity={isTraversed ? 1 : 0.3}
            transparent
        />
    );
}

// Graph scene component
function GraphScene({
    nodes,
    visitedNodes,
    activeNode,
    queuedNodes,
    traversedEdges
}: {
    nodes: GraphNode[];
    visitedNodes: Set<number>;
    activeNode: number | null;
    queuedNodes: Set<number>;
    traversedEdges: Set<string>;
}) {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            {/* Render edges */}
            {nodes.map(node =>
                node.connections.map(targetId => {
                    const target = nodes.find(n => n.id === targetId);
                    if (!target) return null;

                    const edgeKey = `${node.id}-${targetId}`;
                    const reverseEdgeKey = `${targetId}-${node.id}`;
                    const isTraversed = traversedEdges.has(edgeKey) || traversedEdges.has(reverseEdgeKey);

                    return (
                        <Edge
                            key={edgeKey}
                            start={node.position}
                            end={target.position}
                            isTraversed={isTraversed}
                        />
                    );
                })
            )}

            {/* Render nodes */}
            {nodes.map(node => (
                <Node
                    key={node.id}
                    position={node.position}
                    label={node.id.toString()}
                    isVisited={visitedNodes.has(node.id)}
                    isActive={activeNode === node.id}
                    isQueued={queuedNodes.has(node.id)}
                />
            ))}

            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={20}
            />
        </>
    );
}

// Main visualization component
export default function GraphTraversalVisualization() {
    const [algorithm, setAlgorithm] = useState<'DFS' | 'BFS'>('DFS');
    const [isPlaying, setIsPlaying] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState<Set<number>>(new Set());
    const [activeNode, setActiveNode] = useState<number | null>(null);
    const [queuedNodes, setQueuedNodes] = useState<Set<number>>(new Set());
    const [traversedEdges, setTraversedEdges] = useState<Set<string>>(new Set());
    const [currentStep, setCurrentStep] = useState(0);
    const [traversalPath, setTraversalPath] = useState<number[]>([]);

    // Define graph structure (tree-like graph)
    const nodes: GraphNode[] = useMemo(() => [
        { id: 1, position: [0, 3, 0], connections: [2, 3, 4] },
        { id: 2, position: [-3, 1, 0], connections: [1, 5, 6] },
        { id: 3, position: [0, 1, 0], connections: [1, 7] },
        { id: 4, position: [3, 1, 0], connections: [1, 8, 9] },
        { id: 5, position: [-4, -1, 0], connections: [2] },
        { id: 6, position: [-2, -1, 0], connections: [2] },
        { id: 7, position: [0, -1, 0], connections: [3] },
        { id: 8, position: [2, -1, 0], connections: [4] },
        { id: 9, position: [4, -1, 0], connections: [4] },
    ], []);

    // DFS algorithm
    const runDFS = (startNode: number): number[] => {
        const visited = new Set<number>();
        const path: number[] = [];

        const dfs = (nodeId: number) => {
            visited.add(nodeId);
            path.push(nodeId);

            const node = nodes.find(n => n.id === nodeId);
            if (node) {
                for (const neighbor of node.connections) {
                    if (!visited.has(neighbor)) {
                        dfs(neighbor);
                    }
                }
            }
        };

        dfs(startNode);
        return path;
    };

    // BFS algorithm
    const runBFS = (startNode: number): number[] => {
        const visited = new Set<number>();
        const queue: number[] = [startNode];
        const path: number[] = [];

        visited.add(startNode);

        while (queue.length > 0) {
            const nodeId = queue.shift()!;
            path.push(nodeId);

            const node = nodes.find(n => n.id === nodeId);
            if (node) {
                for (const neighbor of node.connections) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
        }

        return path;
    };

    // Toggle play/pause
    const togglePlayPause = () => {
        if (traversalPath.length === 0 || currentStep >= traversalPath.length) {
            // Start new traversal
            setVisitedNodes(new Set());
            setActiveNode(null);
            setQueuedNodes(new Set());
            setTraversedEdges(new Set());
            setCurrentStep(0);
            const path = algorithm === 'DFS' ? runDFS(1) : runBFS(1);
            setTraversalPath(path);
            setIsPlaying(true);
        } else {
            // Toggle pause/resume
            setIsPlaying(!isPlaying);
        }
    };

    // Handle algorithm change
    const handleAlgorithmChange = (newAlgorithm: 'DFS' | 'BFS') => {
        setAlgorithm(newAlgorithm);
        // Reset visualization when algorithm changes
        setIsPlaying(false);
        setVisitedNodes(new Set());
        setActiveNode(null);
        setQueuedNodes(new Set());
        setTraversedEdges(new Set());
        setCurrentStep(0);
        setTraversalPath([]);
    };

    // Animation effect
    useEffect(() => {
        if (!isPlaying || currentStep >= traversalPath.length) {
            if (currentStep >= traversalPath.length && traversalPath.length > 0) {
                setIsPlaying(false);
                setActiveNode(null);
            }
            return;
        }

        const timer = setTimeout(() => {
            const currentNodeId = traversalPath[currentStep];
            const prevNodeId = currentStep > 0 ? traversalPath[currentStep - 1] : null;

            setActiveNode(currentNodeId);
            setVisitedNodes(prev => new Set([...prev, currentNodeId]));

            // Add traversed edge
            if (prevNodeId !== null) {
                setTraversedEdges(prev => new Set([...prev, `${prevNodeId}-${currentNodeId}`]));
            }

            // Update queued nodes for BFS
            if (algorithm === 'BFS') {
                const remainingPath = traversalPath.slice(currentStep + 1);
                setQueuedNodes(new Set(remainingPath.slice(0, 5))); // Show next 5 in queue
            }

            setCurrentStep(prev => prev + 1);
        }, 800);

        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, traversalPath, algorithm]);

    return (
        <div className="w-full space-y-4">
            {/* Traversal Path Display */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-xl">
                <h3 className="text-white font-bold text-lg mb-4">탐색 순서</h3>
                <div className="bg-slate-900/50 rounded-lg p-4 min-h-[80px]">
                    {traversalPath.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {traversalPath.map((nodeId, index) => (
                                <span
                                    key={index}
                                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${index < currentStep
                                        ? 'bg-green-500 text-white'
                                        : index === currentStep
                                            ? 'bg-red-500 text-white scale-110'
                                            : 'bg-slate-600 text-slate-300'
                                        }`}
                                >
                                    {nodeId}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-slate-400 text-sm">알고리즘을 선택하고 재생 버튼을 눌러주세요</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Canvas with Overlaid Controls */}
            <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl">
                {/* Algorithm Selection - Top Left */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <button
                        onClick={() => handleAlgorithmChange('DFS')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-sm ${algorithm === 'DFS'
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90'
                            }`}
                    >
                        DFS
                    </button>
                    <button
                        onClick={() => handleAlgorithmChange('BFS')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-sm ${algorithm === 'BFS'
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90'
                            }`}
                    >
                        BFS
                    </button>
                </div>

                {/* Play/Pause Button - Top Right */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={togglePlayPause}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all backdrop-blur-sm ${isPlaying
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                            } shadow-lg`}
                    >
                        {isPlaying ? '⏸ 일시정지' : (currentStep >= traversalPath.length && traversalPath.length > 0) ? '🔄 다시보기' : '▶ 재생'}
                    </button>
                </div>

                {/* Color Legend - Bottom */}
                <div className="absolute bottom-4 left-4 z-10 bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-white text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#4a90e2]"></div>
                            <span>미방문</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ffd93d]"></div>
                            <span>대기중</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff6b6b]"></div>
                            <span>현재</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#6bcf7f]"></div>
                            <span>완료</span>
                        </div>
                    </div>
                </div>

                {/* 3D Canvas */}
                <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
                    <color attach="background" args={['#0f172a']} />
                    <GraphScene
                        nodes={nodes}
                        visitedNodes={visitedNodes}
                        activeNode={activeNode}
                        queuedNodes={queuedNodes}
                        traversedEdges={traversedEdges}
                    />
                </Canvas>
            </div>
        </div>
    );
}
