import { useCallback, useState, useEffect } from "react";

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
    const [wsData, setWsData] = useState<OrderBookMessage | null>(null);
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
                        type: "l2Book",
                        coin: "BTC",
                    },
                };

                ws.send(JSON.stringify(subscribeMessage));
                console.log("Sent subscription:", subscribeMessage);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("Received Orderbook WebSocket message:", data);
                    setWsData(data); // Store all incoming messages
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
    }, []);

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
