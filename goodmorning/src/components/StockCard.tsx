'use client'

import { Stock } from '@/lib/mockData'

interface StockCardProps {
  stock: Stock
  isTop?: boolean
}

export default function StockCard({ stock, isTop = false }: StockCardProps) {
  const isPositive = stock.changePercent >= 0
  
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    return num.toLocaleString()
  }

  const confidenceColor = {
    HIGH: 'bg-stock-up/20 text-stock-up border-stock-up/30',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    LOW: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  }

  return (
    <div 
      className={`
        bg-dark-card border border-dark-border rounded-xl p-5 card-hover
        ${isTop ? 'ring-2 ring-dark-accent/50' : ''}
        ${isPositive ? 'hover:border-stock-up/30' : 'hover:border-stock-down/30'}
      `}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg
            ${isPositive ? 'bg-stock-up/20 text-stock-up' : 'bg-stock-down/20 text-stock-down'}
          `}>
            {stock.rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg">{stock.symbol}</span>
              {isTop && (
                <span className="px-2 py-0.5 bg-dark-accent/20 text-dark-accent text-xs rounded-full">
                  TOP 1
                </span>
              )}
            </div>
            <p className="text-dark-text-secondary text-sm">{stock.name}</p>
          </div>
        </div>
        <span className={`
          px-2 py-1 text-xs rounded-md border
          ${confidenceColor[stock.confidence]}
        `}>
          {stock.confidence}
        </span>
      </div>

      {/* 가격 정보 */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">${stock.price.toFixed(2)}</span>
          <span className={`text-lg font-semibold ${isPositive ? 'stock-positive' : 'stock-negative'}`}>
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
        </div>
        <p className="text-dark-text-secondary text-sm mt-1">
          {isPositive ? '+' : ''}${stock.change.toFixed(2)} 전일 대비
        </p>
      </div>

      {/* 하이라이트 */}
      <div className={`
        p-3 rounded-lg mb-4
        ${isPositive ? 'bg-stock-up/10 border border-stock-up/20' : 'bg-stock-down/10 border border-stock-down/20'}
      `}>
        <p className="text-sm">{stock.highlight}</p>
      </div>

      {/* 지표 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-dark-bg rounded-lg">
          <p className="text-xs text-dark-text-secondary">거래량</p>
          <p className="text-sm font-semibold text-white">{formatNumber(stock.volume)}</p>
        </div>
        <div className="text-center p-2 bg-dark-bg rounded-lg">
          <p className="text-xs text-dark-text-secondary">시가총액</p>
          <p className="text-sm font-semibold text-white">{formatNumber(stock.marketCap)}</p>
        </div>
        <div className="text-center p-2 bg-dark-bg rounded-lg">
          <p className="text-xs text-dark-text-secondary">P/E</p>
          <p className="text-sm font-semibold text-white">{stock.peRatio.toFixed(1)}</p>
        </div>
      </div>

      {/* 초보자 해설 */}
      <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs">💡</span>
          <span className="text-xs text-dark-text-secondary">초보자 해설</span>
        </div>
        <p className="text-sm text-dark-text">{stock.beginnerNote}</p>
      </div>

      {/* 선정 이유 */}
      <div className="mt-3 pt-3 border-t border-dark-border">
        <p className="text-xs text-dark-text-secondary">
          📊 선정 기준: <span className="text-dark-accent">{stock.selectionReason}</span>
        </p>
      </div>
    </div>
  )
}


