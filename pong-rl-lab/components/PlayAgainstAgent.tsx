"use client";

import { useEffect, useState } from "react";
import PongCanvas from "./PongCanvas";
import type { PongMetrics } from "@/lib/pong-engine";

const emptyMetrics: PongMetrics = {
  agentScore: 0, opponentScore: 0, rally: 0, longestRally: 0, episode: 1,
  cumulativeReward: 0, averageReward: 0, wins: 0, losses: 0, winRate: 0, skill: 0.62,
};

export default function PlayAgainstAgent() {
  const [running, setRunning] = useState(false);
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [resetToken, setResetToken] = useState(0);
  const [metrics, setMetrics] = useState(emptyMetrics);

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        event.preventDefault();
        setDirection(-1);
      }
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
        event.preventDefault();
        setDirection(1);
      }
    };
    const keyUp = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "w", "W", "s", "S"].includes(event.key)) setDirection(0);
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  const reset = () => {
    setRunning(false);
    setDirection(0);
    setMetrics(emptyMetrics);
    setResetToken((token) => token + 1);
  };

  const control = (next: -1 | 1) => ({
    onPointerDown: () => setDirection(next),
    onPointerUp: () => setDirection(0),
    onPointerLeave: () => setDirection(0),
    onPointerCancel: () => setDirection(0),
  });

  return (
    <section id="play" className="mt-20 scroll-mt-24 rounded-2xl border border-cyan-300/15 bg-[#141126]/90 p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">Modo duelo</div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Juega contra el agente</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#aaa4c2]">Tú controlas la paleta izquierda; el agente usa la derecha. Usa <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11px] text-white">↑</kbd> <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11px] text-white">↓</kbd> o <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11px] text-white">W</kbd> <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[11px] text-white">S</kbd>; en móvil usa los controles.</p>
        </div>
        <div className="rounded-full border border-violet-300/15 bg-violet-400/10 px-3 py-1.5 text-[11px] font-medium text-violet-200">Agente intermedio · 62% de habilidad</div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/15 p-2 sm:p-4">
        <PongCanvas skill={0.62} humanLeft running={running} playerDirection={direction} resetToken={resetToken} seed={4312} onMetrics={setMetrics} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => setRunning((value) => !value)} className="rounded-xl bg-cyan-200 px-4 py-2 text-xs font-bold text-[#10202a] transition hover:brightness-110">{running ? "Pausar partida" : "Empezar partida"}</button>
          <button type="button" onClick={reset} className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2 text-xs font-semibold text-[#ddd8ee] transition hover:bg-white/[0.05]">Reiniciar marcador</button>
        </div>
        <div className="text-xs text-[#aaa4c2]">Agente <span className="font-semibold text-violet-200">{metrics.agentScore}</span> · Tú <span className="font-semibold text-cyan-200">{metrics.opponentScore}</span></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
        <button type="button" {...control(-1)} className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 py-3 text-xs font-bold text-cyan-100">Mover arriba</button>
        <button type="button" {...control(1)} className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 py-3 text-xs font-bold text-cyan-100">Mover abajo</button>
      </div>
    </section>
  );
}
