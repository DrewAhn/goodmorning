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
      {/* Live Ticker */}
      <div className={`
        overflow-hidden border-b-2 ${isDark ? 'border-stock-up bg-black' : 'border-black bg-white'}
      `}>
        <div className="flex whitespace-nowrap ticker-animation font-terminal text-sm py-2">
          {/* 티커를 두 번 반복하여 끊김 없는 애니메이션 */}
          {[...tickerItems, ...tickerItems].map((item, i) => {
            const isPositive = item.includes('+')
            const isNegative = item.includes('-')
            return (
              <span
                key={i}
                className={`
                  inline-flex items-center px-6 font-bold
                  ${isPositive ? 'text-stock-up' : isNegative ? 'text-stock-down' : isDark ? 'text-white' : 'text-black'}
                `}
              >
                {isPositive && '▲ '}
                {isNegative && '▼ '}
                {item}
                <span className={`mx-2 ${isDark ? 'text-stock-up' : 'text-black'}`}>•</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Main Header */}
      <header className={`
        border-b-4 sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md
        ${isDark
          ? 'border-stock-up bg-black/95'
          : 'border-black bg-white/95'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center gap-4">
              <div className={`
                w-12 h-12 flex items-center justify-center font-display text-2xl
                border-3 ${isDark ? 'border-stock-up bg-stock-up/10' : 'border-black bg-black/5'}
              `}>
                📈
              </div>
              <div>
                <h1 className={`
                  text-2xl font-display tracking-tight
                  ${isDark ? 'text-stock-up' : 'text-black'}
                `}>
                  굿모닝 월가
                </h1>
                <p className={`
                  text-xs font-terminal uppercase tracking-wider
                  ${isDark ? 'text-white/60' : 'text-black/60'}
                `}>
                  Good Morning, Wall Street
                </p>
              </div>
            </div>

            {/* 우측 정보 */}
            <div className="flex items-center gap-4">
              {/* 실시간 상태 */}
              <div className={`
                hidden md:flex items-center gap-2 px-3 py-1.5
                border-2 ${isDark ? 'border-stock-up' : 'border-black'}
              `}>
                <div className={`w-2 h-2 ${isDark ? 'bg-stock-up' : 'bg-black'} animate-pulse`}></div>
                <span className={`text-xs font-terminal font-bold ${isDark ? 'text-stock-up' : 'text-black'}`}>
                  LIVE
                </span>
              </div>

              {/* 업데이트 시간 */}
              {currentTime && (
                <span className={`
                  text-xs font-terminal hidden lg:block
                  ${isDark ? 'text-white/60' : 'text-black/60'}
                `}>
                  LAST UPDATE: {currentTime} KST
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






