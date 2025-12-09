"use client";

import { HalftoneDots } from "@paper-design/shaders-react";
import { ReactNode, useEffect, useState } from "react";

const HalftoneBackground = ({ children }: { children: ReactNode }) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [mouseOffset, setMouseOffset] = useState({ x: 0.5, y: 0.5, dist: 0 });

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized mouse position (0 to 1)
      const normalizedX = e.clientX / window.innerWidth;
      const normalizedY = e.clientY / window.innerHeight;

      // Distance from center (0 to ~0.7)
      const centerX = normalizedX - 0.5;
      const centerY = normalizedY - 0.5;
      const distFromCenter = Math.sqrt(centerX * centerX + centerY * centerY);

      setMouseOffset({
        x: normalizedX,
        y: normalizedY,
        dist: distFromCenter
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const radius = Math.min(1.3, 0.8 + (mouseOffset.x + mouseOffset.y) * 0.4);
  console.log("radius:", radius.toFixed(3));

  return (
    <div className="relative min-h-screen bg-[#030303] text-white">
      <div className="fixed inset-0 z-0 opacity-40">
        <HalftoneDots
          width={dimensions.width}
          height={dimensions.height}
          image="https://paper.design/flowers.webp"
          colorBack="#030303"
          colorFront="#4767dc"
          originalColors={false}
          type="holes"
          grid="square"
          inverted
          size={0.87}
          radius={radius}
          contrast={0.65}
          grainMixer={0.05}
          grainOverlay={0.3}
          grainSize={0.46}
          fit="cover"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HalftoneBackground;
