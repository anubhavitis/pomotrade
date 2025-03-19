import type {
  ResolutionString,
  Timezone
} from '../../../../../public/charting_library/charting_library'

export const disabled_features = [
  'use_localstorage_for_settings',
  'create_volume_indicator_by_default',
  'header_symbol_search',
  'popup_hints',
  'header_compare',
  'widget_logo',
  'timezone_menu'
]

export const defaultTvOptions = {
  overrides: {
    'paneProperties.backgroundType': 'solid',
    'paneProperties.background': '#191B2A',
    'paneProperties.vertGridProperties.color': 'rgb(0,0,0,0.0)',
    'paneProperties.horzGridProperties.color': 'rgb(0,0,0,0.0)',
    'paneProperties.legendProperties.showSeriesTitle': false,
    'scalesProperties.lineColor': 'rgb(0,0,0,0.0)',
    'mainSeriesProperties.candleStyle.upColor': '#0cac6c',
    'mainSeriesProperties.candleStyle.downColor': '#f24040',
    'mainSeriesProperties.candleStyle.borderColor': '#097e36',
    'mainSeriesProperties.candleStyle.borderUpColor': '#0cac6c',
    'mainSeriesProperties.candleStyle.borderDownColor': '#f24040',
    'mainSeriesProperties.candleStyle.wickUpColor': '#0cac6c',
    'mainSeriesProperties.candleStyle.wickDownColor': '#f24040',

    // Hollow Candles styles,
    'mainSeriesProperties.hollowCandleStyle.upColor': '#0cac6c',
    'mainSeriesProperties.hollowCandleStyle.downColor': '#f24040',
    'mainSeriesProperties.hollowCandleStyle.borderColor': '#097E36',
    'mainSeriesProperties.hollowCandleStyle.borderUpColor': '#0cac6c',
    'mainSeriesProperties.hollowCandleStyle.borderDownColor': '#f24040',
    'mainSeriesProperties.hollowCandleStyle.wickColor': '#c4c4c5',

    // Heikin Ashi styles,
    'mainSeriesProperties.haStyle.upColor': '#0cac6c',
    'mainSeriesProperties.haStyle.downColor': '#f24040',
    'mainSeriesProperties.haStyle.borderColor': '#097E36',
    'mainSeriesProperties.haStyle.borderUpColor': '#0cac6c',
    'mainSeriesProperties.haStyle.borderDownColor': '#f24040',
    'mainSeriesProperties.haStyle.wickColor': '#C4C4C5',

    // Bar styles,
    'mainSeriesProperties.barStyle.upColor': '#0cac6c',
    'mainSeriesProperties.barStyle.downColor': '#f24040',

    // Line styles,
    'mainSeriesProperties.lineStyle.color': '#9953FF',

    // Area styles,
    'mainSeriesProperties.areaStyle.color1': 'rgba(153, 83, 255, 0.3)',
    'mainSeriesProperties.areaStyle.color2': '#9953FF',
    'mainSeriesProperties.areaStyle.linecolor': '#9953FF'
  },
  disabled_features,
  enabled_features: ['hide_resolution_in_legend'],
  loading_screen: { backgroundColor: 'rgba(0,0,0,0)' },
  locale: 'en' as const,
  library_path: '/charting_library/',
  container: 'tv_chart_container',
  interval: '1H' as ResolutionString,
  theme: 'Dark' as const,
  client_id: 'public_client_id',
  user_id: 'public_user_id',
  load_last_chart: true,
  autosize: true,
  fullscreen: false,
  charts_storage_api_version: '1.1' as const,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone
}
