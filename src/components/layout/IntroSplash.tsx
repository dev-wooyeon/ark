'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

function PrismCore(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Smooth complex rotation
            meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
            meshRef.current.rotation.y += 0.02;
        }
    });

    return (
        <Float speed={5} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} {...props}>
                <icosahedronGeometry args={[1, 0]} />
                <meshPhysicalMaterial
                    color="#3182f6" // Toss Blue
                    roughness={0.15} // Matte glass feel
                    metalness={0.1}
                    transmission={0.4}
                    thickness={3}
                    clearcoat={1}
                    clearcoatRoughness={0.2}
                    ior={1.4}
                />
            </mesh>
        </Float>
    );
}

export default function IntroSplash() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500); // Show for 2.5 seconds (Toss-like short intro)

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }} // Toss easing
                >
                    {/* Logo Container */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-64 h-64 relative"
                    >
                        <Canvas gl={{ alpha: true }}>
                            <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                            <ambientLight intensity={1} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                            <pointLight position={[-10, -10, -10]} intensity={2} color="#3182f6" />

                            <PrismCore scale={1.2} />

                            <Environment preset="city" />
                        </Canvas>
                    </motion.div>

                    {/* Text entering */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="absolute bottom-20 text-[var(--color-grey-500)] font-medium text-sm tracking-widest"
                    >
                        eunu.log
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
