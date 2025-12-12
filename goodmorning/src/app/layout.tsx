import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
    <html lang="ko" className="dark">
      <body className="min-h-screen gradient-bg">
        <Providers>
          <div className="min-h-screen">
            <Header />
            
            {/* 메인 콘텐츠 */}
            <main className="max-w-7xl mx-auto px-4 py-6">
              {children}
            </main>
            
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}


