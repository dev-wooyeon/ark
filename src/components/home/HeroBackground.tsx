'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingShape(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={meshRef} {...props}>
                <torusKnotGeometry args={[10, 3, 100, 16]} />
                <meshPhysicalMaterial
                    color="#3182f6"
                    roughness={0.1}
                    metalness={0.1}
                    transmission={0.2} // Glass-like transparency
                    thickness={2}
                    clearcoat={1}
                    opacity={0.3}
                    transparent={true}
                />
            </mesh>
        </Float>
    );
}

function FloatingSymbol(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle rotation for the symbol
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
            <mesh ref={meshRef} {...props}>
                {/* Icosahedron: Symbol of structure and multifaceted perspective */}
                <icosahedronGeometry args={[4, 0]} />
                <meshPhysicalMaterial
                    color="#3182f6" // Toss Blue
                    roughness={0} // Smooth like glass
                    metalness={0.1}
                    transmission={0.6} // Semi-transparent glass
                    thickness={5} // Refraction volume
                    clearcoat={1}
                    clearcoatRoughness={0}
                    ior={1.5} // Index of refraction for glass
                />
            </mesh>
        </Float>
    );
}

export default function HeroBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 20], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <spotLight position={[50, 50, 50]} angle={0.2} penumbra={1} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3182f6" />

                {/* Main Crystal Icosahedron on the right */}
                <FloatingSymbol position={[8, 3, 0]} />

                {/* Subtle shape on the left */}
                {/* <FloatingShape position={[-10, -5, -5]} /> */}

                <Environment preset="city" />
            </Canvas>

            {/* Gradient Overlay to fade into background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
        </div>
    );
}
