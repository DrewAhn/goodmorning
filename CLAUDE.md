# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"굿모닝 월가 (Good Morning, Wall Street)" is a daily briefing dashboard for Korean investors in US stocks. It automatically selects trending stocks based on Yahoo Finance data and provides AI-summarized briefings via email or Slack.

## Development Commands

All commands should be run from the `goodmorning/` subdirectory:

```bash
cd goodmorning

# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React

### Project Structure

```
goodmorning/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with Header/Footer
│   │   ├── page.tsx            # Main dashboard
│   │   └── briefing/[id]/      # Briefing detail page
│   ├── components/             # React components
│   ├── contexts/               # React contexts (ThemeContext)
│   └── lib/
│       └── mockData.ts         # Mock data (no real API yet)
```

### Key Components
- **StockCard**: Displays individual stock information with charts
- **MarketOverview**: Shows NASDAQ, S&P 500, DOW indices
- **StockChart**: Interactive price charts using Recharts
- **ThemeToggle**: Dark/light mode switcher

### Data Flow
Currently uses mock data in `src/lib/mockData.ts`. Future implementation will connect to:
- Yahoo Finance API for stock data
- SendGrid for email delivery
- Slack webhooks for notifications

### Design System
- **Colors**: Green (#00D26A) for gains, Red (#FF4757) for losses
- **Theme**: Dark mode default (#0D1117 background), light mode supported
- **Responsive**: Mobile < 768px, Tablet 768-1024px, Desktop > 1024px

## Development Rules

### 개발일지 작성 (Required)

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
