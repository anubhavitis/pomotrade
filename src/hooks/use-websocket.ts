// hooks/useHyperliquid.js
import { useEffect, useState, useCallback } from "react";
import useAssetStore, { AssetStore } from "./asset-store";

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

export interface WebSocketMessage {
  channel: string;
  data: CandleData;
}

export function useHyperliquidWebSocket() {
  const asset = useAssetStore((state: AssetStore) => state.asset);
  const [wsData, setWsData] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket("wss://api.hyperliquid.xyz/ws");

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log("Connected to Hyperliquid WebSocket");

        // Subscribe to candles for BTC
        const subscribeMessage = {
          method: "subscribe",
          subscription: {
            type: "candle",
            coin: asset.toString(),
            interval: "1m",
          },
        };

        ws.send(JSON.stringify(subscribeMessage));
        console.log("Sent subscription:", subscribeMessage);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          console.log("Received WebSocket message:", data);
          setWsData(data);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.onerror = (event) => {
        setError("WebSocket error occurred");
        console.error("WebSocket error:", event);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setError("WebSocket connection closed");
        console.log("WebSocket connection closed");

        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          connect();
        }, 5000);
      };

      return () => {
        ws.close();
      };
    } catch (err) {
      setError("Failed to connect to WebSocket");
      console.error("Connection error:", err);
    }
  }, [asset]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      if (cleanup) cleanup();
    };
  }, [connect]);

  return {
    data: wsData,
    isConnected,
    error,
  };
}
