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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
      {markets.map((market, idx) => {
        const isPositive = market.changePercent >= 0
        return (
          <div
            key={market.key}
            className={`
              relative p-6 border-2 card-hover scanline
              ${isDark ? 'bg-black border-stock-up' : 'bg-white border-black'}
              ${idx === 1 ? 'md:border-x-0' : ''}
            `}
          >
            {/* 대각선 액센트 */}
            <div className={`
              absolute top-0 left-0 w-1 h-full
              ${isPositive ? 'bg-stock-up' : 'bg-stock-down'}
            `}></div>

            {/* 헤더 */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className={`
                  text-xs font-terminal tracking-widest
                  ${isDark ? 'text-white/40' : 'text-black/40'}
                `}>
                  {market.symbol}
                </p>
                <h3 className={`
                  text-lg font-display
                  ${isDark ? 'text-white' : 'text-black'}
                `}>
                  {market.name}
                </h3>
              </div>
              <div className={`
                px-2 py-1 font-terminal text-xs font-bold
                ${isPositive
                  ? isDark ? 'bg-stock-up/20 text-stock-up' : 'bg-stock-up/10 text-stock-up'
                  : isDark ? 'bg-stock-down/20 text-stock-down' : 'bg-stock-down/10 text-stock-down'
                }
              `}>
                {isPositive ? '▲ UP' : '▼ DOWN'}
              </div>
            </div>

            {/* 가격 */}
            <div className="mb-2">
              <p className={`
                text-3xl font-terminal font-bold tabular-nums animate-count-up
                ${isDark ? 'text-white' : 'text-black'}
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
                text-xl font-terminal font-bold tabular-nums
                ${isPositive ? 'text-stock-up' : 'text-stock-down'}
              `}>
                {isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%
              </span>
              {isPositive ? (
                <div className="flex gap-0.5">
                  <div className="w-1 h-6 bg-stock-up"></div>
                  <div className="w-1 h-5 bg-stock-up/70"></div>
                  <div className="w-1 h-4 bg-stock-up/40"></div>
                </div>
              ) : (
                <div className="flex gap-0.5">
                  <div className="w-1 h-4 bg-stock-down/40"></div>
                  <div className="w-1 h-5 bg-stock-down/70"></div>
                  <div className="w-1 h-6 bg-stock-down"></div>
                </div>
              )}
            </div>

            {/* 프로그레스 바 */}
            <div className={`
              mt-3 h-1 overflow-hidden
              ${isDark ? 'bg-white/10' : 'bg-black/10'}
            `}>
              <div
                className={`
                  h-full transition-all duration-1000
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


