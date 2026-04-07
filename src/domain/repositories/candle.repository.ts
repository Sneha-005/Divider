/**
 * Candle Repository Interface
 * Defines contracts for candlestick data operations
 */

import { Candle } from "../entities/candle.entity";

export interface ICandleRepository {
  /**
   * Fetch candlestick data for a symbol
   */
  getCandles(symbol: string, limit?: number, timeframe?: string): Promise<Candle[]>;
}
