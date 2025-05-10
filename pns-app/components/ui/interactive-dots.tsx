"use client";

import React, { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  vx: number;
  radius: number;
  jumpHeight: number;
  jumpPhase: number;
  opacity: number;
}

export function InteractiveDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<Dot[]>([]);
  const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to document size
    const resizeCanvas = () => {
      canvas.width = document.documentElement.scrollWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize dots
    const initDots = () => {
      const numDots = 30;
      dots.current = Array.from({ length: numDots }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 4 + 2,
        jumpHeight: Math.random() * 40 + 20,
        jumpPhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.3 + 0.3,
      }));
    };
    initDots();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw dots
      dots.current.forEach((dot) => {
        // Update position
        dot.x += dot.vx;
        dot.jumpPhase += 0.03;

        // Calculate vertical position using sine wave for jumping
        const baseY = dot.y;
        const jumpOffset = Math.sin(dot.jumpPhase) * dot.jumpHeight;
        const currentY = baseY - jumpOffset;

        // Wrap around horizontally
        if (dot.x < 0) dot.x = canvas.width;
        if (dot.x > canvas.width) dot.x = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, currentY, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 48, 110, ${dot.opacity})`;
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "transparent",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -10,
      }}
    />
  );
}
