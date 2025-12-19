"""
간단한 API 테스트 - uvicorn 서버 없이 직접 테스트
"""

import sys
from pathlib import Path

# backend 폴더를 Python 경로에 추가
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def print_separator(title: str):
    """테스트 구분선 출력"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80)


def test_root():
    """테스트 1: 루트 엔드포인트"""
    print_separator("테스트 1: GET /")

    response = client.get("/")
    print(f"상태 코드: {response.status_code}")
    print(f"응답: {response.json()}")

    if response.status_code == 200:
        print("\n[OK] 루트 엔드포인트 테스트 완료")
        return True
    return False


def test_health():
    """테스트 2: 헬스 체크"""
    print_separator("테스트 2: GET /api/health")

    response = client.get("/api/health")
    print(f"상태 코드: {response.status_code}")
    print(f"응답: {response.json()}")

    if response.status_code == 200:
        print("\n[OK] 헬스 체크 테스트 완료")
        return True
    return False


def test_trending_stock():
    """테스트 3: 화제 종목 조회"""
    print_separator("테스트 3: GET /api/stocks/trending")

    response = client.get("/api/stocks/trending?type=most_actives&include_news=false")
    print(f"상태 코드: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"\n종목 심볼: {data.get('symbol')}")
        print(f"스크리너 타입: {data.get('screener_type')}")

        basic_info = data.get('basic_info', {})
        if basic_info:
            print(f"\n[기본 정보]")
            print(f"  종목명: {basic_info.get('longName', 'N/A')}")
            print(f"  현재가: ${basic_info.get('regularMarketPrice', 'N/A')}")
            print(f"  변동률: {basic_info.get('regularMarketChangePercent', 0):.2f}%")

        print("\n[OK] 화제 종목 조회 테스트 완료")
        return True
    else:
        print(f"[X] 요청 실패: {response.status_code}")
        print(f"응답: {response.text}")
        return False


def test_stock_info():
    """테스트 4: 종목 상세 정보"""
    print_separator("테스트 4: GET /api/stocks/AAPL")

    response = client.get("/api/stocks/AAPL?include_news=false")
    print(f"상태 코드: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"\n종목 심볼: {data.get('symbol')}")

        basic_info = data.get('basic_info', {})
        if basic_info:
            print(f"종목명: {basic_info.get('longName', 'N/A')}")
            print(f"현재가: ${basic_info.get('regularMarketPrice', 'N/A')}")

        print("\n[OK] 종목 상세 정보 테스트 완료")
        return True
    else:
        print(f"[X] 요청 실패: {response.status_code}")
        print(f"응답: {response.text}")
        return False


def test_all_trending():
    """테스트 5: 모든 스크리너 조회"""
    print_separator("테스트 5: GET /api/stocks/trending/all")

    response = client.get("/api/stocks/trending/all?include_news=false")
    print(f"상태 코드: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"\n조회된 스크리너 수: {len(data)}")

        for screener_type, result in data.items():
            symbol = result.get('symbol', 'N/A')
            print(f"\n  [{screener_type}] {symbol}")

        print("\n[OK] 모든 스크리너 조회 테스트 완료")
        return True
    else:
        print(f"[X] 요청 실패: {response.status_code}")
        return False


def run_all_tests():
    """모든 테스트 실행"""
    print("\n")
    print(">>> FastAPI 엔드포인트 간단 테스트")
    print("=" * 80)

    tests = [
        ("루트 엔드포인트", test_root),
        ("헬스 체크", test_health),
        ("화제 종목 조회", test_trending_stock),
        ("종목 상세 정보", test_stock_info),
        ("모든 스크리너 조회", test_all_trending),
    ]

    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"\n[X] 테스트 실행 중 예외: {e}")
            import traceback
            traceback.print_exc()
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
