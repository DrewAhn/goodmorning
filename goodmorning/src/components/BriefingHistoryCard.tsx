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
        card-hover cursor-pointer rounded-apple-card overflow-hidden shadow-apple-sm transition-all duration-300
        ${isDark ? 'bg-dark-card' : 'bg-light-card'}
      `}>
        {/* 상단 스트라이프 */}
        <div className={`
          h-1
          ${isPositive ? 'bg-stock-up' : 'bg-stock-down'}
        `}></div>

        <div className="p-5">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-3">
            <span className={`
              text-[13px] font-medium
              ${isDark ? 'text-white' : 'text-deep-black'}
            `}>
              {formatDate(briefing.marketDate)}
            </span>
            <span className={`
              px-3 py-1 text-[11px] font-medium rounded-apple-button
              ${briefing.status === 'completed'
                ? isDark ? 'bg-stock-up/20 text-stock-up' : 'bg-black/10 text-deep-black'
                : 'bg-yellow-500/20 text-yellow-600'
              }
            `}>
              {briefing.status === 'completed' ? 'Sent' : 'Pending'}
            </span>
          </div>

          {/* 종목 정보 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`
                text-lg font-semibold tracking-tight
                ${isDark ? 'text-white' : 'text-deep-black'}
              `}>
                {briefing.topStock.symbol}
              </p>
              <p className="text-[13px] text-space-gray">
                {briefing.topStock.name}
              </p>
            </div>
            <div className="text-right">
              <p className={`
                text-xl font-semibold tabular-nums
                ${isPositive ? 'text-stock-up' : 'text-stock-down'}
              `}>
                {isPositive ? '+' : ''}{briefing.topStock.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* 통계 */}
          <div className={`
            pt-3 border-t grid grid-cols-3 gap-2 text-center
            ${isDark ? 'border-white/10' : 'border-black/10'}
          `}>
            <div>
              <p className="text-[12px] text-space-gray mb-1">
                Sent
              </p>
              <p className={`
                text-[15px] font-semibold tabular-nums
                ${isDark ? 'text-white' : 'text-deep-black'}
              `}>
                {briefing.deliverySummary.emailSent}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-space-gray mb-1">
                Open
              </p>
              <p className={`
                text-[15px] font-semibold tabular-nums
                ${isDark ? 'text-white' : 'text-deep-black'}
              `}>
                {openRate}%
              </p>
            </div>
            <div>
              <p className="text-[12px] text-space-gray mb-1">
                Slack
              </p>
              <p className={`
                text-[15px] font-semibold tabular-nums
                ${isDark ? 'text-white' : 'text-deep-black'}
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


