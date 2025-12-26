'use client'

import { useTheme } from '@/contexts/ThemeContext'

interface MarketData {
  nasdaq: { value: number; changePercent: number }
  sp500: { value: number; changePercent: number }
  dow: { value: number; changePercent: number }
}

interface MarketOverviewProps {
  data: MarketData
}

export default function MarketOverview({ data }: MarketOverviewProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const markets = [
    { key: 'nasdaq', name: 'NASDAQ', symbol: 'NDX', ...data.nasdaq },
    { key: 'sp500', name: 'S&P 500', symbol: 'SPX', ...data.sp500 },
    { key: 'dow', name: 'DOW JONES', symbol: 'DJI', ...data.dow },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {markets.map((market) => {
        const isPositive = market.changePercent >= 0
        return (
          <div
            key={market.key}
            className={`
              relative p-6 rounded-apple-card shadow-apple-md card-hover transition-all duration-300
              ${isDark ? 'bg-dark-card' : 'bg-light-card'}
            `}
          >
            {/* 왼쪽 액센트 바 */}
            <div className={`
              absolute top-0 left-0 w-1 h-full rounded-l-apple-card
              ${isPositive ? 'bg-stock-up' : 'bg-stock-down'}
            `}></div>

            {/* 헤더 */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[12px] text-space-gray">
                  {market.symbol}
                </p>
                <h3 className={`
                  text-lg font-semibold tracking-tight
                  ${isDark ? 'text-white' : 'text-deep-black'}
                `}>
                  {market.name}
                </h3>
              </div>
              <div className={`
                px-3 py-1 text-[11px] font-medium rounded-apple-button
                ${isPositive
                  ? isDark ? 'bg-stock-up/20 text-stock-up' : 'bg-stock-up/10 text-stock-up'
                  : isDark ? 'bg-stock-down/20 text-stock-down' : 'bg-stock-down/10 text-stock-down'
                }
              `}>
                {isPositive ? '▲ Up' : '▼ Down'}
              </div>
            </div>

            {/* 가격 */}
            <div className="mb-2">
              <p className={`
                text-3xl font-semibold tabular-nums animate-count-up
                ${isDark ? 'text-white' : 'text-deep-black'}
              `}>
                {market.value.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 1
                })}
              </p>
            </div>

            {/* 변동률 */}
            <div className="flex items-center gap-2">
              <span className={`
                text-xl font-semibold tabular-nums
                ${isPositive ? 'text-stock-up' : 'text-stock-down'}
              `}>
                {isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%
              </span>
              {isPositive ? (
                <div className="flex gap-0.5">
                  <div className="w-1 h-6 bg-stock-up rounded-full"></div>
                  <div className="w-1 h-5 bg-stock-up/70 rounded-full"></div>
                  <div className="w-1 h-4 bg-stock-up/40 rounded-full"></div>
                </div>
              ) : (
                <div className="flex gap-0.5">
                  <div className="w-1 h-4 bg-stock-down/40 rounded-full"></div>
                  <div className="w-1 h-5 bg-stock-down/70 rounded-full"></div>
                  <div className="w-1 h-6 bg-stock-down rounded-full"></div>
                </div>
              )}
            </div>

            {/* 프로그레스 바 */}
            <div className={`
              mt-3 h-1 rounded-full overflow-hidden
              ${isDark ? 'bg-white/10' : 'bg-black/10'}
            `}>
              <div
                className={`
                  h-full transition-all duration-1000 rounded-full
                  ${isPositive ? 'bg-stock-up' : 'bg-stock-down'}
                `}
                style={{ width: `${Math.min(Math.abs(market.changePercent) * 50, 100)}%` }}
              ></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
