import { memo, useMemo, useState, useEffect, useCallback, useRef } from 'react'
import type { DataFeedSource } from './datafeed'
// import { getDataFeed } from './datafeed'
import TVChart from './TVChart'
import { useHyperliquidWebSocket, CandleData } from '@/hooks/use-websocket'

// Define types from TradingView library
type ResolutionString = string;
type SubscribeBarsCallback = (bar: Bar) => void;
interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface PeriodParams {
  from: number;
  to: number;
  firstDataRequest: boolean;
}

interface OnHistoryCallback {
  (bars: Bar[], { noData }: { noData: boolean }): void;
}

interface OnErrorCallback {
  (reason: string): void;
}

// Convert interval to TradingView resolution
const intervalToResolution: Record<string, ResolutionString> = {
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '30m': '30',
  '1h': '60',
  '4h': '240',
  '1d': '1D',
}

// Convert resolution to interval
const resolutionToInterval: Record<string, string> = {
  '1': '1m',
  '5': '5m',
  '15': '15m',
  '30': '30m',
  '60': '1h',
  '240': '4h',
  '1D': '1d',
}

// Helper function to ensure consistent time conversions
const toHyperliquidTime = (tvTime: number): number => {
  // TradingView uses seconds, Hyperliquid uses milliseconds
  return tvTime * 1000;
};

const toTradingViewTime = (hlTime: number): number => {
  // Convert from milliseconds to seconds
  return Math.floor(hlTime / 1000);
};

const TVChartContainer = memo(function TVChartContainer() {
  const [symbol, setSymbol] = useState<string>('BTC-USD');
  const [interval, setInterval] = useState<string>('1m');
  const [resolution, setResolution] = useState<ResolutionString>('1');
  const [source] = useState<DataFeedSource>('hl');
  const [subscribers, setSubscribers] = useState<Record<string, SubscribeBarsCallback>>({});
  const candleCache = useRef<Record<string, CandleData[]>>({});

  
  // Extract coin from symbol (e.g., "BTC-USD" -> "BTC")
  const coin = useMemo(() => symbol.split('-')[0], [symbol]);
  
  // Connect to WebSocket with current coin and interval
  const { candles, isConnected, error, data } = useHyperliquidWebSocket({ 
    coin, 
    interval 
  });


  // Create a custom datafeed based on our WebSocket data
  const datafeed = useMemo(() => {
    // const baseFeed = getDataFeed({ source });
    
    return {
      // ...baseFeed,
      // Override getBars to provide historical data from our cache
      getBars: async (
        symbolInfo: any,
        resolution: string,
        periodParams: PeriodParams,
        onHistoryCallback: OnHistoryCallback,
        onErrorCallback: OnErrorCallback
      ) => {
        console.log('Get bars:', symbolInfo, resolution, periodParams);
        
        const interval = resolutionToInterval[resolution] || '1m';
        const coinFromSymbol = symbolInfo.name.split('-')[0];
        const cacheKey = `${coinFromSymbol}-${interval}`;
        
        try {
          // If we don't have cached data or it's insufficient, fetch it directly
          if (!candleCache.current[cacheKey] || candleCache.current[cacheKey].length === 0) {
            // Calculate timestamp for historical data
            const endTime = periodParams.to * 1000; // Convert to milliseconds for API
            const startTime = periodParams.from * 1000; // Convert to milliseconds for API
            
            console.log(`Fetching historical data for ${coinFromSymbol} from ${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()}`);
            
            // Build API URL
            const url = `https://api.hyperliquid.xyz/info`;
            const requestBody = {
              "type": "candleSnapshot",
              "coin": coinFromSymbol,
              "interval": interval,
              "startTime": startTime,
              "endTime": endTime,
              "limit": 1000 // Request more data for better chart display
            };
            
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error(`API error (${response.status}): ${errorText}`);
              throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            }
            
            const data = await response.json();
            console.log("Historical candle data:", data);
            
            if (Array.isArray(data)) {
              // Process the historical candle data
              const formattedCandles = data.map(candle => ({
                t: candle.time,
                T: candle.time,
                s: coinFromSymbol,
                i: interval,
                o: parseFloat(candle.open),
                c: parseFloat(candle.close), 
                h: parseFloat(candle.high),
                l: parseFloat(candle.low),
                v: parseFloat(candle.volume || '0'),
                n: candle.trades || 0
              }));
              
              // Store in cache
              candleCache.current[cacheKey] = formattedCandles;
            }
          }
          
          // Get cached candles for this coin and interval
          const cachedCandles = candleCache.current[cacheKey] || [];
          
          // Filter by time range in periodParams (remember TV uses seconds, our cache uses ms)
          const filteredCandles = cachedCandles.filter(
            candle => candle.t >= periodParams.from * 1000 && candle.t <= periodParams.to * 1000
          );
          
          if (filteredCandles.length === 0) {
            console.log("No candles found for the requested time range");
            onHistoryCallback([], { noData: true });
            return;
          }
          
          // Convert to TradingView Bar format
          const bars: Bar[] = filteredCandles.map(candle => ({
            time: Math.floor(candle.t / 1000), // Convert from ms to seconds for TradingView
            open: candle.o,
            high: candle.h,
            low: candle.l,
            close: candle.c,
            volume: candle.v
          }));
          
          console.log(`Returning ${bars.length} bars for ${symbolInfo.name}`);
          
          // Return the bars
          onHistoryCallback(bars, { noData: false });
        } catch (err) {
          console.error('Error getting bars:', err);
          onErrorCallback('Failed to get historical data: ' + (err instanceof Error ? err.message : String(err)));
        }
      },
      
      // Override the subscribeBars method to use our WebSocket data
      subscribeBars: (
        symbolInfo: any,
        resolution: string,
        onRealtimeCallback: SubscribeBarsCallback,
        subscriberUID: string
      ) => {
        console.log('Subscribe bars:', symbolInfo, resolution, subscriberUID);
        
        // Store the callback for this subscriber
        setSubscribers(prev => ({
          ...prev,
          [subscriberUID]: onRealtimeCallback
        }));
        
        // Update interval based on resolution if needed
        if (resolutionToInterval[resolution]) {
          setInterval(resolutionToInterval[resolution]);
          setResolution(resolution);
        }
      },
      
      // Override unsubscribeBars to remove subscribers
      unsubscribeBars: (subscriberUID: string) => {
        console.log('Unsubscribe bars:', subscriberUID);
        
        // Remove this subscriber
        setSubscribers(prev => {
          const newSubscribers = { ...prev };
          delete newSubscribers[subscriberUID];
          return newSubscribers;
        });
      }
    };
  }, [source]);

  // Loading state
  if (!isConnected) {
    return <div className="p-4 text-center">Connecting to Hyperliquid...</div>;
  }

  // Error state
  // if (error) {
  //   return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  // }

  return (
    <div className="w-full h-full">
      <TVChart 
        source={source} 
        symbol={symbol} 
        datafeed={datafeed as any} 
      />
    </div>
  );
})



export default TVChartContainer
