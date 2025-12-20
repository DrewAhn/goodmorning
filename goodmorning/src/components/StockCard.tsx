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
        relative overflow-hidden card-hover scanline
        border-4 ${isDark ? 'bg-black border-stock-up' : 'bg-white border-black'}
        ${isTop ? 'md:col-span-2' : ''}
      `}
    >
      {/* 상단 스트라이프 */}
      <div className={`
        h-2
        ${isPositive
          ? 'bg-gradient-to-r from-stock-up to-stock-up/50'
          : 'bg-gradient-to-r from-stock-down to-stock-down/50'
        }
      `}></div>

      <div className="p-6">
        {/* 헤더 - 심볼과 순위 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* 순위 배지 */}
            <div className={`
              relative w-16 h-16 flex items-center justify-center font-display text-3xl
              border-4 ${isDark ? 'border-stock-up bg-stock-up/10' : 'border-black bg-black/5'}
            `}>
              #{stock.rank}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`
                  text-2xl font-display tracking-tight
                  ${isDark ? 'text-stock-up' : 'text-black'}
                `}>
                  {stock.symbol}
                </h3>
                {isTop && (
                  <span className={`
                    px-3 py-1 font-terminal text-xs font-bold
                    border-2 ${isDark ? 'border-stock-up text-stock-up' : 'border-black text-black'}
                  `}>
                    TOP PICK
                  </span>
                )}
              </div>
              <p className={`
                text-sm font-terminal
                ${isDark ? 'text-white/60' : 'text-black/60'}
              `}>
                {stock.name}
              </p>
            </div>
          </div>

          {/* 신뢰도 */}
          <div className={`
            px-3 py-1.5 font-terminal text-xs font-bold
            border-2 ${isDark ? 'border-white text-white' : 'border-black text-black'}
          `}>
            {stock.confidence}
          </div>
        </div>

        {/* 가격 및 변동률 - Big Numbers */}
        <div className="mb-6 pb-6 border-b-2 border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <div className="flex items-end gap-4 mb-2">
            <div className={`
              text-5xl font-terminal font-bold tabular-nums
              ${isDark ? 'text-white' : 'text-black'}
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

        {/* 하이라이트 */}
        <div className={`
          p-4 mb-6 border-l-4
          ${isPositive
            ? isDark ? 'bg-stock-up/10 border-stock-up' : 'bg-stock-up/5 border-stock-up'
            : isDark ? 'bg-stock-down/10 border-stock-down' : 'bg-stock-down/5 border-stock-down'
          }
        `}>
          <p className={`
            font-medium
            ${isDark ? 'text-white' : 'text-black'}
          `}>
            {stock.highlight}
          </p>
        </div>

        {/* 지표 그리드 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`
            p-4 border-2
            ${isDark ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/5'}
          `}>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-black/60'}`} />
              <p className={`
                text-xs font-terminal uppercase
                ${isDark ? 'text-white/60' : 'text-black/60'}
              `}>
                Volume
              </p>
            </div>
            <p className={`
              text-lg font-terminal font-bold
              ${isDark ? 'text-white' : 'text-black'}
            `}>
              {formatNumber(stock.volume)}
            </p>
          </div>

          <div className={`
            p-4 border-2
            ${isDark ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/5'}
          `}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-black/60'}`} />
              <p className={`
                text-xs font-terminal uppercase
                ${isDark ? 'text-white/60' : 'text-black/60'}
              `}>
                Market Cap
              </p>
            </div>
            <p className={`
              text-lg font-terminal font-bold
              ${isDark ? 'text-white' : 'text-black'}
            `}>
              ${formatNumber(stock.marketCap)}
            </p>
          </div>

          <div className={`
            p-4 border-2
            ${isDark ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/5'}
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

        {/* 초보자 해설 */}
        <div className={`
          p-4 border-2 border-dashed
          ${isDark ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/5'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className={`
              text-xs font-terminal uppercase font-bold
              ${isDark ? 'text-white/80' : 'text-black/80'}
            `}>
              초보자 해설
            </span>
          </div>
          <p className={`
            text-sm leading-relaxed
            ${isDark ? 'text-white/80' : 'text-black/80'}
          `}>
            {stock.beginnerNote}
          </p>
        </div>

        {/* 선정 기준 */}
        <div className={`
          mt-4 pt-4 border-t-2
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


