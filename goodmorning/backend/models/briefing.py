"""
브리핑 관련 Pydantic 모델
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BriefingCreateRequest(BaseModel):
    """브리핑 생성 요청"""
    include_chart: bool = True
    include_news: bool = True


class BriefingResponse(BaseModel):
    """브리핑 응답"""
    id: str
    created_at: str
    status: str
    message: Optional[str] = None


class BriefingStock(BaseModel):
    """브리핑 내 종목 정보"""
    symbol: str
    name: str
    price: float
    change_percent: float
    summary: Optional[str] = None


class BriefingDetail(BaseModel):
    """브리핑 상세"""
    id: str
    created_at: str
    title: str
    subtitle: Optional[str] = None
    stocks: List[BriefingStock]
    market_summary: Optional[str] = None
    text_version: Optional[str] = None

