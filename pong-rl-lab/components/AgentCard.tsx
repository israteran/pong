"use client";

import { useState } from "react";
import PongCanvas from "./PongCanvas";
import Metric from "./Metric";
import type { PongMetrics } from "@/lib/pong-engine";

type AgentCardProps = {
  name: string;
  training: string;
  model: string;
  description: string;
  skill: number;
  seed: number;
  accent: "rose" | "amber" | "green";
};

const accents = {
  rose: "text-rose-300 bg-rose-400/10 border-rose-300/15",
  amber: "text-amber-300 bg-amber-400/10 border-amber-300/15",
  green: "text-[#76f7b2] bg-emerald-400/10 border-emerald-300/15",
};

const emptyMetrics: PongMetrics = {
  agentScore: 0, opponentScore: 0, rally: 0, longestRally: 0, episode: 1,
  cumulativeReward: 0, averageReward: 0, wins: 0, losses: 0, winRate: 0, skill: 0,
};

export default function AgentCard({ name, training, model, description, skill, seed, accent }: AgentCardProps) {
  const [metrics, setMetrics] = useState(emptyMetrics);
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1713]/90 shadow-2xl shadow-black/15">
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${accents[accent]}`}>{model}</span>
            <span className="text-xs text-[#789285]">{training}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold">{name}</h3>
          <p className="mt-1 min-h-10 text-xs leading-5 text-[#8da79a]">{description}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/7 px-2.5 py-1 text-[10px] font-medium text-[#76f7b2]">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#76f7b2]" /> LIVE
        </div>
      </div>
      <div className="border-y border-white/8 bg-black/15 p-2">
        <PongCanvas skill={skill} seed={seed} onMetrics={setMetrics} />
      </div>
      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Metric label="Score" value={`${metrics.agentScore}–${metrics.opponentScore}`} hint="agent / opponent" />
        <Metric label="Rally" value={metrics.rally} hint={`best ${metrics.longestRally}`} />
        <Metric label="Win rate" value={`${metrics.winRate.toFixed(0)}%`} hint="current run" />
        <Metric label="Reward" value={metrics.averageReward.toFixed(1)} hint="avg / episode" />
      </div>
    </article>
  );
}
