import { useState, useCallback } from 'react';
import { Candle } from '../../domain/entities/candle.entity';
import { CandleRepositoryImpl } from '../../data/repositories/candle.repository.impl';
import { CandleRemoteDataSource } from '../../data/datasources/remote/candle.remote.datasource';
import { AuthLocalDataSource } from '../../data/datasources/local/auth.local.datasource';
import { GetCandlesUseCase } from '../../domain/use-cases/get-candles.usecase';

const authLocalDataSource = new AuthLocalDataSource();
const remoteDataSource = new CandleRemoteDataSource(authLocalDataSource);
const repository = new CandleRepositoryImpl(remoteDataSource);
const getCandlesUseCase = new GetCandlesUseCase(repository);

interface UseCandlesReturn {
  candles: Candle[];
  loading: boolean;
  error: string | null;
  fetchCandles: (symbol: string, limit?: number, timeframe?: string) => Promise<void>;
}

export const useCandles = (): UseCandlesReturn => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandles = useCallback(async (symbol: string, limit: number = 50, timeframe?: string) => {
    try {
      setError(null);
      setLoading(true);
      const data = await getCandlesUseCase.execute(symbol, limit, timeframe);
      setCandles(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load candles';
      setError(errorMessage);
      console.error('Fetch candles error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    candles,
    loading,
    error,
    fetchCandles,
  };
};
