import AgentCard from "@/components/AgentCard";
import LearningCurve from "@/components/LearningCurve";
import TrainingLab from "@/components/TrainingLab";
import RLExplainer from "@/components/RLExplainer";
import PlayAgainstAgent from "@/components/PlayAgainstAgent";
import EnvironmentGallery from "@/components/EnvironmentGallery";

const agents = [
  {
    name: "Early Learner",
    model: "Small model",
    training: "10K episodes",
    description: "High exploration noise, delayed reactions, and limited trajectory prediction. Misses are common.",
    skill: 0.28,
    seed: 1042,
    accent: "rose" as const,
    rank: 1,
  },
  {
    name: "Developing Policy",
    model: "Medium model",
    training: "100K episodes",
    description: "More stable positioning and stronger ball prediction, but still makes occasional timing errors.",
    skill: 0.61,
    seed: 2307,
    accent: "amber" as const,
    rank: 2,
  },
  {
    name: "Mature Agent",
    model: "Large model",
    training: "1M episodes",
    description: "Fast reactions, low prediction noise, and efficient positioning produce longer, more consistent rallies.",
    skill: 0.92,
    seed: 7109,
    accent: "orange" as const,
    rank: 3,
  },
];

export default function Home() {
  return (
    <main className="grid-noise min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#100c08]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-orange-300/20 bg-orange-400/10 text-sm font-black text-orange-300">RL</div>
            <div>
              <div className="text-sm font-bold tracking-tight">Pong RL Lab</div>
              <div className="text-[10px] text-[#8e786a]">Reinforcement Learning Playground</div>
            </div>
          </a>
          <nav className="flex items-center gap-2 text-xs">
            <a href="#compare" className="hidden rounded-lg px-3 py-2 text-[#c4b4a5] hover:bg-white/5 hover:text-white sm:block">Compare</a>
            <a href="#rl-basics" className="hidden rounded-lg px-3 py-2 text-[#c4b4a5] hover:bg-white/5 hover:text-white md:block">What is RL?</a>
            <a href="#environments" className="hidden rounded-lg px-3 py-2 text-[#c4b4a5] hover:bg-white/5 hover:text-white lg:block">Games</a>
            <a href="#training" className="rounded-lg border border-orange-300/20 bg-orange-400/10 px-3 py-2 font-semibold text-orange-200">Training Lab</a>
          </nav>
        </div>
      </header>

      <div id="top" className="mx-auto max-w-[1500px] px-5 pb-16 pt-14 lg:px-8 lg:pt-20">
        <section className="grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/15 bg-orange-400/7 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-orange-200">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-300" /> Browser-based RL visualization
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
              <div key={label} className="rounded-2xl border border-white/8 bg-[#1b120d]/70 p-4">
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
              <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Same game. Different training maturity.</h2>
            </div>
            <p className="max-w-xl text-xs leading-5 text-[#a48d7d]">The right paddle is the learning agent. Track the live rallies, then compare reaction time, prediction confidence, and exploration below each simulation.</p>
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

        <EnvironmentGallery />

        <section className="mt-20 rounded-2xl border border-white/10 bg-[#1b120d]/75 p-6 md:p-8">
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
