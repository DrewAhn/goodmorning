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
    { key: 'nasdaq', name: 'NASDAQ', ...data.nasdaq },
    { key: 'sp500', name: 'S&P 500', ...data.sp500 },
    { key: 'dow', name: 'DOW', ...data.dow },
  ]

  const cardBg = isDark ? 'bg-dark-card' : 'bg-light-card'
  const borderColor = isDark ? 'border-dark-border' : 'border-light-border'
  const textPrimary = isDark ? 'text-white' : 'text-light-text'
  const textSecondary = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'

  return (
    <div className="grid grid-cols-3 gap-4">
      {markets.map((market) => {
        const isPositive = market.changePercent >= 0
        return (
          <div
            key={market.key}
            className={`
              ${cardBg} border ${borderColor} rounded-xl p-4 text-center
              ${isPositive ? 'hover:border-stock-up/30' : 'hover:border-stock-down/30'}
              transition-colors duration-300
            `}
          >
            <p className={`${textSecondary} text-sm mb-1`}>{market.name}</p>
            <p className={`text-xl font-bold ${textPrimary}`}>
              {market.value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </p>
            <p className={`text-sm font-semibold ${isPositive ? 'stock-positive' : 'stock-negative'}`}>
              {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%
            </p>
          </div>
        )
      })}
    </div>
  )
}


