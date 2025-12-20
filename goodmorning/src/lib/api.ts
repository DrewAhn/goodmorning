// API 클라이언트 유틸리티

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// API 응답 타입 정의
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
    const response = await fetch(`${API_BASE_URL}/api/stocks/trending/list?count=${count}`, {
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

    const data = await response.json()

    // 백엔드는 배열을 직접 반환함
    const trendingList = Array.isArray(data) ? data : []

    // API 응답 형식을 TrendingStock 형식으로 변환
    return trendingList.map((stock: any) => ({
      rank: stock.rank,
      ticker: stock.ticker,
      name: stock.name,
      current_price: stock.current_price,
      change_amount: stock.change_amount,
      change_percent: stock.change_percent,
      volume: stock.volume,
      market_cap: stock.market_cap || 0,
      pe_ratio: stock.pe_ratio || null,
      selection_reason: stock.selection_reason || '거래량 상위',
      confidence: stock.confidence || 'MEDIUM',
      highlight: stock.highlight || (stock.change_percent > 0
        ? `🔥 ${stock.change_percent.toFixed(1)}% 상승으로 주목`
        : stock.change_percent < 0
        ? `⚠️ ${Math.abs(stock.change_percent).toFixed(1)}% 하락으로 주목`
        : '📊 높은 거래량으로 주목'),
      beginner_note: stock.beginner_note || `${stock.name}은(는) 현재 시장에서 높은 관심을 받고 있는 종목입니다.`,
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
    const response = await fetch(`${API_BASE_URL}/api/stocks/${ticker}`, {
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
