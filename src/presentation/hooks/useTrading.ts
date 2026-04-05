import { useState, useCallback } from 'react';
import { tradingRemoteDatasource } from '../../data/datasources/remote/trading.remote.datasource';

interface UseTransactionsResult {
  transactions: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTransactions = (): UseTransactionsResult => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await tradingRemoteDatasource.getTransactions({
        limit: 50,
        offset: 0,
      });

      // Handle both array and object response formats
      const txArray = Array.isArray(data) ? data : data.transactions || [];
      setTransactions(txArray);
      console.log('Transactions fetched:', txArray.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('useTransactions error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
};

interface UseWalletResult {
  wallet: any;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWallet = (): UseWalletResult => {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await tradingRemoteDatasource.getWallet();
      setWallet(data);
      console.log('Wallet data set in state:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet';
      setError(errorMessage);
      console.error('useWallet error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    wallet,
    loading,
    error,
    refetch: fetchWallet,
  };
};

interface TradeResult {
  success: boolean;
  message: string;
  transaction_id?: string;
}

interface TradingParams {
  symbol: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL';
}

export const useExecuteTrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTrade = useCallback(async (params: TradingParams): Promise<TradeResult> => {
    try {
      setLoading(true);
      setError(null);

      console.log('Executing trade:', params);
      
      const data = await tradingRemoteDatasource.createTransaction({
        type: params.type === 'BUY' ? 'buy' : 'sell',
        symbol: params.symbol,
        quantity: params.quantity,
        price: params.price,
      });

      console.log('Trade executed:', data);
      return {
        success: true,
        message: `${params.type} order executed successfully`,
        transaction_id: data.transaction_id,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Trade failed';
      setError(errorMessage);
      console.error('Trade error:', errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    executeTrade,
    loading,
    error,
  };
};
