"use client";

import { HalftoneDots } from "@paper-design/shaders-react";
import { ReactNode, useEffect, useState, useRef } from "react";
import { useBackground } from "@/app/contexts/background-context";
import { motion, AnimatePresence } from "framer-motion";

const imageMap = {
  default: "https://paper.design/flowers.webp",
  granola: "/granola.webp",
  sonder: "/sonder.webp",
};

const HalftoneBackground = ({ children }: { children: ReactNode }) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [offset, setOffset] = useState({ x: 0.5, y: 0.5 });
  const [hasInteracted, setHasInteracted] = useState(false);
  const { activeImage } = useBackground();

  const isHovering = activeImage !== "default";

  // Track when user first hovers to enable animations
  useEffect(() => {
    if (isHovering && !hasInteracted) {
      setHasInteracted(true);
    }
  }, [isHovering, hasInteracted]);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Auto circular motion
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const speed = 0.15; // slow circular motion
      const radiusX = 0.15; // how far it moves horizontally
      const radiusY = 0.1; // how far it moves vertically

      setOffset({
        x: 0.5 + Math.cos(elapsed * speed * Math.PI * 2) * radiusX,
        y: 0.5 + Math.sin(elapsed * speed * Math.PI * 2) * radiusY,
      });
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const radius = Math.min(1.3, 0.8 + (offset.x + offset.y) * 0.4);

  return (
    <div className="relative min-h-screen bg-[#030303] text-white">
      {/* Preload images */}
      <div className="hidden">
        <img src="/granola.webp" alt="" />
        <img src="/sonder.webp" alt="" />
      </div>

      <AnimatePresence mode="sync">
        <motion.div
          key={activeImage}
          className="fixed inset-0 z-0"
          initial={hasInteracted ? { opacity: 0 } : false}
          animate={{ opacity: isHovering ? 0.7 : 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <HalftoneDots
            width={dimensions.width}
            height={dimensions.height}
            image={imageMap[activeImage]}
            colorBack="#030303"
            colorFront="#4767dc"
            originalColors={isHovering}
            type="holes"
            grid="square"
            inverted
            size={isHovering ? 0.3 : 0.87}
            radius={radius}
            contrast={isHovering ? 0.4 : 0.65}
            grainMixer={isHovering ? 0 : 0.05}
            grainOverlay={isHovering ? 0 : 0.3}
            grainSize={0.46}
            fit="cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HalftoneBackground;
