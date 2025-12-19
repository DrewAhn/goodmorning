"""
화제 종목 수집 서비스

yahooquery의 Screener를 사용하여 화제 종목을 수집하고,
TOP 1 종목의 상세 정보를 조회하는 서비스
"""

from typing import Dict, Any, Optional, Literal
from yahooquery import Screener, Ticker
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
            # 스크리너 타입 검증
            available_screeners = self.screener.available_screeners
            if screener_type not in available_screeners:
                raise ValueError(
                    f"유효하지 않은 스크리너 타입: {screener_type}. "
                    f"사용 가능한 타입: most_actives, day_gainers, day_losers"
                )

            logger.info(f"화제 종목 조회 시작 - 스크리너: {screener_type}, 개수: {count}")

            # 스크리너로 종목 조회 (dict 반환)
            screener_data = self.screener.get_screeners([screener_type], count)

            # 응답 검증
            if not isinstance(screener_data, dict):
                logger.error(f"예상하지 못한 응답 타입: {type(screener_data)}")
                return {
                    "symbol": None,
                    "screener_type": screener_type,
                    "error": "스크리너 응답 형식이 올바르지 않습니다."
                }

            # 스크리너 데이터 추출
            if screener_type not in screener_data:
                logger.warning(f"스크리너 '{screener_type}' 데이터를 찾지 못했습니다.")
                return {
                    "symbol": None,
                    "screener_type": screener_type,
                    "error": "종목을 찾지 못했습니다."
                }

            screener_result = screener_data[screener_type]
            quotes = screener_result.get('quotes', [])

            if not quotes:
                logger.warning(f"스크리너 '{screener_type}'에서 종목을 찾지 못했습니다.")
                return {
                    "symbol": None,
                    "screener_type": screener_type,
                    "error": "종목을 찾지 못했습니다."
                }

            # TOP 1 종목 추출
            top_stock = quotes[0]
            symbol = top_stock.get('symbol')

            if not symbol:
                logger.error("종목 심볼을 찾을 수 없습니다.")
                return {
                    "symbol": None,
                    "screener_type": screener_type,
                    "error": "종목 심볼을 찾을 수 없습니다."
                }

            logger.info(f"TOP 1 종목 선정: {symbol}")

            # 기본 정보 추출
            basic_info = {
                "symbol": symbol,
                "shortName": top_stock.get('shortName', 'N/A'),
                "longName": top_stock.get('longName', 'N/A'),
                "regularMarketPrice": top_stock.get('regularMarketPrice'),
                "regularMarketChange": top_stock.get('regularMarketChange'),
                "regularMarketChangePercent": top_stock.get('regularMarketChangePercent'),
                "regularMarketVolume": top_stock.get('regularMarketVolume'),
                "marketCap": top_stock.get('marketCap'),
            }

            # 상세 정보 조회
            detail_info = self._get_stock_detail(symbol)

            result = {
                "symbol": symbol,
                "screener_type": screener_type,
                "basic_info": basic_info,
                "detail_info": detail_info,
            }

            logger.info(f"화제 종목 조회 완료: {symbol}")
            return result

        except ValueError as e:
            logger.error(f"입력 값 오류: {e}")
            return {
                "symbol": None,
                "screener_type": screener_type,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"화제 종목 조회 중 오류 발생: {e}")
            return {
                "symbol": None,
                "screener_type": screener_type,
                "error": f"종목 조회 중 오류가 발생했습니다: {str(e)}"
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
            logger.error(f"종목 상세 정보 조회 중 오류 발생 ({symbol}): {e}")
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
            screener_types = ["most_actives", "day_gainers", "day_losers"]

        results = {}

        for screener_type in screener_types:
            try:
                result = self.get_trending_stock(screener_type, count_per_screener)
                results[screener_type] = result
            except Exception as e:
                logger.error(f"스크리너 '{screener_type}' 조회 중 오류: {e}")
                results[screener_type] = {
                    "symbol": None,
                    "screener_type": screener_type,
                    "error": str(e)
                }

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
