"use client";

import { useState } from "react";
import PongCanvas from "./PongCanvas";
import Metric from "./Metric";
import type { PongMetrics } from "@/lib/pong-engine";

const initial: PongMetrics = {
  agentScore: 0, opponentScore: 0, rally: 0, longestRally: 0, episode: 1,
  cumulativeReward: 0, averageReward: 0, wins: 0, losses: 0, winRate: 0, skill: 0.12, epsilon: 0.9, dqnLoss: 0, replaySize: 0, dqnUpdates: 0,
};

export default function TrainingLab() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState<1 | 5 | 10>(1);
  const [resetToken, setResetToken] = useState(0);
  const [metrics, setMetrics] = useState(initial);

  const replaySize = metrics.replaySize ?? 0;
  const progress = Math.min(100, (replaySize / 6000) * 100);
  const status = replaySize < 180 ? "Collecting experience" : (metrics.dqnUpdates ?? 0) < 50 ? "Training Q-network" : "DQN training in progress";

  const reset = () => {
    setRunning(false);
    setMetrics(initial);
    setResetToken((v) => v + 1);
  };

  return (
    <section id="training" className="scroll-mt-24">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">Interactive training lab</div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Train a DQN in real time</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#c4b4a5]">The agent learns a Q-function with a small neural network, replay memory, and a target network. Increase the speed to collect more transitions.</p>
        </div>
        <div className="rounded-full border border-orange-300/15 bg-orange-400/8 px-3 py-1.5 text-[11px] font-medium text-orange-100">Local DQN · no backend or API</div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.55fr_.85fr]">
        <div className="glow-panel overflow-hidden rounded-2xl border border-white/12 bg-[#15131b]/95">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 p-4">
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${running ? "pulse-dot bg-orange-300" : "bg-[#786358]"}`} />
              <div>
                <div className="text-sm font-semibold">Training environment</div>
                <div className="text-[11px] text-[#c4b4a5]">The DQN controls the right paddle; the left paddle uses a fixed policy.</div>
              </div>
            </div>
            <div className="flex gap-1.5">
              {[1, 5, 10].map((v) => (
                <button key={v} aria-label={`Set simulation speed to ${v} times`} onClick={() => setSpeed(v as 1 | 5 | 10)} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${speed === v ? "border-orange-300/30 bg-orange-400/12 text-orange-200" : "border-white/8 bg-white/[0.025] text-[#c4b4a5] hover:bg-white/[0.05]"}`}>{v}×</button>
              ))}
            </div>
          </div>
          <div className="bg-black/15 p-2 sm:p-4">
            <PongCanvas skill={0.12} learning running={running} speed={speed} resetToken={resetToken} seed={8851} onMetrics={setMetrics} />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-white/8 p-4">
            <button onClick={() => setRunning((v) => !v)} className="rounded-xl bg-orange-400 px-4 py-2 text-xs font-bold text-white shadow-[0_8px_20px_rgba(255,107,0,.22)] transition hover:bg-orange-300 hover:shadow-[0_10px_26px_rgba(255,107,0,.32)]">{running ? "Pause training" : metrics.episode > 1 ? "Resume training" : "Start DQN"}</button>
            <button onClick={reset} className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2 text-xs font-semibold text-[#f0d9c5] transition hover:bg-white/[0.05]">Reset agent</button>
            <div className="ml-auto flex items-center text-[11px] text-[#c4b4a5]">simulation speed <span className="ml-1 font-semibold text-[#fff0e6]">{speed}×</span></div>
          </div>
        </div>

        <aside className="glow-panel rounded-2xl border border-white/12 bg-[#15131b]/95 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#c4b4a5]">DQN telemetry</div>
              <div className="mt-1 text-lg font-semibold">{status}</div>
            </div>
            <div className="metric-value text-3xl font-semibold text-orange-300">{replaySize.toLocaleString()}</div>
          </div>
          <div className="mt-1 text-[10px] text-[#c4b4a5]">replay-buffer experiences</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-orange-300 transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Metric label="Episode" value={metrics.episode.toLocaleString()} />
            <Metric label="Epsilon" value={(metrics.epsilon ?? 0).toFixed(3)} hint="exploration" />
            <Metric label="TD loss" value={(metrics.dqnLoss ?? 0).toFixed(3)} hint="Huber loss" />
            <Metric label="Updates" value={metrics.dqnUpdates ?? 0} hint="gradient steps" />
            <Metric label="Average reward" value={metrics.averageReward.toFixed(1)} />
            <Metric label="Current rally" value={metrics.rally} />
            <Metric label="Wins / losses" value={`${metrics.wins} / ${metrics.losses}`} />
            <Metric label="Win rate" value={`${metrics.winRate.toFixed(1)}%`} />
          </div>

          <div className="mt-5 rounded-xl border border-white/8 bg-black/10 p-4">
            <div className="text-xs font-semibold text-[#fff0e6]">What is changing?</div>
            <p className="mt-2 text-[11px] leading-5 text-[#c4b4a5]">Every transition stores state, action, reward, and next state. The agent trains on random buffer samples and periodically copies its network to a target network to stabilize Q-value estimates.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
