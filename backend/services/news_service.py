"""
뉴스 수집 서비스

Exa API를 사용하여 주식 관련 뉴스를 검색하는 서비스
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import logging
import os

try:
    from exa_py import Exa
    EXA_AVAILABLE = True
except ImportError:
    EXA_AVAILABLE = False
    logging.warning("exa_py 패키지가 설치되지 않았습니다. pip install exa-py를 실행하세요.")

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class NewsService:
    """Exa API를 사용한 주식 뉴스 검색 서비스"""

    def __init__(self, api_key: Optional[str] = None):
        """
        NewsService 초기화

        Args:
            api_key: Exa API 키 (기본값: 환경 변수 EXA_API_KEY)

        Raises:
            ImportError: exa_py 패키지가 설치되지 않은 경우
            ValueError: API 키가 제공되지 않은 경우
        """
        if not EXA_AVAILABLE:
            raise ImportError(
                "exa_py 패키지가 필요합니다. pip install exa-py를 실행하세요."
            )

        # API 키 확인
        self.api_key = api_key or os.getenv("EXA_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Exa API 키가 필요합니다. "
                "환경 변수 EXA_API_KEY를 설정하거나 api_key 파라미터를 전달하세요."
            )

        # Exa 클라이언트 초기화
        self.exa = Exa(api_key=self.api_key)

    def search_stock_news(
        self,
        ticker: str,
        hours: int = 24,
        num_results: int = 10
    ) -> Dict[str, Any]:
        """
        주식 종목 관련 뉴스 검색

        Args:
            ticker: 종목 심볼 (예: "AAPL")
            hours: 검색할 시간 범위 (기본값: 24시간)
            num_results: 반환할 뉴스 개수 (기본값: 10, 최대: 100)

        Returns:
            Dict: 뉴스 검색 결과
                - ticker: 종목 심볼
                - query: 검색 쿼리
                - total_results: 검색된 뉴스 개수
                - news: 뉴스 리스트 (title, url, published_date)
                - search_period: 검색 기간
                - error: 에러 메시지 (에러 발생 시)

        Example:
            >>> service = NewsService()
            >>> result = service.search_stock_news("AAPL", hours=24, num_results=5)
            >>> print(result['news'][0]['title'])
        """
        try:
            # 검색 쿼리 생성
            query = f"{ticker} stock news"

            # 검색 기간 계산 (최근 N시간)
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(hours=hours)

            # 날짜를 ISO 형식으로 변환 (YYYY-MM-DD)
            start_published_date = start_date.strftime("%Y-%m-%d")
            end_published_date = end_date.strftime("%Y-%m-%d")

            logger.info(
                f"뉴스 검색 시작 - 종목: {ticker}, "
                f"기간: {start_published_date} ~ {end_published_date}, "
                f"결과 수: {num_results}"
            )

            # Exa API로 뉴스 검색
            search_results = self.exa.search(
                query=query,
                num_results=num_results,
                start_published_date=start_published_date,
                end_published_date=end_published_date,
                type="auto",  # auto, neural, fast, deep 중 선택
                category="news"  # 뉴스 카테고리로 필터링
            )

            # 결과 추출
            news_list = []
            if hasattr(search_results, 'results') and search_results.results:
                for result in search_results.results:
                    news_item = {
                        "title": result.title if hasattr(result, 'title') else None,
                        "url": result.url if hasattr(result, 'url') else None,
                        "published_date": result.published_date if hasattr(result, 'published_date') else None,
                        "author": result.author if hasattr(result, 'author') else None,
                    }
                    news_list.append(news_item)

            logger.info(f"뉴스 검색 완료 - {len(news_list)}개 뉴스 발견")

            return {
                "ticker": ticker,
                "query": query,
                "total_results": len(news_list),
                "news": news_list,
                "search_period": {
                    "start_date": start_published_date,
                    "end_date": end_published_date,
                    "hours": hours
                }
            }

        except Exception as e:
            logger.error(f"뉴스 검색 중 오류 발생 ({ticker}): {e}")
            return {
                "ticker": ticker,
                "query": f"{ticker} stock news",
                "total_results": 0,
                "news": [],
                "error": f"뉴스 검색 중 오류가 발생했습니다: {str(e)}"
            }

    def search_multiple_stocks_news(
        self,
        tickers: List[str],
        hours: int = 24,
        num_results_per_ticker: int = 5
    ) -> Dict[str, Any]:
        """
        여러 종목의 뉴스를 동시에 검색

        Args:
            tickers: 종목 심볼 리스트 (예: ["AAPL", "MSFT", "GOOGL"])
            hours: 검색할 시간 범위 (기본값: 24시간)
            num_results_per_ticker: 종목당 반환할 뉴스 개수

        Returns:
            Dict: 종목별 뉴스 검색 결과
        """
        results = {}

        for ticker in tickers:
            try:
                result = self.search_stock_news(ticker, hours, num_results_per_ticker)
                results[ticker] = result
            except Exception as e:
                logger.error(f"종목 '{ticker}' 뉴스 검색 중 오류: {e}")
                results[ticker] = {
                    "ticker": ticker,
                    "total_results": 0,
                    "news": [],
                    "error": str(e)
                }

        return results

    def search_market_news(
        self,
        query: str,
        hours: int = 24,
        num_results: int = 10,
        include_domains: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        일반 시장 뉴스 검색 (특정 종목이 아닌 전체 시장 관련)

        Args:
            query: 검색 쿼리 (예: "stock market", "nasdaq", "dow jones")
            hours: 검색할 시간 범위
            num_results: 반환할 뉴스 개수
            include_domains: 포함할 도메인 리스트 (예: ["bloomberg.com", "reuters.com"])

        Returns:
            Dict: 뉴스 검색 결과
        """
        try:
            # 검색 기간 계산
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(hours=hours)

            start_published_date = start_date.strftime("%Y-%m-%d")
            end_published_date = end_date.strftime("%Y-%m-%d")

            logger.info(f"시장 뉴스 검색 시작 - 쿼리: {query}")

            # Exa API로 뉴스 검색
            search_params = {
                "query": query,
                "num_results": num_results,
                "start_published_date": start_published_date,
                "end_published_date": end_published_date,
                "type": "auto",
                "category": "news"
            }

            # 도메인 필터 추가 (선택사항)
            if include_domains:
                search_params["include_domains"] = include_domains

            search_results = self.exa.search(**search_params)

            # 결과 추출
            news_list = []
            if hasattr(search_results, 'results') and search_results.results:
                for result in search_results.results:
                    news_item = {
                        "title": result.title if hasattr(result, 'title') else None,
                        "url": result.url if hasattr(result, 'url') else None,
                        "published_date": result.published_date if hasattr(result, 'published_date') else None,
                        "author": result.author if hasattr(result, 'author') else None,
                    }
                    news_list.append(news_item)

            logger.info(f"시장 뉴스 검색 완료 - {len(news_list)}개 뉴스 발견")

            return {
                "query": query,
                "total_results": len(news_list),
                "news": news_list,
                "search_period": {
                    "start_date": start_published_date,
                    "end_date": end_published_date,
                    "hours": hours
                }
            }

        except Exception as e:
            logger.error(f"시장 뉴스 검색 중 오류 발생: {e}")
            return {
                "query": query,
                "total_results": 0,
                "news": [],
                "error": f"뉴스 검색 중 오류가 발생했습니다: {str(e)}"
            }


# 편의 함수
def search_stock_news(
    ticker: str,
    hours: int = 24,
    num_results: int = 10,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    주식 뉴스 검색 편의 함수

    Args:
        ticker: 종목 심볼
        hours: 검색할 시간 범위
        num_results: 반환할 뉴스 개수
        api_key: Exa API 키 (선택, 환경 변수 사용 가능)

    Returns:
        Dict: 뉴스 검색 결과
    """
    service = NewsService(api_key=api_key)
    return service.search_stock_news(ticker, hours, num_results)


def search_market_news(
    query: str,
    hours: int = 24,
    num_results: int = 10,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    시장 뉴스 검색 편의 함수

    Args:
        query: 검색 쿼리
        hours: 검색할 시간 범위
        num_results: 반환할 뉴스 개수
        api_key: Exa API 키 (선택, 환경 변수 사용 가능)

    Returns:
        Dict: 뉴스 검색 결과
    """
    service = NewsService(api_key=api_key)
    return service.search_market_news(query, hours, num_results)
