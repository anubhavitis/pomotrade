"use client";

import { useHyperliquidWebSocket } from "@/hooks/use-websocket";
import { useEffect } from "react";

export default function WebSocketDataDisplay() {
  const { data, isConnected, error } = useHyperliquidWebSocket();

  useEffect(() => {
    console.log("WebSocket Data Updated:", data);
  }, [data]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
        {error && <p className="text-red-500">Error: {error}</p>}
      </div>

      <div className="h-[500px] w-full max-w-3xl bg-slate-900 rounded-lg overflow-auto p-4">
        <pre className="text-sm text-white whitespace-pre-wrap">
          {data ? JSON.stringify(data, null, 2) : "Waiting for data..."}
        </pre>
      </div>
    </div>
  );
}
