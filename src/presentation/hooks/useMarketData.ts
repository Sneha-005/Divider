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
      console.log('\n🔌 Starting WebSocket connection...');
      
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

      console.log('✅ Token retrieved:', token.length, 'characters');

      // Clear any previous connection
      if (wsRef.current) {
        console.log('⚠️ Closing existing WebSocket connection');
        wsRef.current.close();
      }

      // Create WebSocket connection with token
      const wsUrl = `wss://divider-backend.onrender.com/ws?token=${token}`;
      console.log('🌐 WebSocket URL:', wsUrl.substring(0, 50) + '...');
      
      const ws = new WebSocket(wsUrl);
      let messageCount = 0;

      ws.onopen = () => {
        console.log('✅✅✅ WebSocket CONNECTED ✅✅✅');
        if (mountedRef.current) {
          setConnected(true);
          setError(null);
          setLoading(false);
        }
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        messageCount++;
        try {
          console.log(`\n📨 Message #${messageCount}:`);
          console.log('   Size:', event.data.length, 'bytes');
          console.log('   Raw (first 150 chars):', event.data.substring(0, 150));
          
          const data = JSON.parse(event.data);
          console.log('   ✅ Parsed Successfully');
          console.log('   Type:', Array.isArray(data) ? `Array (${data.length} items)` : typeof data);
          
          if (!mountedRef.current) {
            console.warn('   ⚠️ Component unmounted, skipping state update');
            return;
          }

          // Handle array of market data
          if (Array.isArray(data)) {
            console.log('   Setting', data.length, 'market items to state');
            if (data.length > 0) {
              console.log('   Sample:', JSON.stringify(data[0]));
            }
            setMarketData(data);
          } else if (data && typeof data === 'object') {
            console.log('   Setting single market item to state');
            console.log('   Item:', JSON.stringify(data));
            setMarketData([data]);
          } else {
            console.warn('   ⚠️ Unexpected data type:', typeof data);
          }
          
          setError(null);
        } catch (parseError) {
          console.error('❌ Parse Error:', parseError);
          console.error('   Raw message:', event.data.substring(0, 300));
          if (mountedRef.current) {
            setError(`Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown'}`);
          }
        }
      };

      ws.onerror = (event: Event | string) => {
        console.error('❌ WebSocket Error:', event);
        if (mountedRef.current) {
          setError('WebSocket connection error');
          setConnected(false);
        }
      };

      ws.onclose = (event: any) => {
        console.warn(`⚠️ WebSocket Closed: code=${event?.code || 'unknown'}, reason=${event?.reason || 'unknown'}`);
        if (mountedRef.current) {
          setConnected(false);
        }
        
        // Attempt auto-reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(
            baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current),
            maxReconnectDelay
          );
          
          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          reconnectAttemptsRef.current += 1;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              console.log('🔄 Attempting reconnect...');
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
      console.log('✅ WebSocket object created and handlers attached');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      console.error('❌ Connection Exception:', errorMessage, err);
      if (mountedRef.current) {
        setError(errorMessage);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    console.log('\n🚀 useMarketData Hook Mounted');
    
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      console.log('🛑 useMarketData Hook Unmounting');
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
