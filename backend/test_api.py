"""
FastAPI 엔드포인트 테스트

API 서버가 실행 중일 때 사용
"""

import requests
import json


BASE_URL = "http://localhost:8000"


def print_separator(title: str):
    """테스트 구분선 출력"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80)


def test_root():
    """테스트 1: 루트 엔드포인트"""
    print_separator("테스트 1: GET /")

    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"상태 코드: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"응답: {json.dumps(data, indent=2, ensure_ascii=False)}")
            print("\n[OK] 루트 엔드포인트 테스트 완료")
            return True
        else:
            print(f"[X] 요청 실패: {response.status_code}")
            return False

    except requests.exceptions.ConnectionError:
        print("[X] API 서버에 연결할 수 없습니다.")
        print("    해결: backend 폴더에서 'python main.py' 실행")
        return False
    except Exception as e:
        print(f"[X] 오류 발생: {e}")
        return False


def test_health_check():
    """테스트 2: 헬스 체크"""
    print_separator("테스트 2: GET /api/health")

    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"상태 코드: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"응답: {json.dumps(data, indent=2, ensure_ascii=False)}")
            print("\n[OK] 헬스 체크 테스트 완료")
            return True
        else:
            print(f"[X] 요청 실패: {response.status_code}")
            return False

    except Exception as e:
        print(f"[X] 오류 발생: {e}")
        return False


def test_trending_stock_most_actives():
    """테스트 3: 화제 종목 조회 - most_actives"""
    print_separator("테스트 3: GET /api/stocks/trending?type=most_actives")

    try:
        params = {
            "type": "most_actives",
            "include_news": False,  # 뉴스 제외 (빠른 테스트)
        }
        response = requests.get(f"{BASE_URL}/api/stocks/trending", params=params)
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
                print(f"  변동률: {basic_info.get('regularMarketChangePercent', 'N/A'):.2f}%")
                print(f"  거래량: {basic_info.get('regularMarketVolume', 'N/A'):,}")

            print("\n[OK] most_actives 테스트 완료")
            return True
        else:
            print(f"[X] 요청 실패: {response.status_code}")
            print(f"    응답: {response.text}")
            return False

    except Exception as e:
        print(f"[X] 오류 발생: {e}")
        return False


def test_trending_stock_with_news():
    """테스트 4: 화제 종목 조회 - 뉴스 포함"""
    print_separator("테스트 4: GET /api/stocks/trending?type=day_gainers&include_news=true")

    try:
        params = {
            "type": "day_gainers",
            "include_news": True,
            "news_count": 3,
            "news_hours": 24
        }
        response = requests.get(f"{BASE_URL}/api/stocks/trending", params=params)
        print(f"상태 코드: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"\n종목 심볼: {data.get('symbol')}")

            basic_info = data.get('basic_info', {})
            if basic_info:
                print(f"종목명: {basic_info.get('longName', 'N/A')}")
                print(f"상승률: {basic_info.get('regularMarketChangePercent', 'N/A'):.2f}%")

            news = data.get('news')
            if news:
                print(f"\n[관련 뉴스]")
                print(f"검색된 뉴스: {news.get('total_results', 0)}개")

                news_list = news.get('news', [])
                for i, item in enumerate(news_list[:3], 1):
                    print(f"\n  [{i}] {item.get('title', 'N/A')}")
                    print(f"      URL: {item.get('url', 'N/A')}")
            else:
                print("\n[!] 뉴스 정보 없음 (EXA_API_KEY 미설정일 수 있음)")

            print("\n[OK] 뉴스 포함 테스트 완료")
            return True
        else:
            print(f"[X] 요청 실패: {response.status_code}")
            return False

    except Exception as e:
        print(f"[X] 오류 발생: {e}")
        return False


def test_stock_info():
    """테스트 5: 종목 상세 정보 조회"""
    print_separator("테스트 5: GET /api/stocks/AAPL")

    try:
        params = {
            "include_news": False,  # 뉴스 제외
        }
        response = requests.get(f"{BASE_URL}/api/stocks/AAPL", params=params)
        print(f"상태 코드: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"\n종목 심볼: {data.get('symbol')}")

            basic_info = data.get('basic_info', {})
            if basic_info:
                print(f"\n[기본 정보]")
                print(f"  종목명: {basic_info.get('longName', 'N/A')}")
                print(f"  현재가: ${basic_info.get('regularMarketPrice', 'N/A')}")
                print(f"  변동률: {basic_info.get('regularMarketChangePercent', 'N/A'):.2f}%")

            detail_info = data.get('detail_info', {})
            if detail_info:
                print(f"\n[상세 정보]")
                price = detail_info.get('price')
                if price:
                    print(f"  시가총액: ${price.get('marketCap', 'N/A'):,}")

            print("\n[OK] 종목 상세 정보 테스트 완료")
            return True
        else:
            print(f"[X] 요청 실패: {response.status_code}")
            print(f"    응답: {response.text}")
            return False

    except Exception as e:
        print(f"[X] 오류 발생: {e}")
        return False


def test_invalid_ticker():
    """테스트 6: 존재하지 않는 종목 조회 (에러 처리)"""
    print_separator("테스트 6: GET /api/stocks/INVALID (에러 처리)")

    try:
        response = requests.get(f"{BASE_URL}/api/stocks/INVALID")
        print(f"상태 코드: {response.status_code}")

        if response.status_code == 404:
            data = response.json()
            print(f"에러 메시지: {data.get('detail', 'N/A')}")
            print("\n[OK] 에러 처리 테스트 완료 (404 반환)")
            return True
        else:
            print(f"[X] 예상과 다른 상태 코드: {response.status_code}")
            return False

    except Exception as e:
        print(f"[X] 오류 발생: {e}")
        return False


def test_all_trending_stocks():
    """테스트 7: 모든 스크리너 조회"""
    print_separator("테스트 7: GET /api/stocks/trending/all")

    try:
        params = {"include_news": False}
        response = requests.get(f"{BASE_URL}/api/stocks/trending/all", params=params)
        print(f"상태 코드: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"\n조회된 스크리너 수: {len(data)}")

            for screener_type, result in data.items():
                symbol = result.get('symbol', 'N/A')
                print(f"\n  [{screener_type}]")
                print(f"    종목: {symbol}")

                if 'basic_info' in result:
                    basic_info = result['basic_info']
                    change_pct = basic_info.get('regularMarketChangePercent', 0)
                    print(f"    변동률: {change_pct:.2f}%")

            print("\n[OK] 모든 스크리너 조회 테스트 완료")
            return True
        else:
            print(f"[X] 요청 실패: {response.status_code}")
            return False

    except Exception as e:
        print(f"[X] 오류 발생: {e}")
        return False


def run_all_tests():
    """모든 테스트 실행"""
    print("\n")
    print(">>> FastAPI 엔드포인트 테스트 시작")
    print("=" * 80)
    print("참고: API 서버가 실행 중이어야 합니다. (python main.py)")

    tests = [
        ("루트 엔드포인트", test_root),
        ("헬스 체크", test_health_check),
        ("화제 종목 조회 (most_actives)", test_trending_stock_most_actives),
        ("화제 종목 조회 (뉴스 포함)", test_trending_stock_with_news),
        ("종목 상세 정보 (AAPL)", test_stock_info),
        ("에러 처리 (존재하지 않는 종목)", test_invalid_ticker),
        ("모든 스크리너 조회", test_all_trending_stocks),
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

    # API 문서 안내
    print("\n[참고] API 문서")
    print(f"  - Swagger UI: {BASE_URL}/api/docs")
    print(f"  - ReDoc: {BASE_URL}/api/redoc")
    print("=" * 80)


if __name__ == "__main__":
    run_all_tests()
