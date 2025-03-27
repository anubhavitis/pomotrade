// hooks/useHyperliquid.js
import { useEffect, useState } from "react";
import hl from "hyperliquid";

export function useHyperliquid() {
  const [isConnected, setIsConnected] = useState(false);
  const [candleData, setCandleData] = useState({});
  // Add other state as needed

  useEffect(() => {
    const initHyperliquid = async () => {
      const hyperliquid = new hl.Hyperliquid({ enableWs: true });

      try {
        await hyperliquid.connect();
        setIsConnected(true);

        // Set up subscriptions
        hyperliquid.subscriptions.subscribeToCandle("BTC", "1m", (data) => {
          setCandleData(data);
        });
        // Add other subscriptions as needed
      } catch (error) {
        console.error("Error connecting to Hyperliquid:", error);
      }
    };

    initHyperliquid();
  }, []);

  return { isConnected, candleData };
}
