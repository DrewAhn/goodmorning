# GitHub Actions 설정 가이드

## Daily Stock Briefing Workflow

매일 한국시간 오전 7시에 자동으로 실행되는 주식 브리핑 워크플로우입니다.

### 실행 시간
- **스케줄**: 매일 UTC 22:00 (한국시간 오전 7시)
- **수동 실행**: GitHub Actions 탭에서 "Run workflow" 버튼으로 수동 실행 가능

### 워크플로우 단계

1. **화제 종목 조회** (`screener_service.py`)
   - Yahoo Finance에서 화제 종목 스크리닝
   - 거래량 상위 + 상승률 상위 종목 선정

2. **브리핑 생성** (`briefing_service.py`)
   - Exa API로 뉴스 검색
   - Gemini API로 브리핑 요약 생성

3. **이메일 발송** (`email_service.py`) - **선택사항**
   - 이메일 Secrets이 설정된 경우에만 실행
   - 설정하지 않아도 워크플로우는 정상 동작

4. **아티팩트 저장**
   - 생성된 브리핑 파일(JSON, HTML) 저장
   - 30일간 보관

## GitHub Secrets 설정

### 필수 Secrets (반드시 설정)

워크플로우 실행을 위해 다음 Secrets은 **반드시** 설정해야 합니다:

**Repository Settings → Secrets and variables → Actions → New repository secret**

```
GEMINI_API_KEY       # Google Gemini API 키 (필수)
EXA_API_KEY          # Exa Search API 키 (필수)
```

### 선택적 Secrets (이메일 발송을 원하는 경우)

이메일 발송 기능을 사용하려면 추가로 설정:

```
EMAIL_HOST           # SMTP 서버 주소 (예: smtp.gmail.com)
EMAIL_PORT           # SMTP 포트 (예: 587)
EMAIL_USER           # 발신 이메일 계정
EMAIL_PASSWORD       # 이메일 계정 비밀번호 (앱 비밀번호 권장)
EMAIL_FROM           # 발신자 이메일 주소
EMAIL_TO             # 수신자 이메일 주소 (쉼표로 구분)
```

**참고**: 이메일 Secrets을 설정하지 않아도 워크플로우는 정상적으로 실행되며, 브리핑 파일은 아티팩트로 다운로드할 수 있습니다.

## API 키 발급 방법

### Gemini API
1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. "Create API Key" 클릭
3. 생성된 키를 `GEMINI_API_KEY`에 저장

### Exa API
1. [Exa](https://exa.ai/) 가입
2. Dashboard에서 API Key 발급
3. 생성된 키를 `EXA_API_KEY`에 저장

### Gmail SMTP (선택사항 - 이메일 발송을 원하는 경우)
1. Google 계정 → 보안 → 2단계 인증 활성화
2. 앱 비밀번호 생성
3. 생성된 16자리 비밀번호를 `EMAIL_PASSWORD`에 저장
4. 설정 예시:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=앱비밀번호16자리
   EMAIL_FROM=your-email@gmail.com
   EMAIL_TO=recipient@example.com
   ```

**참고**: 이메일 설정이 복잡하다면 생략하고, 아티팩트 다운로드로 브리핑을 확인할 수 있습니다.

## 수동 실행 방법

1. GitHub 저장소 → Actions 탭
2. "Daily Stock Briefing" 워크플로우 선택
3. "Run workflow" 버튼 클릭
4. 브랜치 선택 후 "Run workflow"

## 워크플로우 로그 확인

1. GitHub 저장소 → Actions 탭
2. 실행된 워크플로우 클릭
3. 각 단계별 로그 확인 가능

## 생성된 아티팩트 다운로드

1. 워크플로우 실행 완료 후 "Artifacts" 섹션에서 다운로드
2. 파일 형식: JSON (데이터), HTML (이메일 템플릿)
3. 보관 기간: 30일

## 트러블슈팅

### 워크플로우 실패 시
1. Actions 탭에서 실패한 단계 확인
2. 로그에서 에러 메시지 확인
3. 필수 Secrets 설정 확인 (`GEMINI_API_KEY`, `EXA_API_KEY`)
4. API 키 유효성 확인

### 이메일 발송 실패 시 (선택사항)
**참고**: 이메일 발송은 선택사항이므로 실패해도 워크플로우는 성공으로 처리됩니다.

만약 이메일 발송을 사용하고 싶다면:
- SMTP 서버 주소와 포트 확인
- 이메일 계정의 "보안 수준이 낮은 앱 액세스" 또는 앱 비밀번호 설정 확인
- 방화벽이나 네트워크 제한 확인

## 참고사항

- Yahoo Finance API는 별도 인증이 필요 없습니다
- 워크플로우는 `main` 브랜치 기준으로 실행됩니다
- 실행 시간은 GitHub 서버 부하에 따라 몇 분 차이가 날 수 있습니다
- **최소 요구사항**: `GEMINI_API_KEY`와 `EXA_API_KEY`만 설정하면 워크플로우가 실행됩니다
- 이메일 발송 없이도 아티팩트 다운로드로 브리핑을 확인할 수 있습니다
