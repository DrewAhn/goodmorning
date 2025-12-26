'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [currentTime, setCurrentTime] = useState<string>('')

  // 클라이언트에서만 시간 업데이트
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    }

    // 초기 시간 설정
    updateTime()

    // 1초마다 업데이트
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const tickerItems = [
    'NVDA +6.15%',
    'TSLA +4.71%',
    'AMD +3.91%',
    'NASDAQ +1.2%',
    'S&P500 +0.8%',
    'DOW +0.5%',
    'AAPL -1.17%',
    'MSFT +1.12%',
  ]

  return (
    <>
      {/* Live Ticker - Apple Style */}
      <div className={`
        overflow-hidden border-b backdrop-blur-lg
        ${isDark ? 'border-dark-border bg-black/50' : 'border-light-border bg-white/50'}
      `}>
        <div className="flex whitespace-nowrap ticker-animation text-[13px] py-2 font-medium">
          {/* 티커를 두 번 반복하여 끊김 없는 애니메이션 */}
          {[...tickerItems, ...tickerItems].map((item, i) => {
            const isPositive = item.includes('+')
            const isNegative = item.includes('-')
            return (
              <span
                key={i}
                className={`
                  inline-flex items-center px-6
                  ${isPositive ? 'text-stock-up' : isNegative ? 'text-stock-down' : 'text-space-gray'}
                `}
              >
                {isPositive && '▲ '}
                {isNegative && '▼ '}
                {item}
                <span className="mx-2 text-space-gray">•</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Main Header - Frosted Glass Effect */}
      <header className={`
        border-b sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl shadow-apple-sm
        ${isDark
          ? 'border-dark-border bg-black/80'
          : 'border-light-border bg-white/80'
        }
      `}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center gap-3">
              <span className="text-4xl">📈</span>
              <div>
                <h1 className={`
                  text-2xl font-semibold tracking-tight
                  ${isDark ? 'text-white' : 'text-deep-black'}
                `}>
                  굿모닝 월가
                </h1>
                <p className="text-sm text-space-gray">
                  Good Morning, Wall Street
                </p>
              </div>
            </div>

            {/* 우측 정보 */}
            <div className="flex items-center gap-4">
              {/* LIVE 상태 - Pill shape */}
              <div className={`
                hidden md:flex items-center gap-2 px-3 py-1.5 rounded-apple-button
                ${isDark ? 'bg-white/10' : 'bg-black/10'}
              `}>
                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-stock-up' : 'bg-apple-blue'} animate-pulse`}></div>
                <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-deep-black'}`}>
                  LIVE
                </span>
              </div>

              {/* 업데이트 시간 */}
              {currentTime && (
                <span className="text-[13px] hidden lg:block text-space-gray">
                  Last update: {currentTime} KST
                </span>
              )}

              {/* 테마 토글 */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}






