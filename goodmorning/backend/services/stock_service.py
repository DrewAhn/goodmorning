"""
주식 데이터 서비스 - yahooquery 연동

기본적인 주식 데이터 조회 및 화제 종목 선정 기능을 제공합니다.
단일 종목 조회가 필요한 경우 TrendingStockService를 사용하는 것을 권장합니다.
"""
from yahooquery import Screener, Ticker
from typing import Optional, List, Dict, Any

from .utils import (
    LoggerFactory,
    StockConstants,
    StockDataFormatter,
    ErrorResponseBuilder
)

# 로깅 설정
logger = LoggerFactory.get_logger(__name__)


class StockService:
    """주식 데이터 조회 서비스"""

    def __init__(self):
        """StockService 초기화"""
        self.screener = Screener()

    def get_trending_stocks(self) -> dict:
        """
        화제 종목 조회
        - most_actives: 거래량 상위
        - day_gainers: 상승률 상위
        - trending: 거래량과 상승률 교집합

        Returns:
            Dict: 화제 종목 정보
                - trending: 교집합 기반 화제 종목 (최대 5개)
                - most_actives: 거래량 상위 종목 (5개)
                - day_gainers: 상승률 상위 종목 (5개)
                - source: 데이터 출처
                - error: 에러 메시지 (에러 발생 시)
        """
        try:
            logger.info("화제 종목 조회 시작")

            # 거래량 상위 종목 조회
            actives_data = self.screener.get_screeners('most_actives')
            most_actives = actives_data.get('most_actives', {}).get(
                'quotes', []
            )[:StockConstants.DEFAULT_SCREENER_COUNT]

            # 상승률 상위 종목 조회
            gainers_data = self.screener.get_screeners('day_gainers')
            day_gainers = gainers_data.get('day_gainers', {}).get(
                'quotes', []
            )[:StockConstants.DEFAULT_SCREENER_COUNT]

            # 화제 종목 선정 (거래량 + 상승률 교집합에서 TOP 5)
            trending = self._select_trending_stocks(most_actives, day_gainers)

            logger.info(
                f"화제 종목 조회 완료 - "
                f"Trending: {len(trending)}, "
                f"Actives: {len(most_actives)}, "
                f"Gainers: {len(day_gainers)}"
            )

            return {
                "trending": StockDataFormatter.format_stocks_list(trending),
                "most_actives": StockDataFormatter.format_stocks_list(
                    most_actives[:StockConstants.DEFAULT_TRENDING_COUNT]
                ),
                "day_gainers": StockDataFormatter.format_stocks_list(
                    day_gainers[:StockConstants.DEFAULT_TRENDING_COUNT]
                ),
                "source": "yahooquery"
            }

        except Exception as e:
            logger.error(f"화제 종목 조회 중 오류 발생: {e}", exc_info=True)
            return {
                "trending": [],
                "most_actives": [],
                "day_gainers": [],
                "source": "yahooquery",
                "error": str(e)
            }

    def _select_trending_stocks(
        self,
        actives: List[Dict[str, Any]],
        gainers: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        화제 종목 선정 알고리즘

        거래량 TOP 10과 상승률 TOP 10의 교집합 중 거래량 순으로 정렬하여 반환합니다.
        교집합이 없으면 거래량 TOP 5를 반환합니다.

        Args:
            actives: 거래량 상위 종목 리스트
            gainers: 상승률 상위 종목 리스트

        Returns:
            List[Dict]: 화제 종목 리스트 (최대 5개)
        """
        # 심볼 기준 교집합 찾기
        active_symbols = {stock['symbol'] for stock in actives}
        gainer_symbols = {stock['symbol'] for stock in gainers}
        intersection = active_symbols & gainer_symbols

        # 교집합 종목을 거래량 순으로 정렬
        trending = []
        for stock in actives:
            if stock['symbol'] in intersection:
                trending.append(stock)

        # 교집합이 없으면 거래량 TOP 5 사용
        if not trending:
            logger.warning("화제 종목 교집합이 비어있습니다. 거래량 TOP 5를 사용합니다.")
            trending = actives[:StockConstants.DEFAULT_TRENDING_COUNT]

        return trending[:StockConstants.DEFAULT_TRENDING_COUNT]

    def get_stock_detail(self, symbol: str) -> Optional[dict]:
        """
        종목 상세 정보 조회

        Args:
            symbol: 종목 심볼 (예: "AAPL")

        Returns:
            Dict: 종목 상세 정보 또는 None
                - symbol: 종목 심볼
                - name, long_name: 종목명
                - price, change, change_percent: 가격 정보
                - volume, market_cap: 거래량, 시가총액
                - pe_ratio: PER
                - fifty_two_week_high, fifty_two_week_low: 52주 최고/최저가
                - sector, industry: 섹터, 산업
                - description: 기업 설명
                - source: 데이터 출처
        """
        try:
            logger.info(f"종목 상세 정보 조회 시작: {symbol}")

            ticker = Ticker(symbol)

            # 기본 정보 조회
            summary = ticker.summary_detail.get(symbol, {})
            profile = ticker.asset_profile.get(symbol, {})
            price_data = ticker.price.get(symbol, {})

            # 에러 응답 체크
            if isinstance(summary, str) or isinstance(price_data, str):
                logger.warning(f"종목 정보를 찾을 수 없습니다: {symbol}")
                return None

            # 상세 정보 포맷팅
            detail_info = StockDataFormatter.format_stock_detail_info(
                symbol=symbol,
                price_data=price_data,
                summary_data=summary,
                profile_data=profile
            )

            logger.info(f"종목 상세 정보 조회 완료: {symbol}")
            return detail_info

        except Exception as e:
            logger.error(f"종목 상세 정보 조회 중 오류 발생 ({symbol}): {e}", exc_info=True)
            return None
