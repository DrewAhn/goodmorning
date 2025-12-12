'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // 초기 테마 설정 (localStorage > 시스템 설정 > 기본값)
  useEffect(() => {
    setMounted(true)
    
    // localStorage에서 저장된 테마 확인
    const savedTheme = localStorage.getItem('theme') as Theme | null
    
    if (savedTheme) {
      setThemeState(savedTheme)
    } else {
      // 시스템 설정 감지 (prefers-color-scheme)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setThemeState(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // 테마 변경 시 document에 class 적용 및 localStorage 저장
  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  // 시스템 설정 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // localStorage에 저장된 값이 없을 때만 시스템 설정 따르기
      const savedTheme = localStorage.getItem('theme')
      if (!savedTheme) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  // 마운트 전에는 기본 테마로 렌더링 (Hydration 에러 방지)
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {}, setTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}


