# 🌅 굿모닝 월가 (Good Morning, Wall Street)

한국인 투자자를 위한 미국주식 데일리 브리핑 대시보드

## 🚀 시작하기

### 설치

```bash
cd goodmorning-wallstreet
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
goodmorning-wallstreet/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 루트 레이아웃 (헤더, 푸터)
│   │   ├── page.tsx            # 메인 대시보드
│   │   ├── globals.css         # 전역 스타일
│   │   └── briefing/
│   │       └── [id]/
│   │           └── page.tsx    # 브리핑 상세 페이지
│   ├── components/
│   │   ├── StockCard.tsx           # 종목 카드 컴포넌트
│   │   ├── MarketOverview.tsx      # 시장 개요 컴포넌트
│   │   ├── BriefingHistoryCard.tsx # 브리핑 히스토리 카드
│   │   └── GenerateBriefingButton.tsx # 브리핑 생성 버튼
│   └── lib/
│       └── mockData.ts         # 목업 데이터
├── tailwind.config.ts          # TailwindCSS 설정
├── package.json
└── README.md
```

## 🎨 디자인 시스템

### 컬러 팔레트

| 용도 | 색상 | 코드 |
|------|------|------|
| 상승 (Positive) | 🟢 | `#00D26A` |
| 하락 (Negative) | 🔴 | `#FF4757` |
| 배경 | ⚫ | `#0D1117` |
| 카드 | ⬛ | `#161B22` |
| 테두리 | 🔘 | `#30363D` |
| 강조 | 🔵 | `#58A6FF` |

### 반응형 브레이크포인트

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 📱 페이지 구성

### 1. 메인 대시보드 (`/`)

- **시장 개요**: NASDAQ, S&P 500, DOW 지수
- **TOP 1 화제 종목**: 가장 주목받는 종목 상세 정보
- **화제 종목 TOP 2-5**: 나머지 화제 종목 카드
- **브리핑 히스토리**: 최근 발송된 브리핑 목록
- **수동 브리핑 생성 버튼**: 즉시 브리핑 생성

### 2. 브리핑 상세 페이지 (`/briefing/[id]`)

- **브리핑 이미지 미리보기**: 발송될 이미지 형태 미리보기
- **브리핑 텍스트**: 전체 텍스트 버전 (복사 가능)
- **발송 버튼**: 이메일/슬랙 발송 모달
- **발송 히스토리**: 과거 발송 내역

## 🧩 컴포넌트

### StockCard

종목 정보를 표시하는 카드 컴포넌트

```tsx
<StockCard stock={stockData} isTop={true} />
```

**Props:**
- `stock`: 종목 데이터 객체
- `isTop`: TOP 1 종목 여부 (하이라이트 표시)

### MarketOverview

시장 지수 개요 컴포넌트

```tsx
<MarketOverview data={marketData} />
```

### BriefingHistoryCard

브리핑 히스토리 카드 (클릭 시 상세 페이지 이동)

```tsx
<BriefingHistoryCard briefing={briefingData} />
```

### GenerateBriefingButton

수동 브리핑 생성 버튼 (로딩/성공 상태 표시)

```tsx
<GenerateBriefingButton />
```

## 🔧 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **Icons**: Lucide React (선택적)

## 📊 목업 데이터

현재 `src/lib/mockData.ts`에 목업 데이터가 포함되어 있습니다.
실제 서비스에서는 API 연동이 필요합니다.

### API 연동 예시

```typescript
// 화제 종목 조회
const response = await fetch('/api/stocks/trending?limit=5')
const data = await response.json()

// 브리핑 생성
const response = await fetch('/api/briefings', {
  method: 'POST',
  body: JSON.stringify({ stock_count: 5 })
})
```

## 📝 TODO

- [ ] 실제 API 연동 (yahooquery)
- [ ] 이메일 발송 기능 구현 (SendGrid)
- [ ] 슬랙 웹훅 연동
- [ ] 사용자 인증 추가
- [ ] 구독자 관리 페이지
- [ ] 브리핑 이미지 생성 기능

## 📄 라이선스

MIT License


