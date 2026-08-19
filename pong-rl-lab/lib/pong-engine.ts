export type PongMetrics = {
  agentScore: number;
  opponentScore: number;
  rally: number;
  longestRally: number;
  episode: number;
  cumulativeReward: number;
  averageReward: number;
  wins: number;
  losses: number;
  winRate: number;
  skill: number;
};

export type EngineOptions = {
  width?: number;
  height?: number;
  skill?: number;
  learning?: boolean;
  seed?: number;
  humanLeft?: boolean;
};

type Ball = { x: number; y: number; vx: number; vy: number; r: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export class PongEngine {
  width: number;
  height: number;
  paddleH = 72;
  paddleW = 10;
  leftY: number;
  rightY: number;
  ball: Ball;
  skill: number;
  baseSkill: number;
  learning: boolean;
  humanLeft: boolean;
  playerDirection = 0;
  rally = 0;
  longestRally = 0;
  episode = 1;
  cumulativeReward = 0;
  episodeReward = 0;
  wins = 0;
  losses = 0;
  agentScore = 0;
  opponentScore = 0;
  private randState: number;
  private rightDecisionTimer = 0;
  private leftDecisionTimer = 0;
  private rightTarget: number;
  private leftTarget: number;

  constructor(options: EngineOptions = {}) {
    this.width = options.width ?? 600;
    this.height = options.height ?? 340;
    this.skill = options.skill ?? 0.45;
    this.baseSkill = this.skill;
    this.learning = options.learning ?? false;
    this.humanLeft = options.humanLeft ?? false;
    this.randState = options.seed ?? 1234567;
    this.leftY = this.height / 2 - this.paddleH / 2;
    this.rightY = this.leftY;
    this.rightTarget = this.height / 2;
    this.leftTarget = this.height / 2;
    this.ball = { x: this.width / 2, y: this.height / 2, vx: 250, vy: 95, r: 6 };
    this.serve(this.random() > 0.5 ? 1 : -1);
  }

  private random() {
    this.randState = (this.randState * 1664525 + 1013904223) >>> 0;
    return this.randState / 4294967296;
  }

  private serve(direction: number) {
    const angle = (this.random() * 0.9 - 0.45);
    const speed = 245 + this.random() * 35;
    this.ball.x = this.width / 2;
    this.ball.y = this.height * (0.3 + this.random() * 0.4);
    this.ball.vx = Math.cos(angle) * speed * direction;
    this.ball.vy = Math.sin(angle) * speed;
    this.rally = 0;
    this.episodeReward = 0;
  }

  reset() {
    this.leftY = this.height / 2 - this.paddleH / 2;
    this.rightY = this.leftY;
    this.rally = 0;
    this.longestRally = 0;
    this.episode = 1;
    this.cumulativeReward = 0;
    this.episodeReward = 0;
    this.wins = 0;
    this.losses = 0;
    this.agentScore = 0;
    this.opponentScore = 0;
    this.skill = this.baseSkill;
    this.serve(1);
  }

  setPlayerDirection(direction: -1 | 0 | 1) {
    this.playerDirection = direction;
  }

  private predictedIntercept(skill: number, isRight: boolean) {
    const ball = this.ball;
    const movingToward = isRight ? ball.vx > 0 : ball.vx < 0;
    if (!movingToward || Math.abs(ball.vx) < 1) return ball.y;

    const targetX = isRight ? this.width - 28 : 28;
    const t = (targetX - ball.x) / ball.vx;
    let y = ball.y + ball.vy * Math.max(0, t);
    const top = ball.r;
    const bottom = this.height - ball.r;
    const span = bottom - top;

    while (y < top || y > bottom) {
      if (y < top) y = top + (top - y);
      if (y > bottom) y = bottom - (y - bottom);
    }

    const uncertainty = (1 - skill) * 105;
    const noise = (this.random() * 2 - 1) * uncertainty;
    const predictionBlend = 0.2 + skill * 0.8;
    return ball.y * (1 - predictionBlend) + y * predictionBlend + noise;
  }

  private movePaddles(dt: number) {
    const leftSkill = 0.74;
    this.leftDecisionTimer -= dt;
    this.rightDecisionTimer -= dt;

    if (!this.humanLeft && this.leftDecisionTimer <= 0) {
      this.leftTarget = this.predictedIntercept(leftSkill, false);
      this.leftDecisionTimer = 0.045 + (1 - leftSkill) * 0.13;
    }

    if (this.rightDecisionTimer <= 0) {
      this.rightTarget = this.predictedIntercept(this.skill, true);
      this.rightDecisionTimer = 0.035 + (1 - this.skill) * 0.22;
    }

    const move = (current: number, target: number, maxSpeed: number) => {
      const center = current + this.paddleH / 2;
      const delta = target - center;
      const maxStep = maxSpeed * dt;
      return clamp(current + clamp(delta, -maxStep, maxStep), 8, this.height - this.paddleH - 8);
    };

    this.leftY = this.humanLeft
      ? clamp(this.leftY + this.playerDirection * 390 * dt, 8, this.height - this.paddleH - 8)
      : move(this.leftY, this.leftTarget, 255 + leftSkill * 150);
    this.rightY = move(this.rightY, this.rightTarget, 190 + this.skill * 300);
  }

  private onEpisodeEnd(agentWon: boolean) {
    const terminalReward = agentWon ? 10 : -10;
    this.episodeReward += terminalReward;
    this.cumulativeReward += terminalReward;
    if (agentWon) this.wins += 1;
    else this.losses += 1;
    this.episode += 1;

    if (this.learning) {
      // Lightweight browser-only learning approximation: policy quality follows a
      // saturating learning curve with tiny exploration jitter.
      const learned = 0.12 + 0.84 * (1 - Math.exp(-(this.episode - 1) / 145));
      const exploration = (this.random() - 0.5) * Math.max(0.015, 0.09 * Math.exp(-this.episode / 90));
      this.skill = clamp(learned + exploration, 0.1, 0.965);
    }
  }

  step(dt: number) {
    this.movePaddles(dt);

    const ball = this.ball;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.y - ball.r <= 0 && ball.vy < 0) {
      ball.y = ball.r;
      ball.vy *= -1;
    } else if (ball.y + ball.r >= this.height && ball.vy > 0) {
      ball.y = this.height - ball.r;
      ball.vy *= -1;
    }

    const leftX = 22;
    const rightX = this.width - 22 - this.paddleW;

    if (
      ball.vx < 0 &&
      ball.x - ball.r <= leftX + this.paddleW &&
      ball.x + ball.r >= leftX &&
      ball.y >= this.leftY - 4 &&
      ball.y <= this.leftY + this.paddleH + 4
    ) {
      ball.x = leftX + this.paddleW + ball.r;
      ball.vx = Math.abs(ball.vx) * 1.018;
      const relative = (ball.y - (this.leftY + this.paddleH / 2)) / (this.paddleH / 2);
      ball.vy += relative * 92;
      this.rally += 1;
      this.longestRally = Math.max(this.longestRally, this.rally);
    }

    if (
      ball.vx > 0 &&
      ball.x + ball.r >= rightX &&
      ball.x - ball.r <= rightX + this.paddleW &&
      ball.y >= this.rightY - 4 &&
      ball.y <= this.rightY + this.paddleH + 4
    ) {
      ball.x = rightX - ball.r;
      ball.vx = -Math.abs(ball.vx) * 1.018;
      const relative = (ball.y - (this.rightY + this.paddleH / 2)) / (this.paddleH / 2);
      ball.vy += relative * 92;
      this.rally += 1;
      this.longestRally = Math.max(this.longestRally, this.rally);
      this.episodeReward += 1;
      this.cumulativeReward += 1;
    }

    ball.vx = clamp(ball.vx, -530, 530);
    ball.vy = clamp(ball.vy, -410, 410);

    if (ball.x < -30) {
      this.agentScore += 1;
      this.onEpisodeEnd(true);
      this.serve(1);
    } else if (ball.x > this.width + 30) {
      this.opponentScore += 1;
      this.onEpisodeEnd(false);
      this.serve(-1);
    }
  }

  getMetrics(): PongMetrics {
    const games = this.wins + this.losses;
    return {
      agentScore: this.agentScore,
      opponentScore: this.opponentScore,
      rally: this.rally,
      longestRally: this.longestRally,
      episode: this.episode,
      cumulativeReward: this.cumulativeReward,
      averageReward: this.cumulativeReward / Math.max(1, this.episode - 1),
      wins: this.wins,
      losses: this.losses,
      winRate: games ? (this.wins / games) * 100 : 0,
      skill: this.skill,
    };
  }
}
