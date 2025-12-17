'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out
        ${isDark 
          ? 'bg-dark-border hover:bg-dark-text-secondary/30' 
          : 'bg-light-border hover:bg-light-text-secondary/30'
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isDark ? 'focus:ring-dark-accent focus:ring-offset-dark-bg' : 'focus:ring-light-accent focus:ring-offset-light-bg'}
      `}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {/* 슬라이더 */}
      <span
        className={`
          absolute top-0.5 w-6 h-6 rounded-full 
          flex items-center justify-center text-sm
          transition-all duration-300 ease-in-out transform
          ${isDark 
            ? 'left-0.5 bg-dark-card shadow-lg' 
            : 'left-7 bg-white shadow-lg'
          }
        `}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
      
      {/* 배경 아이콘 (반대편) */}
      <span
        className={`
          absolute top-0.5 w-6 h-6 rounded-full 
          flex items-center justify-center text-sm opacity-30
          transition-all duration-300
          ${isDark ? 'right-0.5' : 'left-0.5'}
        `}
      >
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  )
}






