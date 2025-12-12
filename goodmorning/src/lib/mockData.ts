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

// 타입 정의
export type Stock = typeof trendingStocks[0]
export type BriefingHistoryItem = typeof briefingHistory[0]
export type BriefingDetail = typeof briefingDetail


