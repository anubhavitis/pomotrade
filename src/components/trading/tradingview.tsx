// TradingViewWidget.jsx
import React, { memo, useEffect, useRef, useState } from "react";
import { CandlestickSeries, ChartOptions, ColorType, createChart, DeepPartial } from 'lightweight-charts';
import { useHyperliquidWebSocket } from "@/hooks/use-websocket";

const TradingViewWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [candleData, setCandleData] = useState<any[]>([]);
  const [chartInitialized, setChartInitialized] = useState(false);
  const { data, isConnected, error } = useHyperliquidWebSocket();

  const chartOptions: DeepPartial<ChartOptions> = {
    layout: {
      textColor: 'white',
      background: {
        type: ColorType.Solid,
        color: 'transparent'
      }
    },
    grid: {
      vertLines: {
        color: 'rgba(30, 30, 35, 0.5)',
        style: 1,
      },
      horzLines: {
        color: 'rgba(30, 30, 35, 0.5)',
        style: 1,
      },
    },

    timeScale: {
      borderColor: 'rgba(50, 50, 55, 0.8)',
      timeVisible: true,
      secondsVisible: true,
      tickMarkFormatter: (time: number) => {
        const date = new Date(time * 1000);
        return date.toLocaleTimeString();
      },
    },
  };


  // Initialize the chart
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = createChart(containerRef.current, chartOptions);
    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial size
    setChartInitialized(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []); // Run only once on mount

  // Process incoming WebSocket data
  useEffect(() => {
    if (!isConnected || !data || data.channel !== "candle") {
      return;
    }

    try {

      // Format the new candle data
      const timestamp = Math.floor(data.data.T / 1000);
      const formattedCandle = {
        time: timestamp,
        open: Number(data.data.o),
        high: Number(data.data.h),
        low: Number(data.data.l),
        close: Number(data.data.c)
      };

      // Check if we already have a candle with this timestamp
      setCandleData(prevData => {
        const existingIndex = prevData.findIndex(candle => candle.time === timestamp);

        if (existingIndex >= 0) {
          // Update existing candle
          const updatedData = [...prevData];
          updatedData[existingIndex] = formattedCandle;
          return updatedData;
        } else {
          // Add new candle and sort by time
          const newData = [...prevData, formattedCandle];
          return newData.sort((a, b) => a.time - b.time);
        }
      });
    } catch (err) {
      console.error("Error processing WebSocket data:", err);
    }
  }, [data, isConnected]);

  // Update chart with accumulated data
  useEffect(() => {
    if (!chartInitialized || !seriesRef.current || candleData.length === 0) {
      return;
    }

    try {
      seriesRef.current.setData(candleData);

      // Fit content to see all data
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    } catch (err) {
      console.error("Error updating chart data:", err);
    }
  }, [candleData, chartInitialized]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm relative">
      <div ref={containerRef} className="h-full w-full" />
      {!isConnected && error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500/80 text-white text-sm p-1 text-center">
          WebSocket disconnected: {typeof error === 'string' ? error : (error as any).message || 'Unknown error'}
        </div>
      )}
      {(candleData.length === 0 && isConnected) && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-500/80 text-white text-sm p-1 text-center">
          Waiting for candle data...
        </div>
      )}
    </div>
  );
};

export default memo(TradingViewWidget);
