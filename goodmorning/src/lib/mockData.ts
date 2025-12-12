// 목업 데이터: 화제 종목
export const trendingStocks = [
  {
    rank: 1,
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 142.50,
    change: 8.25,
    changePercent: 6.15,
    volume: 58420000,
    marketCap: 3500000000000,
    peRatio: 65.2,
    selectionReason: '거래량 상위 + 상승 종목',
    confidence: 'HIGH' as const,
    highlight: '🔥 AI 칩 신제품 발표로 급등',
    beginnerNote: '엔비디아는 AI에 필요한 고성능 칩을 만드는 회사예요.',
  },
  {
    rank: 2,
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 275.80,
    change: 12.40,
    changePercent: 4.71,
    volume: 42150000,
    marketCap: 875000000000,
    peRatio: 78.5,
    selectionReason: '거래량 상위 + 상승 종목',
    confidence: 'HIGH' as const,
    highlight: '📈 4분기 인도량 기대감 상승',
    beginnerNote: '테슬라는 전기차와 에너지 저장장치를 만드는 회사예요.',
  },
  {
    rank: 3,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 195.20,
    change: -2.30,
    changePercent: -1.17,
    volume: 38900000,
    marketCap: 3020000000000,
    peRatio: 31.2,
    selectionReason: '거래량 상위',
    confidence: 'MEDIUM' as const,
    highlight: '📱 아이폰 판매 우려로 소폭 하락',
    beginnerNote: '애플은 아이폰, 맥북 등을 만드는 세계 최대 기술 기업이에요.',
  },
  {
    rank: 4,
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 148.90,
    change: 5.60,
    changePercent: 3.91,
    volume: 35200000,
    marketCap: 240000000000,
    peRatio: 48.3,
    selectionReason: '거래량 상위 + 상승 종목',
    confidence: 'HIGH' as const,
    highlight: '💻 데이터센터 GPU 수요 증가',
    beginnerNote: 'AMD는 CPU와 GPU를 만드는 반도체 회사예요.',
  },
  {
    rank: 5,
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.50,
    change: 4.20,
    changePercent: 1.12,
    volume: 22100000,
    marketCap: 2810000000000,
    peRatio: 36.8,
    selectionReason: '거래량 상위 + 상승 종목',
    confidence: 'MEDIUM' as const,
    highlight: '☁️ Azure 클라우드 성장 지속',
    beginnerNote: '마이크로소프트는 윈도우, 오피스, 클라우드 서비스를 제공해요.',
  },
]

// 목업 데이터: 시장 개요
export const marketOverview = {
  nasdaq: { value: 16250.5, changePercent: 1.2 },
  sp500: { value: 4850.2, changePercent: 0.8 },
  dow: { value: 38500.0, changePercent: 0.5 },
}

// 목업 데이터: 브리핑 히스토리
export const briefingHistory = [
  {
    id: 'br_20251210_abc123',
    marketDate: '2025-12-09',
    createdAt: '2025-12-10T09:00:00Z',
    status: 'completed' as const,
    topStock: {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      changePercent: 6.15,
    },
    stockCount: 5,
    deliverySummary: {
      emailSent: 150,
      emailOpened: 95,
      slackSent: 3,
    },
  },
  {
    id: 'br_20251209_def456',
    marketDate: '2025-12-08',
    createdAt: '2025-12-09T09:00:00Z',
    status: 'completed' as const,
    topStock: {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      changePercent: 4.25,
    },
    stockCount: 5,
    deliverySummary: {
      emailSent: 148,
      emailOpened: 92,
      slackSent: 3,
    },
  },
  {
    id: 'br_20251208_ghi789',
    marketDate: '2025-12-07',
    createdAt: '2025-12-08T09:00:00Z',
    status: 'completed' as const,
    topStock: {
      symbol: 'AMD',
      name: 'Advanced Micro Devices',
      changePercent: 3.82,
    },
    stockCount: 5,
    deliverySummary: {
      emailSent: 145,
      emailOpened: 88,
      slackSent: 3,
    },
  },
  {
    id: 'br_20251207_jkl012',
    marketDate: '2025-12-06',
    createdAt: '2025-12-07T09:00:00Z',
    status: 'completed' as const,
    topStock: {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      changePercent: -1.50,
    },
    stockCount: 5,
    deliverySummary: {
      emailSent: 142,
      emailOpened: 85,
      slackSent: 3,
    },
  },
]

// 목업 데이터: 브리핑 상세
export const briefingDetail = {
  id: 'br_20251210_abc123',
  marketDate: '2025-12-09',
  createdAt: '2025-12-10T09:00:00Z',
  status: 'completed' as const,
  content: {
    title: '🌅 굿모닝 월가 - 2025년 12월 10일',
    subtitle: '어젯밤 미국 증시에서 가장 뜨거웠던 종목들',
    summary: '나스닥 +1.2% 상승 마감. AI 반도체 섹터 강세 지속. NVIDIA가 AI 칩 신제품 발표로 6% 이상 급등하며 시장을 이끌었습니다.',
    stocks: trendingStocks,
    marketOverview,
  },
  textVersion: `🌅 굿모닝 월가 - 2025년 12월 10일

📊 오늘의 화제 종목 TOP 5

1️⃣ NVDA (NVIDIA) $142.50 (+6.15%)
   → AI 칩 신제품 발표로 급등
   
2️⃣ TSLA (Tesla) $275.80 (+4.71%)
   → 4분기 인도량 기대감 상승
   
3️⃣ AAPL (Apple) $195.20 (-1.17%)
   → 아이폰 판매 우려로 소폭 하락
   
4️⃣ AMD $148.90 (+3.91%)
   → 데이터센터 GPU 수요 증가
   
5️⃣ MSFT (Microsoft) $378.50 (+1.12%)
   → Azure 클라우드 성장 지속

📈 시장 개요
• 나스닥: 16,250.5 (+1.2%)
• S&P 500: 4,850.2 (+0.8%)
• 다우: 38,500.0 (+0.5%)

⚠️ 본 정보는 투자 권유가 아닙니다.`,
  deliveryHistory: [
    {
      id: 'del_email_xyz789',
      channel: 'email' as const,
      sentAt: '2025-12-10T09:01:00Z',
      recipientsCount: 150,
      openedCount: 95,
    },
    {
      id: 'del_slack_def456',
      channel: 'slack' as const,
      sentAt: '2025-12-10T09:01:30Z',
      status: 'delivered' as const,
    },
  ],
}

// 목업 데이터: 주가 차트 (5일, 1개월, 3개월)
export type ChartDataPoint = {
  date: string
  close: number
  volume: number
}

export type ChartPeriod = '5d' | '1mo' | '3mo'

// 차트 데이터 생성 헬퍼 함수
function generateChartData(
  basePrice: number,
  days: number,
  volatility: number,
  trend: 'up' | 'down' | 'neutral'
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  let price = basePrice * (trend === 'up' ? 0.85 : trend === 'down' ? 1.15 : 0.95)
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // 주말 건너뛰기
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    const change = (Math.random() - 0.5) * volatility
    const trendFactor = trend === 'up' ? 0.002 : trend === 'down' ? -0.002 : 0
    price = price * (1 + change + trendFactor)
    
    data.push({
      date: date.toISOString().split('T')[0],
      close: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    })
  }
  
  return data
}

// 종목별 차트 데이터
export const stockChartData: Record<string, Record<ChartPeriod, ChartDataPoint[]>> = {
  NVDA: {
    '5d': generateChartData(142.50, 7, 0.03, 'up'),
    '1mo': generateChartData(142.50, 30, 0.025, 'up'),
    '3mo': generateChartData(142.50, 90, 0.02, 'up'),
  },
  TSLA: {
    '5d': generateChartData(275.80, 7, 0.04, 'up'),
    '1mo': generateChartData(275.80, 30, 0.035, 'up'),
    '3mo': generateChartData(275.80, 90, 0.03, 'neutral'),
  },
  AAPL: {
    '5d': generateChartData(195.20, 7, 0.015, 'down'),
    '1mo': generateChartData(195.20, 30, 0.012, 'neutral'),
    '3mo': generateChartData(195.20, 90, 0.01, 'up'),
  },
  AMD: {
    '5d': generateChartData(148.90, 7, 0.035, 'up'),
    '1mo': generateChartData(148.90, 30, 0.03, 'up'),
    '3mo': generateChartData(148.90, 90, 0.025, 'up'),
  },
  MSFT: {
    '5d': generateChartData(378.50, 7, 0.012, 'up'),
    '1mo': generateChartData(378.50, 30, 0.01, 'up'),
    '3mo': generateChartData(378.50, 90, 0.008, 'up'),
  },
}

// 차트 해설 생성 함수 (규칙 기반)
export function generateChartInsight(chartData: ChartDataPoint[], period: ChartPeriod): string {
  if (!chartData || chartData.length < 2) {
    return "데이터가 충분하지 않아요."
  }

  const startPrice = chartData[0].close
  const endPrice = chartData[chartData.length - 1].close
  const changePercent = ((endPrice - startPrice) / startPrice) * 100

  // 최근 반등 여부
  const recentData = chartData.slice(-3)
  const isRecovering = recentData.every((d, i) => 
    i === 0 || recentData[i - 1].close <= d.close
  )

  const periodLabel = { '5d': '5일', '1mo': '한 달', '3mo': '3개월' }[period]

  if (changePercent >= 15) {
    const emoji = period === '5d' ? '🔥' : '🚀'
    return `${periodLabel}간 +${changePercent.toFixed(1)}% 급등! 매우 강한 상승세예요 ${emoji}`
  }
  
  if (changePercent >= 5) {
    return `${periodLabel}간 +${changePercent.toFixed(1)}% 상승했어요. 긍정적인 흐름이에요 📈`
  }
  
  if (changePercent >= 1) {
    return `${periodLabel}간 +${changePercent.toFixed(1)}% 소폭 상승. 안정적인 모습이에요 📊`
  }
  
  if (changePercent >= -1) {
    return `${periodLabel}간 큰 변동 없이 횡보 중이에요. 방향을 지켜보세요 ➡️`
  }
  
  if (changePercent >= -5) {
    if (isRecovering) {
      return `${periodLabel}간 ${changePercent.toFixed(1)}% 하락했지만, 최근 반등 중이에요 🔄`
    }
    return `${periodLabel}간 ${changePercent.toFixed(1)}% 하락했어요. 조정 구간일 수 있어요 📉`
  }
  
  // -5% 미만 (급락)
  if (isRecovering) {
    return `${periodLabel}간 ${changePercent.toFixed(1)}% 하락 후 반등 시도 중이에요 💪`
  }
  return `${periodLabel}간 ${changePercent.toFixed(1)}% 급락! 신중한 접근이 필요해요 ⚠️`
}

// 타입 정의
export type Stock = typeof trendingStocks[0]
export type BriefingHistoryItem = typeof briefingHistory[0]
export type BriefingDetail = typeof briefingDetail


