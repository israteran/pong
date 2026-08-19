"use client";

import { useEffect, useRef } from "react";
import { PongEngine, PongMetrics } from "@/lib/pong-engine";

type PongCanvasProps = {
  skill: number;
  running?: boolean;
  speed?: 1 | 5 | 10;
  learning?: boolean;
  resetToken?: number;
  seed?: number;
  onMetrics?: (metrics: PongMetrics) => void;
};

export default function PongCanvas({
  skill,
  running = true,
  speed = 1,
  learning = false,
  resetToken = 0,
  seed = 1,
  onMetrics,
}: PongCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<PongEngine | null>(null);
  const onMetricsRef = useRef(onMetrics);
  const runningRef = useRef(running);
  const speedRef = useRef(speed);

  useEffect(() => {
    onMetricsRef.current = onMetrics;
  }, [onMetrics]);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const engine = new PongEngine({ width: 600, height: 340, skill, learning, seed });
    engineRef.current = engine;
    let frame = 0;
    let last = performance.now();
    let lastMetricUpdate = 0;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const displayW = Math.max(1, rect.width);
      const displayH = displayW * (340 / 600);
      if (canvas.width !== Math.floor(displayW * dpr) || canvas.height !== Math.floor(displayH * dpr)) {
        canvas.width = Math.floor(displayW * dpr);
        canvas.height = Math.floor(displayH * dpr);
      }

      ctx.setTransform((displayW / 600) * dpr, 0, 0, (displayH / 340) * dpr, 0, 0);
      ctx.clearRect(0, 0, 600, 340);
      ctx.fillStyle = "#07100d";
      ctx.fillRect(0, 0, 600, 340);

      ctx.strokeStyle = "rgba(141, 167, 154, 0.2)";
      ctx.lineWidth = 1;
      for (let y = 10; y < 340; y += 18) {
        ctx.beginPath();
        ctx.moveTo(300, y);
        ctx.lineTo(300, y + 8);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(118, 247, 178, 0.08)";
      for (let x = 0; x <= 600; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 340); ctx.stroke();
      }
      for (let y = 0; y <= 340; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(600, y); ctx.stroke();
      }

      ctx.fillStyle = "rgba(238, 251, 244, .88)";
      ctx.fillRect(22, engine.leftY, engine.paddleW, engine.paddleH);

      ctx.shadowColor = "rgba(118, 247, 178, .65)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#76f7b2";
      ctx.fillRect(600 - 22 - engine.paddleW, engine.rightY, engine.paddleW, engine.paddleH);
      ctx.shadowBlur = 0;

      ctx.shadowColor = "rgba(238, 251, 244, .7)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(engine.ball.x, engine.ball.y, engine.ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#eefbf4";
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const tick = (now: number) => {
      const elapsed = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (runningRef.current) {
        const simulated = elapsed * speedRef.current;
        const step = 1 / 120;
        const iterations = Math.max(1, Math.ceil(simulated / step));
        const subDt = simulated / iterations;
        for (let i = 0; i < iterations; i += 1) engine.step(subDt);
      }
      draw();
      if (now - lastMetricUpdate > 140) {
        lastMetricUpdate = now;
        onMetricsRef.current?.(engine.getMetrics());
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [skill, learning, seed, resetToken]);

  return <canvas ref={canvasRef} className="block aspect-[30/17] w-full rounded-xl" aria-label="Pong reinforcement learning simulation" />;
}
