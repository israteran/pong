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
  humanLeft?: boolean;
  playerDirection?: -1 | 0 | 1;
  onMetrics?: (metrics: PongMetrics) => void;
};

type TrailPoint = { x: number; y: number };

function predictedIntercept(ball: { x: number; y: number; vx: number; vy: number; r: number }, targetX: number, height: number) {
  if (ball.vx <= 0) return null;
  const travelTime = (targetX - ball.x) / ball.vx;
  if (travelTime <= 0) return null;
  const top = ball.r;
  const bottom = height - ball.r;
  let y = ball.y + ball.vy * travelTime;
  while (y < top || y > bottom) y = y < top ? top + (top - y) : bottom - (y - bottom);
  return y;
}

export default function PongCanvas({
  skill,
  running = true,
  speed = 1,
  learning = false,
  resetToken = 0,
  seed = 1,
  humanLeft = false,
  playerDirection = 0,
  onMetrics,
}: PongCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<PongEngine | null>(null);
  const onMetricsRef = useRef(onMetrics);
  const runningRef = useRef(running);
  const speedRef = useRef(speed);
  const playerDirectionRef = useRef(playerDirection);

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
    playerDirectionRef.current = playerDirection;
  }, [playerDirection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const engine = new PongEngine({ width: 600, height: 340, skill, learning, seed, humanLeft });
    engineRef.current = engine;
    let frame = 0;
    let last = performance.now();
    let lastMetricUpdate = 0;
    let ballTrail: TrailPoint[] = [];
    let paddleTrail: number[] = [];

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
      ctx.fillStyle = "#090a0f";
      ctx.fillRect(0, 0, 600, 340);

      ctx.strokeStyle = "rgba(196, 180, 165, 0.2)";
      ctx.lineWidth = 1;
      for (let y = 10; y < 340; y += 18) {
        ctx.beginPath();
        ctx.moveTo(300, y);
        ctx.lineTo(300, y + 8);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(251, 146, 60, 0.1)";
      for (let x = 0; x <= 600; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 340); ctx.stroke();
      }
      for (let y = 0; y <= 340; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(600, y); ctx.stroke();
      }

      const agentColor = skill < 0.4 ? "#fb7185" : skill < 0.8 ? "#fbbf24" : "#fb923c";
      const prediction = predictedIntercept(engine.ball, 600 - 22 - engine.paddleW, 340);
      const uncertainty = 10 + (1 - skill) * 62;
      const confidence = Math.round((0.16 + skill * 0.84) * 100);

      if (prediction !== null) {
        const targetX = 600 - 22 - engine.paddleW;
        const visualPrediction = engine.ball.y * (1 - skill) + prediction * skill;
        ctx.fillStyle = `${agentColor}18`;
        ctx.fillRect(targetX - 7, visualPrediction - uncertainty, 24, uncertainty * 2);
        ctx.setLineDash(skill < 0.45 ? [4, 8] : [7, 5]);
        ctx.strokeStyle = `${agentColor}${skill < 0.45 ? "70" : "b8"}`;
        ctx.lineWidth = skill < 0.45 ? 1 : 1.5;
        ctx.beginPath();
        ctx.moveTo(engine.ball.x, engine.ball.y);
        ctx.lineTo(targetX + 3, visualPrediction);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = agentColor;
        ctx.globalAlpha = 0.32 + skill * 0.5;
        ctx.fillRect(targetX - 4, visualPrediction - 2, 18, 4);
        ctx.globalAlpha = 1;
      }

      paddleTrail.forEach((y, index) => {
        const age = (index + 1) / paddleTrail.length;
        ctx.fillStyle = agentColor;
        ctx.globalAlpha = age * (0.05 + (1 - skill) * 0.17);
        ctx.fillRect(600 - 22 - engine.paddleW - 5 * age, y, engine.paddleW, engine.paddleH);
      });
      ctx.globalAlpha = 1;

      ctx.fillStyle = "rgba(255, 247, 237, .88)";
      ctx.fillRect(22, engine.leftY, engine.paddleW, engine.paddleH);

      ctx.shadowColor = agentColor;
      ctx.shadowBlur = 9 + skill * 10;
      ctx.fillStyle = agentColor;
      ctx.fillRect(600 - 22 - engine.paddleW, engine.rightY, engine.paddleW, engine.paddleH);
      ctx.shadowBlur = 0;

      ballTrail.forEach((point, index) => {
        const age = (index + 1) / ballTrail.length;
        ctx.beginPath();
        ctx.arc(point.x, point.y, engine.ball.r * (0.24 + age * 0.46), 0, Math.PI * 2);
        ctx.fillStyle = "#fff7ed";
        ctx.globalAlpha = age * 0.42;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowColor = "rgba(255, 247, 237, .7)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(engine.ball.x, engine.ball.y, engine.ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff7ed";
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255,247,237,.62)";
      ctx.font = "600 10px Inter, system-ui, sans-serif";
      ctx.fillText("PREDICTION", 18, 22);
      ctx.fillStyle = agentColor;
      ctx.font = "700 12px Inter, system-ui, sans-serif";
      ctx.fillText(`${confidence}% CONFIDENCE`, 18, 38);
    };

    const tick = (now: number) => {
      const elapsed = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (runningRef.current) {
        engine.setPlayerDirection(playerDirectionRef.current);
        const simulated = elapsed * speedRef.current;
        const step = 1 / 120;
        const iterations = Math.max(1, Math.ceil(simulated / step));
        const subDt = simulated / iterations;
        for (let i = 0; i < iterations; i += 1) engine.step(subDt);
      }
      ballTrail.push({ x: engine.ball.x, y: engine.ball.y });
      ballTrail = ballTrail.slice(-Math.round(5 + skill * 16));
      paddleTrail.push(engine.rightY);
      paddleTrail = paddleTrail.slice(-7);
      draw();
      if (now - lastMetricUpdate > 140) {
        lastMetricUpdate = now;
        onMetricsRef.current?.(engine.getMetrics());
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [skill, learning, seed, resetToken, humanLeft]);

  return <canvas ref={canvasRef} className="block aspect-[30/17] w-full rounded-xl" aria-label="Pong reinforcement learning simulation" />;
}
