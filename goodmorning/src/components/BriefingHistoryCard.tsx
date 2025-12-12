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
  
  const cardBg = isDark ? 'bg-dark-card' : 'bg-light-card'
  const borderColor = isDark ? 'border-dark-border' : 'border-light-border'
  const textPrimary = isDark ? 'text-white' : 'text-light-text'
  const textSecondary = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })
  }

  return (
    <Link href={`/briefing/${briefing.id}`}>
      <div className={`${cardBg} border ${borderColor} rounded-xl p-4 card-hover cursor-pointer transition-colors duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span className={`text-sm ${textSecondary}`}>{formatDate(briefing.marketDate)}</span>
          </div>
          <span className={`
            px-2 py-0.5 text-xs rounded-full
            ${briefing.status === 'completed' ? 'bg-stock-up/20 text-stock-up' : 'bg-yellow-500/20 text-yellow-400'}
          `}>
            {briefing.status === 'completed' ? '발송완료' : '대기중'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className={`${textPrimary} font-semibold`}>{briefing.topStock.symbol}</p>
            <p className={`text-xs ${textSecondary}`}>{briefing.topStock.name}</p>
          </div>
          <div className="text-right">
            <p className={`font-bold ${isPositive ? 'stock-positive' : 'stock-negative'}`}>
              {isPositive ? '+' : ''}{briefing.topStock.changePercent.toFixed(2)}%
            </p>
            <p className={`text-xs ${textSecondary}`}>TOP 1 종목</p>
          </div>
        </div>

        <div className={`mt-3 pt-3 border-t ${borderColor} flex items-center justify-between text-xs ${textSecondary}`}>
          <span>📧 {briefing.deliverySummary.emailSent}명 발송</span>
          <span>👁️ {openRate}% 열람</span>
          <span>💬 Slack {briefing.deliverySummary.slackSent}건</span>
        </div>
      </div>
    </Link>
  )
}


