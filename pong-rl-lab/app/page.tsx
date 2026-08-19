import AgentCard from "@/components/AgentCard";
import LearningCurve from "@/components/LearningCurve";
import TrainingLab from "@/components/TrainingLab";
import RLExplainer from "@/components/RLExplainer";
import PlayAgainstAgent from "@/components/PlayAgainstAgent";

const agents = [
  {
    name: "Early Learner",
    model: "Small model",
    training: "10K episodes",
    description: "High exploration noise, delayed reactions, and limited trajectory prediction. Misses are common.",
    skill: 0.28,
    seed: 1042,
    accent: "rose" as const,
  },
  {
    name: "Developing Policy",
    model: "Medium model",
    training: "100K episodes",
    description: "More stable positioning and stronger ball prediction, but still makes occasional timing errors.",
    skill: 0.61,
    seed: 2307,
    accent: "amber" as const,
  },
  {
    name: "Mature Agent",
    model: "Large model",
    training: "1M episodes",
    description: "Fast reactions, low prediction noise, and efficient positioning produce longer, more consistent rallies.",
    skill: 0.92,
    seed: 7109,
    accent: "violet" as const,
  },
];

export default function Home() {
  return (
    <main className="grid-noise min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#0b0a18]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-sm font-black text-violet-300">RL</div>
            <div>
              <div className="text-sm font-bold tracking-tight">Pong RL Lab</div>
              <div className="text-[10px] text-[#60796d]">Reinforcement Learning Playground</div>
            </div>
          </a>
          <nav className="flex items-center gap-2 text-xs">
            <a href="#compare" className="hidden rounded-lg px-3 py-2 text-[#aaa4c2] hover:bg-white/5 hover:text-white sm:block">Comparar</a>
            <a href="#rl-basics" className="hidden rounded-lg px-3 py-2 text-[#aaa4c2] hover:bg-white/5 hover:text-white md:block">¿Qué es RL?</a>
            <a href="#play" className="hidden rounded-lg px-3 py-2 text-[#aaa4c2] hover:bg-white/5 hover:text-white lg:block">Jugar</a>
            <a href="#training" className="rounded-lg border border-violet-300/20 bg-violet-400/10 px-3 py-2 font-semibold text-violet-200">Laboratorio</a>
          </nav>
        </div>
      </header>

      <div id="top" className="mx-auto max-w-[1500px] px-5 pb-16 pt-14 lg:px-8 lg:pt-20">
        <section className="grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/7 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300" /> Visualización de RL en el navegador
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-[#eefbf4] sm:text-5xl lg:text-7xl">
              Visualiza el aprendizaje<br/><span className="text-violet-300">un rally a la vez.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#aaa4c2] sm:text-base">Compara tres agentes de Pong con distintos niveles de entrenamiento y observa cómo una política ligera mejora en tiempo real.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:max-w-xl lg:justify-self-end">
            {[
              ["03", "agents compared"],
              ["10×", "max sim speed"],
              ["100%", "browser based"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-[#141126]/70 p-4">
                <div className="metric-value text-xl font-semibold text-[#eefbf4] sm:text-2xl">{value}</div>
                <div className="mt-1 text-[10px] leading-4 text-[#60796d]">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="compare" className="mt-20 scroll-mt-24">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">Comparación de políticas</div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Same game. Different training maturity.</h2>
            </div>
            <p className="max-w-xl text-xs leading-5 text-[#789285]">The right paddle is the learning agent. The opponent uses the same fixed baseline policy in every panel, making behavior differences easier to observe.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {agents.map((agent) => <AgentCard key={agent.name} {...agent} />)}
          </div>

          <div className="mt-4">
            <LearningCurve />
          </div>
        </section>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <RLExplainer />
        <TrainingLab />
        <PlayAgainstAgent />

        <section className="mt-20 rounded-2xl border border-white/10 bg-[#141126]/75 p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">Próximos entornos</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Atari para ampliar el laboratorio</h2>
            </div>
            <p className="max-w-xl text-xs leading-5 text-[#aaa4c2]">Propuestas de alcance; no están implementadas todavía. Todas son entornos de referencia en ALE.</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Breakout", "El siguiente paso ideal: una paleta, control continuo y recompensas claras."],
              ["Space Invaders", "Introduce objetivos móviles, proyectiles y decisiones más rápidas."],
              ["Seaquest", "Añade planificación, recursos limitados y recompensas a largo plazo."],
              ["Montezuma’s Revenge", "Reto avanzado de exploración con recompensas escasas."],
            ].map(([game, description]) => (
              <article key={game} className="rounded-xl border border-white/8 bg-black/15 p-4">
                <h3 className="text-sm font-semibold text-violet-200">{game}</h3>
                <p className="mt-2 text-[11px] leading-5 text-[#aaa4c2]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-2xl border border-white/10 bg-[#141126]/75 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">Cómo funciona este MVP</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">A transparent learning approximation</h2>
            </div>
            <div className="text-sm leading-7 text-[#8da79a] lg:col-span-2">
              <p>This version intentionally runs without a Python service, GPU, paid API, or external model. The agent uses ball-state observations plus a lightweight heuristic policy whose reaction latency, prediction error, and exploration noise improve along a saturating learning curve.</p>
              <p className="mt-3">That makes the training behavior credible for an educational demonstration while keeping deployment simple. It is <strong className="font-semibold text-[#c6d9cf]">not presented as a production-trained DQN</strong>. A future version can replace the policy module with TensorFlow.js, ONNX Runtime Web, or an API-backed RL model without redesigning the interface.</p>
            </div>
          </div>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 py-6 text-[11px] text-[#60796d]">
          <span>Pong RL Lab · MVP educativo · Créditos: Israel Teran</span>
          <span>Next.js · React · TypeScript · Tailwind CSS · Canvas</span>
        </footer>
      </div>
    </main>
  );
}
