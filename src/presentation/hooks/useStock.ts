// Presentation layer - Custom hooks for stocks

import { useState, useCallback, useEffect } from 'react';
import { Stock, Portfolio } from '../../domain/entities/stock.entity';
import {
  GetStocksUseCase,
  GetPortfolioUseCase,
  BuyStockUseCase,
  SellStockUseCase,
} from '../../domain/usecases/stock.usecase';
import { StockRepositoryImpl } from '../../data/repositories/stock.repository.impl';
import { MockStockDataSource } from '../../data/datasources/stock.datasource';

// Initialize repository and use cases
const dataSource = new MockStockDataSource();
const repository = new StockRepositoryImpl(dataSource);
const getStocksUseCase = new GetStocksUseCase(repository);
const getPortfolioUseCase = new GetPortfolioUseCase(repository);
const buyStockUseCase = new BuyStockUseCase(repository);
const sellStockUseCase = new SellStockUseCase(repository);

export const useStocks = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStocksUseCase.execute();
      setStocks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return {
    stocks,
    loading,
    error,
    refetch: fetchStocks,
  };
};

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPortfolioUseCase.execute();
      setPortfolio(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return {
    portfolio,
    loading,
    error,
    refetch: fetchPortfolio,
  };
};

export const useBuySell = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyStock = useCallback(async (stockId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await buyStockUseCase.execute(stockId, quantity);
      return { success, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Buy failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const sellStock = useCallback(async (stockId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await sellStockUseCase.execute(stockId, quantity);
      return { success, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sell failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    buyStock,
    sellStock,
    loading,
    error,
  };
};
