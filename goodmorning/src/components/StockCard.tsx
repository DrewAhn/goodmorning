'use client'

import { Stock } from '@/lib/mockData'
import { useTheme } from '@/contexts/ThemeContext'
import StockChart from './StockChart'

interface StockCardProps {
  stock: Stock
  isTop?: boolean
}

export default function StockCard({ stock, isTop = false }: StockCardProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
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

  // 테마별 색상 클래스
  const cardBg = isDark ? 'bg-dark-card' : 'bg-light-card'
  const borderColor = isDark ? 'border-dark-border' : 'border-light-border'
  const textPrimary = isDark ? 'text-white' : 'text-light-text'
  const textSecondary = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
  const textNormal = isDark ? 'text-dark-text' : 'text-light-text'
  const bgSecondary = isDark ? 'bg-dark-bg' : 'bg-light-bg'
  const accentColor = isDark ? 'text-dark-accent' : 'text-light-accent'
  const accentBg = isDark ? 'bg-dark-accent/20 text-dark-accent' : 'bg-light-accent/20 text-light-accent'
  const ringColor = isDark ? 'ring-dark-accent/50' : 'ring-light-accent/50'

  return (
    <div 
      className={`
        ${cardBg} border ${borderColor} rounded-xl p-5 card-hover transition-colors duration-300
        ${isTop ? `ring-2 ${ringColor}` : ''}
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
              <span className={`font-bold ${textPrimary} text-lg`}>{stock.symbol}</span>
              {isTop && (
                <span className={`px-2 py-0.5 ${accentBg} text-xs rounded-full`}>
                  TOP 1
                </span>
              )}
            </div>
            <p className={`${textSecondary} text-sm`}>{stock.name}</p>
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
          <span className={`text-2xl font-bold ${textPrimary}`}>${stock.price.toFixed(2)}</span>
          <span className={`text-lg font-semibold ${isPositive ? 'stock-positive' : 'stock-negative'}`}>
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
        </div>
        <p className={`${textSecondary} text-sm mt-1`}>
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
        <div className={`text-center p-2 ${bgSecondary} rounded-lg`}>
          <p className={`text-xs ${textSecondary}`}>거래량</p>
          <p className={`text-sm font-semibold ${textPrimary}`}>{formatNumber(stock.volume)}</p>
        </div>
        <div className={`text-center p-2 ${bgSecondary} rounded-lg`}>
          <p className={`text-xs ${textSecondary}`}>시가총액</p>
          <p className={`text-sm font-semibold ${textPrimary}`}>{formatNumber(stock.marketCap)}</p>
        </div>
        <div className={`text-center p-2 ${bgSecondary} rounded-lg`}>
          <p className={`text-xs ${textSecondary}`}>P/E</p>
          <p className={`text-sm font-semibold ${textPrimary}`}>{stock.peRatio.toFixed(1)}</p>
        </div>
      </div>

      {/* 주가 차트 */}
      <StockChart symbol={stock.symbol} isPositive={isPositive} />

      {/* 초보자 해설 */}
      <div className={`p-3 ${bgSecondary} rounded-lg border ${borderColor}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs">💡</span>
          <span className={`text-xs ${textSecondary}`}>초보자 해설</span>
        </div>
        <p className={`text-sm ${textNormal}`}>{stock.beginnerNote}</p>
      </div>

      {/* 선정 이유 */}
      <div className={`mt-3 pt-3 border-t ${borderColor}`}>
        <p className={`text-xs ${textSecondary}`}>
          📊 선정 기준: <span className={accentColor}>{stock.selectionReason}</span>
        </p>
      </div>
    </div>
  )
}


