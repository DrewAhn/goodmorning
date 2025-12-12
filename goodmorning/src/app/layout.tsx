import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '굿모닝 월가 | Good Morning, Wall Street',
  description: '한국인 투자자를 위한 미국주식 데일리 브리핑',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen gradient-bg">
        <div className="min-h-screen">
          {/* 헤더 */}
          <header className="border-b border-dark-border bg-dark-bg/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌅</span>
                <div>
                  <h1 className="text-xl font-bold text-white">굿모닝 월가</h1>
                  <p className="text-xs text-dark-text-secondary">Good Morning, Wall Street</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-dark-text-secondary">
                  마지막 업데이트: 2025-12-10 09:00 KST
                </span>
                <div className="w-2 h-2 bg-stock-up rounded-full animate-pulse"></div>
              </div>
            </div>
          </header>
          
          {/* 메인 콘텐츠 */}
          <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>
          
          {/* 푸터 */}
          <footer className="border-t border-dark-border mt-12 py-6">
            <div className="max-w-7xl mx-auto px-4 text-center text-dark-text-secondary text-sm">
              <p>본 정보는 투자 권유가 아닙니다. 투자 결정은 본인 판단에 따라 신중히 하세요.</p>
              <p className="mt-2">© 2025 굿모닝 월가. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}


