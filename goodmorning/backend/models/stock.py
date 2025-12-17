"""
주식 관련 Pydantic 모델
"""
from pydantic import BaseModel
from typing import Optional, List


class StockBase(BaseModel):
    """주식 기본 정보"""
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    volume: int
    market_cap: Optional[int] = None


class StockDetail(StockBase):
    """주식 상세 정보"""
    long_name: Optional[str] = None
    pe_ratio: Optional[float] = None
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None
    sector: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    source: str = "yahooquery"


class TrendingStocksResponse(BaseModel):
    """화제 종목 응답"""
    trending: List[StockBase]
    most_actives: List[StockBase]
    day_gainers: List[StockBase]
    source: str = "yahooquery"
    error: Optional[str] = None


class StockDetailResponse(StockDetail):
    """종목 상세 응답"""
    pass

