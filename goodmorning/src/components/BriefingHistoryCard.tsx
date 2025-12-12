'use client'

import Link from 'next/link'
import { BriefingHistoryItem } from '@/lib/mockData'

interface BriefingHistoryCardProps {
  briefing: BriefingHistoryItem
}

export default function BriefingHistoryCard({ briefing }: BriefingHistoryCardProps) {
  const isPositive = briefing.topStock.changePercent >= 0
  const openRate = Math.round((briefing.deliverySummary.emailOpened / briefing.deliverySummary.emailSent) * 100)
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })
  }

  return (
    <Link href={`/briefing/${briefing.id}`}>
      <div className="bg-dark-card border border-dark-border rounded-xl p-4 card-hover cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span className="text-sm text-dark-text-secondary">{formatDate(briefing.marketDate)}</span>
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
            <p className="text-white font-semibold">{briefing.topStock.symbol}</p>
            <p className="text-xs text-dark-text-secondary">{briefing.topStock.name}</p>
          </div>
          <div className="text-right">
            <p className={`font-bold ${isPositive ? 'stock-positive' : 'stock-negative'}`}>
              {isPositive ? '+' : ''}{briefing.topStock.changePercent.toFixed(2)}%
            </p>
            <p className="text-xs text-dark-text-secondary">TOP 1 종목</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-dark-border flex items-center justify-between text-xs text-dark-text-secondary">
          <span>📧 {briefing.deliverySummary.emailSent}명 발송</span>
          <span>👁️ {openRate}% 열람</span>
          <span>💬 Slack {briefing.deliverySummary.slackSent}건</span>
        </div>
      </div>
    </Link>
  )
}


