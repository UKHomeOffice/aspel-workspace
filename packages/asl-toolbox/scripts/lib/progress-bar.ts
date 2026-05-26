import { stdout } from 'process';

const colour = (code: number, value: string) => stdout.isTTY ? `\u001b[${code}m${value}\u001b[0m` : value;
const bold = (value: string) => colour(1, value);
const cyan = (value: string) => colour(36, value);
const gray = (value: string) => colour(90, value);
const green = (value: string) => colour(32, value);

export class ProgressBar {
  private readonly width: number;
  private readonly total: number;
  private readonly updateIntervalMs: number;
  private current: number;
  private lastFlushed: number;
  private readonly encoder: TextEncoder;
  private completed: boolean;

  constructor(total: number, width: number = 80, updateIntervalMs: number = 100) {
    this.total = total;
    this.width = width;
    this.updateIntervalMs = updateIntervalMs;
    this.current = 0;
    this.lastFlushed = 0;
    this.encoder = new TextEncoder();
    this.completed = false;

    this.render().then();
  }

  private async render(): Promise<void> {
    const now = Date.now();
    if (this.completed || (now - this.lastFlushed < this.updateIntervalMs && this.current < this.total)) {
      return;
    }

    const safeTotal = Math.max(this.total, 0);
    const totalLength = `${safeTotal}`.length;
    const ratio = safeTotal === 0 ? 1 : Math.min(this.current / safeTotal, 1);

    const percentText = `${Math.round(ratio * 100)}`.padStart(3, ' ') + '%';
    const countsText = `${`${this.current}`.padStart(totalLength)}/${safeTotal}`;

    const visibleSuffix = ` ${percentText} ${countsText}`;
    const suffix = ` ${bold(cyan(percentText))} ${gray(countsText)}`;

    const barWidth = Math.max(1, this.width - visibleSuffix.length - 2);
    const filled = Math.round(ratio * barWidth);
    const empty = Math.max(0, barWidth - filled);
    const bar = `${green('█'.repeat(filled))}${gray('░'.repeat(empty))}`;

    stdout.write(this.encoder.encode(`\r[${bar}]${suffix}`));

    if (this.current >= this.total) {
      this.completed = true;
      stdout.write(this.encoder.encode('\r\n'));
    }

    this.lastFlushed = Date.now();
  }

  async increment(value: number = 1) {
    this.current += value;
    await this.render();
  }

  async complete(): Promise<void> {
    this.current = this.total;
    await this.render();
  }
}
