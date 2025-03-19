'use client'
import { memo, useEffect, useRef, useState } from 'react'


import type {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString
} from '../../../../../public/charting_library/charting_library'

import type { DataFeedSource } from './datafeed'
import { defaultTvOptions, disabled_features } from './tvOptions'

type Props = Pick<ChartingLibraryWidgetOptions, 'datafeed' | 'symbol'> & {
  source: DataFeedSource
}

const noop = () => null

const TVChart = memo(function TVChart({ source, datafeed, symbol }: Props) {
  const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null)
  const tvWidgetRef = useRef(tvWidget)


  const updateTvWidget = (newTvWidget: IChartingLibraryWidget | null) => {
    setTvWidget(newTvWidget)
    tvWidgetRef.current = newTvWidget

    if (newTvWidget && symbol) {
      newTvWidget.chart().setSymbol(symbol, noop)
    }
  }

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ tvwidget:", {
      ...defaultTvOptions,
      disabled_features:
        disabled_features,
      symbol,
      datafeed
    });
    if (window.TradingView) {
      try {
        const widget = new window.TradingView.widget({
          ...defaultTvOptions,
          disabled_features: disabled_features,
          symbol,
          datafeed,
          interval: '1' as ResolutionString, // Default to 1 minute chart
          auto_save_delay: 5,
          debug: true // Enable debug mode for development
        });

        let unmounted = false;

        widget.onChartReady(() => {
          if (!unmounted) {
            console.log("Chart is ready");
            updateTvWidget(widget);
          }
        });

        return () => {
          unmounted = true;
          updateTvWidget(null);
          widget.remove();
        };
      } catch (error) {
        console.error("Error initializing TradingView widget:", error);
      }
    } else {
      console.warn("TradingView library not loaded");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datafeed, symbol]); // Add symbol as dependency

  useEffect(() => {
    if (tvWidgetRef.current && symbol) {
      tvWidgetRef.current.chart().setSymbol(symbol, noop)
    }
  }, [symbol, tvWidget])

  return (
    <div className='w-full h-full flex flex-col items-end rounded border bg-grey-12 border-grey-10 py-2'>
      <div
        id={defaultTvOptions.container}
        className='w-full h-full'
        style={{ display: tvWidget ? 'block' : 'none' }}
      />
      {!tvWidget && (
        <div className='flex items-center justify-center h-full w-full'>
          {/* <Spinner /> */}
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  )
})

export default TVChart
