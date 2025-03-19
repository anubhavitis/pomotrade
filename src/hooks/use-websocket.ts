// hooks/useHyperliquid.js
import { useEffect, useState, useCallback, useRef } from "react";

export interface CandleData {
  t: number; // open millis
  T: number; // close millis
  s: string; // coin
  i: string; // interval
  o: number; // open price
  c: number; // close price
  h: number; // high price
  l: number; // low price
  v: number; // volume (base unit)
  n: number; // number of trades
}

export interface AllMidData {
  coin: string;
  mid: string;
  timestamp: number;
}

export interface HyperliquidWebSocketProps {
  coin?: string;
  interval?: string;
  limit?: number;
}

export function useHyperliquidWebSocket({ 
  coin = "BTC", 
  interval = "1m",
  limit = 100 
}: HyperliquidWebSocketProps = {}) {
  const [wsData, setWsData] = useState<any>(null);
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const hasLoadedHistory = useRef<boolean>(false);

  // Fetch historical candle data
  const fetchHistoricalCandles = useCallback(async () => {
    try {
      // Calculate timestamp for historical data (last 24 hours by default)
      const endTime = new Date().getTime();
      const startTime = endTime - (24 * 60 * 60 * 1000); // 24 hours ago
      
      // Build API URL
      const url = `https://api.hyperliquid.xyz/info`;
      const requestBody = {
        "type": "candleSnapshot",
        "coin": coin,
        "interval": interval,
        "startTime": startTime,
        "endTime": endTime,
        "limit": limit
      };
      
      console.log("Fetching historical candles:", requestBody);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Historical candle data:", data);
      
      if (Array.isArray(data)) {
        // Process the historical candle data
        const formattedCandles: CandleData[] = data.map((item: any) => ({
          t: item.time,
          T: item.time + getIntervalMillis(interval),
          s: coin,
          i: interval,
          o: parseFloat(item.open),
          c: parseFloat(item.close), 
          h: parseFloat(item.high),
          l: parseFloat(item.low),
          v: parseFloat(item.volume),
          n: item.trades || 0
        }));
        
        setCandleData(formattedCandles);
        hasLoadedHistory.current = true;
      }
    } catch (err) {
      console.error("Error fetching historical candle data:", err);
      setError("Failed to fetch historical data");
    }
  }, [coin, interval, limit]);

  // Helper function to get milliseconds for an interval
  const getIntervalMillis = (interval: string): number => {
    const unit = interval.slice(-1);
    const value = parseInt(interval.slice(0, -1));
    
    switch (unit) {
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 60 * 1000; // Default to 1 minute
    }
  };

  const connect = useCallback(() => {
    try {
      // Use the production endpoint
      ws.current = new WebSocket("wss://api.hyperliquid.xyz/ws");

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log("Connected to Hyperliquid WebSocket");

        // Load historical data if not already loaded
        if (!hasLoadedHistory.current) {
          fetchHistoricalCandles();
        }

        // Subscribe to candles for the specified coin and interval
        const subscribeMessage = {
          method: "subscribe",
          subscription: {
            type: "candle",
            coin,
            interval,
          },
        };

        ws.current?.send(JSON.stringify(subscribeMessage));
        console.log("Sent subscription:", subscribeMessage);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket message:", data);
          
          // Store the complete message
          setWsData(data);
          
          // If the data contains candle information, process it separately
          if (data.channel === "candle" && Array.isArray(data.data)) {
            setCandleData(prevData => {
              // Combine previous data with new data
              const newCandles = [...prevData];
              
              data.data.forEach((candle: CandleData) => {
                // Find if we already have this candle (matching timestamp)
                const existingIndex = newCandles.findIndex(
                  existing => existing.t === candle.t && existing.s === candle.s
                );
                
                if (existingIndex >= 0) {
                  // Update existing candle
                  newCandles[existingIndex] = candle;
                } else {
                  // Add new candle
                  newCandles.push(candle);
                }
              });
              
              // Sort by timestamp, newest first
              return newCandles.sort((a, b) => b.t - a.t);
            });
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.current.onerror = (event) => {
        setError("WebSocket error occurred");
        console.error("WebSocket error:", event);
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        setError("WebSocket connection closed");
        console.log("WebSocket connection closed");

        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          connect();
        }, 5000);
      };

      return () => {
        ws.current?.close();
      };
    } catch (err) {
      setError("Failed to connect to WebSocket");
      console.error("Connection error:", err);
      // Return a noop cleanup function
      return () => {};
    }
  }, [coin, interval, fetchHistoricalCandles]);

  useEffect(() => {
    // Reset history loaded flag when coin or interval changes
    hasLoadedHistory.current = false;
    
    // Close any existing connection
    if (ws.current) {
      ws.current.close();
    }
    
    // Establish a new connection
    const cleanup = connect();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [connect, coin, interval]);

  return {
    data: wsData,
    candles: candleData,
    isConnected,
    error,
  };
}
