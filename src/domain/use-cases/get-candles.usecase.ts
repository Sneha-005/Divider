/**
 * Use Case: Get Candles
 */

import { ICandleRepository } from "../repositories/candle.repository";
import { Candle } from "../entities/candle.entity";

export class GetCandlesUseCase {
  constructor(private candleRepository: ICandleRepository) {}

  async execute(symbol: string, limit?: number, timeframe?: string): Promise<Candle[]> {
    return this.candleRepository.getCandles(symbol, limit, timeframe);
  }
}
