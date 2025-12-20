'use client'

import Link from 'next/link'
import { BriefingHistoryItem } from '@/lib/mockData'
import { useTheme } from '@/contexts/ThemeContext'

interface BriefingHistoryCardProps {
  briefing: BriefingHistoryItem
}

export default function BriefingHistoryCard({ briefing }: BriefingHistoryCardProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const isPositive = briefing.topStock.changePercent >= 0
  const openRate = Math.round((briefing.deliverySummary.emailOpened / briefing.deliverySummary.emailSent) * 100)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })
  }

  return (
    <Link href={`/briefing/${briefing.id}`}>
      <div className={`
        card-hover cursor-pointer border-2 overflow-hidden
        ${isDark ? 'bg-black border-stock-up' : 'bg-white border-black'}
      `}>
        {/* 상단 스트라이프 */}
        <div className={`
          h-1.5
          ${isPositive ? 'bg-stock-up' : 'bg-stock-down'}
        `}></div>

        <div className="p-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-3">
            <span className={`
              text-xs font-terminal uppercase font-bold
              ${isDark ? 'text-stock-up' : 'text-black'}
            `}>
              {formatDate(briefing.marketDate)}
            </span>
            <span className={`
              px-2 py-0.5 font-terminal text-[10px] font-bold border
              ${briefing.status === 'completed'
                ? isDark ? 'border-stock-up text-stock-up' : 'border-black text-black'
                : 'border-yellow-500 text-yellow-500'
              }
            `}>
              {briefing.status === 'completed' ? 'SENT' : 'PENDING'}
            </span>
          </div>

          {/* 종목 정보 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`
                text-lg font-display
                ${isDark ? 'text-white' : 'text-black'}
              `}>
                {briefing.topStock.symbol}
              </p>
              <p className={`
                text-xs font-terminal
                ${isDark ? 'text-white/60' : 'text-black/60'}
              `}>
                {briefing.topStock.name}
              </p>
            </div>
            <div className="text-right">
              <p className={`
                text-xl font-terminal font-bold
                ${isPositive ? 'text-stock-up' : 'text-stock-down'}
              `}>
                {isPositive ? '+' : ''}{briefing.topStock.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* 통계 */}
          <div className={`
            pt-3 border-t grid grid-cols-3 gap-2 text-center font-terminal
            ${isDark ? 'border-white/10' : 'border-black/10'}
          `}>
            <div>
              <p className={`
                text-xs
                ${isDark ? 'text-white/60' : 'text-black/60'}
              `}>
                SENT
              </p>
              <p className={`
                text-sm font-bold
                ${isDark ? 'text-white' : 'text-black'}
              `}>
                {briefing.deliverySummary.emailSent}
              </p>
            </div>
            <div>
              <p className={`
                text-xs
                ${isDark ? 'text-white/60' : 'text-black/60'}
              `}>
                OPEN
              </p>
              <p className={`
                text-sm font-bold
                ${isDark ? 'text-white' : 'text-black'}
              `}>
                {openRate}%
              </p>
            </div>
            <div>
              <p className={`
                text-xs
                ${isDark ? 'text-white/60' : 'text-black/60'}
              `}>
                SLACK
              </p>
              <p className={`
                text-sm font-bold
                ${isDark ? 'text-white' : 'text-black'}
              `}>
                {briefing.deliverySummary.slackSent}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}


