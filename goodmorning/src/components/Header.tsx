'use client'

import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className={`
      border-b backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300
      ${isDark 
        ? 'border-dark-border bg-dark-bg/80' 
        : 'border-light-border bg-light-bg/80'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌅</span>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-light-text'}`}>
              굿모닝 월가
            </h1>
            <p className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              Good Morning, Wall Street
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-sm hidden sm:block ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            마지막 업데이트: 2025-12-10 09:00 KST
          </span>
          <div className="w-2 h-2 bg-stock-up rounded-full animate-pulse"></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}






