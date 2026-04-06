/**
 * Candle Entity - Business logic model
 */

export class Candle {
  constructor(
    readonly symbol: string,
    readonly open: number,
    readonly high: number,
    readonly low: number,
    readonly close: number,
    readonly volume: number,
    readonly timestamp: string,
  ) {}

  static create(data: {
    symbol: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: string;
  }): Candle {
    return new Candle(
      data.symbol,
      data.open,
      data.high,
      data.low,
      data.close,
      data.volume,
      data.timestamp,
    );
  }

  getFormattedTime(): string {
    const date = new Date(this.timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getPercentageChange(): number {
    return ((this.close - this.open) / this.open) * 100;
  }
}
