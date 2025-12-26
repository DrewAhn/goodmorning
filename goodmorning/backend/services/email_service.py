"""
이메일 발송 서비스

생성된 브리핑을 이메일로 발송합니다.
GitHub Actions 워크플로우에서 실행됩니다.
"""

import os
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from typing import Dict, Any, List, Optional

from .utils import LoggerFactory

# 로깅 설정
logger = LoggerFactory.get_logger(__name__)


class EmailConfig:
    """이메일 설정 클래스"""

    def __init__(self):
        """환경 변수에서 이메일 설정 로드"""
        self.host = os.getenv("EMAIL_HOST")
        self.port = int(os.getenv("EMAIL_PORT", "587"))
        self.user = os.getenv("EMAIL_USER")
        self.password = os.getenv("EMAIL_PASSWORD")
        self.from_email = os.getenv("EMAIL_FROM")
        self.to_emails = os.getenv("EMAIL_TO", "").split(",")

        # 빈 문자열 제거
        self.to_emails = [email.strip() for email in self.to_emails if email.strip()]

        self._validate()

    def _validate(self):
        """설정 유효성 검사"""
        required_fields = {
            "EMAIL_HOST": self.host,
            "EMAIL_USER": self.user,
            "EMAIL_PASSWORD": self.password,
            "EMAIL_FROM": self.from_email,
            "EMAIL_TO": self.to_emails
        }

        missing = [key for key, value in required_fields.items() if not value]

        if missing:
            raise ValueError(
                f"필수 환경 변수가 설정되지 않았습니다: {', '.join(missing)}"
            )

        logger.info("이메일 설정 로드 완료")
        logger.info(f"SMTP 서버: {self.host}:{self.port}")
        logger.info(f"발신자: {self.from_email}")
        logger.info(f"수신자: {len(self.to_emails)}명")


def load_latest_briefing() -> Optional[str]:
    """
    가장 최근의 HTML 브리핑 로드

    Returns:
        str: HTML 브리핑 내용 또는 None
    """
    output_dir = Path(__file__).parent.parent / "output"

    if not output_dir.exists():
        logger.warning("output 디렉토리가 존재하지 않습니다.")
        return None

    # briefing_*.html 파일 찾기
    briefing_files = list(output_dir.glob("briefing_*.html"))

    if not briefing_files:
        logger.warning("브리핑 HTML 파일을 찾을 수 없습니다.")
        return None

    # 가장 최근 파일 선택
    latest_file = max(briefing_files, key=lambda f: f.stat().st_mtime)
    logger.info(f"브리핑 파일 로드: {latest_file}")

    with open(latest_file, 'r', encoding='utf-8') as f:
        return f.read()


def create_email_message(
    html_content: str,
    from_email: str,
    to_email: str,
    subject: str
) -> MIMEMultipart:
    """
    이메일 메시지 생성

    Args:
        html_content: HTML 본문
        from_email: 발신자
        to_email: 수신자
        subject: 제목

    Returns:
        MIMEMultipart: 이메일 메시지
    """
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email

    # HTML 파트 추가
    html_part = MIMEText(html_content, 'html', 'utf-8')
    msg.attach(html_part)

    return msg


def send_email(
    config: EmailConfig,
    html_content: str,
    subject: str
) -> Dict[str, Any]:
    """
    이메일 발송

    Args:
        config: 이메일 설정
        html_content: HTML 본문
        subject: 제목

    Returns:
        Dict: 발송 결과
    """
    logger.info("=" * 60)
    logger.info("이메일 발송 시작")
    logger.info("=" * 60)

    sent_count = 0
    failed_count = 0
    failed_emails = []

    try:
        # SMTP 서버 연결
        logger.info(f"SMTP 서버 연결 중: {config.host}:{config.port}")

        with smtplib.SMTP(config.host, config.port) as server:
            server.ehlo()

            # TLS 시작 (포트 587 사용 시)
            if config.port == 587:
                server.starttls()
                server.ehlo()

            # 로그인
            logger.info("SMTP 서버 로그인 중...")
            server.login(config.user, config.password)
            logger.info("로그인 성공")

            # 각 수신자에게 발송
            for to_email in config.to_emails:
                try:
                    logger.info(f"이메일 발송 중: {to_email}")

                    # 메시지 생성
                    msg = create_email_message(
                        html_content,
                        config.from_email,
                        to_email,
                        subject
                    )

                    # 발송
                    server.send_message(msg)
                    sent_count += 1

                    logger.info(f"✓ 발송 성공: {to_email}")

                except Exception as e:
                    failed_count += 1
                    failed_emails.append(to_email)
                    logger.error(f"✗ 발송 실패 ({to_email}): {e}")

        logger.info("=" * 60)
        logger.info(f"이메일 발송 완료: 성공 {sent_count}건, 실패 {failed_count}건")
        logger.info("=" * 60)

        return {
            "success": failed_count == 0,
            "sent_count": sent_count,
            "failed_count": failed_count,
            "failed_emails": failed_emails,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        error_msg = f"이메일 발송 중 오류 발생: {str(e)}"
        logger.error(error_msg, exc_info=True)

        return {
            "success": False,
            "sent_count": sent_count,
            "failed_count": len(config.to_emails) - sent_count,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }


def run_email_delivery() -> Dict[str, Any]:
    """
    이메일 발송 실행

    Returns:
        Dict: 발송 결과
    """
    try:
        # 이메일 설정 로드
        config = EmailConfig()

        # 최근 브리핑 로드
        html_content = load_latest_briefing()
        if not html_content:
            raise ValueError("브리핑 파일을 찾을 수 없습니다.")

        # 제목 생성
        today = datetime.now().strftime("%Y-%m-%d")
        subject = f"🌅 굿모닝 월가 - {today} 데일리 브리핑"

        # 이메일 발송
        result = send_email(config, html_content, subject)

        return result

    except Exception as e:
        error_msg = f"이메일 발송 실패: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise


def main():
    """메인 실행 함수"""
    try:
        result = run_email_delivery()

        if result["success"]:
            logger.info("프로그램 정상 종료")
            print(f"✓ {result['sent_count']}건의 이메일이 성공적으로 발송되었습니다.")
            exit(0)
        else:
            logger.error("프로그램 비정상 종료")
            print(f"✗ 이메일 발송 실패: {result.get('error', 'Unknown error')}")
            print(f"  성공: {result['sent_count']}건, 실패: {result['failed_count']}건")
            exit(1)

    except Exception as e:
        logger.error(f"프로그램 실행 중 오류 발생: {e}")
        print(f"✗ 오류: {e}")
        exit(1)


if __name__ == "__main__":
    main()
