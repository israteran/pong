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
  accent: "rose" | "amber" | "orange";
  rank: number;
};

const accents = {
  rose: "text-rose-300 bg-rose-400/10 border-rose-300/15",
  amber: "text-amber-300 bg-amber-400/10 border-amber-300/15",
  orange: "text-orange-300 bg-orange-400/10 border-orange-300/15",
};

const emptyMetrics: PongMetrics = {
  agentScore: 0, opponentScore: 0, rally: 0, longestRally: 0, episode: 1,
  cumulativeReward: 0, averageReward: 0, wins: 0, losses: 0, winRate: 0, skill: 0,
};

export default function AgentCard({ name, training, model, description, skill, seed, accent, rank }: AgentCardProps) {
  const [metrics, setMetrics] = useState(emptyMetrics);
  const profile = skill < 0.4
    ? { reaction: "210 ms", prediction: 31, exploration: 78, label: "High variance" }
    : skill < 0.8
      ? { reaction: "110 ms", prediction: 65, exploration: 40, label: "Finding consistency" }
      : { reaction: "45 ms", prediction: 93, exploration: 8, label: "Precision policy" };
  const featured = skill > 0.8;

  return (
    <article className={`group relative overflow-hidden rounded-2xl border bg-[#1b120d]/90 shadow-2xl shadow-black/15 transition duration-300 hover:-translate-y-1 ${featured ? "border-orange-400/45 shadow-orange-950/30" : "border-white/10 hover:border-orange-300/35"}`}>
      {featured ? <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" /> : null}
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${accents[accent]}`}>{model}</span>
            <span className="text-xs text-[#a48d7d]">{training}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold">{name}</h3>
          <p className="mt-1 min-h-10 text-xs leading-5 text-[#b7a08d]">{description}</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold tracking-[0.16em] text-[#8e786a]">MODEL 0{rank}</div>
          <div className="mt-2 flex items-center justify-end gap-1.5 rounded-full bg-orange-400/7 px-2.5 py-1 text-[10px] font-medium text-orange-200">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-orange-300" /> LIVE
          </div>
        </div>
      </div>
      <div className="border-y border-white/8 bg-black/15 p-2 transition group-hover:bg-orange-400/[0.035]">
        <PongCanvas skill={skill} seed={seed} onMetrics={setMetrics} />
      </div>
      <div className="border-b border-white/8 px-4 py-3">
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-[#8e786a]">
          <span>Behavior profile</span><span className="text-orange-200">{profile.label}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><div className="text-[10px] text-[#8e786a]">Reaction</div><div className="mt-0.5 text-xs font-semibold text-[#fff0e6]">{profile.reaction}</div></div>
          <div><div className="text-[10px] text-[#8e786a]">Prediction</div><div className="mt-0.5 text-xs font-semibold text-[#fff0e6]">{profile.prediction}%</div></div>
          <div><div className="text-[10px] text-[#8e786a]">Exploration</div><div className="mt-0.5 text-xs font-semibold text-[#fff0e6]">{profile.exploration}%</div></div>
        </div>
        <div className="mt-2.5 flex gap-1" aria-label={`${name} behavior profile`}>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-orange-300" style={{ width: `${100 - profile.exploration}%` }} /></div>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-orange-400" style={{ width: `${profile.prediction}%` }} /></div>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-orange-500" style={{ width: `${100 - (Number.parseInt(profile.reaction, 10) / 2.4)}%` }} /></div>
        </div>
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
