# Pong RL Lab

A browser-based MVP that uses Pong to visualize how a reinforcement-learning-style policy improves with training.

## What is included

- Three simultaneous Pong simulations representing low, medium, and high training maturity.
- An Atari-style gallery for Breakout, Space Invaders, and Seaquest, showing how those same three policy sizes change behavior by task.
- Live score, rally, win-rate, and reward metrics for every agent.
- Interactive training mode with Start, Pause, Reset, and 1x / 5x / 10x simulation speeds.
- Dynamic episode, cumulative reward, average reward, win/loss, rally, and policy-quality telemetry.
- Illustrative learning-curve visualization.
- Responsive AI/ML laboratory dashboard UI.
- No backend, database, paid API, GPU, or external ML infrastructure required.

## Important modeling note

This MVP uses a **lightweight reinforcement-learning approximation**, not a production-trained neural network. The training agent improves along a saturating learning curve: reaction latency, targeting noise, exploration error, and trajectory prediction improve as episodes accumulate.

This design makes the learning process observable and keeps the application fully browser-based. The policy layer can later be replaced with TensorFlow.js, ONNX Runtime Web, or a backend-hosted DQN/PPO model.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- HTML Canvas

## Local development

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel

### Option A — GitHub

1. Create a new GitHub repository.
2. Upload the contents of this project.
3. In Vercel, choose **Add New > Project**.
4. Import the GitHub repository.
5. Vercel should detect Next.js automatically.
6. No environment variables are required.
7. Click **Deploy**.

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the CLI prompts. No custom build configuration is required.

## Project structure

```text
pong-rl-lab/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AgentCard.tsx
│   ├── LearningCurve.tsx
│   ├── Metric.tsx
│   ├── PongCanvas.tsx
│   └── TrainingLab.tsx
├── lib/
│   └── pong-engine.ts
├── eslint.config.mjs
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── vercel.json
└── README.md
```

## Suggested next iteration

For a more rigorous ML demonstration, keep the UI and replace `lib/pong-engine.ts` policy logic with one of these approaches:

- a real tabular Q-learning state/action implementation;
- TensorFlow.js DQN running in the browser;
- ONNX Runtime Web using pre-trained policies;
- a Python/FastAPI training backend storing experiment runs.

The UI deliberately labels the current behavior as an educational simulation so users are not misled about the underlying implementation.
