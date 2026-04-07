import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://divider-backend.onrender.com';
const REQUEST_TIMEOUT = 10000;

interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: any;
}

interface StoredUserData {
  id?: string;
  email?: string;
  username?: string;
}

/**
 * Trading Remote Datasource
 * Handles API calls to wallet and transactions endpoints
 */
export class TradingRemoteDatasource {
  /**
   * Get authorization header with Bearer token
   * Ensures proper format: "Authorization: Bearer {token}"
   */
  private async getAuthHeader(): Promise<{ Authorization: string }> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No auth token found');
      }

      // Ensure token doesn't have "Bearer " prefix already
      const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
      
      // Return properly formatted Authorization header
      return {
        Authorization: `Bearer ${cleanToken}`,
      };
    } catch (error) {
      console.error('Error getting auth header:', error);
      throw error;
    }
  }

  /**
   * Get optional user context headers used by some backend endpoints.
   */
  private async getUserContextHeaders(): Promise<Record<string, string>> {
    try {
      const userDataRaw = await AsyncStorage.getItem('user_data');
      if (!userDataRaw) {
        return {};
      }

      const userData: StoredUserData = JSON.parse(userDataRaw);
      const headers: Record<string, string> = {};

      if (userData.id) {
        headers['X-User-ID'] = userData.id;
      }
      if (userData.email) {
        headers['X-Email'] = userData.email;
      }
      if (userData.username) {
        headers['X-Username'] = userData.username;
      }

      return headers;
    } catch (error) {
      // If user context is not available, fallback to token-only auth.
      return {};
    }
  }

  /**
   * Generic fetch method with timeout and error handling
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = REQUEST_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Get wallet information
   * GET /trading/wallet
   */
  async getWallet(): Promise<any> {
    try {
      const authHeader = await this.getAuthHeader();

      console.log('Fetching wallet from:', `${API_BASE_URL}/trading/wallet`);
      console.log('Authorization header format:', authHeader.Authorization.substring(0, 20) + '...');

      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/trading/wallet`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authHeader,
          },
        }
      );

      if (!response.ok) {
        let errorData: ApiErrorResponse = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: `HTTP ${response.status}` };
        }
        console.error('Wallet API Error:', errorData);
        throw new Error(
          errorData.message ||
          errorData.error ||
          `Wallet API error: ${response.status}`
        );
      }

      const data = await response.json();
      console.log('Wallet API response:', data);
      
      // Handle response wrapper - API wraps data in { data, success }
      const walletData = data.data || data;
      
      console.log('✅ Wallet data extracted:', {
        user_id: walletData.user_id,
        total_balance: walletData.total_balance,
        available_cash: walletData.available_cash,
        invested_amount: walletData.invested_amount,
        positions_count: Object.keys(walletData.positions || {}).length
      });
      
      // Map API response to standardized format
      // API returns: positions object, we convert to holdings array
      const mappedData = {
        user_id: walletData.user_id,
        total_balance: walletData.total_balance || 0,
        available_cash: walletData.available_cash || 0,
        invested_amount: walletData.invested_amount || 0,
        last_updated: walletData.last_updated,
        // Convert positions object to holdings array with all details
        holdings: walletData.positions ? Object.values(walletData.positions).map((position: any) => ({
          symbol: position.symbol,
          quantity: position.quantity,
          current_price: position.current_price,
          average_cost: position.average_cost,
          current_value: position.current_price * position.quantity,
          unrealized_pnl: position.unrealized_pnl,
          percentage: position.percentage,
        })) : [],
      };
      
      console.log('✅ Mapped wallet data:', {
        total_balance: mappedData.total_balance,
        available_cash: mappedData.available_cash,
        invested_amount: mappedData.invested_amount,
        holdings_count: mappedData.holdings.length
      });
      
      return mappedData;
    } catch (error) {
      console.error('getWallet error:', error);
      throw error;
    }
  }

  /**
   * Get transactions history
   * GET /trading/transactions
   * 
   * IMPORTANT: This endpoint may have stricter header validation
   * Ensure Authorization header is exactly: "Bearer {token}"
   * No extra spaces or characters
   */
  async getTransactions(params?: { limit?: number; offset?: number }): Promise<any> {
    try {
      const authHeader = await this.getAuthHeader();

      // Build query string if params provided
      let url = `${API_BASE_URL}/trading/transactions`;
      if (params) {
        const queryString = new URLSearchParams();
        if (params.limit) queryString.append('limit', params.limit.toString());
        if (params.offset) queryString.append('offset', params.offset.toString());
        if (queryString.toString()) {
          url += `?${queryString.toString()}`;
        }
      }

      console.log('Fetching transactions from:', url);
      console.log('Authorization header format:', authHeader.Authorization.substring(0, 20) + '...');

      const response = await this.fetchWithTimeout(
        url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authHeader,
          },
        }
      );

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: `HTTP ${response.status}` };
        }

        console.error('Transactions API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });

        throw new Error(
          errorData.message ||
          errorData.error ||
          `Transactions API error: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Transactions data received:', data);
      return data;
    } catch (error) {
      console.error('getTransactions error:', error);
      throw error;
    }
  }

  /**
   * Create a new transaction (Buy/Sell)
   * POST /trading/trade
   */
  async createTransaction(transactionData: {
    type: 'buy' | 'sell';
    symbol: string;
    quantity: number;
    price?: number;
  }): Promise<any> {
    try {
      const authHeader = await this.getAuthHeader();

      console.log('Creating transaction:', transactionData);
      console.log('Authorization header format:', authHeader.Authorization.substring(0, 20) + '...');

      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/trading/trade`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authHeader,
          },
          body: JSON.stringify(transactionData),
        }
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Get response as text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Raw response:', responseText.substring(0, 200));

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse failed, raw response:', responseText);
        throw new Error(`Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown'}`);
      }

      if (!response.ok) {
        console.error('Trade API Error Response:', data);
        
        // Handle error response format: { success: false, error: { code, message, details } }
        if (data.error?.message) {
          throw new Error(data.error.message);
        }
        
        throw new Error(
          data.message ||
          data.error ||
          `Trade API error: ${response.status}`
        );
      }

      console.log('Transaction created successfully:', data);
      return data;
    } catch (error) {
      console.error('createTransaction error:', error);
      throw error;
    }
  }

  /**
   * Perform cash operation against wallet endpoints (deposit/withdraw).
   */
  private async performCashOperation(
    endpoint: 'deposit' | 'withdraw',
    amount: number
  ): Promise<any> {
    try {
      const authHeader = await this.getAuthHeader();
      const userContextHeaders = await this.getUserContextHeaders();

      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/trading/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authHeader,
            ...userContextHeaders,
          },
          body: JSON.stringify({ amount }),
        }
      );

      let data: any = null;
      try {
        data = await response.json();
      } catch (parseError) {
        data = {
          success: false,
          error: {
            code: 'INVALID_RESPONSE',
            message: 'Invalid JSON response from server',
            details: {
              status: response.status,
            },
          },
        };
      }

      if (!response.ok || data?.success === false) {
        const errorPayload = data?.error
          ? data
          : {
              success: false,
              error: {
                code: 'API_ERROR',
                message: data?.message || `${endpoint} API error: ${response.status}`,
                details: data?.details || { status: response.status },
              },
            };

        throw new Error(JSON.stringify(errorPayload));
      }

      return data?.data || data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        JSON.stringify({
          success: false,
          error: {
            code: 'UNKNOWN_ERROR',
            message: `${endpoint} failed`,
            details: error,
          },
        })
      );
    }
  }

  /**
   * Deposit cash
   * POST /trading/deposit
   */
  async deposit(amount: number): Promise<any> {
    return this.performCashOperation('deposit', amount);
  }

  /**
   * Withdraw cash
   * POST /trading/withdraw
   */
  async withdraw(amount: number): Promise<any> {
    return this.performCashOperation('withdraw', amount);
  }

  /**
   * Get dashboard home data
   * GET /dashboard/home
   */
  async getDashboardHome(): Promise<any> {
    try {
      const authHeader = await this.getAuthHeader();

      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/dashboard/home`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authHeader,
          },
        }
      );

      if (!response.ok) {
        let errorData: ApiErrorResponse = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: `HTTP ${response.status}` };
        }
        console.error('Dashboard API Error:', errorData);
        throw new Error(
          errorData.message ||
          errorData.error ||
          `Dashboard API error: ${response.status}`
        );
      }

      const data = await response.json();
      
      // Handle response wrapper - API wraps data in { data, success }
      const dashboardData = data.data || data;
      
      return dashboardData;
    } catch (error) {
      console.error('getDashboardHome error:', error);
      throw error;
    }
  }
}

export const tradingRemoteDatasource = new TradingRemoteDatasource();
