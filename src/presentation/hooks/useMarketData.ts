import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MarketData {
  symbol: string;
  currentPrice: number;
  volume: number;
  percentageChange: number;
}

interface UseMarketDataResult {
  marketData: MarketData[];
  loading: boolean;
  connected: boolean;
  error: string | null;
}

export const useMarketData = (): UseMarketDataResult => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;
  const maxReconnectDelay = 30000;
  const mountedRef = useRef(true);

  const connectWebSocket = async () => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        const msg = '❌ NO TOKEN in AsyncStorage!';
        console.error(msg);
        if (mountedRef.current) {
          setError(msg);
          setLoading(false);
        }
        return;
      }

      // Clear any previous connection
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Create WebSocket connection with token
      const wsUrl = `wss://divider-backend.onrender.com/ws?token=${token}`;
      
      const ws = new WebSocket(wsUrl);
      let messageCount = 0;

      ws.onopen = () => {
        if (mountedRef.current) {
          setConnected(true);
          setError(null);
          setLoading(false);
        }
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (!mountedRef.current) {
            return;
          }

          // Handle array of market data
          if (Array.isArray(data)) {
            setMarketData(data);
          } else if (data && typeof data === 'object') {
            setMarketData([data]);
          }
          
          setError(null);
        } catch (parseError) {
          console.error('❌ WebSocket Parse Error:', parseError);
          if (mountedRef.current) {
            setError(`Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown'}`);
          }
        }
      };

      ws.onerror = (event: Event | string) => {
        if (mountedRef.current) {
          setError('WebSocket connection error');
          setConnected(false);
        }
      };

      ws.onclose = (event: any) => {
        if (mountedRef.current) {
          setConnected(false);
        }
        
        // Attempt auto-reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(
            baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current),
            maxReconnectDelay
          );
          
          reconnectAttemptsRef.current += 1;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              connectWebSocket();
            }
          }, delay);
        } else {
          const errMsg = `❌ Max reconnection attempts (${maxReconnectAttempts}) exceeded`;
          console.error(errMsg);
          if (mountedRef.current) {
            setError(errMsg);
            setLoading(false);
          }
        }
      };

      wsRef.current = ws;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      console.error('❌ WebSocket Connection Error:', errorMessage);
      if (mountedRef.current) {
        setError(errorMessage);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - connect only on mount

  return {
    marketData,
    loading,
    connected,
    error,
  };
};
