"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function AmbientBackground() {
    const [mounted, setMounted] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 부드러운 스프링 애니메이션으로 따라가기
    const springConfig = { damping: 25, stiffness: 150 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        setMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    if (!mounted) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                zIndex: 0,
                pointerEvents: "none",
            }}
        >
            <motion.div
                style={{
                    position: "absolute",
                    width: "600px",
                    height: "600px",
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                    background: "radial-gradient(circle, rgba(0, 102, 204, 0.08) 0%, rgba(0, 102, 204, 0.02) 40%, rgba(0,0,0,0) 70%)",
                    filter: "blur(40px)",
                    borderRadius: "50%",
                }}
            />
        </div>
    );
}
