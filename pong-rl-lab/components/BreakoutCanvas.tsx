"use client";

import { useEffect, useRef } from "react";
import type { PongMetrics } from "@/lib/pong-engine";

type BreakoutCanvasProps = {
  skill: number;
  seed?: number;
  onMetrics?: (metrics: PongMetrics) => void;
};

type Brick = { x: number; y: number; alive: boolean; color: string };

export default function BreakoutCanvas({ skill, seed = 1, onMetrics }: BreakoutCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onMetricsRef = useRef(onMetrics);

  useEffect(() => { onMetricsRef.current = onMetrics; }, [onMetrics]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const width = 600; const height = 340; const paddleW = 82; const paddleY = 304;
    let paddleX = width / 2 - paddleW / 2;
    let ball = { x: 320, y: 226, vx: 132, vy: 154, r: 5 };
    let score = 0; let hits = 0; let bestHits = 0; let episode = 1; let wins = 0; let losses = 0;
    let random = seed >>> 0;
    const rand = () => { random = (random * 1664525 + 1013904223) >>> 0; return random / 4294967296; };
    const colors = ["#ff5b2e", "#ff8534", "#ffb23e", "#ffcf66"];
    let bricks: Brick[] = [];
    const reset = () => {
      bricks = Array.from({ length: 32 }, (_, i) => ({ x: 52 + (i % 8) * 63, y: 36 + Math.floor(i / 8) * 17, alive: true, color: colors[Math.floor(i / 8)] }));
      paddleX = width / 2 - paddleW / 2;
      ball = { x: 278 + rand() * 44, y: 218, vx: (rand() > .5 ? 1 : -1) * (120 + rand() * 28), vy: 150, r: 5 };
      hits = 0;
    };
    reset();
    let frame = 0; let last = performance.now(); let lastMetric = 0;
    const endEpisode = (won: boolean) => { bestHits = Math.max(bestHits, hits); if (won) wins += 1; else losses += 1; episode += 1; reset(); };
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); const rect = canvas.getBoundingClientRect(); const displayW = Math.max(1, rect.width); const displayH = displayW * height / width;
      if (canvas.width !== Math.floor(displayW * dpr) || canvas.height !== Math.floor(displayH * dpr)) { canvas.width = Math.floor(displayW * dpr); canvas.height = Math.floor(displayH * dpr); }
      ctx.setTransform(displayW / width * dpr, 0, 0, displayH / height * dpr, 0, 0); ctx.clearRect(0, 0, width, height); ctx.fillStyle = "#090a0f"; ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255,255,255,.045)"; for (let x = 0; x < width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      bricks.forEach((brick) => { if (!brick.alive) return; ctx.fillStyle = brick.color; ctx.fillRect(brick.x, brick.y, 54, 10); });
      ctx.shadowColor = "rgba(255,107,0,.75)"; ctx.shadowBlur = 14; ctx.fillStyle = "#ff6b00"; ctx.fillRect(paddleX, paddleY, paddleW, 7); ctx.shadowBlur = 0;
      ctx.shadowColor = "rgba(255,250,245,.8)"; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fillStyle = "#fffaf5"; ctx.fill(); ctx.shadowBlur = 0;
    };
    const tick = (now: number) => {
      const dt = Math.min(.035, (now - last) / 1000); last = now;
      const target = ball.x - paddleW / 2 + (1 - skill) * (rand() - .5) * 150;
      paddleX += Math.max(-1, Math.min(1, target - paddleX)) * (90 + skill * 440) * dt; paddleX = Math.max(14, Math.min(width - paddleW - 14, paddleX));
      ball.x += ball.vx * dt; ball.y += ball.vy * dt;
      if (ball.x < ball.r || ball.x > width - ball.r) { ball.vx *= -1; ball.x = Math.max(ball.r, Math.min(width - ball.r, ball.x)); }
      if (ball.y < ball.r) { ball.vy *= -1; ball.y = ball.r; }
      if (ball.vy > 0 && ball.y + ball.r >= paddleY && ball.y - ball.r < paddleY + 9 && ball.x >= paddleX && ball.x <= paddleX + paddleW) { ball.vy = -Math.abs(ball.vy); ball.vx += ((ball.x - (paddleX + paddleW / 2)) / paddleW) * 55; hits += 1; }
      for (const brick of bricks) if (brick.alive && ball.y - ball.r < brick.y + 10 && ball.y + ball.r > brick.y && ball.x > brick.x && ball.x < brick.x + 54) { brick.alive = false; ball.vy *= -1; score += 1; hits += 1; break; }
      if (!bricks.some((brick) => brick.alive)) endEpisode(true); else if (ball.y > height + 9) endEpisode(false);
      draw();
      if (now - lastMetric > 140) { lastMetric = now; const total = wins + losses; onMetricsRef.current?.({ agentScore: score, opponentScore: 32 - bricks.filter((brick) => brick.alive).length, rally: hits, longestRally: bestHits, episode, cumulativeReward: score - losses, averageReward: score / Math.max(1, episode), wins, losses, winRate: total ? wins / total * 100 : 0, skill }); }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [seed, skill]);
  return <canvas ref={canvasRef} className="block aspect-[30/17] w-full rounded-xl" aria-label="Simulación de aprendizaje por refuerzo en Breakout" />;
}
