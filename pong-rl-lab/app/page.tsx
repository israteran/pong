"use client";

import { useState } from "react";
import AgentCard from "@/components/AgentCard";
import LearningCurve from "@/components/LearningCurve";
import TrainingLab from "@/components/TrainingLab";
import RLExplainer from "@/components/RLExplainer";
import PlayAgainstAgent from "@/components/PlayAgainstAgent";
import EnvironmentGallery from "@/components/EnvironmentGallery";

const agents = [
  {
    name: "Early learner",
    model: "Small model",
    training: "10K episodes",
    description: "High exploration, late reactions, and limited trajectory prediction.",
    skill: 0.28,
    seed: 1042,
    accent: "rose" as const,
    rank: 1,
  },
  {
    name: "Developing policy",
    model: "Medium model",
    training: "100K episodes",
    description: "More stable positioning and stronger prediction, with occasional timing errors.",
    skill: 0.61,
    seed: 2307,
    accent: "amber" as const,
    rank: 2,
  },
  {
    name: "Mature agent",
    model: "Large model",
    training: "1M episodes",
    description: "Fast reactions and efficient positioning for longer, more consistent rallies.",
    skill: 0.92,
    seed: 7109,
    accent: "orange" as const,
    rank: 3,
  },
];

export default function Home() {
  const [comparisonGame, setComparisonGame] = useState<"pong" | "breakout">("pong");
  const breakoutDescriptions = [
    "Loses track of the ball and misses straightforward returns.",
    "Keeps the ball alive and begins to identify useful angles.",
    "Anticipates rebounds and clears brick rows more consistently.",
  ];
  return (
    <main className="grid-noise min-h-screen">
      <header className="sticky top-0 z-20 border-b border-orange-200/10 bg-[#090a0f]/85 shadow-[0_8px_30px_rgba(0,0,0,.18)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-orange-300/45 bg-orange-400/20 text-sm font-black text-orange-200 shadow-[0_0_24px_rgba(255,107,0,.18)]">RL</div>
            <div>
              <div className="text-sm font-bold tracking-tight">Pong RL Lab</div>
              <div className="text-[10px] text-[#b9a293]">Reinforcement Learning Playground</div>
            </div>
          </a>
          <nav className="flex items-center gap-2 text-xs">
            <a href="#compare" className="hidden rounded-lg px-3 py-2 text-[#c4b4a5] hover:bg-white/5 hover:text-white sm:block">Compare</a>
            <a href="#rl-basics" className="hidden rounded-lg px-3 py-2 text-[#c4b4a5] hover:bg-white/5 hover:text-white md:block">What is RL?</a>
            <a href="#environments" className="hidden rounded-lg px-3 py-2 text-[#c4b4a5] hover:bg-white/5 hover:text-white lg:block">Games</a>
            <a href="#training" className="rounded-lg border border-orange-300/45 bg-orange-400/20 px-3 py-2 font-semibold text-orange-100 shadow-[0_0_18px_rgba(255,107,0,.12)]">Training Lab</a>
          </nav>
        </div>
      </header>

      <div id="top" className="mx-auto max-w-[1500px] px-5 pb-16 pt-14 lg:px-8 lg:pt-20">
        <section className="grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/35 bg-orange-400/12 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-orange-100 shadow-[0_0_22px_rgba(255,107,0,.1)]">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-300 shadow-[0_0_9px_rgba(255,154,61,.9)]" /> Browser-based RL visualization
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-[#fff7ed] sm:text-5xl lg:text-7xl">
              Visualize learning<br/><span className="text-orange-300">one rally at a time.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#c4b4a5] sm:text-base">Compare small, medium, and large policies in Pong, then carry the same RL ideas into three Atari-style environments.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:max-w-xl lg:justify-self-end">
            {[
              ["04", "games in the lab"],
              ["10×", "max sim speed"],
              ["100%", "browser based"],
            ].map(([value, label]) => (
              <div key={label} className="glow-panel rounded-2xl border border-white/10 bg-[#15131b]/85 p-4">
                <div className="metric-value text-xl font-semibold text-[#fff7ed] sm:text-2xl">{value}</div>
                <div className="mt-1 text-[10px] leading-4 text-[#8e786a]">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="compare" className="mt-20 scroll-mt-24">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">Policy comparison</div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Same game. Different model scales.</h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-1" role="tablist" aria-label="Comparison game">
              <button type="button" role="tab" aria-selected={comparisonGame === "pong"} onClick={() => setComparisonGame("pong")} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${comparisonGame === "pong" ? "bg-orange-400 text-white shadow-[0_5px_16px_rgba(255,107,0,.25)]" : "text-[#d9c7b9] hover:text-white"}`}>Pong</button>
              <button type="button" role="tab" aria-selected={comparisonGame === "breakout"} onClick={() => setComparisonGame("breakout")} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${comparisonGame === "breakout" ? "bg-orange-400 text-white shadow-[0_5px_16px_rgba(255,107,0,.25)]" : "text-[#d9c7b9] hover:text-white"}`}>Breakout</button>
            </div>
          </div>

          <p className="mb-5 max-w-3xl text-xs leading-5 text-[#d9c7b9]">{comparisonGame === "pong" ? "The right paddle is the agent. Watch its return path, then compare reaction time, prediction confidence, and exploration." : "The agent controls the lower paddle. Watch how model scale changes ball tracking, rebound selection, and brick clearing."}</p>

          <div className="grid gap-4 lg:grid-cols-3">
            {agents.map((agent, index) => <AgentCard key={agent.name} {...agent} game={comparisonGame} description={comparisonGame === "breakout" ? breakoutDescriptions[index] : agent.description} />)}
          </div>

          <div className="mt-4">
            <LearningCurve />
          </div>
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <RLExplainer />
        <TrainingLab />
        <PlayAgainstAgent />

        <EnvironmentGallery />

        <section className="glow-panel mt-20 rounded-2xl border border-white/12 bg-[#15131b]/95 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">How this MVP works</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">A transparent DQN implementation</h2>
            </div>
            <div className="text-sm leading-7 text-[#c4b4a5] lg:col-span-2">
              <p>The lab trains a real DQN without a Python service, GPU, paid API, or external model. Its state contains the ball and both paddles; the network estimates the value of three actions: up, stay, or down.</p>
              <p className="mt-3">To remain educational and browser-friendly, it uses a small network, replay buffer, epsilon-greedy exploration, and a target network. <strong className="font-semibold text-[#fff7ed]">It is not an Atari model trained from pixels</strong>; it is a compact DQN for this Pong environment.</p>
            </div>
          </div>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 py-6 text-[11px] text-[#8e786a]">
          <span>Pong RL Lab · Educational MVP · Credits: Israel Teran</span>
          <span>Next.js · React · TypeScript · Tailwind CSS · Canvas</span>
        </footer>
      </div>
    </main>
  );
}
