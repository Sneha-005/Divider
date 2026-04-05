import { useState, useCallback, useEffect } from 'react';
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

      // Datasource already handles mapping and response unwrapping
      const walletData = await tradingRemoteDatasource.getWallet();
      
      setWallet(walletData);
      console.log('✅ Wallet hook - data set:', {
        total_balance: walletData.total_balance,
        available_cash: walletData.available_cash,
        invested_amount: walletData.invested_amount,
        holdings: walletData.holdings?.length || 0
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet';
      setError(errorMessage);
      console.error('❌ useWallet hook error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch wallet data on component mount
  useEffect(() => {
    console.log('📱 useWallet hook initialized, fetching wallet data...');
    fetchWallet();
  }, [fetchWallet]);

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
  code?: string;
  details?: any;
  data?: {
    status?: string;
    symbol?: string;
    type?: string;
    quantity?: number;
    price?: number;
    total?: number;
    fee?: number;
    transaction_id?: string;
    timestamp?: string;
  };
  transaction_id?: string;
  status?: string;
  symbol?: string;
  type?: string;
  quantity?: number;
  price?: number;
  total?: number;
  timestamp?: string;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
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

      console.log('🔄 Executing trade:', params);
      
      const response = await tradingRemoteDatasource.createTransaction({
        type: params.type === 'BUY' ? 'buy' : 'sell',
        symbol: params.symbol,
        quantity: params.quantity,
        price: params.price,
      });

      console.log('📨 API Response:', response);

      // Check if response indicates error with error field
      if (response.error || response.success === false) {
        // Error response structure: { success: false, error: { code, message, details } }
        const errorCode = response.error?.code || 'UNKNOWN_ERROR';
        const errorMessage = response.error?.message || response.message || 'Trade failed';
        const errorDetails = response.error?.details;

        console.error('❌ Trade API Error:', {
          code: errorCode,
          message: errorMessage,
          details: errorDetails,
        });

        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          code: errorCode,
          details: errorDetails,
        };
      }

      // Success response structure: API returns data directly
      // e.g. { "status": "Trade executed successfully", "total": 1604.52, "symbol": "RELIANCE-CE-2900", ... }
      if (response.status || response.total || response.symbol) {
        console.log('✅ Trade executed successfully:', response);
        
        return {
          success: true,
          message: `${params.type} order executed successfully`,
          data: {
            status: response.status,
            symbol: response.symbol || params.symbol,
            type: response.type || params.type.toLowerCase(),
            quantity: response.quantity || params.quantity,
            price: response.price || params.price,
            total: response.total,
            fee: response.fee || (response.total * 0.005),
            transaction_id: response.transaction_id,
            timestamp: response.timestamp,
          },
        };
      }

      // Fallback for unexpected response format
      console.warn('⚠️ Unexpected response format:', response);
      return {
        success: true,
        message: `${params.type} order executed successfully`,
        data: response,
      };

    } catch (err) {
      let errorMessage = 'Trade failed';
      let errorCode = 'UNKNOWN_ERROR';
      let errorDetails: any = null;

      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Try to parse error as JSON if it's a stringified error response
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
            errorCode = errorData.error.code;
            errorDetails = errorData.error.details;
          }
        } catch (parseErr) {
          // Keep the original error message
        }
      }

      console.error('❌ Trade execution error:', errorMessage, err);
      
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        code: errorCode,
        details: errorDetails,
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

interface UseDashboardResult {
  dashboard: any;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboard = (): UseDashboardResult => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardData = await tradingRemoteDatasource.getDashboardHome();
      
      setDashboard(dashboardData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard';
      setError(errorMessage);
      console.error('❌ useDashboard hook error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
};
