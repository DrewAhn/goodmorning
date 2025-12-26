'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center
        transition-all duration-300
        ${isDark
          ? 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
          : 'bg-black/10 backdrop-blur-md text-black hover:bg-black/20'
        }
        shadow-apple-sm hover:shadow-apple-md
        focus:outline-none focus:ring-2 focus:ring-apple-blue focus:ring-opacity-50
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Moon className="w-5 h-5" strokeWidth={2} />
      ) : (
        <Sun className="w-5 h-5" strokeWidth={2} />
      )}
    </button>
  )
}






