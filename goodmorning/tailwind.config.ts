import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 주식 컬러
        'stock-up': '#00D26A',      // 상승 (녹색)
        'stock-down': '#FF4757',    // 하락 (빨간색)
        'stock-neutral': '#A0AEC0', // 보합 (회색)
        // 다크 테마 컬러
        'dark': {
          'bg': '#0D1117',
          'card': '#161B22',
          'border': '#30363D',
          'text': '#C9D1D9',
          'text-secondary': '#8B949E',
          'accent': '#58A6FF',
        }
      },
      fontFamily: {
        'display': ['Pretendard', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
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
      },
    },
  },
  plugins: [],
}
export default config


