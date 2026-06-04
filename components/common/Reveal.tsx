"use client";

import React from "react";
import { motion } from "framer-motion";

interface RevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    className?: string;
    delay?: number;
    y?: number;
}

/**
 * A reusable component to add premium scroll animations using Framer Motion.
 * Optimized for performance with GPU acceleration and 'once' viewport property.
 */
export default function Reveal({
    children,
    width = "100%",
    className = "",
    delay = 0.1,
    y = 25
}: RevealProps) {
    return (
        <motion.div
            className={`${className} animate-gpu`}
            style={{ width, position: "relative" }}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
        >
            {children}
        </motion.div>
    );
}
