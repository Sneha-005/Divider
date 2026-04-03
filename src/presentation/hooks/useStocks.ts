import { useState, useCallback, useEffect, useRef } from 'react';
import { Stock, Portfolio, TradeOrder } from '../../domain/entities/Stock';
import { GetStocksUseCase } from '../../domain/usecases/GetStocksUseCase';
import { GetPortfolioUseCase } from '../../domain/usecases/GetPortfolioUseCase';
import { ExecuteTradeUseCase } from '../../domain/usecases/ExecuteTradeUseCase';
import { StockRepositoryImpl } from '../../data/repositories/StockRepositoryImpl';
import { StockLocalDataSource } from '../../data/datasources/StockLocalDataSource';
import { REFRESH_INTERVAL_MS } from '../../utils/constants';

// Single data source instance so portfolio state persists
const dataSource = new StockLocalDataSource();
const repository = new StockRepositoryImpl(dataSource);
const getStocksUseCase = new GetStocksUseCase(repository);
const getPortfolioUseCase = new GetPortfolioUseCase(repository);
const executeTradeUseCase = new ExecuteTradeUseCase(repository);

export const useStocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [trading, setTrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      const data = await getStocksUseCase.execute();
      setStocks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load stocks');
    }
  }, []);

  const fetchPortfolio = useCallback(async () => {
    try {
      const data = await getPortfolioUseCase.execute();
      setPortfolio(data);
    } catch (err) {
      setError('Failed to load portfolio');
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStocks(), fetchPortfolio()]);
    setLoading(false);
  }, [fetchStocks, fetchPortfolio]);

  const executeTrade = useCallback(async (order: TradeOrder) => {
    setTrading(true);
    try {
      const result = await executeTradeUseCase.execute(order);
      if (result.success) {
        await fetchPortfolio();
      }
      return result;
    } catch (err) {
      return { success: false, message: 'Trade failed' };
    } finally {
      setTrading(false);
    }
  }, [fetchPortfolio]);

  const refresh = useCallback(async () => {
    await fetchStocks();
  }, [fetchStocks]);

  // Initial load
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Auto-refresh stock prices
  useEffect(() => {
    intervalRef.current = setInterval(fetchStocks, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStocks]);

  return {
    stocks,
    portfolio,
    loading,
    trading,
    error,
    executeTrade,
    refresh,
  };
};
