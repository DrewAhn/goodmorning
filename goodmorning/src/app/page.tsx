'use client'

import { useState, useEffect } from 'react'
import StockCard from '@/components/StockCard'
import MarketOverview from '@/components/MarketOverview'
import BriefingHistoryCard from '@/components/BriefingHistoryCard'
import GenerateBriefingButton from '@/components/GenerateBriefingButton'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import { marketOverview, briefingHistory } from '@/lib/mockData'
import { getTrendingStocks, convertApiToMockFormat } from '@/lib/api'
import { useTheme } from '@/contexts/ThemeContext'
import { RefreshCw } from 'lucide-react'
import type { Stock } from '@/lib/mockData'

export default function Dashboard() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // 상태 관리
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const topStock = stocks[0]
  const otherStocks = stocks.slice(1)

  // 화제 종목 데이터 로드
  const fetchStocks = async () => {
    try {
      setError(null)
      const apiStocks = await getTrendingStocks()
      const convertedStocks = apiStocks.map(convertApiToMockFormat)
      setStocks(convertedStocks)
    } catch (err) {
      console.error('화제 종목 로드 실패:', err)
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // 초기 로드
  useEffect(() => {
    fetchStocks()
  }, [])

  // 새로고침 핸들러
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchStocks()
  }

  // 테마별 색상 클래스
  const textPrimary = isDark ? 'text-white' : 'text-light-text'
  const textSecondary = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
  const textNormal = isDark ? 'text-dark-text' : 'text-light-text'
  const cardBg = isDark ? 'bg-dark-card' : 'bg-light-card'
  const borderColor = isDark ? 'border-dark-border' : 'border-light-border'
  const bgSecondary = isDark ? 'bg-dark-bg' : 'bg-light-bg'
  const accentColor = isDark ? 'text-dark-accent' : 'text-light-accent'
  const accentBg = isDark ? 'bg-dark-accent/20 text-dark-accent' : 'bg-light-accent/20 text-light-accent'
  const buttonAccent = isDark ? 'bg-dark-accent hover:bg-dark-accent/80' : 'bg-light-accent hover:bg-light-accent/80'

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <LoadingSpinner message="화제 종목을 불러오는 중입니다..." />
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <ErrorMessage
          title="화제 종목을 불러올 수 없습니다"
          message={error}
          onRetry={handleRefresh}
        />
      </div>
    )
  }

  // 데이터가 없는 경우
  if (!stocks || stocks.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <ErrorMessage
          title="화제 종목이 없습니다"
          message="현재 표시할 화제 종목이 없습니다. 잠시 후 다시 시도해주세요."
          onRetry={handleRefresh}
        />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* 페이지 타이틀 & 액션 버튼 */}
      <div className={`
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6
        border-b-4 ${isDark ? 'border-stock-up' : 'border-black'}
      `}>
        <div>
          <h2 className={`
            text-4xl font-display mb-2
            ${isDark ? 'text-stock-up' : 'text-black'}
          `}>
            TODAY'S TRENDING
          </h2>
          <p className={`
            text-sm font-terminal
            ${isDark ? 'text-white/60' : 'text-black/60'}
          `}>
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • 미국 증시 기준
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`
              px-5 py-3 font-terminal font-bold uppercase tracking-wider
              border-2 transition-all duration-200
              ${isDark
                ? 'bg-black border-stock-up text-stock-up hover:bg-stock-up hover:text-black'
                : 'bg-white border-black text-black hover:bg-black hover:text-white'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            `}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'LOADING...' : 'REFRESH'}
          </button>
          <GenerateBriefingButton />
        </div>
      </div>

      {/* 시장 개요 */}
      <section className="stagger-item">
        <div className="flex items-center gap-3 mb-6">
          <div className={`
            w-1 h-12
            ${isDark ? 'bg-stock-up' : 'bg-black'}
          `}></div>
          <div>
            <h3 className={`
              text-2xl font-display
              ${isDark ? 'text-white' : 'text-black'}
            `}>
              MARKET OVERVIEW
            </h3>
            <p className={`
              text-xs font-terminal
              ${isDark ? 'text-white/60' : 'text-black/60'}
            `}>
              미국 3대 지수 실시간 현황
            </p>
          </div>
        </div>
        <MarketOverview data={marketOverview} />
      </section>

      {/* TOP 1 종목 (큰 카드) */}
      <section className="stagger-item">
        <div className="flex items-center gap-3 mb-6">
          <div className={`
            w-1 h-12
            ${isDark ? 'bg-stock-up' : 'bg-black'}
          `}></div>
          <div>
            <h3 className={`
              text-2xl font-display
              ${isDark ? 'text-white' : 'text-black'}
            `}>
              TOP PICK
            </h3>
            <p className={`
              text-xs font-terminal
              ${isDark ? 'text-white/60' : 'text-black/60'}
            `}>
              오늘의 최고 화제 종목
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StockCard stock={topStock} isTop={true} />
        </div>
      </section>

      {/* 나머지 화제 종목 */}
      <section className="stagger-item">
        <div className="flex items-center gap-3 mb-6">
          <div className={`
            w-1 h-12
            ${isDark ? 'bg-stock-up' : 'bg-black'}
          `}></div>
          <div>
            <h3 className={`
              text-2xl font-display
              ${isDark ? 'text-white' : 'text-black'}
            `}>
              TOP 2-5
            </h3>
            <p className={`
              text-xs font-terminal
              ${isDark ? 'text-white/60' : 'text-black/60'}
            `}>
              화제성 높은 종목들
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </section>

      {/* 최근 브리핑 히스토리 */}
      <section className="stagger-item">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`
              w-1 h-12
              ${isDark ? 'bg-stock-up' : 'bg-black'}
            `}></div>
            <div>
              <h3 className={`
                text-2xl font-display
                ${isDark ? 'text-white' : 'text-black'}
              `}>
                BRIEFING HISTORY
              </h3>
              <p className={`
                text-xs font-terminal
                ${isDark ? 'text-white/60' : 'text-black/60'}
              `}>
                최근 브리핑 기록
              </p>
            </div>
          </div>
          <button className={`
            font-terminal text-sm font-bold uppercase
            ${isDark ? 'text-stock-up hover:underline' : 'text-black hover:underline'}
          `}>
            VIEW ALL →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {briefingHistory.map((briefing) => (
            <BriefingHistoryCard key={briefing.id} briefing={briefing} />
          ))}
        </div>
      </section>
    </div>
  )
}


