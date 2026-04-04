import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://divider-backend.onrender.com';
const REQUEST_TIMEOUT = 10000;

interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: string;
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
      console.log('Wallet data received:', data);
      
      // Map API response to standardized format
      // API returns: positions, but we expect: holdings
      const mappedData = {
        user_id: data.user_id,
        total_balance: data.total_balance,
        available_cash: data.available_cash,
        invested_amount: data.invested_amount || 0,
        last_updated: data.last_updated,
        // Convert positions to holdings format with all details
        holdings: data.positions ? Object.values(data.positions).map((position: any) => ({
          symbol: position.symbol,
          quantity: position.quantity,
          current_price: position.current_price,
          average_cost: position.average_cost,
          current_value: position.current_price * position.quantity,
          unrealized_pnl: position.unrealized_pnl,
          percentage: position.percentage,
        })) : [],
      };
      
      console.log('Mapped Holdings count:', mappedData.holdings.length);
      console.log('Holdings:', mappedData.holdings);
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
   * POST /trading/transactions
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

      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/trading/transactions`,
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

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        console.error('Create Transaction API Error:', errorData);
        throw new Error(
          errorData.message ||
          errorData.error ||
          `Create transaction error: ${response.status}`
        );
      }

      const data = await response.json();
      console.log('Transaction created:', data);
      return data;
    } catch (error) {
      console.error('createTransaction error:', error);
      throw error;
    }
  }
}

export const tradingRemoteDatasource = new TradingRemoteDatasource();
