'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({
  title = '오류 발생',
  message,
  onRetry
}: ErrorMessageProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const textPrimary = isDark ? 'text-white' : 'text-light-text'
  const textSecondary = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
  const cardBg = isDark ? 'bg-dark-card' : 'bg-light-card'
  const borderColor = isDark ? 'border-dark-border' : 'border-light-border'
  const accentColor = isDark ? 'bg-dark-accent hover:bg-dark-accent/80' : 'bg-light-accent hover:bg-light-accent/80'

  return (
    <div className={`${cardBg} border ${borderColor} rounded-xl p-8 flex flex-col items-center justify-center transition-colors duration-300`}>
      <div className="w-16 h-16 bg-stock-down/20 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className={`${textPrimary} font-bold text-lg mb-2`}>{title}</h3>
      <p className={`${textSecondary} text-center mb-6 max-w-md`}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`${accentColor} text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors duration-200`}
        >
          <RefreshCw className="w-4 h-4" />
          다시 시도
        </button>
      )}
    </div>
  )
}
