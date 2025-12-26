import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 주식 컬러 (Apple 스타일)
        'stock-up': '#34C759',      // Apple Success Green
        'stock-down': '#FF3B30',    // Apple Error Red
        'stock-neutral': '#8E8E93', // Apple Gray
        // Apple 브랜드 컬러
        'apple-blue': '#0071E3',
        'deep-black': '#1D1D1F',
        'space-gray': '#86868B',
        // 다크 테마 컬러 (Apple 스타일)
        'dark': {
          'bg': '#000000',          // Pure black
          'card': '#1C1C1E',        // Apple dark card
          'border': '#38383A',      // Subtle border
          'text': '#FFFFFF',        // Pure white text
          'text-secondary': '#86868B', // Space gray
          'accent': '#0A84FF',      // Apple blue (dark mode)
        },
        // 라이트 테마 컬러 (Apple 스타일)
        'light': {
          'bg': '#FFFFFF',          // Pure white
          'card': '#F5F5F7',        // Apple light gray
          'border': '#D2D2D7',      // Light border
          'text': '#1D1D1F',        // Deep black
          'text-secondary': '#86868B', // Space gray
          'accent': '#0071E3',      // Apple blue (light mode)
        }
      },
      fontFamily: {
        // Apple 시스템 폰트 (Pretendard는 한글 fallback)
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'apple-card': '18px',
        'apple-button': '980px',    // Pill shape
        'apple-input': '12px',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'apple-xl': '0 16px 48px rgba(0, 0, 0, 0.16)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config


