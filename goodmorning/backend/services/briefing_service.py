"""
브리핑 생성 서비스

화제 종목에 대한 뉴스를 수집하고 AI로 브리핑을 생성합니다.
GitHub Actions 워크플로우에서 실행됩니다.
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional
import google.generativeai as genai

from .news_service import search_stock_news, search_market_news
from .utils import LoggerFactory

# 로깅 설정
logger = LoggerFactory.get_logger(__name__)


def configure_gemini():
    """Gemini API 설정"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.")

    genai.configure(api_key=api_key)
    logger.info("Gemini API 설정 완료")


def load_latest_screening() -> Optional[Dict[str, Any]]:
    """
    가장 최근의 스크리닝 결과 로드

    Returns:
        Dict: 스크리닝 결과 또는 None
    """
    output_dir = Path(__file__).parent.parent / "output"

    if not output_dir.exists():
        logger.warning("output 디렉토리가 존재하지 않습니다.")
        return None

    # screening_*.json 파일 찾기
    screening_files = list(output_dir.glob("screening_*.json"))

    if not screening_files:
        logger.warning("스크리닝 결과 파일을 찾을 수 없습니다.")
        return None

    # 가장 최근 파일 선택
    latest_file = max(screening_files, key=lambda f: f.stat().st_mtime)
    logger.info(f"스크리닝 결과 로드: {latest_file}")

    with open(latest_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def collect_news_for_stocks(stocks: List[Dict[str, Any]]) -> Dict[str, List[Dict]]:
    """
    각 종목에 대한 뉴스 수집

    Args:
        stocks: 종목 리스트

    Returns:
        Dict: {symbol: [news_items]}
    """
    logger.info(f"{len(stocks)}개 종목에 대한 뉴스 수집 시작")

    news_data = {}
    for stock in stocks[:5]:  # 상위 5개 종목만
        symbol = stock["symbol"]
        name = stock["name"]

        logger.info(f"뉴스 검색 중: {symbol} - {name}")

        try:
            # 종목별 뉴스 검색 (최대 5개)
            news_items = search_stock_news(symbol, max_results=5)
            news_data[symbol] = news_items

            logger.info(f"{symbol}: {len(news_items)}개 뉴스 수집 완료")

        except Exception as e:
            logger.error(f"{symbol} 뉴스 수집 실패: {e}")
            news_data[symbol] = []

    return news_data


def generate_briefing_with_gemini(
    stocks: List[Dict[str, Any]],
    news_data: Dict[str, List[Dict]]
) -> str:
    """
    Gemini API를 사용하여 브리핑 생성

    Args:
        stocks: 종목 리스트
        news_data: 뉴스 데이터

    Returns:
        str: 생성된 브리핑 텍스트
    """
    logger.info("Gemini API로 브리핑 생성 시작")

    # 프롬프트 구성
    prompt = f"""
당신은 미국 주식 시장 전문 애널리스트입니다.
한국 투자자를 위한 아침 브리핑을 작성해주세요.

## 오늘의 화제 종목
"""

    # 종목 정보 추가
    for i, stock in enumerate(stocks[:5], 1):
        symbol = stock["symbol"]
        name = stock["name"]
        price = stock.get("price", 0)
        change_pct = stock.get("change_percent", 0)

        prompt += f"\n{i}. **{symbol}** ({name})\n"
        prompt += f"   - 현재가: ${price:.2f}\n"
        prompt += f"   - 변동률: {change_pct:+.2f}%\n"

        # 뉴스 추가
        news_items = news_data.get(symbol, [])
        if news_items:
            prompt += f"   - 주요 뉴스:\n"
            for news in news_items[:3]:
                prompt += f"     * {news.get('title', 'N/A')}\n"

    prompt += """
## 요청사항
1. 각 종목별로 왜 화제가 되고 있는지 간단히 설명해주세요
2. 전체적인 시장 분위기를 요약해주세요
3. 투자자들이 주목해야 할 포인트를 제시해주세요
4. 친근하고 이해하기 쉬운 한국어로 작성해주세요
5. 분량은 300-500단어로 작성해주세요

**중요**: 본 정보는 투자 권유가 아니며, 모든 투자 결정은 본인 책임임을 명시해주세요.
"""

    try:
        # Gemini 모델 생성
        model = genai.GenerativeModel('gemini-1.5-flash')

        # 브리핑 생성
        response = model.generate_content(prompt)
        briefing_text = response.text

        logger.info("브리핑 생성 완료")
        return briefing_text

    except Exception as e:
        logger.error(f"Gemini API 호출 실패: {e}", exc_info=True)
        raise


def generate_html_briefing(
    briefing_text: str,
    stocks: List[Dict[str, Any]],
    timestamp: str
) -> str:
    """
    HTML 형식의 브리핑 생성

    Args:
        briefing_text: 브리핑 텍스트
        stocks: 종목 리스트
        timestamp: 생성 시각

    Returns:
        str: HTML 브리핑
    """
    # 간단한 HTML 템플릿
    html = f"""
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>굿모닝 월가 - {timestamp}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #000;
            color: #fff;
        }}
        h1 {{
            color: #00D26A;
            border-bottom: 2px solid #00D26A;
            padding-bottom: 10px;
        }}
        .stock-item {{
            background: #1a1a1a;
            border-left: 3px solid #00D26A;
            padding: 15px;
            margin: 10px 0;
        }}
        .positive {{ color: #00D26A; }}
        .negative {{ color: #FF4757; }}
        .briefing {{
            background: #1a1a1a;
            padding: 20px;
            margin: 20px 0;
            line-height: 1.6;
            white-space: pre-wrap;
        }}
        .footer {{
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #333;
            color: #888;
            font-size: 12px;
        }}
    </style>
</head>
<body>
    <h1>🌅 굿모닝 월가</h1>
    <p style="color: #888;">생성 시각: {timestamp}</p>

    <h2>📈 오늘의 화제 종목</h2>
"""

    # 종목 리스트 추가
    for stock in stocks[:5]:
        change_class = "positive" if stock.get("change_percent", 0) > 0 else "negative"
        html += f"""
    <div class="stock-item">
        <h3>{stock['symbol']} - {stock['name']}</h3>
        <p>현재가: ${stock.get('price', 0):.2f}
        <span class="{change_class}">({stock.get('change_percent', 0):+.2f}%)</span></p>
    </div>
"""

    # 브리핑 내용 추가
    html += f"""
    <h2>📰 브리핑</h2>
    <div class="briefing">{briefing_text}</div>

    <div class="footer">
        <p>본 정보는 투자 권유가 아닙니다. 투자 결정은 본인 판단에 따라 신중히 하세요.</p>
        <p>© 2025 굿모닝 월가. All rights reserved.</p>
    </div>
</body>
</html>
"""

    return html


def save_briefing(
    briefing_text: str,
    html_content: str,
    stocks: List[Dict[str, Any]],
    output_dir: Path
) -> tuple[str, str]:
    """
    브리핑 결과 저장

    Returns:
        tuple: (json_path, html_path)
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # JSON 저장
    json_data = {
        "timestamp": datetime.now().isoformat(),
        "briefing": briefing_text,
        "stocks": stocks,
        "success": True
    }

    json_filename = f"briefing_{timestamp}.json"
    json_path = output_dir / json_filename

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)

    logger.info(f"JSON 브리핑 저장 완료: {json_path}")

    # HTML 저장
    html_filename = f"briefing_{timestamp}.html"
    html_path = output_dir / html_filename

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    logger.info(f"HTML 브리핑 저장 완료: {html_path}")

    return str(json_path), str(html_path)


def run_briefing_generation() -> Dict[str, Any]:
    """
    브리핑 생성 실행

    Returns:
        Dict: 생성 결과
    """
    logger.info("=" * 60)
    logger.info("브리핑 생성 시작")
    logger.info("=" * 60)

    try:
        # Gemini API 설정
        configure_gemini()

        # 최근 스크리닝 결과 로드
        screening_data = load_latest_screening()
        if not screening_data or not screening_data.get("success"):
            raise ValueError("유효한 스크리닝 결과를 찾을 수 없습니다.")

        stocks = screening_data.get("stocks", [])
        if not stocks:
            raise ValueError("화제 종목이 없습니다.")

        logger.info(f"{len(stocks)}개 화제 종목 발견")

        # 뉴스 수집
        news_data = collect_news_for_stocks(stocks)

        # 브리핑 생성
        briefing_text = generate_briefing_with_gemini(stocks, news_data)

        # HTML 생성
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        html_content = generate_html_briefing(briefing_text, stocks, timestamp)

        # 결과 저장
        output_dir = Path(__file__).parent.parent / "output"
        output_dir.mkdir(exist_ok=True)

        json_path, html_path = save_briefing(
            briefing_text, html_content, stocks, output_dir
        )

        logger.info("=" * 60)
        logger.info("브리핑 생성 완료")
        logger.info(f"JSON: {json_path}")
        logger.info(f"HTML: {html_path}")
        logger.info("=" * 60)

        return {
            "success": True,
            "json_path": json_path,
            "html_path": html_path,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        error_msg = f"브리핑 생성 실패: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise


def main():
    """메인 실행 함수"""
    try:
        result = run_briefing_generation()

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
