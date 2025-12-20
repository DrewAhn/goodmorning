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
        w-12 h-12 flex items-center justify-center
        border-2 transition-all duration-200
        ${isDark
          ? 'bg-black border-stock-up text-stock-up hover:bg-stock-up hover:text-black'
          : 'bg-white border-black text-black hover:bg-black hover:text-white'
        }
        focus:outline-none
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Moon className="w-5 h-5" strokeWidth={2.5} />
      ) : (
        <Sun className="w-5 h-5" strokeWidth={2.5} />
      )}
    </button>
  )
}






