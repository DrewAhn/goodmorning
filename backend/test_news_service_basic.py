"""
뉴스 수집 서비스 기본 테스트 (API 키 불필요)

API 키 없이도 실행 가능한 기본 테스트
"""

import sys
from pathlib import Path
import os

# backend 폴더를 Python 경로에 추가
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))


def print_separator(title: str):
    """테스트 구분선 출력"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80)


def test_import():
    """테스트 1: 모듈 import 테스트"""
    print_separator("테스트 1: 모듈 import")

    try:
        from services.news_service import (
            NewsService,
            search_stock_news,
            search_market_news,
        )
        print("[OK] 모든 모듈을 성공적으로 import했습니다.")
        return True
    except ImportError as e:
        print(f"[X] ImportError: {e}")
        return False


def test_exa_py_available():
    """테스트 2: exa_py 패키지 설치 확인"""
    print_separator("테스트 2: exa_py 패키지 확인")

    try:
        import exa_py
        print(f"[OK] exa_py 패키지가 설치되어 있습니다.")
        print(f"     버전: {exa_py.__version__ if hasattr(exa_py, '__version__') else 'N/A'}")
        return True
    except ImportError:
        print("[X] exa_py 패키지가 설치되지 않았습니다.")
        print("    해결: pip install exa-py")
        return False


def test_error_handling_no_api_key():
    """테스트 3: API 키 없이 초기화 시도 (에러 처리 확인)"""
    print_separator("테스트 3: API 키 없이 초기화 (에러 처리)")

    try:
        from services.news_service import NewsService

        # 환경 변수 백업
        original_key = os.getenv("EXA_API_KEY")
        if original_key:
            del os.environ["EXA_API_KEY"]

        try:
            service = NewsService()
            print("[X] ValueError가 발생하지 않았습니다.")
            success = False
        except ValueError as e:
            print(f"[OK] 예상대로 ValueError 발생")
            print(f"     에러 메시지: {str(e)[:100]}...")
            success = True
        except Exception as e:
            print(f"[X] 예상치 못한 에러: {type(e).__name__}: {e}")
            success = False
        finally:
            # 환경 변수 복원
            if original_key:
                os.environ["EXA_API_KEY"] = original_key

        return success

    except Exception as e:
        print(f"[X] 테스트 실행 중 예외: {e}")
        return False


def test_newsservice_with_api_key():
    """테스트 4: API 키와 함께 초기화 (mock)"""
    print_separator("테스트 4: API 키와 함께 초기화")

    try:
        from services.news_service import NewsService

        # 가짜 API 키로 초기화 시도
        try:
            service = NewsService(api_key="test_api_key_12345")
            print("[OK] API 키와 함께 NewsService 초기화 성공")
            print(f"     API 키가 설정되었습니다: {service.api_key[:10]}...")
            return True
        except Exception as e:
            print(f"[X] 초기화 실패: {e}")
            return False

    except Exception as e:
        print(f"[X] 테스트 실행 중 예외: {e}")
        return False


def test_search_methods_exist():
    """테스트 5: 주요 메서드 존재 확인"""
    print_separator("테스트 5: 주요 메서드 존재 확인")

    try:
        from services.news_service import NewsService

        service = NewsService(api_key="test_key")

        methods = [
            "search_stock_news",
            "search_multiple_stocks_news",
            "search_market_news"
        ]

        all_exist = True
        for method_name in methods:
            if hasattr(service, method_name):
                print(f"[OK] {method_name} 메서드 존재")
            else:
                print(f"[X] {method_name} 메서드가 없습니다.")
                all_exist = False

        return all_exist

    except Exception as e:
        print(f"[X] 테스트 실행 중 예외: {e}")
        return False


def test_convenience_functions_exist():
    """테스트 6: 편의 함수 존재 확인"""
    print_separator("테스트 6: 편의 함수 존재 확인")

    try:
        from services import news_service

        functions = [
            "search_stock_news",
            "search_market_news"
        ]

        all_exist = True
        for func_name in functions:
            if hasattr(news_service, func_name):
                print(f"[OK] {func_name} 함수 존재")
            else:
                print(f"[X] {func_name} 함수가 없습니다.")
                all_exist = False

        return all_exist

    except Exception as e:
        print(f"[X] 테스트 실행 중 예외: {e}")
        return False


def test_package_exports():
    """테스트 7: __init__.py exports 확인"""
    print_separator("테스트 7: 패키지 exports 확인")

    try:
        from services import (
            NewsService,
            search_stock_news,
            search_market_news,
        )

        print("[OK] 모든 클래스와 함수를 services 패키지에서 import 성공")
        return True

    except ImportError as e:
        print(f"[X] ImportError: {e}")
        return False


def run_all_tests():
    """모든 테스트 실행"""
    print("\n")
    print(">>> 뉴스 수집 서비스 기본 테스트 시작")
    print("=" * 80)
    print("참고: 이 테스트는 EXA_API_KEY 없이 실행 가능합니다.")

    tests = [
        ("모듈 import", test_import),
        ("exa_py 패키지 확인", test_exa_py_available),
        ("API 키 없이 초기화 (에러 처리)", test_error_handling_no_api_key),
        ("API 키와 함께 초기화", test_newsservice_with_api_key),
        ("주요 메서드 존재 확인", test_search_methods_exist),
        ("편의 함수 존재 확인", test_convenience_functions_exist),
        ("패키지 exports 확인", test_package_exports),
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

    # API 키 테스트 안내
    print("\n[참고] 실제 API 호출 테스트")
    print("  실제 뉴스 검색 기능을 테스트하려면:")
    print("  1. https://exa.ai/ 에서 API 키 발급")
    print("  2. 환경 변수 설정: set EXA_API_KEY=your_api_key")
    print("  3. test_news_service.py 실행")
    print("=" * 80)


if __name__ == "__main__":
    run_all_tests()
