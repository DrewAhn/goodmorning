"""
뉴스 수집 서비스 테스트

NewsService의 모든 함수를 테스트
"""

import sys
from pathlib import Path
import os

# backend 폴더를 Python 경로에 추가
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from services.news_service import (
    NewsService,
    search_stock_news,
    search_market_news,
)


def print_separator(title: str):
    """테스트 구분선 출력"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80)


def check_api_key():
    """API 키 확인"""
    api_key = os.getenv("EXA_API_KEY")
    if not api_key:
        print("\n[!] 경고: EXA_API_KEY 환경 변수가 설정되지 않았습니다.")
        print("    테스트를 실행하려면 환경 변수를 설정하세요:")
        print("    export EXA_API_KEY='your-api-key'  # Linux/Mac")
        print("    set EXA_API_KEY=your-api-key       # Windows")
        return False
    return True


def test_news_service_init():
    """테스트 1: NewsService 초기화"""
    print_separator("테스트 1: NewsService 초기화")

    try:
        service = NewsService()
        print("[OK] NewsService 초기화 성공")
        return True
    except ImportError as e:
        print(f"[X] ImportError: {e}")
        print("    해결: pip install exa-py")
        return False
    except ValueError as e:
        print(f"[X] ValueError: {e}")
        print("    해결: EXA_API_KEY 환경 변수 설정")
        return False
    except Exception as e:
        print(f"[X] 예외 발생: {e}")
        return False


def test_search_stock_news():
    """테스트 2: 주식 뉴스 검색"""
    print_separator("테스트 2: 주식 뉴스 검색 (AAPL)")

    try:
        service = NewsService()
        result = service.search_stock_news("AAPL", hours=24, num_results=5)

        print(f"종목: {result.get('ticker')}")
        print(f"검색 쿼리: {result.get('query')}")
        print(f"검색 기간: {result.get('search_period')}")

        if 'error' in result:
            print(f"[X] 에러 발생: {result['error']}")
            return False

        print(f"\n검색된 뉴스 개수: {result.get('total_results')}")

        news_list = result.get('news', [])
        if news_list:
            print("\n[최신 뉴스 TOP 3]")
            for i, news in enumerate(news_list[:3], 1):
                print(f"\n  [{i}] {news.get('title', 'N/A')}")
                print(f"      URL: {news.get('url', 'N/A')}")
                print(f"      발행일: {news.get('published_date', 'N/A')}")
                if news.get('author'):
                    print(f"      작성자: {news.get('author')}")
        else:
            print("\n[!] 검색된 뉴스가 없습니다.")

        print("\n[OK] 주식 뉴스 검색 테스트 완료")
        return True

    except Exception as e:
        print(f"\n[X] 테스트 실행 중 예외 발생: {e}")
        return False


def test_search_multiple_stocks_news():
    """테스트 3: 여러 종목 뉴스 동시 검색"""
    print_separator("테스트 3: 여러 종목 뉴스 동시 검색")

    try:
        service = NewsService()
        tickers = ["AAPL", "MSFT", "GOOGL"]
        results = service.search_multiple_stocks_news(tickers, hours=24, num_results_per_ticker=3)

        print(f"검색된 종목 수: {len(results)}")

        for ticker, result in results.items():
            print(f"\n  [{ticker}]")
            if 'error' in result:
                print(f"    [X] 에러: {result['error']}")
            else:
                total = result.get('total_results', 0)
                print(f"    뉴스 개수: {total}")
                if total > 0:
                    first_news = result.get('news', [])[0]
                    print(f"    최신 뉴스: {first_news.get('title', 'N/A')[:50]}...")

        print("\n[OK] 여러 종목 뉴스 동시 검색 테스트 완료")
        return True

    except Exception as e:
        print(f"\n[X] 테스트 실행 중 예외 발생: {e}")
        return False


def test_search_market_news():
    """테스트 4: 시장 뉴스 검색"""
    print_separator("테스트 4: 시장 뉴스 검색")

    try:
        service = NewsService()
        result = service.search_market_news("stock market", hours=24, num_results=5)

        print(f"검색 쿼리: {result.get('query')}")

        if 'error' in result:
            print(f"[X] 에러 발생: {result['error']}")
            return False

        print(f"검색된 뉴스 개수: {result.get('total_results')}")

        news_list = result.get('news', [])
        if news_list:
            print("\n[최신 시장 뉴스 TOP 3]")
            for i, news in enumerate(news_list[:3], 1):
                print(f"\n  [{i}] {news.get('title', 'N/A')}")
                print(f"      URL: {news.get('url', 'N/A')}")

        print("\n[OK] 시장 뉴스 검색 테스트 완료")
        return True

    except Exception as e:
        print(f"\n[X] 테스트 실행 중 예외 발생: {e}")
        return False


def test_search_with_domain_filter():
    """테스트 5: 도메인 필터를 사용한 뉴스 검색"""
    print_separator("테스트 5: 도메인 필터를 사용한 뉴스 검색")

    try:
        service = NewsService()
        # 주요 금융 뉴스 사이트로 필터링
        result = service.search_market_news(
            "nasdaq",
            hours=48,
            num_results=5,
            include_domains=["bloomberg.com", "reuters.com", "cnbc.com"]
        )

        print(f"검색 쿼리: {result.get('query')}")
        print(f"도메인 필터: bloomberg.com, reuters.com, cnbc.com")

        if 'error' in result:
            print(f"[X] 에러 발생: {result['error']}")
            return False

        print(f"검색된 뉴스 개수: {result.get('total_results')}")

        news_list = result.get('news', [])
        if news_list:
            print("\n[도메인 필터 적용 결과]")
            for i, news in enumerate(news_list[:3], 1):
                url = news.get('url', 'N/A')
                domain = url.split('/')[2] if url != 'N/A' and '/' in url else 'N/A'
                print(f"\n  [{i}] {news.get('title', 'N/A')}")
                print(f"      도메인: {domain}")

        print("\n[OK] 도메인 필터 테스트 완료")
        return True

    except Exception as e:
        print(f"\n[X] 테스트 실행 중 예외 발생: {e}")
        return False


def test_convenience_functions():
    """테스트 6: 편의 함수 테스트"""
    print_separator("테스트 6: 편의 함수")

    try:
        # search_stock_news 함수
        print("\n[편의 함수 1] search_stock_news()")
        result1 = search_stock_news("TSLA", hours=24, num_results=3)
        print(f"  종목: {result1.get('ticker')}")
        print(f"  뉴스 개수: {result1.get('total_results')}")

        # search_market_news 함수
        print("\n[편의 함수 2] search_market_news()")
        result2 = search_market_news("dow jones", hours=24, num_results=3)
        print(f"  쿼리: {result2.get('query')}")
        print(f"  뉴스 개수: {result2.get('total_results')}")

        print("\n[OK] 편의 함수 테스트 완료")
        return True

    except Exception as e:
        print(f"\n[X] 테스트 실행 중 예외 발생: {e}")
        return False


def test_error_handling():
    """테스트 7: 에러 처리 확인"""
    print_separator("테스트 7: 에러 처리")

    try:
        # API 키 없이 초기화 시도
        print("\n[에러 케이스 1] API 키 없이 초기화")
        try:
            # 임시로 환경 변수 백업
            original_key = os.getenv("EXA_API_KEY")
            if original_key:
                del os.environ["EXA_API_KEY"]

            service = NewsService()
            print("  [X] 에러가 발생하지 않았습니다.")
            success1 = False
        except ValueError as e:
            print(f"  [OK] 예상대로 ValueError 발생: {str(e)[:50]}...")
            success1 = True
        finally:
            # 환경 변수 복원
            if original_key:
                os.environ["EXA_API_KEY"] = original_key

        print("\n[OK] 에러 처리 테스트 완료")
        return success1

    except Exception as e:
        print(f"\n[X] 테스트 실행 중 예외 발생: {e}")
        return False


def run_all_tests():
    """모든 테스트 실행"""
    print("\n")
    print(">>> 뉴스 수집 서비스 테스트 시작")
    print("=" * 80)

    # API 키 확인
    if not check_api_key():
        print("\n[!] EXA_API_KEY가 설정되지 않아 일부 테스트를 건너뜁니다.")
        print("=" * 80)
        return

    tests = [
        ("NewsService 초기화", test_news_service_init),
        ("주식 뉴스 검색", test_search_stock_news),
        ("여러 종목 뉴스 동시 검색", test_search_multiple_stocks_news),
        ("시장 뉴스 검색", test_search_market_news),
        ("도메인 필터 검색", test_search_with_domain_filter),
        ("편의 함수", test_convenience_functions),
        ("에러 처리", test_error_handling),
    ]

    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"\n[X] 테스트 실행 중 예외 발생: {e}")
            results.append((test_name, False))

    # 결과 요약
    print_separator("테스트 결과 요약")
    passed = sum(1 for _, success in results if success)
    total = len(results)

    print(f"\n총 테스트: {total}개")
    print(f"성공: {passed}개")
    print(f"실패: {total - passed}개")

    print("\n상세 결과:")
    for test_name, success in results:
        status = "[PASS]" if success else "[FAIL]"
        print(f"  {status} - {test_name}")

    if passed == total:
        print("\n>>> 모든 테스트를 통과했습니다!")
    else:
        print(f"\n[!] {total - passed}개의 테스트가 실패했습니다.")

    print("=" * 80)


if __name__ == "__main__":
    run_all_tests()
