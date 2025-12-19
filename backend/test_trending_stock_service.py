"""
화제 종목 수집 서비스 테스트

TrendingStockService의 모든 함수를 테스트
"""

import sys
from pathlib import Path

# backend 폴더를 Python 경로에 추가
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from services.trending_stock_service import (
    TrendingStockService,
    get_trending_stock,
    get_all_trending_stocks,
)


def print_separator(title: str):
    """테스트 구분선 출력"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80)


def test_get_trending_stock_most_actives():
    """테스트 1: most_actives 스크리너에서 TOP 1 종목 조회"""
    print_separator("테스트 1: most_actives 스크리너")

    service = TrendingStockService()
    result = service.get_trending_stock("most_actives")

    print(f"스크리너 타입: {result.get('screener_type')}")
    print(f"종목 심볼: {result.get('symbol')}")

    if 'error' in result:
        print(f"[X] 에러 발생: {result['error']}")
        return False

    print("\n[기본 정보]")
    basic_info = result.get('basic_info', {})
    for key, value in basic_info.items():
        print(f"  {key}: {value}")

    print("\n[상세 정보]")
    detail_info = result.get('detail_info', {})

    # price 정보
    price_data = detail_info.get('price')
    if price_data:
        print(f"  가격 정보 조회 성공")
        print(f"    - 현재가: ${price_data.get('regularMarketPrice', 'N/A')}")
        print(f"    - 시가총액: {price_data.get('marketCap', 'N/A')}")
    else:
        print(f"  [!] 가격 정보 조회 실패")

    # summary_detail 정보
    summary_data = detail_info.get('summary_detail')
    if summary_data:
        print(f"  요약 정보 조회 성공")
        print(f"    - 52주 최고가: ${summary_data.get('fiftyTwoWeekHigh', 'N/A')}")
        print(f"    - 52주 최저가: ${summary_data.get('fiftyTwoWeekLow', 'N/A')}")
    else:
        print(f"  [!] 요약 정보 조회 실패")

    # financial_data 정보
    financial_data = detail_info.get('financial_data')
    if financial_data:
        print(f"  재무 정보 조회 성공")
        print(f"    - 시가총액: {financial_data.get('marketCap', 'N/A')}")
        print(f"    - 수익 마진: {financial_data.get('profitMargins', 'N/A')}")
    else:
        print(f"  [!] 재무 정보 조회 실패")

    print("\n[OK] most_actives 테스트 완료")
    return True


def test_get_trending_stock_day_gainers():
    """테스트 2: day_gainers 스크리너에서 TOP 1 종목 조회"""
    print_separator("테스트 2: day_gainers 스크리너")

    service = TrendingStockService()
    result = service.get_trending_stock("day_gainers")

    print(f"스크리너 타입: {result.get('screener_type')}")
    print(f"종목 심볼: {result.get('symbol')}")

    if 'error' in result:
        print(f"[X] 에러 발생: {result['error']}")
        return False

    basic_info = result.get('basic_info', {})
    print(f"\n상승률: {basic_info.get('regularMarketChangePercent', 0):.2f}%")
    print(f"종목명: {basic_info.get('longName', 'N/A')}")

    print("\n[OK] day_gainers 테스트 완료")
    return True


def test_get_trending_stock_day_losers():
    """테스트 3: day_losers 스크리너에서 TOP 1 종목 조회"""
    print_separator("테스트 3: day_losers 스크리너")

    service = TrendingStockService()
    result = service.get_trending_stock("day_losers")

    print(f"스크리너 타입: {result.get('screener_type')}")
    print(f"종목 심볼: {result.get('symbol')}")

    if 'error' in result:
        print(f"[X] 에러 발생: {result['error']}")
        return False

    basic_info = result.get('basic_info', {})
    print(f"\n하락률: {basic_info.get('regularMarketChangePercent', 0):.2f}%")
    print(f"종목명: {basic_info.get('longName', 'N/A')}")

    print("\n[OK] day_losers 테스트 완료")
    return True


def test_invalid_screener_type():
    """테스트 4: 잘못된 스크리너 타입 에러 처리"""
    print_separator("테스트 4: 잘못된 스크리너 타입 에러 처리")

    service = TrendingStockService()
    result = service.get_trending_stock("invalid_screener")

    if 'error' in result:
        print(f"[OK] 예상대로 에러 발생: {result['error']}")
        return True
    else:
        print(f"[X] 에러가 발생하지 않았습니다.")
        return False


def test_get_multiple_trending_stocks():
    """테스트 5: 여러 스크리너에서 동시 조회"""
    print_separator("테스트 5: 여러 스크리너 동시 조회")

    service = TrendingStockService()
    results = service.get_multiple_trending_stocks()

    print(f"조회된 스크리너 수: {len(results)}")

    for screener_type, result in results.items():
        symbol = result.get('symbol', 'N/A')
        print(f"\n  [{screener_type}]")
        print(f"    종목: {symbol}")

        if 'error' in result:
            print(f"    [X] 에러: {result['error']}")
        else:
            basic_info = result.get('basic_info', {})
            change_percent = basic_info.get('regularMarketChangePercent', 0)
            print(f"    변동률: {change_percent:.2f}%")

    print("\n[OK] 여러 스크리너 동시 조회 테스트 완료")
    return True


def test_convenience_functions():
    """테스트 6: 편의 함수 테스트"""
    print_separator("테스트 6: 편의 함수")

    # get_trending_stock 함수
    print("\n[편의 함수 1] get_trending_stock()")
    result1 = get_trending_stock("most_actives")
    print(f"  종목: {result1.get('symbol', 'N/A')}")

    # get_all_trending_stocks 함수
    print("\n[편의 함수 2] get_all_trending_stocks()")
    result2 = get_all_trending_stocks()
    print(f"  조회된 스크리너 수: {len(result2)}")

    print("\n[OK] 편의 함수 테스트 완료")
    return True


def run_all_tests():
    """모든 테스트 실행"""
    print("\n")
    print(">>> 화제 종목 수집 서비스 테스트 시작")
    print("=" * 80)

    tests = [
        ("most_actives 조회", test_get_trending_stock_most_actives),
        ("day_gainers 조회", test_get_trending_stock_day_gainers),
        ("day_losers 조회", test_get_trending_stock_day_losers),
        ("에러 처리", test_invalid_screener_type),
        ("여러 스크리너 동시 조회", test_get_multiple_trending_stocks),
        ("편의 함수", test_convenience_functions),
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
