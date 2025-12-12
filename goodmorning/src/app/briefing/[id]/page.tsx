'use client'

import { useState } from 'react'
import Link from 'next/link'
import { briefingDetail } from '@/lib/mockData'

export default function BriefingDetailPage({ params }: { params: { id: string } }) {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showSlackModal, setShowSlackModal] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [sendingSlack, setSendingSlack] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [slackSent, setSlackSent] = useState(false)

  const briefing = briefingDetail // 실제로는 params.id로 조회

  const handleSendEmail = async () => {
    setSendingEmail(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSendingEmail(false)
    setEmailSent(true)
    setTimeout(() => {
      setShowEmailModal(false)
      setEmailSent(false)
    }, 2000)
  }

  const handleSendSlack = async () => {
    setSendingSlack(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSendingSlack(false)
    setSlackSent(true)
    setTimeout(() => {
      setShowSlackModal(false)
      setSlackSent(false)
    }, 2000)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <div className="animate-fade-in">
      {/* 뒤로가기 */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-dark-text-secondary hover:text-white transition-colors mb-6"
      >
        <span>←</span>
        <span>대시보드로 돌아가기</span>
      </Link>

      {/* 헤더 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{briefing.content.title}</h1>
          <p className="text-dark-text-secondary mt-1">{briefing.content.subtitle}</p>
          <p className="text-sm text-dark-text-secondary mt-2">
            생성일: {formatDate(briefing.createdAt)}
          </p>
        </div>
        
        {/* 발송 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-dark-card border border-dark-border rounded-xl hover:border-dark-accent transition-colors"
          >
            <span className="text-xl">📧</span>
            <span>이메일 발송</span>
          </button>
          <button
            onClick={() => setShowSlackModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-dark-card border border-dark-border rounded-xl hover:border-purple-500 transition-colors"
          >
            <span className="text-xl">💬</span>
            <span>슬랙 발송</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 브리핑 이미지 미리보기 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🖼️</span> 브리핑 이미지 미리보기
          </h2>
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            {/* 이미지 미리보기 (목업) */}
            <div className="bg-gradient-to-br from-dark-bg to-dark-card rounded-lg p-6 border border-dark-border">
              <div className="text-center mb-6">
                <p className="text-3xl mb-2">🌅</p>
                <h3 className="text-xl font-bold text-white">굿모닝 월가</h3>
                <p className="text-dark-text-secondary text-sm">2025년 12월 10일</p>
              </div>
              
              <div className="space-y-3">
                {briefing.content.stocks.slice(0, 3).map((stock, idx) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-dark-accent">{idx + 1}</span>
                      <div>
                        <p className="font-semibold text-white">{stock.symbol}</p>
                        <p className="text-xs text-dark-text-secondary">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${stock.price}</p>
                      <p className={stock.changePercent >= 0 ? 'text-stock-up text-sm' : 'text-stock-down text-sm'}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
                <p className="text-center text-dark-text-secondary text-sm">... 외 2개 종목</p>
              </div>

              <div className="mt-6 pt-4 border-t border-dark-border grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-dark-text-secondary">NASDAQ</p>
                  <p className="text-stock-up text-sm font-semibold">+1.2%</p>
                </div>
                <div>
                  <p className="text-xs text-dark-text-secondary">S&P 500</p>
                  <p className="text-stock-up text-sm font-semibold">+0.8%</p>
                </div>
                <div>
                  <p className="text-xs text-dark-text-secondary">DOW</p>
                  <p className="text-stock-up text-sm font-semibold">+0.5%</p>
                </div>
              </div>
            </div>
            
            <p className="text-center text-dark-text-secondary text-sm mt-4">
              실제 발송 시 고해상도 이미지로 생성됩니다
            </p>
          </div>
        </div>

        {/* 오른쪽: 리포트 텍스트 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📝</span> 브리핑 텍스트
          </h2>
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <pre className="whitespace-pre-wrap text-dark-text text-sm font-mono leading-relaxed">
              {briefing.textVersion}
            </pre>
            
            <div className="mt-4 pt-4 border-t border-dark-border">
              <button 
                onClick={() => navigator.clipboard.writeText(briefing.textVersion)}
                className="text-sm text-dark-accent hover:underline flex items-center gap-2"
              >
                <span>📋</span> 텍스트 복사하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 발송 히스토리 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>📤</span> 발송 히스토리
        </h2>
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="text-left px-6 py-3 text-dark-text-secondary text-sm font-medium">채널</th>
                <th className="text-left px-6 py-3 text-dark-text-secondary text-sm font-medium">발송 시간</th>
                <th className="text-left px-6 py-3 text-dark-text-secondary text-sm font-medium">상태</th>
                <th className="text-left px-6 py-3 text-dark-text-secondary text-sm font-medium">상세</th>
              </tr>
            </thead>
            <tbody>
              {briefing.deliveryHistory.map((delivery) => (
                <tr key={delivery.id} className="border-t border-dark-border">
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      {delivery.channel === 'email' ? '📧' : '💬'}
                      <span className="text-white capitalize">{delivery.channel}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-dark-text-secondary">
                    {new Date(delivery.sentAt).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-stock-up/20 text-stock-up text-xs rounded-full">
                      발송완료
                    </span>
                  </td>
                  <td className="px-6 py-4 text-dark-text-secondary text-sm">
                    {delivery.channel === 'email' 
                      ? `${delivery.recipientsCount}명 발송 / ${delivery.openedCount}명 열람`
                      : 'Slack 채널 발송 완료'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 이메일 발송 모달 */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md mx-4 animate-slide-up">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📧</span> 이메일 발송
            </h3>
            
            {emailSent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-stock-up font-semibold">발송이 완료되었습니다!</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-dark-text-secondary mb-2">수신자</label>
                    <input 
                      type="text" 
                      placeholder="이메일 주소 (쉼표로 구분)"
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-text-secondary focus:border-dark-accent focus:outline-none"
                      defaultValue="subscribers@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-dark-text-secondary mb-2">제목</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-dark-accent focus:outline-none"
                      defaultValue="🌅 굿모닝 월가 - 오늘의 화제 종목"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text hover:bg-dark-border transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={sendingEmail}
                    className="flex-1 px-4 py-3 bg-dark-accent hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    {sendingEmail ? '발송 중...' : '발송하기'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 슬랙 발송 모달 */}
      {showSlackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md mx-4 animate-slide-up">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>💬</span> 슬랙 발송
            </h3>
            
            {slackSent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-stock-up font-semibold">슬랙 발송이 완료되었습니다!</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-dark-text-secondary mb-2">Webhook URL</label>
                    <input 
                      type="text" 
                      placeholder="https://hooks.slack.com/services/..."
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-text-secondary focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-dark-text-secondary mb-2">멘션</label>
                    <select className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-purple-500 focus:outline-none">
                      <option value="">멘션 없음</option>
                      <option value="@channel">@channel</option>
                      <option value="@here">@here</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowSlackModal(false)}
                    className="flex-1 px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text hover:bg-dark-border transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSendSlack}
                    disabled={sendingSlack}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    {sendingSlack ? '발송 중...' : '발송하기'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


