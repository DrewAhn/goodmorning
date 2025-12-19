'use client'

import { useTheme } from '@/contexts/ThemeContext'

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = '데이터를 불러오는 중...' }: LoadingSpinnerProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const textPrimary = isDark ? 'text-white' : 'text-light-text'
  const textSecondary = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
  const cardBg = isDark ? 'bg-dark-card' : 'bg-light-card'
  const borderColor = isDark ? 'border-dark-border' : 'border-light-border'

  return (
    <div className={`${cardBg} border ${borderColor} rounded-xl p-12 flex flex-col items-center justify-center transition-colors duration-300`}>
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-dark-accent/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-dark-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className={`${textPrimary} font-semibold mb-1`}>{message}</p>
      <p className={`${textSecondary} text-sm`}>잠시만 기다려주세요...</p>
    </div>
  )
}
