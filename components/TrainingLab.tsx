"use client";

import { useMemo, useState } from "react";
import PongCanvas from "./PongCanvas";
import Metric from "./Metric";
import type { PongMetrics } from "@/lib/pong-engine";

const initial: PongMetrics = {
  agentScore: 0, opponentScore: 0, rally: 0, longestRally: 0, episode: 1,
  cumulativeReward: 0, averageReward: 0, wins: 0, losses: 0, winRate: 0, skill: 0.12,
};

export default function TrainingLab() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState<1 | 5 | 10>(1);
  const [resetToken, setResetToken] = useState(0);
  const [metrics, setMetrics] = useState(initial);

  const progress = useMemo(() => Math.min(100, ((metrics.skill - 0.1) / 0.865) * 100), [metrics.skill]);
  const status = progress < 25 ? "Exploring" : progress < 65 ? "Learning" : progress < 90 ? "Converging" : "Mature policy";

  const reset = () => {
    setRunning(false);
    setMetrics(initial);
    setResetToken((v) => v + 1);
  };

  return (
    <section id="training" className="scroll-mt-24">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#76f7b2]">Interactive Training Lab</div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Train a policy in real time</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8da79a]">Watch an intentionally weak agent improve as training episodes accumulate. Increase simulation speed to compress the learning process.</p>
        </div>
        <div className="rounded-full border border-amber-300/15 bg-amber-400/8 px-3 py-1.5 text-[11px] font-medium text-amber-200">Educational simulation · no external ML backend</div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.55fr_.85fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1713]/90">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 p-4">
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${running ? "pulse-dot bg-[#76f7b2]" : "bg-[#53675d]"}`} />
              <div>
                <div className="text-sm font-semibold">Training environment</div>
                <div className="text-[11px] text-[#789285]">Agent is the right paddle · opponent uses a fixed policy</div>
              </div>
            </div>
            <div className="flex gap-1.5">
              {[1, 5, 10].map((v) => (
                <button key={v} onClick={() => setSpeed(v as 1 | 5 | 10)} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${speed === v ? "border-emerald-300/30 bg-emerald-400/12 text-[#76f7b2]" : "border-white/8 bg-white/[0.025] text-[#8da79a] hover:bg-white/[0.05]"}`}>{v}×</button>
              ))}
            </div>
          </div>
          <div className="bg-black/15 p-2 sm:p-4">
            <PongCanvas skill={0.12} learning running={running} speed={speed} resetToken={resetToken} seed={8851} onMetrics={setMetrics} />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-white/8 p-4">
            <button onClick={() => setRunning((v) => !v)} className="rounded-xl bg-[#76f7b2] px-4 py-2 text-xs font-bold text-[#062115] transition hover:brightness-110">{running ? "Pause training" : metrics.episode > 1 ? "Resume training" : "Start training"}</button>
            <button onClick={reset} className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2 text-xs font-semibold text-[#c6d9cf] transition hover:bg-white/[0.05]">Reset agent</button>
            <div className="ml-auto flex items-center text-[11px] text-[#60796d]">simulation speed <span className="ml-1 font-semibold text-[#8da79a]">{speed}×</span></div>
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-[#0b1713]/90 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#789285]">Policy telemetry</div>
              <div className="mt-1 text-lg font-semibold">{status}</div>
            </div>
            <div className="metric-value text-3xl font-semibold text-[#76f7b2]">{Math.round(progress)}%</div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-[#76f7b2] transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Metric label="Episode" value={metrics.episode.toLocaleString()} />
            <Metric label="Policy quality" value={`${(metrics.skill * 100).toFixed(0)}%`} />
            <Metric label="Cumulative reward" value={metrics.cumulativeReward.toFixed(0)} />
            <Metric label="Average reward" value={metrics.averageReward.toFixed(1)} />
            <Metric label="Current rally" value={metrics.rally} />
            <Metric label="Longest rally" value={metrics.longestRally} />
            <Metric label="Wins / losses" value={`${metrics.wins} / ${metrics.losses}`} />
            <Metric label="Win rate" value={`${metrics.winRate.toFixed(1)}%`} />
          </div>

          <div className="mt-5 rounded-xl border border-white/8 bg-black/10 p-4">
            <div className="text-xs font-semibold text-[#c6d9cf]">What is changing?</div>
            <p className="mt-2 text-[11px] leading-5 text-[#789285]">The agent begins with slow reactions, noisy targeting, and weak trajectory prediction. As episodes increase, its simulated policy reduces exploration error, reacts faster, and predicts ball intercepts more accurately.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
