'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export default function GenerateBriefingButton() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    
    // 목업: 2초 후 완료
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setShowSuccess(true)
    
    // 3초 후 성공 메시지 숨김
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const disabledBg = isDark ? 'bg-dark-border' : 'bg-light-border'
  const disabledText = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
  const gradientFrom = isDark ? 'from-dark-accent' : 'from-light-accent'
  const shadowColor = isDark ? 'hover:shadow-dark-accent/25' : 'hover:shadow-light-accent/25'

  return (
    <div className="relative">
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
          ${isLoading 
            ? `${disabledBg} ${disabledText} cursor-not-allowed` 
            : `bg-gradient-to-r ${gradientFrom} to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white shadow-lg ${shadowColor}`
          }
        `}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>브리핑 생성 중...</span>
          </>
        ) : (
          <>
            <span className="text-xl">✨</span>
            <span>수동 브리핑 생성</span>
          </>
        )}
      </button>
      
      {/* 성공 토스트 */}
      {showSuccess && (
        <div className="absolute top-full mt-3 left-0 right-0 animate-slide-up">
          <div className="bg-stock-up/20 border border-stock-up/30 text-stock-up px-4 py-2 rounded-lg text-sm text-center">
            ✅ 브리핑이 성공적으로 생성되었습니다!
          </div>
        </div>
      )}
    </div>
  )
}


