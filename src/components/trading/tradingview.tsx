// TradingViewWidget.jsx
import React, { memo, useEffect, useRef, useState } from "react";
import { CandlestickSeries, ChartOptions, ColorType, createChart, DeepPartial, Time } from 'lightweight-charts';
import { useHyperliquidWebSocket } from "@/hooks/use-websocket";
import { AssetStore } from "@/hooks/asset-store";
import useAssetStore from "@/hooks/asset-store";
import { fetchHistoricalCandles, formatCandleData } from "@/hooks/historical-chart";

const VISIBLE_CANDLES = 50; // Number of candles visible at once
const TOTAL_CANDLES = 500; // Total number of candles to fetch

const TradingViewWidget: React.FC = () => {
  const asset = useAssetStore((state: AssetStore) => state.asset);
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
      rightOffset: 5,
      barSpacing: 12,
      minBarSpacing: 10,
      fixLeftEdge: true,
      fixRightEdge: true,
      visible: true,
      rightBarStaysOnScroll: true,
    },
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
      horzTouchDrag: true,
      vertTouchDrag: true,
    },
    handleScale: {
      axisPressedMouseMove: true,
      mouseWheel: true,
      pinch: true,
    },
  };

  // Initialize the chart
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    // Clear existing chart if it exists
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (error) {
        console.log('Chart already disposed');
      }
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
    handleResize();
    setChartInitialized(true);

    const loadHistoricalData = async () => {
      try {
        const response = await fetchHistoricalCandles("1m", TOTAL_CANDLES);
        if (response) {
          const formattedData = formatCandleData(response);
          setCandleData(formattedData);

          // Set the visible range to show the most recent VISIBLE_CANDLES
          if (formattedData.length > 0) {
            const timeScale = chart.timeScale();
            const lastTime = formattedData[formattedData.length - 1].time as Time;
            const firstVisibleTime = (lastTime as number - (VISIBLE_CANDLES * 60)) as Time;

            // First set the data
            seriesRef.current.setData(formattedData);

            // Then set the visible range to show the latest candles
            timeScale.setVisibleRange({
              from: firstVisibleTime,
              to: lastTime
            });

            // Ensure the right edge stays fixed
            timeScale.scrollToPosition(1, false);
          }
        }
      } catch (error) {
        console.error("Error loading historical data:", error);
      }
    };

    loadHistoricalData();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [asset]);

  // Process incoming WebSocket data
  useEffect(() => {
    if (!isConnected || !data || data.channel !== "candle") {
      return;
    }

    try {
      const timestamp = Math.floor(data.data.T / 1000);
      const formattedCandle = {
        time: timestamp,
        open: Number(data.data.o),
        high: Number(data.data.h),
        low: Number(data.data.l),
        close: Number(data.data.c)
      };

      setCandleData(prevData => {
        const existingIndex = prevData.findIndex(candle => candle.time === timestamp);

        if (existingIndex >= 0) {
          const updatedData = [...prevData];
          updatedData[existingIndex] = formattedCandle;
          return updatedData;
        } else {
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
    } catch (err) {
      console.error("Error updating chart data:", err);
    }
  }, [candleData, chartInitialized]);

  // Clear candle data when asset changes
  useEffect(() => {
    setCandleData([]);
  }, [asset]);

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
