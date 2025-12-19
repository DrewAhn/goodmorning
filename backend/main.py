"""
굿모닝 월가 - FastAPI 메인 애플리케이션

미국 주식 화제 종목 및 뉴스 조회 API
"""

from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import logging
import os

from models.stock_models import (
    ScreenerType,
    TrendingStockResponse,
    StockInfoResponse,
    ErrorResponse,
)
from services.trending_stock_service import TrendingStockService
from services.news_service import NewsService

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI 앱 초기화
app = FastAPI(
    title="굿모닝 월가 API",
    description="미국 주식 화제 종목 및 뉴스 조회 API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS 설정 (프론트엔드 연동을 위해)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js 개발 서버
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)


# 서비스 초기화
trending_service = TrendingStockService()

# NewsService는 API 키가 필요하므로 필요시에만 초기화
def get_news_service() -> Optional[NewsService]:
    """NewsService 인스턴스 반환 (API 키가 있을 때만)"""
    try:
        return NewsService()
    except (ImportError, ValueError) as e:
        logger.warning(f"NewsService를 초기화할 수 없습니다: {e}")
        return None


@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "굿모닝 월가 API",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


@app.get("/api/health")
async def health_check():
    """헬스 체크"""
    return {
        "status": "healthy",
        "services": {
            "trending_stock": "available",
            "news": "available" if os.getenv("EXA_API_KEY") else "unavailable (API key required)"
        }
    }


@app.get(
    "/api/stocks/trending",
    response_model=TrendingStockResponse,
    responses={
        200: {"description": "화제 종목 조회 성공"},
        400: {"model": ErrorResponse, "description": "잘못된 요청"},
        500: {"model": ErrorResponse, "description": "서버 오류"}
    },
    summary="화제 종목 조회",
    description="스크리너 타입별 화제 종목 TOP 1을 조회합니다."
)
async def get_trending_stock(
    type: ScreenerType = Query(
        ScreenerType.MOST_ACTIVES,
        description="스크리너 타입 (most_actives, day_gainers, day_losers)"
    ),
    include_news: bool = Query(
        True,
        description="관련 뉴스 포함 여부"
    ),
    news_count: int = Query(
        5,
        ge=1,
        le=20,
        description="뉴스 개수 (1-20)"
    ),
    news_hours: int = Query(
        24,
        ge=1,
        le=168,
        description="뉴스 검색 시간 범위 (시간, 1-168)"
    )
):
    """
    화제 종목 조회 API

    **스크리너 타입:**
    - `most_actives`: 거래량 최다 종목
    - `day_gainers`: 일일 상승률 최고 종목
    - `day_losers`: 일일 하락률 최고 종목

    **응답:**
    - 종목 기본 정보 (심볼, 이름, 가격, 변동률 등)
    - 종목 상세 정보 (price, summary_detail, financial_data)
    - 관련 뉴스 (선택)
    """
    try:
        logger.info(f"화제 종목 조회 요청 - 타입: {type.value}")

        # 화제 종목 조회
        result = trending_service.get_trending_stock(type.value)

        # 에러 체크
        if "error" in result:
            raise HTTPException(
                status_code=400,
                detail=result["error"]
            )

        # 종목 심볼 확인
        symbol = result.get("symbol")
        if not symbol:
            raise HTTPException(
                status_code=404,
                detail="종목을 찾을 수 없습니다."
            )

        # 뉴스 조회 (선택)
        news_result = None
        if include_news:
            news_service = get_news_service()
            if news_service:
                try:
                    news_result = news_service.search_stock_news(
                        symbol,
                        hours=news_hours,
                        num_results=news_count
                    )
                except Exception as e:
                    logger.error(f"뉴스 조회 중 오류: {e}")
                    # 뉴스 조회 실패는 전체 요청을 실패시키지 않음
                    news_result = None

        # 응답 구성
        response = TrendingStockResponse(
            symbol=symbol,
            screener_type=type.value,
            basic_info=result.get("basic_info"),
            detail_info=result.get("detail_info"),
            news=news_result
        )

        logger.info(f"화제 종목 조회 완료 - 종목: {symbol}")
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"화제 종목 조회 중 오류: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"서버 오류가 발생했습니다: {str(e)}"
        )


@app.get(
    "/api/stocks/{ticker}",
    response_model=StockInfoResponse,
    responses={
        200: {"description": "종목 상세 정보 조회 성공"},
        404: {"model": ErrorResponse, "description": "종목을 찾을 수 없음"},
        500: {"model": ErrorResponse, "description": "서버 오류"}
    },
    summary="종목 상세 정보 조회",
    description="특정 종목의 상세 정보와 관련 뉴스를 조회합니다."
)
async def get_stock_info(
    ticker: str = Path(
        ...,
        description="종목 심볼 (예: AAPL, MSFT, GOOGL)",
        min_length=1,
        max_length=10,
        pattern="^[A-Z]+$"
    ),
    include_news: bool = Query(
        True,
        description="관련 뉴스 포함 여부"
    ),
    news_count: int = Query(
        10,
        ge=1,
        le=20,
        description="뉴스 개수 (1-20)"
    ),
    news_hours: int = Query(
        48,
        ge=1,
        le=168,
        description="뉴스 검색 시간 범위 (시간, 1-168)"
    )
):
    """
    종목 상세 정보 조회 API

    **파라미터:**
    - `ticker`: 종목 심볼 (대문자, 1-10자)
    - `include_news`: 뉴스 포함 여부 (기본: true)
    - `news_count`: 뉴스 개수 (기본: 10)
    - `news_hours`: 뉴스 검색 시간 범위 (기본: 48시간)

    **응답:**
    - 종목 기본 정보
    - 종목 상세 정보
    - 관련 뉴스 (선택)
    """
    try:
        logger.info(f"종목 상세 정보 조회 요청 - 종목: {ticker}")

        # Ticker 객체로 종목 정보 조회
        from yahooquery import Ticker

        stock = Ticker(ticker)

        # 기본 정보 조회 (price 모듈 사용)
        price_data = stock.price

        # 에러 체크
        if isinstance(price_data, dict) and ticker in price_data:
            price_info = price_data[ticker]

            # 에러 응답 체크
            if isinstance(price_info, str) or (isinstance(price_info, dict) and "error" in price_info):
                raise HTTPException(
                    status_code=404,
                    detail=f"종목 '{ticker}'를 찾을 수 없습니다."
                )

            # 기본 정보 추출
            basic_info = {
                "symbol": ticker,
                "shortName": price_info.get("shortName"),
                "longName": price_info.get("longName"),
                "regularMarketPrice": price_info.get("regularMarketPrice"),
                "regularMarketChange": price_info.get("regularMarketChange"),
                "regularMarketChangePercent": price_info.get("regularMarketChangePercent"),
                "regularMarketVolume": price_info.get("regularMarketVolume"),
                "marketCap": price_info.get("marketCap"),
            }
        else:
            raise HTTPException(
                status_code=404,
                detail=f"종목 '{ticker}'를 찾을 수 없습니다."
            )

        # 상세 정보 조회
        detail_info = {
            "price": price_info,
            "summary_detail": stock.summary_detail.get(ticker) if hasattr(stock, 'summary_detail') else None,
            "financial_data": stock.financial_data.get(ticker) if hasattr(stock, 'financial_data') else None,
        }

        # 뉴스 조회 (선택)
        news_result = None
        if include_news:
            news_service = get_news_service()
            if news_service:
                try:
                    news_result = news_service.search_stock_news(
                        ticker,
                        hours=news_hours,
                        num_results=news_count
                    )
                except Exception as e:
                    logger.error(f"뉴스 조회 중 오류: {e}")
                    news_result = None

        # 응답 구성
        response = StockInfoResponse(
            symbol=ticker,
            basic_info=basic_info,
            detail_info=detail_info,
            news=news_result
        )

        logger.info(f"종목 상세 정보 조회 완료 - 종목: {ticker}")
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"종목 상세 정보 조회 중 오류: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"서버 오류가 발생했습니다: {str(e)}"
        )


@app.get(
    "/api/stocks/trending/list",
    summary="화제 종목 TOP 5 목록 조회",
    description="가장 활발한 거래량 종목 TOP 5를 조회합니다."
)
async def get_trending_stocks_list(
    screener_type: ScreenerType = Query(
        ScreenerType.MOST_ACTIVES,
        description="스크리너 타입 (most_actives, day_gainers, day_losers)"
    ),
    count: int = Query(
        5,
        ge=1,
        le=25,
        description="조회할 종목 수 (1-25)"
    )
):
    """
    화제 종목 TOP N 목록 조회 API

    프론트엔드 대시보드에 표시할 화제 종목 목록을 조회합니다.
    각 종목의 기본 정보와 순위를 포함합니다.
    """
    try:
        logger.info(f"화제 종목 목록 조회 요청 - 타입: {screener_type.value}, 개수: {count}")

        # 스크리너로 종목 목록 조회
        from yahooquery import Screener
        screener = Screener()
        screener_data = screener.get_screeners([screener_type.value], count)

        if screener_type.value not in screener_data:
            raise HTTPException(
                status_code=404,
                detail="종목을 찾을 수 없습니다."
            )

        quotes = screener_data[screener_type.value].get('quotes', [])

        if not quotes:
            raise HTTPException(
                status_code=404,
                detail="종목을 찾을 수 없습니다."
            )

        # 응답 데이터 구성
        trending_stocks = []
        for idx, quote in enumerate(quotes[:count], start=1):
            stock_data = {
                "rank": idx,
                "ticker": quote.get("symbol", ""),
                "name": quote.get("shortName") or quote.get("longName", ""),
                "current_price": quote.get("regularMarketPrice", 0),
                "change_amount": quote.get("regularMarketChange", 0),
                "change_percent": quote.get("regularMarketChangePercent", 0),
                "volume": quote.get("regularMarketVolume", 0),
                "market_cap": quote.get("marketCap", 0),
                "pe_ratio": quote.get("trailingPE"),
                "selection_reason": _get_selection_reason(screener_type.value, idx),
                "confidence": _get_confidence_level(idx),
                "highlight": _generate_highlight(quote, screener_type.value),
                "beginner_note": _generate_beginner_note(quote),
            }
            trending_stocks.append(stock_data)

        logger.info(f"화제 종목 목록 조회 완료 - {len(trending_stocks)}개 종목")
        return trending_stocks

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"화제 종목 목록 조회 중 오류: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"서버 오류가 발생했습니다: {str(e)}"
        )


def _get_selection_reason(screener_type: str, rank: int) -> str:
    """선정 이유 생성"""
    if screener_type == "most_actives":
        if rank == 1:
            return "거래량 상위 + 주목도 최고"
        return "거래량 상위"
    elif screener_type == "day_gainers":
        return "거래량 상위 + 상승 종목"
    elif screener_type == "day_losers":
        return "거래량 상위 + 하락 종목"
    return "거래량 상위"


def _get_confidence_level(rank: int) -> str:
    """신뢰도 레벨 생성"""
    if rank == 1:
        return "HIGH"
    elif rank <= 3:
        return "MEDIUM"
    else:
        return "LOW"


def _generate_highlight(quote: dict, screener_type: str) -> str:
    """하이라이트 메시지 생성"""
    change_percent = quote.get("regularMarketChangePercent", 0)

    if screener_type == "day_gainers":
        return f"📈 {abs(change_percent):.1f}% 상승으로 주목"
    elif screener_type == "day_losers":
        return f"📉 {abs(change_percent):.1f}% 하락으로 주목"
    else:
        if change_percent > 0:
            return f"🔥 거래량 증가와 함께 {change_percent:.1f}% 상승"
        elif change_percent < 0:
            return f"⚠️ 거래량 증가와 함께 {abs(change_percent):.1f}% 하락"
        else:
            return "📊 높은 거래량으로 주목"


def _generate_beginner_note(quote: dict) -> str:
    """초보자 해설 생성"""
    name = quote.get("shortName") or quote.get("longName", "이 종목")
    return f"{name}은(는) 현재 시장에서 높은 관심을 받고 있는 종목입니다."


@app.get(
    "/api/stocks/trending/all",
    summary="모든 스크리너 화제 종목 조회",
    description="모든 스크리너 타입의 화제 종목을 한 번에 조회합니다."
)
async def get_all_trending_stocks(
    include_news: bool = Query(
        False,
        description="관련 뉴스 포함 여부"
    )
):
    """
    모든 스크리너의 화제 종목 조회 API

    most_actives, day_gainers, day_losers의 TOP 1 종목을 모두 조회합니다.
    """
    try:
        logger.info("모든 스크리너 화제 종목 조회 요청")

        results = trending_service.get_multiple_trending_stocks()

        # 뉴스 조회 (선택)
        if include_news:
            news_service = get_news_service()
            if news_service:
                for screener_type, result in results.items():
                    symbol = result.get("symbol")
                    if symbol:
                        try:
                            news_result = news_service.search_stock_news(symbol, hours=24, num_results=3)
                            result["news"] = news_result
                        except Exception as e:
                            logger.error(f"뉴스 조회 중 오류 ({symbol}): {e}")

        logger.info("모든 스크리너 화제 종목 조회 완료")
        return results

    except Exception as e:
        logger.error(f"모든 스크리너 조회 중 오류: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"서버 오류가 발생했습니다: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    # 개발 서버 실행
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
