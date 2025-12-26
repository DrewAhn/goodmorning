"""
화제 종목 수집 서비스

yahooquery의 Screener를 사용하여 화제 종목을 수집하고,
TOP 1 종목의 상세 정보를 조회하는 서비스
"""

from typing import Dict, Any, Optional, Literal
from yahooquery import Screener, Ticker

from .utils import (
    LoggerFactory,
    StockConstants,
    StockDataFormatter,
    ErrorResponseBuilder
)

# 로깅 설정
logger = LoggerFactory.get_logger(__name__)


class TrendingStockService:
    """화제 종목 수집 및 상세 정보 조회 서비스"""

    # 사용 가능한 스크리너 타입
    SCREENER_TYPES = Literal["most_actives", "day_gainers", "day_losers"]

    def __init__(self):
        """TrendingStockService 초기화"""
        self.screener = Screener()

    def get_trending_stock(
        self,
        screener_type: str = "most_actives",
        count: int = 1
    ) -> Dict[str, Any]:
        """
        화제 종목 TOP 1 조회

        Args:
            screener_type: 스크리너 타입 (most_actives, day_gainers, day_losers)
            count: 조회할 종목 수 (기본값: 1)

        Returns:
            Dict: 화제 종목 정보
                - symbol: 종목 심볼
                - screener_type: 스크리너 타입
                - basic_info: 기본 정보 (심볼, 이름, 가격, 변동률 등)
                - detail_info: 상세 정보 (price, summary_detail, financial_data)
                - error: 에러 메시지 (에러 발생 시)

        Raises:
            ValueError: 유효하지 않은 screener_type
        """
        try:
            self._validate_screener_type(screener_type)
            logger.info(f"화제 종목 조회 시작 - 스크리너: {screener_type}, 개수: {count}")

            screener_data = self._fetch_screener_data(screener_type, count)
            top_stock = self._extract_top_stock(screener_data, screener_type)

            if not top_stock:
                return ErrorResponseBuilder.build_stock_error_response(
                    screener_type,
                    "종목을 찾지 못했습니다."
                )

            symbol = top_stock.get('symbol')
            if not symbol:
                logger.error("종목 심볼을 찾을 수 없습니다.")
                return ErrorResponseBuilder.build_stock_error_response(
                    screener_type,
                    "종목 심볼을 찾을 수 없습니다."
                )

            logger.info(f"TOP 1 종목 선정: {symbol}")

            return self._build_stock_response(top_stock, screener_type)

        except ValueError as e:
            logger.error(f"입력 값 오류: {e}")
            return ErrorResponseBuilder.build_stock_error_response(
                screener_type,
                str(e)
            )
        except Exception as e:
            logger.error(f"화제 종목 조회 중 오류 발생: {e}", exc_info=True)
            return ErrorResponseBuilder.build_stock_error_response(
                screener_type,
                f"종목 조회 중 오류가 발생했습니다: {str(e)}"
            )

    def _validate_screener_type(self, screener_type: str) -> None:
        """
        스크리너 타입 검증

        Args:
            screener_type: 검증할 스크리너 타입

        Raises:
            ValueError: 유효하지 않은 스크리너 타입
        """
        available_screeners = self.screener.available_screeners
        if screener_type not in available_screeners:
            raise ValueError(
                f"유효하지 않은 스크리너 타입: {screener_type}. "
                f"사용 가능한 타입: {', '.join(StockConstants.SCREENER_TYPES)}"
            )

    def _fetch_screener_data(self, screener_type: str, count: int) -> Dict[str, Any]:
        """
        스크리너 데이터 조회

        Args:
            screener_type: 스크리너 타입
            count: 조회할 종목 수

        Returns:
            Dict: 스크리너 데이터

        Raises:
            ValueError: 응답 형식이 올바르지 않은 경우
        """
        screener_data = self.screener.get_screeners([screener_type], count)

        if not isinstance(screener_data, dict):
            raise ValueError(f"예상하지 못한 응답 타입: {type(screener_data)}")

        return screener_data

    def _extract_top_stock(
        self,
        screener_data: Dict[str, Any],
        screener_type: str
    ) -> Optional[Dict[str, Any]]:
        """
        스크리너 데이터에서 TOP 1 종목 추출

        Args:
            screener_data: 스크리너 응답 데이터
            screener_type: 스크리너 타입

        Returns:
            Dict: TOP 1 종목 데이터 또는 None
        """
        if screener_type not in screener_data:
            logger.warning(f"스크리너 '{screener_type}' 데이터를 찾지 못했습니다.")
            return None

        screener_result = screener_data[screener_type]
        quotes = screener_result.get('quotes', [])

        if not quotes:
            logger.warning(f"스크리너 '{screener_type}'에서 종목을 찾지 못했습니다.")
            return None

        return quotes[0]

    def _build_stock_response(
        self,
        top_stock: Dict[str, Any],
        screener_type: str
    ) -> Dict[str, Any]:
        """
        주식 정보 응답 생성

        Args:
            top_stock: TOP 1 종목 데이터
            screener_type: 스크리너 타입

        Returns:
            Dict: 완전한 주식 정보 응답
        """
        symbol = top_stock.get('symbol')

        # 기본 정보 포맷팅
        basic_info = self._format_basic_info(top_stock)

        # 상세 정보 조회
        detail_info = self._get_stock_detail(symbol)

        logger.info(f"화제 종목 조회 완료: {symbol}")

        return {
            "symbol": symbol,
            "screener_type": screener_type,
            "basic_info": basic_info,
            "detail_info": detail_info,
        }

    def _format_basic_info(self, stock: Dict[str, Any]) -> Dict[str, Any]:
        """
        주식 기본 정보 포맷팅

        Args:
            stock: 원본 주식 데이터

        Returns:
            Dict: 포맷팅된 기본 정보
        """
        return {
            "symbol": stock.get('symbol'),
            "shortName": stock.get('shortName', StockConstants.DEFAULT_VALUE_STRING),
            "longName": stock.get('longName', StockConstants.DEFAULT_VALUE_STRING),
            "regularMarketPrice": stock.get('regularMarketPrice'),
            "regularMarketChange": stock.get('regularMarketChange'),
            "regularMarketChangePercent": stock.get('regularMarketChangePercent'),
            "regularMarketVolume": stock.get('regularMarketVolume'),
            "marketCap": stock.get('marketCap'),
        }

    def _get_stock_detail(self, symbol: str) -> Dict[str, Any]:
        """
        종목 상세 정보 조회 (Ticker 사용)

        Args:
            symbol: 종목 심볼

        Returns:
            Dict: 종목 상세 정보
                - price: 가격 정보
                - summary_detail: 요약 정보
                - financial_data: 재무 데이터
                - error: 에러 메시지 (에러 발생 시)
        """
        try:
            logger.info(f"종목 상세 정보 조회: {symbol}")

            ticker = Ticker(symbol)

            # 주요 모듈 조회
            detail = {
                "price": self._safe_get_module(ticker, 'price', symbol),
                "summary_detail": self._safe_get_module(ticker, 'summary_detail', symbol),
                "financial_data": self._safe_get_module(ticker, 'financial_data', symbol),
            }

            return detail

        except Exception as e:
            logger.error(f"종목 상세 정보 조회 중 오류 발생 ({symbol}): {e}", exc_info=True)
            return {
                "error": f"상세 정보 조회 중 오류가 발생했습니다: {str(e)}"
            }

    def _safe_get_module(
        self,
        ticker: Ticker,
        module_name: str,
        symbol: str
    ) -> Optional[Dict[str, Any]]:
        """
        안전하게 Ticker 모듈 조회 (에러 처리 포함)

        Args:
            ticker: Ticker 인스턴스
            module_name: 모듈 이름
            symbol: 종목 심볼

        Returns:
            Dict: 모듈 데이터 또는 None
        """
        try:
            data = getattr(ticker, module_name)

            # 에러 응답 체크
            if isinstance(data, dict) and symbol in data:
                return data[symbol]
            elif isinstance(data, dict):
                return data
            else:
                return None

        except Exception as e:
            logger.warning(f"모듈 '{module_name}' 조회 실패 ({symbol}): {e}")
            return None

    def get_multiple_trending_stocks(
        self,
        screener_types: list = None,
        count_per_screener: int = 1
    ) -> Dict[str, Any]:
        """
        여러 스크리너에서 화제 종목 조회

        Args:
            screener_types: 스크리너 타입 리스트 (기본값: ['most_actives', 'day_gainers', 'day_losers'])
            count_per_screener: 스크리너당 조회할 종목 수

        Returns:
            Dict: 스크리너 타입별 화제 종목 정보
        """
        if screener_types is None:
            screener_types = StockConstants.SCREENER_TYPES

        results = {}

        for screener_type in screener_types:
            try:
                result = self.get_trending_stock(screener_type, count_per_screener)
                results[screener_type] = result
            except Exception as e:
                logger.error(f"스크리너 '{screener_type}' 조회 중 오류: {e}", exc_info=True)
                results[screener_type] = ErrorResponseBuilder.build_stock_error_response(
                    screener_type,
                    str(e)
                )

        return results


# 편의 함수
def get_trending_stock(
    screener_type: str = "most_actives"
) -> Dict[str, Any]:
    """
    화제 종목 TOP 1 조회 (편의 함수)

    Args:
        screener_type: 스크리너 타입

    Returns:
        Dict: 화제 종목 정보
    """
    service = TrendingStockService()
    return service.get_trending_stock(screener_type)


def get_all_trending_stocks() -> Dict[str, Any]:
    """
    모든 스크리너에서 화제 종목 조회 (편의 함수)

    Returns:
        Dict: 스크리너 타입별 화제 종목 정보
    """
    service = TrendingStockService()
    return service.get_multiple_trending_stocks()
