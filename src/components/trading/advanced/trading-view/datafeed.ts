import type {
  Bar,
  DatafeedConfiguration,
  IBasicDataFeed,
  LibrarySymbolInfo,
  ResolutionString
} from '../../../../../public/charting_library/charting_library'

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map()

const config: DatafeedConfiguration = {
  supported_resolutions: [
    '1',
    '5',
    '15',
    '30',
    '60',
    '120',
    '240',
    '720',
    '1D',
    '1W',
    '1M'
  ] as ResolutionString[]
}

const resolutions: Record<string, string> = {
  '1': '1m',
  '3': '3m',
  '5': '5m',
  '15': '15m',
  '30': '30m',
  '60': '1h',
  '120': '2h',
  '240': '4h',
  '360': '6h',
  '480': '8h',
  '720': '12h',
  D: '1d',
  '1D': '1d',
  '3D': '3d',
  W: '1w',
  '1W': '1w',
  M: '1M',
  '1M': '1M'
}

const dydxResolutions = {
  '1': '1MIN',
  '5': '5MINS',
  '15': '15MINS',
  '30': '30MINS',
  '60': '1HOUR',
  '240': '4HOURS',
  D: '1DAY',
  '1D': '1DAY'
} as const

const checkResolution = (interval: string) =>
  !!resolutions[interval as keyof typeof resolutions]

export type DataFeedSource = 'pyth' | 'hl' | 'aevo' | 'dydx' | 'hltest' | 'synfutures'

type GetDataFeedArgs = {
  source: DataFeedSource
}

export const getDataFeed = ({ source }: GetDataFeedArgs): IBasicDataFeed => ({
  onReady: (callback) => {
    setTimeout(() => callback(config))
  },

  // We're not using search
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    onResultReadyCallback([])
  },

  resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    if (!symbolName) {
      onResolveErrorCallback('cannot resolve symbol')
      return
    }

    let digits = 4
    // let digits = tokenDigits(symbolName)
    // if (digits === 2) {
    //   digits = 4
    // }

    const symbolInfo: LibrarySymbolInfo = {
      name: symbolName,
      ticker: symbolName,
      description: symbolName,
      full_name: symbolName,
      format: 'price',
      listed_exchange: 'Rage Trade',
      volume_precision: 8,
      exchange: 'Rage Trade',
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      minmov: 1,
      pricescale: 10 ** digits,
      has_empty_bars: true,
      has_intraday: true,
      has_no_volume: false,
      has_weekly_and_monthly: false,
      supported_resolutions:
        source === 'dydx'
          ? (Object.keys(dydxResolutions) as ResolutionString[])
          : (config.supported_resolutions as ResolutionString[])
    }

    return onSymbolResolvedCallback(symbolInfo)
  },

  getBars: async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    let bars: Bar[] = []

    const { firstDataRequest } = periodParams

    const routerV1Exchange = useMarkets.getState().routerV1Exchange

    try {
      const params = {
        symbolInfo: symbolInfo.name,
        resolution,
        marketId: undefined,
        ...periodParams
      }

      bars = await routerV1Exchange.getBars(source, params as unknown as GetBarsParams)
    } catch {
      return onHistoryCallback([], { noData: true })
    }

    if (!checkResolution(resolution)) {
      return onErrorCallback('[getBars] Invalid resolution')
    }

    if (firstDataRequest) {
      lastBarsCache.set(symbolInfo.ticker, {
        ...bars[bars.length - 1]
      })
    }

    if (bars?.length) {
      return onHistoryCallback(bars)
    } else {
      return onHistoryCallback([], { noData: true })
    }
  },

  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    const routerV1Exchange = useMarkets.getState().routerV1Exchange

    routerV1Exchange.subscribeStream(source, {
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache
    })
  },

  unsubscribeBars: (subscriberUID) => {
    const routerV1Exchange = useMarkets.getState().routerV1Exchange

    routerV1Exchange.unsubscribeStream(source, subscriberUID)
  }
})
