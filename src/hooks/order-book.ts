import { useCallback, useState, useEffect, useRef } from "react";
import useAssetStore, { AssetStore } from "./asset-store";

export interface OrderBookLevel {
    px: string;
    sz: string;
    n: number;
}

interface OrderBookData {
    coin: string;
    time: number;
    levels: [OrderBookLevel[], OrderBookLevel[]]; // [bids, asks]
}

interface OrderBookMessage {
    channel: string;
    data: OrderBookData;
}

export function getOrderbook() {
    const asset = useAssetStore((state: AssetStore) => state.asset);
    const wsRef = useRef<WebSocket | null>(null);
    const [wsData, setWsData] = useState<OrderBookMessage | null>(null);
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

                // Subscribe to orderbook for the current asset
                const subscribeMessage = {
                    method: "subscribe",
                    subscription: {
                        type: "l2Book",
                        coin: asset,
                    },
                };

                ws.send(JSON.stringify(subscribeMessage));
                console.log("Sent orderbook subscription for asset:", asset, ":", subscribeMessage);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    // Only update state if the data is for the current asset
                    if (data.data?.coin === asset) {
                        console.log("Received Orderbook WebSocket message for", asset, ":", data);
                        setWsData(data);
                    } else {
                        console.log("Received Orderbook WebSocket message for", data.data?.coin, ":", data);
                    }
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
    }, [asset]);

    useEffect(() => {
        const cleanup = connect();
        return () => {
            if (cleanup) cleanup();
        };
    }, [connect]);

    return {
        orderbookData: wsData,
        isConnected,
        error,
    };
}
