'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

function PrismSymbol(props: any) {
    return (
        <mesh {...props} rotation={[0.4, 0.6, 0]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
                color="#3182f6" // Toss Blue
                roughness={0.15}
                metalness={0.1}
                transmission={0.4} // Glass-like
                thickness={3}
                clearcoat={1}
                clearcoatRoughness={0.2}
                ior={1.4}
            />
        </mesh>
    );
}

export default function ThreeTossLogo() {
    return (
        <div className="w-10 h-10 relative">
            <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={1} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={2} color="#3182f6" />
                <PrismSymbol />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
