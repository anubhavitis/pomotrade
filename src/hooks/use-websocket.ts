// hooks/useHyperliquid.js
import { useEffect, useState, useCallback, useRef } from "react";
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

export interface AllMidData {
  coin: string;
  mid: string;
  timestamp: number;
}

export function useHyperliquidWebSocket() {
  const asset = useAssetStore((state: AssetStore) => state.asset);
  const wsRef = useRef<WebSocket | null>(null);
  const [wsData, setWsData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket("wss://api.hyperliquid.xyz/ws");
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log("Connected to Hyperliquid WebSocket");

        // Subscribe to candles for the current asset
        const subscribeMessage = {
          method: "subscribe",
          subscription: {
            type: "candle",
            coin: asset.toString(),
            interval: "1m",
          },
        };

        ws.send(JSON.stringify(subscribeMessage));
        // console.log("Sent subscription for asset:", asset, ":", subscribeMessage);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
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

        // Only attempt to reconnect if the connection was closed unexpectedly
        // and we're still subscribed to the same asset
        if (wsRef.current === ws) {
          setTimeout(() => {
            connect();
          }, 5000);
        }
      };

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    } catch (err) {
      setError("Failed to connect to WebSocket");
      console.error("Connection error:", err);
    }
  }, [asset]); // Add asset to dependency array

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
