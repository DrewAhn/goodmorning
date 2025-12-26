// API 클라이언트 유틸리티

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// 백엔드 API 응답 타입 (실제 백엔드 형식)
export interface BackendStock {
  symbol: string
  name: string
  price: number
  change: number
  change_percent: number
  volume: number
  market_cap: number
}

export interface BackendTrendingResponse {
  trending: BackendStock[]
  most_actives: BackendStock[]
  day_gainers: BackendStock[]
  source: string
  error: string | null
}

// 프론트엔드에서 사용하는 타입
export interface TrendingStock {
  rank: number
  ticker: string
  name: string
  current_price: number
  change_amount: number
  change_percent: number
  volume: number
  market_cap: number
  pe_ratio: number | null
  selection_reason: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  highlight: string
  beginner_note: string
}

export interface StockDetail {
  ticker: string
  name: string
  current_price: number
  change_amount: number
  change_percent: number
  volume: number
  market_cap: number
  pe_ratio: number | null
  fifty_two_week_high: number | null
  fifty_two_week_low: number | null
}

export interface MarketOverview {
  nasdaq: { value: number; changePercent: number }
  sp500: { value: number; changePercent: number }
  dow: { value: number; changePercent: number }
}

// API 에러 클래스
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 화제 종목 목록 가져오기
export async function getTrendingStocks(count: number = 5): Promise<TrendingStock[]> {
  try {
    // 백엔드 API 경로: /stocks/trending
    const response = await fetch(`${API_BASE_URL}/stocks/trending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // 항상 최신 데이터 가져오기
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.detail || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      )
    }

    const data: BackendTrendingResponse = await response.json()

    if (data.error) {
      throw new ApiError(data.error)
    }

    // trending, most_actives, day_gainers를 합쳐서 상위 종목 추출
    const allStocks: BackendStock[] = [
      ...data.trending,
      ...data.most_actives,
      ...data.day_gainers,
    ]

    // 중복 제거 (symbol 기준)
    const uniqueStocks = allStocks.reduce((acc: BackendStock[], stock) => {
      if (!acc.find(s => s.symbol === stock.symbol)) {
        acc.push(stock)
      }
      return acc
    }, [])

    // 변동률 기준 정렬 후 count 개수만큼 반환
    const sortedStocks = uniqueStocks
      .sort((a, b) => Math.abs(b.change_percent) - Math.abs(a.change_percent))
      .slice(0, count)

    // 백엔드 형식을 프론트엔드 형식으로 변환
    return sortedStocks.map((stock, index) => ({
      rank: index + 1,
      ticker: stock.symbol,
      name: stock.name,
      current_price: stock.price,
      change_amount: stock.change,
      change_percent: stock.change_percent,
      volume: stock.volume,
      market_cap: stock.market_cap || 0,
      pe_ratio: null,
      selection_reason: stock.change_percent > 5 ? '급등주' : stock.change_percent < -5 ? '급락주' : '거래량 상위',
      confidence: Math.abs(stock.change_percent) > 10 ? 'HIGH' : Math.abs(stock.change_percent) > 5 ? 'MEDIUM' : 'LOW' as const,
      highlight: stock.change_percent > 0
        ? `🔥 ${stock.change_percent.toFixed(1)}% 상승으로 주목`
        : stock.change_percent < 0
        ? `⚠️ ${Math.abs(stock.change_percent).toFixed(1)}% 하락으로 주목`
        : '📊 높은 거래량으로 주목',
      beginner_note: `${stock.name}은(는) 현재 시장에서 높은 관심을 받고 있는 종목입니다.`,
    }))
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      `화제 종목 데이터를 가져오는데 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      undefined,
      error
    )
  }
}

// 종목 상세 정보 가져오기
export async function getStockDetail(ticker: string): Promise<StockDetail> {
  try {
    // 백엔드 API 경로: /stocks/{symbol}
    const response = await fetch(`${API_BASE_URL}/stocks/${ticker}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.detail || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      `종목 상세 정보를 가져오는데 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      undefined,
      error
    )
  }
}

// 목업 데이터를 실제 API 데이터 형식으로 변환하는 헬퍼 함수
export function convertApiToMockFormat(apiStock: TrendingStock) {
  return {
    rank: apiStock.rank,
    symbol: apiStock.ticker,
    name: apiStock.name,
    price: apiStock.current_price,
    change: apiStock.change_amount,
    changePercent: apiStock.change_percent,
    volume: apiStock.volume,
    marketCap: apiStock.market_cap,
    peRatio: apiStock.pe_ratio || 0,
    selectionReason: apiStock.selection_reason,
    confidence: apiStock.confidence,
    highlight: apiStock.highlight,
    beginnerNote: apiStock.beginner_note,
  }
}
