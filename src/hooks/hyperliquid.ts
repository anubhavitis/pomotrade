// hooks/useHyperliquid.js
import { useEffect, useState } from "react";
import { Hyperliquid } from "hyperliquid";

export function useHyperliquid() {
  const [sdk, setSdk] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [priceData, setPriceData] = useState({});
  // Add other state as needed

  useEffect(() => {
    const initHyperliquid = async () => {
      const hyperliquid = new Hyperliquid({ enableWs: true });

      try {
        await hyperliquid.connect();
        setIsConnected(true);

        // Set up subscriptions
        hyperliquid.subscriptions.subscribeToAllMids((data) => {
          setPriceData(data);
        });

        // Add other subscriptions as needed
      } catch (error) {
        console.error("Error connecting to Hyperliquid:", error);
      }
    };

    initHyperliquid();
  }, []);

  return { sdk, isConnected, priceData };
}
