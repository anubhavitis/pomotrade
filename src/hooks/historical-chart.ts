import useAssetStore, { AssetStore } from "./asset-store";

type Interval = "1m" | "15m" | "1hr" | "1d";

const INTERVAL_MILLISECONDS: Record<Interval, number> = {
    "1m": 60 * 1000,
    "15m": 15 * 60 * 1000,
    "1hr": 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
};

export interface CandleData {
    t: number; // open millis
    T: number; // close millis
    s: string; // coin
    i: string; // interval
    o: string; // open price
    c: string; // close price
    h: string; // high price
    l: string; // low price
    v: string; // volume (base unit)
    n: number; // number of trades
}


export async function fetchHistoricalCandles(interval: Interval = "1m", limit: number = 1000): Promise<CandleData[]> {
    const asset = useAssetStore.getState().asset;
    const endTime = Date.now();


    // Calculate start time based on interval and desired number of candles
    const intervalMs = INTERVAL_MILLISECONDS[interval];
    const startTime = endTime - (intervalMs * limit);

    console.log("fetching historical candles for", asset, "with interval", interval, "and limit", limit, "from", startTime, "to", endTime)
    try {
        const response = await fetch('https://api.hyperliquid.xyz/info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: "candleSnapshot",
                req: {
                    coin: asset,
                    interval: interval,
                    startTime: startTime,
                    endTime: endTime
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as CandleData[];
    } catch (error) {
        console.error('Error fetching historical candles:', error);
        throw error;
    }
}

// Helper function to format candle data for the chart
export function formatCandleData(rawData: CandleData[]) {
    return rawData.map(candle => ({
        time: Math.floor(candle.t / 1000),
        open: Number(candle.o),
        high: Number(candle.h),
        low: Number(candle.l),
        close: Number(candle.c)
    }));
}
