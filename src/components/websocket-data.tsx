"use client";

import { useHyperliquidWebSocket } from "@/hooks/use-websocket";
import { useEffect } from "react";

type Channel = "candle" | "subscriptionResponse"

interface CandleData {
  t: number;    // Start timestamp
  T: number;    // End timestamp
  s: string;    // Symbol
  i: string;    // Interval
  o: string;    // Open price
  c: string;    // Close price
  h: string;    // High price
  l: string;    // Low price
  v: string;    // Volume
  n: number;    // Number of trades
}

interface SubscriptionResponseData {
  method: string;
  subscription: {
    type: string;
    interval: string;
    coin: string;
  }
}

interface WebSocketMessage {
  channel: Channel;
  data: CandleData;
}


export default function WebSocketData() {
  const { data, isConnected, error } = useHyperliquidWebSocket();

  useEffect(() => {
    console.log("WebSocket Data Updated:", data);
  }, [data]);

  return data;
}
