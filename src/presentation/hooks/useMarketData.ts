import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MarketData {
  symbol: string;
  currentPrice: number;
  percentageChange: number;
  totalQuantity: number;
  availableQuantity: number;
  heldQuantity: number;
  timestamp: string;
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
  const logEveryNUpdates = 10;
  const mountedRef = useRef(true);

  const connectWebSocket = async () => {
    try {
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

      if (wsRef.current) {
        wsRef.current.close();
      }

      const wsUrl = `wss://divider-backend.onrender.com/ws?token=${token}`;
      console.log('[WebSocket] Connecting...');
      
      const ws = new WebSocket(wsUrl);
      let messageCount = 0;

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
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
          messageCount += 1;
          const shouldLogUpdate = messageCount === 1 || messageCount % logEveryNUpdates === 0;
          
          if (!mountedRef.current) {
            return;
          }

          if (Array.isArray(data)) {
            if (shouldLogUpdate) {
              const availableByCompany = data
                .map((stock: any) => {
                  const qty =
                    stock.availableQuantity === undefined || stock.availableQuantity === null
                      ? 'N/A'
                      : Number(stock.availableQuantity).toLocaleString('en-IN');
                  return `${stock.symbol}: ${qty}`;
                })
                .join(' | ');
              console.log(
                `[WebSocket] Update #${messageCount}: ${data.length} symbols | Available -> ${availableByCompany}`
              );
            }
            setMarketData(data);
          } else if (data && typeof data === 'object') {
            if (shouldLogUpdate) {
              const qty =
                data.availableQuantity === undefined || data.availableQuantity === null
                  ? 'N/A'
                  : Number(data.availableQuantity).toLocaleString('en-IN');
              console.log(
                `[WebSocket] Update #${messageCount}: ${data.symbol} available=${qty} price=${data.currentPrice} change=${data.percentageChange}`
              );
            }
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
        const errorType = typeof event === 'string' ? event : event?.type || 'unknown';
        console.error(`[WebSocket] Connection error (${errorType})`);
        if (mountedRef.current) {
          setError('WebSocket connection error');
          setConnected(false);
        }
      };

      ws.onclose = (event: any) => {
        console.log(
          `[WebSocket] Closed: code=${event?.code ?? 'N/A'} reason=${event?.reason || 'N/A'}`
        );
        if (mountedRef.current) {
          setConnected(false);
        }
        
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(
            baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current),
            maxReconnectDelay
          );
          
          reconnectAttemptsRef.current += 1;
          console.log(
            `[WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );
          
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
  }, []); 

  return {
    marketData,
    loading,
    connected,
    error,
  };
};
