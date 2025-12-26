"""
화제 종목 스크리닝 서비스

yahooquery를 사용하여 화제 종목을 선정하고 결과를 저장합니다.
GitHub Actions 워크플로우에서 실행됩니다.
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

from .trending_stock_service import get_all_trending_stocks
from .utils import LoggerFactory

# 로깅 설정
logger = LoggerFactory.get_logger(__name__)


def ensure_output_directory() -> Path:
    """출력 디렉토리가 존재하는지 확인하고 생성"""
    output_dir = Path(__file__).parent.parent / "output"
    output_dir.mkdir(exist_ok=True)
    return output_dir


def save_screening_result(data: Dict[str, Any], output_dir: Path) -> str:
    """
    스크리닝 결과를 JSON 파일로 저장

    Args:
        data: 저장할 데이터
        output_dir: 출력 디렉토리 경로

    Returns:
        str: 저장된 파일 경로
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"screening_{timestamp}.json"
    filepath = output_dir / filename

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    logger.info(f"스크리닝 결과 저장 완료: {filepath}")
    return str(filepath)


def run_screening() -> Dict[str, Any]:
    """
    화제 종목 스크리닝 실행

    Returns:
        Dict: 스크리닝 결과
            - timestamp: 실행 시각
            - stocks: 화제 종목 리스트
            - count: 종목 개수
            - success: 성공 여부
    """
    logger.info("=" * 60)
    logger.info("화제 종목 스크리닝 시작")
    logger.info("=" * 60)

    try:
        # 화제 종목 조회
        stocks = get_all_trending_stocks()

        # 결과 구성
        result = {
            "timestamp": datetime.now().isoformat(),
            "stocks": stocks,
            "count": len(stocks),
            "success": True,
            "message": f"{len(stocks)}개 화제 종목 조회 완료"
        }

        # 결과 저장
        output_dir = ensure_output_directory()
        filepath = save_screening_result(result, output_dir)

        logger.info("=" * 60)
        logger.info(f"스크리닝 완료: {len(stocks)}개 종목")
        logger.info(f"저장 위치: {filepath}")
        logger.info("=" * 60)

        # 화제 종목 목록 출력
        for i, stock in enumerate(stocks, 1):
            logger.info(
                f"{i}. {stock['symbol']} - {stock['name']} "
                f"({stock['change_percent']:+.2f}%)"
            )

        return result

    except Exception as e:
        error_msg = f"스크리닝 실패: {str(e)}"
        logger.error(error_msg, exc_info=True)

        result = {
            "timestamp": datetime.now().isoformat(),
            "stocks": [],
            "count": 0,
            "success": False,
            "error": str(e),
            "message": error_msg
        }

        # 에러 결과도 저장
        output_dir = ensure_output_directory()
        save_screening_result(result, output_dir)

        raise


def main():
    """메인 실행 함수"""
    try:
        result = run_screening()

        # 성공 시 exit code 0
        if result["success"]:
            logger.info("프로그램 정상 종료")
            exit(0)
        else:
            logger.error("프로그램 비정상 종료")
            exit(1)

    except Exception as e:
        logger.error(f"프로그램 실행 중 오류 발생: {e}")
        exit(1)


if __name__ == "__main__":
    main()
