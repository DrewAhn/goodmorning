'use client'

interface MarketData {
  nasdaq: { value: number; changePercent: number }
  sp500: { value: number; changePercent: number }
  dow: { value: number; changePercent: number }
}

interface MarketOverviewProps {
  data: MarketData
}

export default function MarketOverview({ data }: MarketOverviewProps) {
  const markets = [
    { key: 'nasdaq', name: 'NASDAQ', ...data.nasdaq },
    { key: 'sp500', name: 'S&P 500', ...data.sp500 },
    { key: 'dow', name: 'DOW', ...data.dow },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {markets.map((market) => {
        const isPositive = market.changePercent >= 0
        return (
          <div
            key={market.key}
            className={`
              bg-dark-card border border-dark-border rounded-xl p-4 text-center
              ${isPositive ? 'hover:border-stock-up/30' : 'hover:border-stock-down/30'}
              transition-colors duration-200
            `}
          >
            <p className="text-dark-text-secondary text-sm mb-1">{market.name}</p>
            <p className="text-xl font-bold text-white">
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


