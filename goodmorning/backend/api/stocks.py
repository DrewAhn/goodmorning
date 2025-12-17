"""
주식 관련 API 라우터
"""
from fastapi import APIRouter, HTTPException

from services.stock_service import StockService
from models.stock import TrendingStocksResponse, StockDetailResponse

router = APIRouter()
stock_service = StockService()


@router.get("/trending", response_model=TrendingStocksResponse)
async def get_trending_stocks():
    """
    화제 종목 목록 조회
    - most_actives: 거래량 상위 종목
    - day_gainers: 상승률 상위 종목
    """
    try:
        data = stock_service.get_trending_stocks()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}", response_model=StockDetailResponse)
async def get_stock_detail(symbol: str):
    """
    종목 상세 정보 조회
    """
    try:
        data = stock_service.get_stock_detail(symbol.upper())
        if not data:
            raise HTTPException(status_code=404, detail=f"종목 {symbol}을(를) 찾을 수 없습니다.")
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

