'use client'

import StockCard from '@/components/StockCard'
import MarketOverview from '@/components/MarketOverview'
import BriefingHistoryCard from '@/components/BriefingHistoryCard'
import GenerateBriefingButton from '@/components/GenerateBriefingButton'
import { trendingStocks, marketOverview, briefingHistory } from '@/lib/mockData'
import { useTheme } from '@/contexts/ThemeContext'

export default function Dashboard() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const topStock = trendingStocks[0]
  const otherStocks = trendingStocks.slice(1)

  // 테마별 색상 클래스
  const textPrimary = isDark ? 'text-white' : 'text-light-text'
  const textSecondary = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
  const textNormal = isDark ? 'text-dark-text' : 'text-light-text'
  const cardBg = isDark ? 'bg-dark-card' : 'bg-light-card'
  const borderColor = isDark ? 'border-dark-border' : 'border-light-border'
  const bgSecondary = isDark ? 'bg-dark-bg' : 'bg-light-bg'
  const accentColor = isDark ? 'text-dark-accent' : 'text-light-accent'
  const accentBg = isDark ? 'bg-dark-accent/20 text-dark-accent' : 'bg-light-accent/20 text-light-accent'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 페이지 타이틀 & 액션 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textPrimary}`}>오늘의 화제 종목</h2>
          <p className={`${textSecondary} mt-1`}>
            2025년 12월 9일 미국 증시 마감 기준
          </p>
        </div>
        <GenerateBriefingButton />
      </div>

      {/* 시장 개요 */}
      <section>
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
          <span>📈</span> 시장 개요
        </h3>
        <MarketOverview data={marketOverview} />
      </section>

      {/* TOP 1 종목 (큰 카드) */}
      <section>
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
          <span>🏆</span> TOP 1 화제 종목
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 메인 카드 */}
          <div className="lg:col-span-1">
            <StockCard stock={topStock} isTop={true} />
          </div>
          
          {/* 요약 정보 */}
          <div className={`${cardBg} border ${borderColor} rounded-xl p-6 flex flex-col justify-between transition-colors duration-300`}>
            <div>
              <h4 className={`text-xl font-bold ${textPrimary} mb-2`}>
                왜 {topStock.symbol}이 선정되었나요?
              </h4>
              <div className="space-y-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-stock-up/20 rounded-lg flex items-center justify-center text-stock-up">
                    📊
                  </div>
                  <div>
                    <p className={`font-semibold ${textPrimary}`}>거래량 1위</p>
                    <p className={`text-sm ${textSecondary}`}>
                      {(topStock.volume / 1000000).toFixed(1)}M 주 거래 (평소 대비 30% 증가)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-stock-up/20 rounded-lg flex items-center justify-center text-stock-up">
                    📈
                  </div>
                  <div>
                    <p className={`font-semibold ${textPrimary}`}>상승률 상위</p>
                    <p className={`text-sm ${textSecondary}`}>
                      +{topStock.changePercent.toFixed(2)}% 상승으로 상승 종목 중 상위권
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${accentBg} rounded-lg flex items-center justify-center`}>
                    🎯
                  </div>
                  <div>
                    <p className={`font-semibold ${textPrimary}`}>선정 신뢰도: {topStock.confidence}</p>
                    <p className={`text-sm ${textSecondary}`}>
                      거래량과 상승률 모두 상위권 → 높은 신뢰도
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`mt-6 p-4 ${bgSecondary} rounded-lg border ${borderColor}`}>
              <p className={`text-sm ${textSecondary}`}>
                💡 <span className={textNormal}>선정 알고리즘</span>: 거래량 TOP 25와 상승률 TOP 25의 
                <span className={accentColor}> 교집합</span> 중 거래량 1위 종목을 자동 선정합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 나머지 화제 종목 */}
      <section>
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
          <span>🔥</span> 화제 종목 TOP 2-5
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {otherStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </section>

      {/* 최근 브리핑 히스토리 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${textPrimary} flex items-center gap-2`}>
            <span>📚</span> 최근 브리핑 히스토리
          </h3>
          <button className={`text-sm ${accentColor} hover:underline`}>
            전체 보기 →
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


