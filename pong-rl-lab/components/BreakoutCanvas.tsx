"use client";

import { useEffect, useRef } from "react";
import type { PongMetrics } from "@/lib/pong-engine";

type BreakoutCanvasProps = {
  skill: number;
  seed?: number;
  onMetrics?: (metrics: PongMetrics) => void;
};

type Brick = { x: number; y: number; alive: boolean; color: string };
type TrailPoint = { x: number; y: number };
type Spark = { x: number; y: number; life: number; color: string };

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
    let ballTrail: TrailPoint[] = [];
    let paddleTrail: number[] = [];
    let sparks: Spark[] = [];
    const reset = () => {
      bricks = Array.from({ length: 32 }, (_, i) => ({ x: 52 + (i % 8) * 63, y: 36 + Math.floor(i / 8) * 17, alive: true, color: colors[Math.floor(i / 8)] }));
      paddleX = width / 2 - paddleW / 2;
      ball = { x: 278 + rand() * 44, y: 218, vx: (rand() > .5 ? 1 : -1) * (120 + rand() * 28), vy: 150, r: 5 };
      hits = 0;
      ballTrail = [];
      paddleTrail = [];
    };
    reset();
    let frame = 0; let last = performance.now(); let lastMetric = 0;
    const endEpisode = (won: boolean) => { bestHits = Math.max(bestHits, hits); if (won) wins += 1; else losses += 1; episode += 1; reset(); };
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); const rect = canvas.getBoundingClientRect(); const displayW = Math.max(1, rect.width); const displayH = displayW * height / width;
      if (canvas.width !== Math.floor(displayW * dpr) || canvas.height !== Math.floor(displayH * dpr)) { canvas.width = Math.floor(displayW * dpr); canvas.height = Math.floor(displayH * dpr); }
      ctx.setTransform(displayW / width * dpr, 0, 0, displayH / height * dpr, 0, 0); ctx.clearRect(0, 0, width, height); ctx.fillStyle = "#090a0f"; ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255,255,255,.045)"; for (let x = 0; x < width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      const agentColor = skill < .4 ? "#fb7185" : skill < .8 ? "#fbbf24" : "#fb923c";
      const confidence = Math.round((.16 + skill * .84) * 100);
      if (ball.vy > 0) {
        const travelTime = (paddleY - ball.y) / ball.vy;
        let interceptX = ball.x + ball.vx * Math.max(0, travelTime);
        while (interceptX < ball.r || interceptX > width - ball.r) interceptX = interceptX < ball.r ? ball.r + (ball.r - interceptX) : width - ball.r - (interceptX - (width - ball.r));
        const projectedX = ball.x * (1 - skill) + interceptX * skill;
        const uncertainty = 12 + (1 - skill) * 74;
        ctx.fillStyle = `${agentColor}18`;
        ctx.fillRect(projectedX - uncertainty, paddleY - 8, uncertainty * 2, 24);
        ctx.setLineDash(skill < .45 ? [4, 8] : [7, 5]);
        ctx.strokeStyle = `${agentColor}${skill < .45 ? "70" : "b8"}`;
        ctx.lineWidth = skill < .45 ? 1 : 1.5;
        ctx.beginPath(); ctx.moveTo(ball.x, ball.y); ctx.lineTo(projectedX, paddleY); ctx.stroke(); ctx.setLineDash([]);
      }
      bricks.forEach((brick) => { if (!brick.alive) return; ctx.fillStyle = brick.color; ctx.fillRect(brick.x, brick.y, 54, 10); });
      sparks.forEach((spark) => { ctx.globalAlpha = spark.life; ctx.fillStyle = spark.color; ctx.fillRect(spark.x, spark.y, 3, 3); }); ctx.globalAlpha = 1;
      paddleTrail.forEach((x, index) => { const age = (index + 1) / paddleTrail.length; ctx.globalAlpha = age * (.05 + (1 - skill) * .17); ctx.fillStyle = agentColor; ctx.fillRect(x, paddleY + 3, paddleW, 5); }); ctx.globalAlpha = 1;
      ctx.shadowColor = agentColor; ctx.shadowBlur = 9 + skill * 10; ctx.fillStyle = agentColor; ctx.fillRect(paddleX, paddleY, paddleW, 7); ctx.shadowBlur = 0;
      ballTrail.forEach((point, index) => { const age = (index + 1) / ballTrail.length; ctx.beginPath(); ctx.arc(point.x, point.y, ball.r * (.25 + age * .45), 0, Math.PI * 2); ctx.fillStyle = "#fffaf5"; ctx.globalAlpha = age * .42; ctx.fill(); }); ctx.globalAlpha = 1;
      ctx.shadowColor = "rgba(255,250,245,.8)"; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fillStyle = "#fffaf5"; ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,247,237,.62)"; ctx.font = "600 10px Inter, system-ui, sans-serif"; ctx.fillText("PREDICTION", 18, 22);
      ctx.fillStyle = agentColor; ctx.font = "700 12px Inter, system-ui, sans-serif"; ctx.fillText(`${confidence}% CONFIDENCE`, 18, 38);
    };
    const tick = (now: number) => {
      const dt = Math.min(.035, (now - last) / 1000); last = now;
      const target = ball.x - paddleW / 2 + (1 - skill) * (rand() - .5) * 150;
      paddleX += Math.max(-1, Math.min(1, target - paddleX)) * (90 + skill * 440) * dt; paddleX = Math.max(14, Math.min(width - paddleW - 14, paddleX));
      ball.x += ball.vx * dt; ball.y += ball.vy * dt;
      ballTrail.push({ x: ball.x, y: ball.y }); ballTrail = ballTrail.slice(-Math.round(5 + skill * 16));
      paddleTrail.push(paddleX); paddleTrail = paddleTrail.slice(-7);
      sparks = sparks.map((spark) => ({ ...spark, y: spark.y + (1 - spark.life) * 2, life: spark.life - dt * 2.2 })).filter((spark) => spark.life > 0);
      if (ball.x < ball.r || ball.x > width - ball.r) { ball.vx *= -1; ball.x = Math.max(ball.r, Math.min(width - ball.r, ball.x)); }
      if (ball.y < ball.r) { ball.vy *= -1; ball.y = ball.r; }
      if (ball.vy > 0 && ball.y + ball.r >= paddleY && ball.y - ball.r < paddleY + 9 && ball.x >= paddleX && ball.x <= paddleX + paddleW) { ball.vy = -Math.abs(ball.vy); ball.vx += ((ball.x - (paddleX + paddleW / 2)) / paddleW) * 55; hits += 1; }
      for (const brick of bricks) if (brick.alive && ball.y - ball.r < brick.y + 10 && ball.y + ball.r > brick.y && ball.x > brick.x && ball.x < brick.x + 54) { brick.alive = false; sparks.push(...Array.from({ length: 5 }, (_, i) => ({ x: brick.x + 8 + i * 9, y: brick.y + 5, life: 1, color: brick.color }))); ball.vy *= -1; score += 1; hits += 1; break; }
      if (!bricks.some((brick) => brick.alive)) endEpisode(true); else if (ball.y > height + 9) endEpisode(false);
      draw();
      if (now - lastMetric > 140) { lastMetric = now; const total = wins + losses; onMetricsRef.current?.({ agentScore: score, opponentScore: 32 - bricks.filter((brick) => brick.alive).length, rally: hits, longestRally: bestHits, episode, cumulativeReward: score - losses, averageReward: score / Math.max(1, episode), wins, losses, winRate: total ? wins / total * 100 : 0, skill }); }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [seed, skill]);
  return <canvas ref={canvasRef} className="block aspect-[30/17] w-full rounded-xl" aria-label="Breakout reinforcement learning simulation" />;
}
