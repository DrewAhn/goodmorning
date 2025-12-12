# 굿모닝 월가 REST API 명세서

## 개요

| 항목 | 내용 |
|------|------|
| **Base URL** | `https://api.goodmorning-wallstreet.com/v1` |
| **인증 방식** | Bearer Token (JWT) |
| **응답 형식** | JSON |
| **문자 인코딩** | UTF-8 |

### 공통 응답 구조

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2025-12-10T09:00:00Z"
}
```

### 공통 에러 응답

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": { ... }
  },
  "timestamp": "2025-12-10T09:00:00Z"
}
```

---

## 1. 화제 종목 조회 API

Yahoo Finance Screener를 활용하여 오늘의 화제 종목 목록을 조회합니다.

### 1.1 화제 종목 목록 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/stocks/trending` |
| **인증** | 선택 (비인증 시 제한된 결과) |

#### Request Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `type` | string | ❌ | `all` | `most_actives`, `day_gainers`, `day_losers`, `all` |
| `limit` | integer | ❌ | `10` | 조회할 종목 수 (최대 25) |
| `market` | string | ❌ | `us` | 시장 (`us`, `nasdaq`, `nyse`) |

#### Request 예시

```http
GET /v1/stocks/trending?type=most_actives&limit=5
Authorization: Bearer {token}
```

#### Response 성공 (200 OK)

```json
{
  "success": true,
  "data": {
    "market_date": "2025-12-09",
    "market_status": "closed",
    "trending_stocks": [
      {
        "rank": 1,
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "price": 142.50,
        "change": 8.25,
        "change_percent": 6.15,
        "volume": 58420000,
        "market_cap": 3500000000000,
        "pe_ratio": 65.2,
        "selection_reason": "거래량 상위 + 상승 종목",
        "confidence": "HIGH"
      },
      {
        "rank": 2,
        "symbol": "TSLA",
        "name": "Tesla, Inc.",
        "price": 275.80,
        "change": 12.40,
        "change_percent": 4.71,
        "volume": 42150000,
        "market_cap": 875000000000,
        "pe_ratio": 78.5,
        "selection_reason": "거래량 상위 + 상승 종목",
        "confidence": "HIGH"
      }
    ],
    "total_count": 5,
    "data_source": "yahoo_finance"
  },
  "error": null,
  "timestamp": "2025-12-10T09:00:00Z"
}
```

#### Error Cases

| HTTP Code | Error Code | 설명 |
|-----------|------------|------|
| 400 | `INVALID_TYPE` | 유효하지 않은 type 파라미터 |
| 400 | `INVALID_LIMIT` | limit 범위 초과 (1-25) |
| 503 | `DATA_SOURCE_UNAVAILABLE` | Yahoo Finance 연결 실패 |
| 503 | `MARKET_DATA_NOT_FOUND` | 시장 데이터 없음 (휴장일 등) |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "MARKET_DATA_NOT_FOUND",
    "message": "시장 데이터를 찾을 수 없습니다. 휴장일일 수 있습니다.",
    "details": {
      "market_date": "2025-12-25",
      "reason": "Christmas Day"
    }
  },
  "timestamp": "2025-12-25T09:00:00Z"
}
```

---

## 2. 종목 상세 정보 API

특정 종목의 상세 정보와 초보자용 해설을 제공합니다.

### 2.1 종목 상세 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/stocks/{symbol}` |
| **인증** | 선택 |

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `symbol` | string | ✅ | 종목 티커 (예: `AAPL`, `NVDA`) |

#### Request Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `include_guide` | boolean | ❌ | `true` | 초보자용 해설 포함 여부 |
| `include_news` | boolean | ❌ | `true` | 관련 뉴스 포함 여부 |
| `news_limit` | integer | ❌ | `3` | 뉴스 개수 (최대 10) |

#### Request 예시

```http
GET /v1/stocks/NVDA?include_guide=true&include_news=true&news_limit=3
Authorization: Bearer {token}
```

#### Response 성공 (200 OK)

```json
{
  "success": true,
  "data": {
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "sector": "Technology",
    "industry": "Semiconductors",
    "price_info": {
      "current_price": 142.50,
      "previous_close": 134.25,
      "open": 135.00,
      "day_high": 145.20,
      "day_low": 134.80,
      "change": 8.25,
      "change_percent": 6.15,
      "volume": 58420000,
      "avg_volume_10d": 45000000
    },
    "fundamentals": {
      "market_cap": 3500000000000,
      "pe_ratio": 65.2,
      "eps": 2.19,
      "dividend_yield": 0.03,
      "52week_high": 152.89,
      "52week_low": 76.32
    },
    "beginner_guide": {
      "price_summary": "현재 1주당 $142.50이며, 어제보다 $8.25(+6.15%) 올랐습니다.",
      "volume_summary": "오늘 5,842만 주가 거래되어 평소(4,500만 주)보다 30% 많은 관심을 받았습니다.",
      "market_cap_summary": "회사 전체 가치는 약 3.5조 달러로, 미국 시장에서 가장 큰 기업 중 하나입니다.",
      "pe_ratio_summary": "P/E 65.2는 투자자들이 이 회사의 미래 성장에 높은 기대를 갖고 있음을 의미합니다.",
      "overall_assessment": "AI 반도체 시장 선두주자로, 높은 거래량과 상승세가 지속되고 있습니다."
    },
    "related_news": [
      {
        "title": "NVIDIA, 신규 AI 칩 발표로 주가 급등",
        "summary": "엔비디아가 차세대 AI 가속기 'Blackwell Ultra'를 공개하며 주가가 6% 상승했습니다.",
        "source": "Reuters",
        "published_at": "2025-12-09T16:30:00Z",
        "url": "https://reuters.com/..."
      },
      {
        "title": "AI 데이터센터 투자 확대, NVIDIA 수혜 전망",
        "summary": "주요 빅테크 기업들의 AI 인프라 투자 확대로 엔비디아 매출 성장 기대감이 커지고 있습니다.",
        "source": "Bloomberg",
        "published_at": "2025-12-09T14:00:00Z",
        "url": "https://bloomberg.com/..."
      }
    ],
    "last_updated": "2025-12-10T09:00:00Z"
  },
  "error": null,
  "timestamp": "2025-12-10T09:00:00Z"
}
```

#### Error Cases

| HTTP Code | Error Code | 설명 |
|-----------|------------|------|
| 400 | `INVALID_SYMBOL` | 유효하지 않은 티커 형식 |
| 404 | `STOCK_NOT_FOUND` | 존재하지 않는 종목 |
| 503 | `DATA_FETCH_FAILED` | 데이터 조회 실패 |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "STOCK_NOT_FOUND",
    "message": "종목을 찾을 수 없습니다.",
    "details": {
      "symbol": "INVALID123",
      "suggestion": "티커 심볼을 확인해주세요. (예: AAPL, NVDA, TSLA)"
    }
  },
  "timestamp": "2025-12-10T09:00:00Z"
}
```

---

## 3. 브리핑 생성 API

화제 종목 정보를 기반으로 AI 브리핑(이미지 + 텍스트)을 생성합니다.

### 3.1 브리핑 생성 요청

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **Endpoint** | `/briefings` |
| **인증** | 필수 |

#### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `symbols` | string[] | ❌ | 브리핑할 종목 (미지정 시 자동 선정) |
| `stock_count` | integer | ❌ | 포함할 종목 수 (기본 5, 최대 10) |
| `format` | string | ❌ | `image`, `text`, `both` (기본: `both`) |
| `language` | string | ❌ | `ko`, `en` (기본: `ko`) |
| `include_guide` | boolean | ❌ | 초보자 해설 포함 (기본: `true`) |

#### Request 예시

```http
POST /v1/briefings
Authorization: Bearer {token}
Content-Type: application/json

{
  "stock_count": 5,
  "format": "both",
  "language": "ko",
  "include_guide": true
}
```

#### Response 성공 (201 Created)

```json
{
  "success": true,
  "data": {
    "briefing_id": "br_20251210_abc123",
    "created_at": "2025-12-10T09:00:00Z",
    "market_date": "2025-12-09",
    "status": "completed",
    "content": {
      "title": "🌅 굿모닝 월가 - 2025년 12월 10일",
      "subtitle": "어젯밤 미국 증시에서 가장 뜨거웠던 종목들",
      "summary": "나스닥 +1.2% 상승 마감. AI 반도체 섹터 강세 지속.",
      "stocks": [
        {
          "rank": 1,
          "symbol": "NVDA",
          "name": "NVIDIA Corporation",
          "price": 142.50,
          "change_percent": 6.15,
          "highlight": "🔥 거래량 1위 + 상승률 상위",
          "one_line_summary": "AI 칩 신제품 발표로 급등",
          "beginner_note": "엔비디아는 AI에 필요한 고성능 칩을 만드는 회사예요."
        }
      ],
      "market_overview": {
        "nasdaq": { "value": 16250.5, "change_percent": 1.2 },
        "sp500": { "value": 4850.2, "change_percent": 0.8 },
        "dow": { "value": 38500.0, "change_percent": 0.5 }
      },
      "footer": "본 정보는 투자 권유가 아닙니다. 투자 결정은 본인 판단에 따라 신중히 하세요."
    },
    "image": {
      "url": "https://cdn.goodmorning-wallstreet.com/briefings/br_20251210_abc123.png",
      "width": 1200,
      "height": 1600,
      "format": "png",
      "expires_at": "2025-12-17T09:00:00Z"
    },
    "text_version": "🌅 굿모닝 월가 - 2025년 12월 10일\n\n📊 오늘의 화제 종목 TOP 5\n\n1️⃣ NVDA (NVIDIA) $142.50 (+6.15%)\n   → AI 칩 신제품 발표로 급등\n..."
  },
  "error": null,
  "timestamp": "2025-12-10T09:00:00Z"
}
```

#### Error Cases

| HTTP Code | Error Code | 설명 |
|-----------|------------|------|
| 400 | `INVALID_SYMBOLS` | 유효하지 않은 종목 포함 |
| 400 | `STOCK_COUNT_EXCEEDED` | stock_count 최대값 초과 |
| 401 | `UNAUTHORIZED` | 인증 토큰 없음/만료 |
| 429 | `RATE_LIMIT_EXCEEDED` | 일일 생성 한도 초과 |
| 500 | `BRIEFING_GENERATION_FAILED` | 브리핑 생성 실패 |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "일일 브리핑 생성 한도를 초과했습니다.",
    "details": {
      "daily_limit": 10,
      "used": 10,
      "reset_at": "2025-12-11T00:00:00Z"
    }
  },
  "timestamp": "2025-12-10T15:00:00Z"
}
```

---

## 4. 발송 API

생성된 브리핑을 이메일 또는 슬랙으로 발송합니다.

### 4.1 이메일 발송

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **Endpoint** | `/delivery/email` |
| **인증** | 필수 |

#### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `briefing_id` | string | ✅ | 발송할 브리핑 ID |
| `recipients` | string[] | ✅ | 수신자 이메일 목록 (최대 50) |
| `subject` | string | ❌ | 이메일 제목 (미지정 시 자동 생성) |
| `schedule_at` | string | ❌ | 예약 발송 시간 (ISO 8601) |

#### Request 예시

```http
POST /v1/delivery/email
Authorization: Bearer {token}
Content-Type: application/json

{
  "briefing_id": "br_20251210_abc123",
  "recipients": ["user@example.com"],
  "subject": "🌅 굿모닝 월가 - 오늘의 화제 종목"
}
```

#### Response 성공 (202 Accepted)

```json
{
  "success": true,
  "data": {
    "delivery_id": "del_email_xyz789",
    "briefing_id": "br_20251210_abc123",
    "channel": "email",
    "status": "queued",
    "recipients_count": 1,
    "scheduled_at": null,
    "estimated_delivery": "2025-12-10T09:01:00Z"
  },
  "error": null,
  "timestamp": "2025-12-10T09:00:30Z"
}
```

### 4.2 슬랙 발송

| 항목 | 내용 |
|------|------|
| **Method** | `POST` |
| **Endpoint** | `/delivery/slack` |
| **인증** | 필수 |

#### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `briefing_id` | string | ✅ | 발송할 브리핑 ID |
| `webhook_url` | string | ✅* | 슬랙 웹훅 URL (*또는 channel_id) |
| `channel_id` | string | ✅* | 슬랙 채널 ID (*또는 webhook_url) |
| `mention` | string | ❌ | 멘션 대상 (`@channel`, `@here`, 또는 user_id) |

#### Request 예시

```http
POST /v1/delivery/slack
Authorization: Bearer {token}
Content-Type: application/json

{
  "briefing_id": "br_20251210_abc123",
  "webhook_url": "https://hooks.slack.com/services/T.../B.../xxx",
  "mention": "@channel"
}
```

#### Response 성공 (202 Accepted)

```json
{
  "success": true,
  "data": {
    "delivery_id": "del_slack_def456",
    "briefing_id": "br_20251210_abc123",
    "channel": "slack",
    "status": "sent",
    "slack_response": {
      "ok": true,
      "ts": "1702198800.000100"
    }
  },
  "error": null,
  "timestamp": "2025-12-10T09:00:30Z"
}
```

### 4.3 발송 상태 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/delivery/{delivery_id}` |
| **인증** | 필수 |

#### Response 성공 (200 OK)

```json
{
  "success": true,
  "data": {
    "delivery_id": "del_email_xyz789",
    "briefing_id": "br_20251210_abc123",
    "channel": "email",
    "status": "delivered",
    "created_at": "2025-12-10T09:00:30Z",
    "delivered_at": "2025-12-10T09:01:15Z",
    "recipients": [
      {
        "email": "user@example.com",
        "status": "delivered",
        "opened_at": "2025-12-10T09:15:00Z"
      }
    ],
    "stats": {
      "sent": 1,
      "delivered": 1,
      "opened": 1,
      "failed": 0
    }
  },
  "error": null,
  "timestamp": "2025-12-10T10:00:00Z"
}
```

#### Error Cases (발송 API 공통)

| HTTP Code | Error Code | 설명 |
|-----------|------------|------|
| 400 | `INVALID_BRIEFING_ID` | 존재하지 않는 브리핑 ID |
| 400 | `INVALID_RECIPIENTS` | 유효하지 않은 이메일 형식 |
| 400 | `RECIPIENTS_LIMIT_EXCEEDED` | 수신자 수 초과 (최대 50) |
| 400 | `INVALID_WEBHOOK_URL` | 유효하지 않은 슬랙 웹훅 URL |
| 401 | `UNAUTHORIZED` | 인증 실패 |
| 404 | `DELIVERY_NOT_FOUND` | 발송 내역 없음 |
| 502 | `SLACK_DELIVERY_FAILED` | 슬랙 발송 실패 |
| 502 | `EMAIL_DELIVERY_FAILED` | 이메일 발송 실패 |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "SLACK_DELIVERY_FAILED",
    "message": "슬랙 발송에 실패했습니다.",
    "details": {
      "slack_error": "channel_not_found",
      "webhook_url": "https://hooks.slack.com/...",
      "retry_available": true
    }
  },
  "timestamp": "2025-12-10T09:00:30Z"
}
```

---

## 5. 브리핑 히스토리 조회 API

과거 생성된 브리핑 목록 및 상세 내용을 조회합니다.

### 5.1 브리핑 목록 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/briefings` |
| **인증** | 필수 |

#### Request Query Parameters

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `page` | integer | ❌ | `1` | 페이지 번호 |
| `limit` | integer | ❌ | `20` | 페이지당 개수 (최대 50) |
| `start_date` | string | ❌ | - | 조회 시작일 (YYYY-MM-DD) |
| `end_date` | string | ❌ | - | 조회 종료일 (YYYY-MM-DD) |
| `status` | string | ❌ | `all` | `completed`, `failed`, `all` |

#### Request 예시

```http
GET /v1/briefings?page=1&limit=10&start_date=2025-12-01&end_date=2025-12-10
Authorization: Bearer {token}
```

#### Response 성공 (200 OK)

```json
{
  "success": true,
  "data": {
    "briefings": [
      {
        "briefing_id": "br_20251210_abc123",
        "market_date": "2025-12-09",
        "created_at": "2025-12-10T09:00:00Z",
        "status": "completed",
        "stock_count": 5,
        "top_stock": {
          "symbol": "NVDA",
          "name": "NVIDIA Corporation",
          "change_percent": 6.15
        },
        "delivery_summary": {
          "email_sent": 150,
          "email_opened": 95,
          "slack_sent": 3
        },
        "image_url": "https://cdn.goodmorning-wallstreet.com/briefings/br_20251210_abc123_thumb.png"
      },
      {
        "briefing_id": "br_20251209_def456",
        "market_date": "2025-12-08",
        "created_at": "2025-12-09T09:00:00Z",
        "status": "completed",
        "stock_count": 5,
        "top_stock": {
          "symbol": "TSLA",
          "name": "Tesla, Inc.",
          "change_percent": 4.25
        },
        "delivery_summary": {
          "email_sent": 148,
          "email_opened": 92,
          "slack_sent": 3
        },
        "image_url": "https://cdn.goodmorning-wallstreet.com/briefings/br_20251209_def456_thumb.png"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 45,
      "has_next": true,
      "has_prev": false
    }
  },
  "error": null,
  "timestamp": "2025-12-10T10:00:00Z"
}
```

### 5.2 브리핑 상세 조회

| 항목 | 내용 |
|------|------|
| **Method** | `GET` |
| **Endpoint** | `/briefings/{briefing_id}` |
| **인증** | 필수 |

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `briefing_id` | string | ✅ | 브리핑 ID |

#### Request 예시

```http
GET /v1/briefings/br_20251210_abc123
Authorization: Bearer {token}
```

#### Response 성공 (200 OK)

```json
{
  "success": true,
  "data": {
    "briefing_id": "br_20251210_abc123",
    "market_date": "2025-12-09",
    "created_at": "2025-12-10T09:00:00Z",
    "status": "completed",
    "content": {
      "title": "🌅 굿모닝 월가 - 2025년 12월 10일",
      "subtitle": "어젯밤 미국 증시에서 가장 뜨거웠던 종목들",
      "summary": "나스닥 +1.2% 상승 마감. AI 반도체 섹터 강세 지속.",
      "stocks": [
        {
          "rank": 1,
          "symbol": "NVDA",
          "name": "NVIDIA Corporation",
          "price": 142.50,
          "change_percent": 6.15,
          "volume": 58420000,
          "highlight": "🔥 거래량 1위 + 상승률 상위",
          "one_line_summary": "AI 칩 신제품 발표로 급등",
          "beginner_note": "엔비디아는 AI에 필요한 고성능 칩을 만드는 회사예요."
        }
      ],
      "market_overview": {
        "nasdaq": { "value": 16250.5, "change_percent": 1.2 },
        "sp500": { "value": 4850.2, "change_percent": 0.8 },
        "dow": { "value": 38500.0, "change_percent": 0.5 }
      }
    },
    "image": {
      "url": "https://cdn.goodmorning-wallstreet.com/briefings/br_20251210_abc123.png",
      "thumbnail_url": "https://cdn.goodmorning-wallstreet.com/briefings/br_20251210_abc123_thumb.png",
      "width": 1200,
      "height": 1600
    },
    "delivery_history": [
      {
        "delivery_id": "del_email_xyz789",
        "channel": "email",
        "sent_at": "2025-12-10T09:01:00Z",
        "recipients_count": 150,
        "opened_count": 95
      },
      {
        "delivery_id": "del_slack_def456",
        "channel": "slack",
        "sent_at": "2025-12-10T09:01:30Z",
        "status": "delivered"
      }
    ]
  },
  "error": null,
  "timestamp": "2025-12-10T10:00:00Z"
}
```

#### Error Cases

| HTTP Code | Error Code | 설명 |
|-----------|------------|------|
| 400 | `INVALID_DATE_RANGE` | 유효하지 않은 날짜 범위 |
| 401 | `UNAUTHORIZED` | 인증 실패 |
| 404 | `BRIEFING_NOT_FOUND` | 존재하지 않는 브리핑 |

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BRIEFING_NOT_FOUND",
    "message": "해당 브리핑을 찾을 수 없습니다.",
    "details": {
      "briefing_id": "br_invalid_id"
    }
  },
  "timestamp": "2025-12-10T10:00:00Z"
}
```

---

## 6. API 요약

| Method | Endpoint | 기능 | Request | Response | Response 출처 |
|--------|----------|------|---------|----------|---------------|
| `GET` | `/stocks/trending` | 화제 종목 목록 조회 | `?type`, `?limit`, `?market` | `symbol`, `name`, `price`, `change_percent`, `volume`, `market_cap`, `pe_ratio`, `selection_reason`, `confidence` | `symbol`~`pe_ratio`: **yahooquery** / `selection_reason`, `confidence`: **서비스 로직** |
| `GET` | `/stocks/{symbol}` | 종목 상세 + 초보자 해설 | `?include_guide`, `?include_news` | `price_info`, `fundamentals`, `beginner_guide`, `related_news` | `price_info`, `fundamentals`: **yahooquery** / `beginner_guide`: **AI 생성** / `related_news`: **뉴스 API** |
| `POST` | `/briefings` | AI 브리핑 생성 | `symbols`, `stock_count`, `format`, `language` | `briefing_id`, `content`, `image`, `text_version` | `content.stocks`: **yahooquery + 서비스 로직** / `image`: **이미지 생성 서비스** |
| `GET` | `/briefings` | 브리핑 히스토리 목록 | `?page`, `?limit`, `?start_date`, `?end_date` | `briefings[]`, `pagination` | **DB (자체 저장)** |
| `GET` | `/briefings/{id}` | 브리핑 상세 조회 | - | `content`, `image`, `delivery_history` | **DB (자체 저장)** |
| `POST` | `/delivery/email` | 이메일 발송 | `briefing_id`, `recipients`, `subject` | `delivery_id`, `status`, `estimated_delivery` | **이메일 서비스 (SendGrid 등)** |
| `POST` | `/delivery/slack` | 슬랙 발송 | `briefing_id`, `webhook_url` | `delivery_id`, `status`, `slack_response` | **Slack API** |
| `GET` | `/delivery/{id}` | 발송 상태 조회 | - | `status`, `recipients`, `stats` | **DB + 외부 서비스 콜백** |

---

**작성일**: 2025년 12월
**버전**: 1.0

