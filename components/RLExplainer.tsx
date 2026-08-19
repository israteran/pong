"use client";

import { useState } from "react";

const topics = [
  {
    label: "The idea",
    title: "Learning by trying",
    text: "In RL, an agent takes an action, observes what happens, and receives a reward. It then adjusts its behavior to collect better rewards over time.",
  },
  {
    label: "In this Pong",
    title: "Observe, act, and receive feedback",
    text: "The agent sees the ball and paddles, chooses to move up or down, and receives a positive signal for returning the ball or winning a point. Missing the ball lowers its reward.",
  },
  {
    label: "Two choices",
    title: "Explore or exploit",
    text: "At first, exploring moves helps discover what works. Later, the agent exploits decisions that already produce good results. Balancing both is central to RL.",
  },
];

export default function RLExplainer() {
  const [active, setActive] = useState(0);
  const topic = topics[active];

  return (
    <section id="rl-basics" className="mt-20 scroll-mt-24 rounded-2xl border border-orange-300/15 bg-[#1b120d]/80 p-6 md:p-8">
      <div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr]">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">RL in one minute</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">What is reinforcement learning?</h2>
          <p className="mt-3 text-sm leading-6 text-[#c4b4a5]">A machine learning approach guided by consequences: an agent tries actions and learns which ones bring it closer to a goal.</p>
        </div>
        <div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Basic reinforcement learning concepts">
            {topics.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={active === index}
                onClick={() => setActive(index)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${active === index ? "border-orange-300/35 bg-orange-400/15 text-orange-200" : "border-white/8 bg-white/[0.025] text-[#c4b4a5] hover:bg-white/[0.06] hover:text-white"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="mt-4 rounded-xl border border-white/8 bg-black/15 p-4">
            <h3 className="text-sm font-semibold text-[#fff7ed]">{topic.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#c4b4a5]">{topic.text}</p>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[#c4b4a5]">
            Learn more: <a className="font-semibold text-orange-200 underline decoration-orange-300/30 underline-offset-4 hover:text-orange-100" href="https://spinningup.openai.com/en/latest/spinningup/rl_intro.html" target="_blank" rel="noreferrer">OpenAI Spinning Up: RL concepts</a>{" · "}
            <a className="font-semibold text-orange-200 underline decoration-orange-300/30 underline-offset-4 hover:text-orange-100" href="https://ale.farama.org/main/" target="_blank" rel="noreferrer">Arcade Learning Environment</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
