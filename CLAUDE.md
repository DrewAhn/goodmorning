# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트명: Good morning, Wall Street (굿모닝 월가)

## 프로젝트 개요

미국주식 데일리 브리핑 서비스 "굿모닝 월가"

한국 투자자를 위한 미국 주식 시장 데일리 브리핑 대시보드입니다. Yahoo Finance 데이터를 기반으로 화제 종목을 자동 선정하고, AI가 요약한 브리핑을 제공합니다.

## 기술 스택

- **Frontend**: Next.js 14 (1주차 프로토타입 완성)
  - TypeScript
  - TailwindCSS
  - Recharts (차트)
  - Lucide React (아이콘)

- **Backend**: FastAPI, Python 3.12+ (예정)

- **데이터 수집**: yahooquery (Screener, 종목 정보)

- **뉴스 검색**: Exa API

- **AI**: Gemini API

## 폴더 구조

```
/
├── goodmorning/              # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/              # Next.js App Router 페이지
│   │   │   ├── layout.tsx    # 루트 레이아웃 (Header/Footer)
│   │   │   ├── page.tsx      # 메인 대시보드
│   │   │   └── briefing/[id]/ # 브리핑 상세 페이지
│   │   ├── components/       # React 컴포넌트
│   │   ├── contexts/         # React Context (ThemeContext)
│   │   └── lib/
│   │       └── mockData.ts   # Mock 데이터
│   └── package.json
│
├── backend/                  # FastAPI 서버 (예정)
│   └── services/             # 비즈니스 로직 (예정)
│
├── 개발일지/                  # 개발 기록
├── 스크린샷/                  # 프로젝트 스크린샷
└── 기획서_굿모닝_월가.md      # 프로젝트 기획서
```

## 개발 명령어

### Frontend (goodmorning/)

```bash
cd goodmorning

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅
npm run lint
```

### Backend (예정)

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
venv\Scripts\activate  # Windows

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
uvicorn main:app --reload
```

## 컨벤션

### Frontend (TypeScript/React)
- **함수명**: camelCase (예: `formatNumber`, `generateChartData`)
- **컴포넌트/타입**: PascalCase (예: `StockCard`, `ChartDataPoint`)
- **변수명**: camelCase

### Backend (Python/FastAPI) - 예정
- **함수명**: snake_case (예: `get_trending_stocks`)
- **클래스명**: PascalCase (예: `StockService`)
- **변수명**: snake_case

### 공통
- **주석**: 한글로 작성

## 주요 컴포넌트 및 아키텍처

### 컴포넌트 (goodmorning/src/components/)
- **StockCard**: 개별 종목 정보 및 차트 표시
- **MarketOverview**: NASDAQ, S&P 500, DOW 지수 표시
- **StockChart**: Recharts 기반 인터랙티브 차트
- **ThemeToggle**: 다크/라이트 모드 전환
- **BriefingHistoryCard**: 브리핑 히스토리 카드
- **GenerateBriefingButton**: 브리핑 생성 버튼
- **Header/Footer**: 레이아웃 컴포넌트 (app/layout.tsx에서 사용)
- **Providers**: ThemeContext를 제공하는 클라이언트 컴포넌트

### 상태 관리 및 테마
- **ThemeContext (contexts/ThemeContext.tsx)**: React Context API를 사용한 다크/라이트 모드 상태 관리
- **Providers 컴포넌트**: 'use client' 지시어를 사용하여 서버/클라이언트 경계 분리
- 테마 상태는 localStorage에 저장되어 새로고침 시에도 유지됨

### 데이터 구조
- **mockData.ts**: 현재 API 연동 전까지 사용하는 Mock 데이터
- 주요 타입: Stock, MarketIndex, Briefing 등

## 디자인 시스템

- **Colors**: 상승 Green (#00D26A), 하락 Red (#FF4757)
- **Theme**: 다크 모드 기본 (#0D1117 배경), 라이트 모드 지원 (#FFFFFF 배경)
- **Responsive**: Mobile < 768px, Tablet 768-1024px, Desktop > 1024px
- **카드 스타일**: border-border (다크: #30363D), rounded-lg

## 개발 규칙

### 개발일지 작성 (필수)

모든 개발 단계별로 개발일지를 `개발일지/` 폴더에 마크다운 파일로 작성해야 합니다.

**파일명 형식**: `YYYY-MM-DD_HH-mm-ss_개발일지_제목.md`

**필수 포함 내용**:
1. **작성시각**: 개발일지 작성 날짜와 시간
2. **해결하고자 한 문제**: 해당 단계에서 해결하려고 했던 문제나 목표
3. **해결된 것**: 성공적으로 해결된 문제나 완료된 작업
4. **해결되지 않은 것**: 아직 해결하지 못한 문제나 미완료된 작업
5. **향후 개발을 위한 컨텍스트**: 다음 단계 개발을 위해 필요한 정보, 참고사항, 기술적 결정사항 등

### 백엔드 테스트 규칙

백엔드 로직에서 API 함수나 클래스를 구현할 때마다 테스트를 철저히 수행해야 합니다.
- 각 함수/클래스 구현 후 반드시 테스트 실행
- 테스트가 검증되었을 때만 다음 단계로 진행
- 테스트 실패 시 문제 해결 후 재검증
