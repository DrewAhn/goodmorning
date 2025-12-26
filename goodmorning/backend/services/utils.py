"""
서비스 공통 유틸리티

주식 데이터 포맷팅, 로깅 설정, 상수 정의 등
모든 서비스에서 공통으로 사용하는 유틸리티 함수 및 클래스
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta


class StockConstants:
    """주식 서비스 관련 상수"""

    # 스크리너 관련
    DEFAULT_SCREENER_COUNT = 10
    DEFAULT_TRENDING_COUNT = 5
    SCREENER_TYPES = ["most_actives", "day_gainers", "day_losers"]

    # 뉴스 관련
    DEFAULT_NEWS_HOURS = 24
    DEFAULT_NEWS_RESULTS = 10
    MAX_NEWS_RESULTS = 100

    # 데이터 포맷 관련
    DEFAULT_VALUE_STRING = 'N/A'
    DEFAULT_VALUE_NUMERIC = 0


class LoggerFactory:
    """로거 생성 팩토리"""

    _configured = False

    @classmethod
    def get_logger(cls, name: str) -> logging.Logger:
        """
        서비스별 로거 생성

        Args:
            name: 로거 이름 (일반적으로 __name__ 사용)

        Returns:
            logging.Logger: 설정된 로거 인스턴스
        """
        if not cls._configured:
            logging.basicConfig(
                level=logging.INFO,
                format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            cls._configured = True

        return logging.getLogger(name)


class StockDataFormatter:
    """주식 데이터 포맷팅 유틸리티"""

    @staticmethod
    def format_stock_basic_info(stock: Dict[str, Any]) -> Dict[str, Any]:
        """
        주식 기본 정보를 표준 형식으로 포맷팅

        Args:
            stock: 원본 주식 데이터 (yahooquery 응답)

        Returns:
            Dict: 표준화된 주식 기본 정보
        """
        return {
            "symbol": stock.get('symbol', ''),
            "name": stock.get('shortName', stock.get('longName', StockConstants.DEFAULT_VALUE_STRING)),
            "price": stock.get('regularMarketPrice', StockConstants.DEFAULT_VALUE_NUMERIC),
            "change": stock.get('regularMarketChange', StockConstants.DEFAULT_VALUE_NUMERIC),
            "change_percent": stock.get('regularMarketChangePercent', StockConstants.DEFAULT_VALUE_NUMERIC),
            "volume": stock.get('regularMarketVolume', StockConstants.DEFAULT_VALUE_NUMERIC),
            "market_cap": stock.get('marketCap', StockConstants.DEFAULT_VALUE_NUMERIC),
        }

    @staticmethod
    def format_stock_detail_info(
        symbol: str,
        price_data: Dict[str, Any],
        summary_data: Dict[str, Any],
        profile_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        주식 상세 정보를 표준 형식으로 포맷팅

        Args:
            symbol: 종목 심볼
            price_data: 가격 정보
            summary_data: 요약 정보
            profile_data: 프로필 정보

        Returns:
            Dict: 표준화된 주식 상세 정보
        """
        return {
            "symbol": symbol,
            "name": price_data.get('shortName', StockConstants.DEFAULT_VALUE_STRING),
            "long_name": price_data.get('longName', StockConstants.DEFAULT_VALUE_STRING),
            "price": price_data.get('regularMarketPrice', StockConstants.DEFAULT_VALUE_NUMERIC),
            "change": price_data.get('regularMarketChange', StockConstants.DEFAULT_VALUE_NUMERIC),
            "change_percent": price_data.get('regularMarketChangePercent', StockConstants.DEFAULT_VALUE_NUMERIC),
            "volume": price_data.get('regularMarketVolume', StockConstants.DEFAULT_VALUE_NUMERIC),
            "market_cap": summary_data.get('marketCap', StockConstants.DEFAULT_VALUE_NUMERIC),
            "pe_ratio": summary_data.get('trailingPE', None),
            "fifty_two_week_high": summary_data.get('fiftyTwoWeekHigh', StockConstants.DEFAULT_VALUE_NUMERIC),
            "fifty_two_week_low": summary_data.get('fiftyTwoWeekLow', StockConstants.DEFAULT_VALUE_NUMERIC),
            "sector": profile_data.get('sector', StockConstants.DEFAULT_VALUE_STRING),
            "industry": profile_data.get('industry', StockConstants.DEFAULT_VALUE_STRING),
            "description": profile_data.get('longBusinessSummary', StockConstants.DEFAULT_VALUE_STRING),
            "source": "yahooquery"
        }

    @staticmethod
    def format_stocks_list(stocks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        주식 리스트를 표준 형식으로 포맷팅

        Args:
            stocks: 원본 주식 데이터 리스트

        Returns:
            List[Dict]: 표준화된 주식 정보 리스트
        """
        return [StockDataFormatter.format_stock_basic_info(stock) for stock in stocks]


class NewsDataFormatter:
    """뉴스 데이터 포맷팅 유틸리티"""

    @staticmethod
    def format_news_item(news_result) -> Dict[str, Any]:
        """
        개별 뉴스 항목 포맷팅

        Args:
            news_result: Exa API 검색 결과 항목

        Returns:
            Dict: 표준화된 뉴스 항목
        """
        return {
            "title": getattr(news_result, 'title', None),
            "url": getattr(news_result, 'url', None),
            "published_date": getattr(news_result, 'published_date', None),
            "author": getattr(news_result, 'author', None),
        }

    @staticmethod
    def format_news_list(search_results) -> List[Dict[str, Any]]:
        """
        뉴스 검색 결과 리스트 포맷팅

        Args:
            search_results: Exa API 검색 결과 객체

        Returns:
            List[Dict]: 표준화된 뉴스 항목 리스트
        """
        news_list = []
        if hasattr(search_results, 'results') and search_results.results:
            for result in search_results.results:
                news_list.append(NewsDataFormatter.format_news_item(result))
        return news_list


class DateRangeBuilder:
    """날짜 범위 생성 유틸리티"""

    @staticmethod
    def build_date_range(hours: int) -> Dict[str, str]:
        """
        현재 시각부터 N시간 전까지의 날짜 범위 생성

        Args:
            hours: 시간 범위

        Returns:
            Dict: start_date, end_date를 포함한 딕셔너리 (ISO 형식)
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(hours=hours)

        return {
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d"),
            "hours": hours
        }


class ErrorResponseBuilder:
    """에러 응답 생성 유틸리티"""

    @staticmethod
    def build_stock_error_response(
        screener_type: str,
        error_message: str,
        symbol: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        주식 조회 에러 응답 생성

        Args:
            screener_type: 스크리너 타입
            error_message: 에러 메시지
            symbol: 종목 심볼 (선택)

        Returns:
            Dict: 표준화된 에러 응답
        """
        return {
            "symbol": symbol,
            "screener_type": screener_type,
            "error": error_message
        }

    @staticmethod
    def build_news_error_response(
        query: str,
        error_message: str,
        ticker: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        뉴스 검색 에러 응답 생성

        Args:
            query: 검색 쿼리
            error_message: 에러 메시지
            ticker: 종목 심볼 (선택)

        Returns:
            Dict: 표준화된 에러 응답
        """
        response = {
            "query": query,
            "total_results": 0,
            "news": [],
            "error": error_message
        }

        if ticker:
            response["ticker"] = ticker

        return response
