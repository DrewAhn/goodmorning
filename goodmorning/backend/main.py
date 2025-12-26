"""
굿모닝 월가 - FastAPI 백엔드
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import stocks, briefings

app = FastAPI(
    title="굿모닝 월가 API",
    description="미국주식 데일리 브리핑 서비스 API",
    version="1.0.0"
)

# CORS 설정 - 프론트엔드에서 접근 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js 개발 서버
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # 대체 포트
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(stocks.router, prefix="/stocks", tags=["Stocks"])
app.include_router(briefings.router, prefix="/briefings", tags=["Briefings"])


@app.get("/")
async def root():
    """헬스 체크"""
    return {
        "status": "ok",
        "message": "굿모닝 월가 API 서버가 실행 중입니다! 🌅"
    }


@app.get("/health")
async def health_check():
    """상세 헬스 체크"""
    return {
        "status": "healthy",
        "version": "1.0.0"
    }

