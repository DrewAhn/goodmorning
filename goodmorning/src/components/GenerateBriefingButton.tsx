'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Sparkles } from 'lucide-react'

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

  return (
    <div className="relative">
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className={`
          px-6 py-3 font-semibold tracking-normal text-[15px]
          rounded-apple-button transition-all duration-300
          flex items-center gap-2
          shadow-apple-sm hover:shadow-apple-md
          ${isLoading
            ? 'bg-gray-400 text-white/70 cursor-not-allowed'
            : isDark
              ? 'bg-dark-accent text-white hover:opacity-90 hover:scale-[1.02]'
              : 'bg-light-accent text-white hover:opacity-90 hover:scale-[1.02]'
          }
          disabled:hover:scale-100
        `}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>생성 중...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>브리핑 생성</span>
          </>
        )}
      </button>

      {/* Apple 스타일 성공 토스트 */}
      {showSuccess && (
        <div className="absolute top-full mt-3 left-0 right-0 animate-slide-up z-50">
          <div className={`
            px-4 py-3 rounded-apple-input text-[14px] text-center font-medium
            shadow-apple-md
            ${isDark
              ? 'bg-stock-up/20 text-stock-up'
              : 'bg-stock-up/10 text-stock-up'
            }
          `}>
            ✓ 브리핑이 성공적으로 생성되었습니다
          </div>
        </div>
      )}
    </div>
  )
}


