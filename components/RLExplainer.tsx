"use client";

import { useState } from "react";

const topics = [
  {
    label: "La idea",
    title: "Aprender probando",
    text: "En RL, un agente toma una acción, observa qué ocurre y recibe una recompensa. Después ajusta su comportamiento para acumular mejores recompensas con el tiempo.",
  },
  {
    label: "En este Pong",
    title: "Observar, actuar y recibir señal",
    text: "El agente ve la pelota y las paletas, decide moverse arriba o abajo y recibe una señal positiva al sostener un rally o ganar un punto. Perderlo reduce su recompensa.",
  },
  {
    label: "Dos decisiones",
    title: "Explorar o aprovechar",
    text: "Al principio conviene explorar movimientos para descubrir qué funciona. Más adelante, el agente aprovecha las decisiones que ya le dan buenos resultados. Ese equilibrio es clave en RL.",
  },
];

export default function RLExplainer() {
  const [active, setActive] = useState(0);
  const topic = topics[active];

  return (
    <section id="rl-basics" className="mt-20 scroll-mt-24 rounded-2xl border border-violet-300/15 bg-[#141126]/80 p-6 md:p-8">
      <div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr]">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">RL en 1 minuto</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">¿Qué es reinforcement learning?</h2>
          <p className="mt-3 text-sm leading-6 text-[#aaa4c2]">Una forma de aprendizaje automático guiada por consecuencias: el agente intenta acciones y aprende cuáles le acercan a un objetivo.</p>
        </div>
        <div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Conceptos básicos de reinforcement learning">
            {topics.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={active === index}
                onClick={() => setActive(index)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${active === index ? "border-violet-300/35 bg-violet-400/15 text-violet-200" : "border-white/8 bg-white/[0.025] text-[#aaa4c2] hover:bg-white/[0.06] hover:text-white"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="mt-4 rounded-xl border border-white/8 bg-black/15 p-4">
            <h3 className="text-sm font-semibold text-[#f5f2ff]">{topic.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#aaa4c2]">{topic.text}</p>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-[#aaa4c2]">
            Para profundizar: <a className="font-semibold text-cyan-200 underline decoration-cyan-300/30 underline-offset-4 hover:text-cyan-100" href="https://spinningup.openai.com/en/latest/spinningup/rl_intro.html" target="_blank" rel="noreferrer">OpenAI Spinning Up: conceptos de RL</a>{" · "}
            <a className="font-semibold text-cyan-200 underline decoration-cyan-300/30 underline-offset-4 hover:text-cyan-100" href="https://ale.farama.org/main/" target="_blank" rel="noreferrer">Arcade Learning Environment</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
