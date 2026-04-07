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

      if (response.error || response.success === false) {
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
        
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
            errorCode = errorData.error.code;
            errorDetails = errorData.error.details;
          }
        } catch (parseErr) {
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

interface CashOperationResult {
  success: boolean;
  message: string;
  code?: string;
  details?: any;
  data?: {
    status?: string;
    amount?: number;
  };
}

const parseApiError = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed?.error?.message) {
        return {
          code: parsed.error.code || 'API_ERROR',
          message: parsed.error.message,
          details: parsed.error.details,
        };
      }
    } catch (parseError) {
      // Use raw message when error message is not JSON
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || fallbackMessage,
      details: null,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: fallbackMessage,
    details: null,
  };
};

export const useCashOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runOperation = useCallback(
    async (type: 'deposit' | 'withdraw', amount: number): Promise<CashOperationResult> => {
      const opLabel = type === 'deposit' ? 'Deposit' : 'Withdrawal';

      if (!Number.isFinite(amount) || amount <= 0) {
        const validationMessage = `${opLabel} amount must be greater than 0`;
        setError(validationMessage);
        return {
          success: false,
          code: 'INVALID_AMOUNT',
          message: validationMessage,
          details: { amount },
        };
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          type === 'deposit'
            ? await tradingRemoteDatasource.deposit(amount)
            : await tradingRemoteDatasource.withdraw(amount);

        const statusMessage =
          response?.status || (type === 'deposit' ? 'Deposit successful' : 'Withdrawal successful');

        return {
          success: true,
          message: statusMessage,
          data: {
            status: statusMessage,
            amount: Number(response?.amount ?? amount),
          },
        };
      } catch (err) {
        const parsed = parseApiError(err, `${opLabel} failed`);
        setError(parsed.message);
        return {
          success: false,
          code: parsed.code,
          message: parsed.message,
          details: parsed.details,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const depositCash = useCallback(
    async (amount: number) => runOperation('deposit', amount),
    [runOperation]
  );

  const withdrawCash = useCallback(
    async (amount: number) => runOperation('withdraw', amount),
    [runOperation]
  );

  return {
    depositCash,
    withdrawCash,
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
