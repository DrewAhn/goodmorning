'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function Footer() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <footer className={`
      border-t mt-12 py-6 transition-colors duration-300
      ${isDark ? 'border-dark-border' : 'border-light-border'}
    `}>
      <div className={`
        max-w-7xl mx-auto px-4 text-center text-sm
        ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}
      `}>
        <p>본 정보는 투자 권유가 아닙니다. 투자 결정은 본인 판단에 따라 신중히 하세요.</p>
        <p className="mt-2">© 2025 굿모닝 월가. All rights reserved.</p>
      </div>
    </footer>
  )
}


