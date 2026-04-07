/**
 * Candle Repository Implementation
 * Combines remote API for candlestick data
 */

import { ICandleRepository } from "../../domain/repositories/candle.repository";
import { Candle } from "../../domain/entities/candle.entity";
import { CandleRemoteDataSource } from "../datasources/remote/candle.remote.datasource";

export class CandleRepositoryImpl implements ICandleRepository {
  constructor(private remoteDataSource: CandleRemoteDataSource) {}

  async getCandles(symbol: string, limit: number = 50, timeframe?: string): Promise<Candle[]> {
    try {
      const response = await this.remoteDataSource.getCandles(symbol, limit, timeframe);
      return response.map((data) => Candle.create(data));
    } catch (error) {
      throw error;
    }
  }
}
