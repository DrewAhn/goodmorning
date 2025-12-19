"""
주식 관련 Pydantic 모델

API 요청/응답에 사용되는 데이터 모델 정의
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class ScreenerType(str, Enum):
    """스크리너 타입"""
    MOST_ACTIVES = "most_actives"
    DAY_GAINERS = "day_gainers"
    DAY_LOSERS = "day_losers"


class NewsItem(BaseModel):
    """뉴스 아이템"""
    title: Optional[str] = Field(None, description="뉴스 제목")
    url: Optional[str] = Field(None, description="뉴스 URL")
    published_date: Optional[str] = Field(None, description="발행일")
    author: Optional[str] = Field(None, description="작성자")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Apple announces new iPhone",
                "url": "https://example.com/news/apple-iphone",
                "published_date": "2025-12-19",
                "author": "John Doe"
            }
        }


class StockBasicInfo(BaseModel):
    """종목 기본 정보"""
    symbol: str = Field(..., description="종목 심볼")
    shortName: Optional[str] = Field(None, description="종목 단축명")
    longName: Optional[str] = Field(None, description="종목 전체명")
    regularMarketPrice: Optional[float] = Field(None, description="현재가")
    regularMarketChange: Optional[float] = Field(None, description="전일 대비 변동")
    regularMarketChangePercent: Optional[float] = Field(None, description="전일 대비 변동률(%)")
    regularMarketVolume: Optional[int] = Field(None, description="거래량")
    marketCap: Optional[int] = Field(None, description="시가총액")

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "AAPL",
                "shortName": "Apple Inc.",
                "longName": "Apple Inc.",
                "regularMarketPrice": 150.25,
                "regularMarketChange": 2.50,
                "regularMarketChangePercent": 1.69,
                "regularMarketVolume": 50000000,
                "marketCap": 2500000000000
            }
        }


class StockDetailInfo(BaseModel):
    """종목 상세 정보"""
    price: Optional[Dict[str, Any]] = Field(None, description="가격 정보")
    summary_detail: Optional[Dict[str, Any]] = Field(None, description="요약 정보")
    financial_data: Optional[Dict[str, Any]] = Field(None, description="재무 데이터")


class NewsSearchResult(BaseModel):
    """뉴스 검색 결과"""
    ticker: Optional[str] = Field(None, description="종목 심볼")
    query: str = Field(..., description="검색 쿼리")
    total_results: int = Field(..., description="검색된 뉴스 개수")
    news: List[NewsItem] = Field(default_factory=list, description="뉴스 리스트")
    search_period: Optional[Dict[str, Any]] = Field(None, description="검색 기간")
    error: Optional[str] = Field(None, description="에러 메시지")


class TrendingStockResponse(BaseModel):
    """화제 종목 조회 응답"""
    symbol: Optional[str] = Field(None, description="종목 심볼")
    screener_type: str = Field(..., description="스크리너 타입")
    basic_info: Optional[StockBasicInfo] = Field(None, description="기본 정보")
    detail_info: Optional[StockDetailInfo] = Field(None, description="상세 정보")
    news: Optional[NewsSearchResult] = Field(None, description="관련 뉴스")
    error: Optional[str] = Field(None, description="에러 메시지")

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "AAPL",
                "screener_type": "most_actives",
                "basic_info": {
                    "symbol": "AAPL",
                    "shortName": "Apple Inc.",
                    "regularMarketPrice": 150.25,
                    "regularMarketChangePercent": 1.69
                },
                "news": {
                    "total_results": 5,
                    "news": [
                        {
                            "title": "Apple announces new product",
                            "url": "https://example.com/news"
                        }
                    ]
                }
            }
        }


class StockInfoResponse(BaseModel):
    """종목 상세 정보 응답"""
    symbol: str = Field(..., description="종목 심볼")
    basic_info: Optional[StockBasicInfo] = Field(None, description="기본 정보")
    detail_info: Optional[StockDetailInfo] = Field(None, description="상세 정보")
    news: Optional[NewsSearchResult] = Field(None, description="관련 뉴스")
    error: Optional[str] = Field(None, description="에러 메시지")


class ErrorResponse(BaseModel):
    """에러 응답"""
    detail: str = Field(..., description="에러 상세 메시지")
    error_code: Optional[str] = Field(None, description="에러 코드")

    class Config:
        json_schema_extra = {
            "example": {
                "detail": "종목을 찾을 수 없습니다.",
                "error_code": "STOCK_NOT_FOUND"
            }
        }
