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
          px-5 py-3 font-terminal font-bold uppercase tracking-wider
          border-2 transition-all duration-200
          flex items-center gap-2
          ${isLoading
            ? isDark
              ? 'bg-black/50 border-white/20 text-white/40 cursor-not-allowed'
              : 'bg-white/50 border-black/20 text-black/40 cursor-not-allowed'
            : isDark
              ? 'bg-stock-up border-stock-up text-black hover:bg-stock-up/90'
              : 'bg-black border-black text-white hover:bg-black/90'
          }
        `}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>GENERATING...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate</span>
          </>
        )}
      </button>

      {/* 성공 토스트 - Terminal style */}
      {showSuccess && (
        <div className="absolute top-full mt-3 left-0 right-0 animate-slide-up z-50">
          <div className={`
            px-4 py-3 border-2 font-terminal text-sm text-center
            ${isDark
              ? 'bg-stock-up/20 border-stock-up text-stock-up'
              : 'bg-stock-up/10 border-stock-up text-stock-up'
            }
          `}>
            ✓ BRIEFING GENERATED SUCCESSFULLY
          </div>
        </div>
      )}
    </div>
  )
}


