type Transition = {
  state: number[];
  action: number;
  reward: number;
  nextState: number[];
  done: boolean;
};

export type DQNStats = {
  epsilon: number;
  loss: number;
  replaySize: number;
  updates: number;
};

/** A compact, browser-safe DQN: 6 inputs → 32 ReLU units → 3 Q-values. */
export class DQNAgent {
  private readonly inputs = 6;
  private readonly hidden = 32;
  private readonly actions = 3;
  private readonly gamma = 0.98;
  private readonly learningRate = 0.001;
  private readonly batchSize = 32;
  private readonly replayLimit = 6000;
  private readonly warmup = 180;
  private readonly trainEvery = 8;
  private readonly targetEvery = 240;
  private replay: Transition[] = [];
  private cursor = 0;
  private randomState: number;
  private online: number[][];
  private target: number[][];
  private steps = 0;
  private updates = 0;
  private epsilon = 0.9;
  private loss = 0;

  constructor(seed = 1234) {
    this.randomState = seed;
    this.online = this.createNetwork();
    this.target = this.online.map((layer) => [...layer]);
  }

  private random() {
    this.randomState = (this.randomState * 1664525 + 1013904223) >>> 0;
    return this.randomState / 4294967296;
  }

  private createNetwork() {
    const w1 = Array.from({ length: this.inputs * this.hidden }, () => (this.random() * 2 - 1) * Math.sqrt(2 / this.inputs));
    const b1 = Array(this.hidden).fill(0);
    const w2 = Array.from({ length: this.hidden * this.actions }, () => (this.random() * 2 - 1) * Math.sqrt(2 / this.hidden));
    const b2 = Array(this.actions).fill(0);
    return [w1, b1, w2, b2];
  }

  private forward(state: number[], network: number[][]) {
    const [w1, b1, w2, b2] = network;
    const preHidden = Array(this.hidden).fill(0);
    const hidden = Array(this.hidden).fill(0);
    const q = Array(this.actions).fill(0);
    for (let j = 0; j < this.hidden; j += 1) {
      let value = b1[j];
      for (let i = 0; i < this.inputs; i += 1) value += state[i] * w1[i * this.hidden + j];
      preHidden[j] = value;
      hidden[j] = Math.max(0, value);
    }
    for (let action = 0; action < this.actions; action += 1) {
      let value = b2[action];
      for (let j = 0; j < this.hidden; j += 1) value += hidden[j] * w2[j * this.actions + action];
      q[action] = value;
    }
    return { preHidden, hidden, q };
  }

  selectAction(state: number[]) {
    if (this.random() < this.epsilon) return Math.floor(this.random() * this.actions);
    const values = this.forward(state, this.online).q;
    return values.reduce((best, value, index) => value > values[best] ? index : best, 0);
  }

  observe(transition: Transition) {
    if (this.replay.length < this.replayLimit) this.replay.push(transition);
    else {
      this.replay[this.cursor] = transition;
      this.cursor = (this.cursor + 1) % this.replayLimit;
    }
    this.steps += 1;
    this.epsilon = Math.max(0.06, this.epsilon * 0.99994);
    if (this.replay.length >= this.warmup && this.steps % this.trainEvery === 0) this.trainBatch();
  }

  private trainBatch() {
    const [w1, b1, w2, b2] = this.online;
    const gradW1 = Array(w1.length).fill(0);
    const gradB1 = Array(b1.length).fill(0);
    const gradW2 = Array(w2.length).fill(0);
    const gradB2 = Array(b2.length).fill(0);
    let batchLoss = 0;

    for (let batch = 0; batch < this.batchSize; batch += 1) {
      const item = this.replay[Math.floor(this.random() * this.replay.length)];
      const prediction = this.forward(item.state, this.online);
      const nextQ = this.forward(item.nextState, this.target).q;
      const target = item.reward + (item.done ? 0 : this.gamma * Math.max(...nextQ));
      const error = prediction.q[item.action] - target;
      const gradient = Math.max(-1, Math.min(1, error)); // Huber-loss derivative
      batchLoss += Math.abs(error) <= 1 ? 0.5 * error * error : Math.abs(error) - 0.5;

      for (let j = 0; j < this.hidden; j += 1) {
        gradW2[j * this.actions + item.action] += prediction.hidden[j] * gradient;
      }
      gradB2[item.action] += gradient;

      for (let j = 0; j < this.hidden; j += 1) {
        const hiddenGradient = prediction.preHidden[j] > 0 ? w2[j * this.actions + item.action] * gradient : 0;
        gradB1[j] += hiddenGradient;
        for (let i = 0; i < this.inputs; i += 1) gradW1[i * this.hidden + j] += item.state[i] * hiddenGradient;
      }
    }

    const scale = this.learningRate / this.batchSize;
    for (let i = 0; i < w1.length; i += 1) w1[i] -= scale * gradW1[i];
    for (let i = 0; i < b1.length; i += 1) b1[i] -= scale * gradB1[i];
    for (let i = 0; i < w2.length; i += 1) w2[i] -= scale * gradW2[i];
    for (let i = 0; i < b2.length; i += 1) b2[i] -= scale * gradB2[i];
    this.loss = batchLoss / this.batchSize;
    this.updates += 1;
    if (this.updates % this.targetEvery === 0) this.target = this.online.map((layer) => [...layer]);
  }

  getStats(): DQNStats {
    return { epsilon: this.epsilon, loss: this.loss, replaySize: this.replay.length, updates: this.updates };
  }
}
