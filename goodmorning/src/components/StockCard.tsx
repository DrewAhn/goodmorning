'use client'

import { Stock } from '@/lib/mockData'
import { useTheme } from '@/contexts/ThemeContext'
import StockChart from './StockChart'
import { TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react'

interface StockCardProps {
  stock: Stock
  isTop?: boolean
}

export default function StockCard({ stock, isTop = false }: StockCardProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const isPositive = stock.changePercent >= 0
  
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    return num.toLocaleString()
  }

  return (
    <div
      className={`
        relative overflow-hidden card-hover rounded-apple-card shadow-apple-md transition-all duration-300
        ${isDark ? 'bg-dark-card' : 'bg-light-card'}
        ${isTop ? 'md:col-span-2' : ''}
      `}
    >
      {/* 상단 스트라이프 */}
      <div className={`
        h-1
        ${isPositive
          ? 'bg-gradient-to-r from-stock-up to-stock-up/50'
          : 'bg-gradient-to-r from-stock-down to-stock-down/50'
        }
      `}></div>

      <div className="p-8">
        {/* 헤더 - 심볼과 순위 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* 순위 배지 - 원형 */}
            <div className={`
              relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold
              ${isDark ? 'bg-stock-up/20 text-stock-up' : 'bg-black/10 text-deep-black'}
            `}>
              #{stock.rank}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`
                  text-2xl font-semibold tracking-tight
                  ${isDark ? 'text-white' : 'text-deep-black'}
                `}>
                  {stock.symbol}
                </h3>
                {isTop && (
                  <span className={`
                    px-3 py-1 text-[11px] font-medium rounded-apple-button
                    ${isDark ? 'bg-stock-up/20 text-stock-up' : 'bg-black/10 text-deep-black'}
                  `}>
                    Top Pick
                  </span>
                )}
              </div>
              <p className="text-[14px] text-space-gray">
                {stock.name}
              </p>
            </div>
          </div>

          {/* 신뢰도 - Pill badge */}
          <div className={`
            px-3 py-1.5 text-[11px] font-medium rounded-apple-button
            ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-deep-black'}
          `}>
            {stock.confidence}
          </div>
        </div>

        {/* 가격 및 변동률 */}
        <div className="mb-6 pb-6 border-b border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <div className="flex items-end gap-4 mb-2">
            <div className={`
              text-5xl font-bold tabular-nums
              ${isDark ? 'text-white' : 'text-deep-black'}
            `}>
              ${stock.price.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 mb-2">
              {isPositive ? (
                <TrendingUp className="w-8 h-8 text-stock-up" strokeWidth={3} />
              ) : (
                <TrendingDown className="w-8 h-8 text-stock-down" strokeWidth={3} />
              )}
              <span className={`
                text-3xl font-terminal font-bold
                ${isPositive ? 'text-stock-up' : 'text-stock-down'}
              `}>
                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <p className={`
            text-sm font-terminal
            ${isDark ? 'text-white/60' : 'text-black/60'}
          `}>
            {isPositive ? '+' : ''}${stock.change.toFixed(2)} USD • 전일 대비
          </p>
        </div>

        {/* 하이라이트 - Apple style */}
        <div className={`
          p-4 mb-6 border-l-4 rounded-r-apple-input
          ${isPositive
            ? isDark ? 'bg-stock-up/10 border-stock-up' : 'bg-stock-up/5 border-stock-up'
            : isDark ? 'bg-stock-down/10 border-stock-down' : 'bg-stock-down/5 border-stock-down'
          }
        `}>
          <p className={`
            text-[15px] leading-relaxed
            ${isDark ? 'text-white' : 'text-deep-black'}
          `}>
            {stock.highlight}
          </p>
        </div>

        {/* 지표 그리드 - Apple style */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`
            p-4 rounded-apple-input
            ${isDark ? 'bg-white/5' : 'bg-black/5'}
          `}>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-space-gray" />
              <p className="text-[12px] text-space-gray">
                Volume
              </p>
            </div>
            <p className={`
              text-lg font-semibold tabular-nums
              ${isDark ? 'text-white' : 'text-deep-black'}
            `}>
              {formatNumber(stock.volume)}
            </p>
          </div>

          <div className={`
            p-4 rounded-apple-input
            ${isDark ? 'bg-white/5' : 'bg-black/5'}
          `}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-space-gray" />
              <p className="text-[12px] text-space-gray">
                Market Cap
              </p>
            </div>
            <p className={`
              text-lg font-semibold tabular-nums
              ${isDark ? 'text-white' : 'text-deep-black'}
            `}>
              ${formatNumber(stock.marketCap)}
            </p>
          </div>

          <div className={`
            p-4 rounded-apple-input
            ${isDark ? 'bg-white/5' : 'bg-black/5'}
          `}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>📊</span>
              <p className={`
                text-xs font-terminal uppercase
                ${isDark ? 'text-white/60' : 'text-black/60'}
              `}>
                P/E Ratio
              </p>
            </div>
            <p className={`
              text-lg font-terminal font-bold
              ${isDark ? 'text-white' : 'text-black'}
            `}>
              {stock.peRatio.toFixed(1)}
            </p>
          </div>
        </div>

        {/* 차트 */}
        <div className="mb-6">
          <StockChart symbol={stock.symbol} isPositive={isPositive} />
        </div>

        {/* 초보자 해설 - Apple style */}
        <div className={`
          p-4 rounded-apple-input
          ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="text-[12px] font-medium text-space-gray">
              초보자 해설
            </span>
          </div>
          <p className={`
            text-[14px] leading-relaxed
            ${isDark ? 'text-white/90' : 'text-deep-black/90'}
          `}>
            {stock.beginnerNote}
          </p>
        </div>

        {/* 선정 기준 - Apple style */}
        <div className={`
          mt-4 pt-4 border-t
          ${isDark ? 'border-white/10' : 'border-black/10'}
        `}>
          <p className={`
            text-xs font-terminal
            ${isDark ? 'text-white/60' : 'text-black/60'}
          `}>
            SELECTION: <span className={`font-bold ${isDark ? 'text-stock-up' : 'text-black'}`}>
              {stock.selectionReason}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}


