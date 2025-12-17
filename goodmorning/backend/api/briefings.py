"""
브리핑 관련 API 라우터
"""
from fastapi import APIRouter, HTTPException

from models.briefing import BriefingResponse, BriefingCreateRequest

router = APIRouter()


@router.post("/", response_model=BriefingResponse)
async def create_briefing(request: BriefingCreateRequest):
    """
    새 브리핑 생성
    """
    # TODO: 브리핑 생성 로직 구현
    return {
        "id": "briefing_001",
        "created_at": "2025-12-12T09:00:00Z",
        "status": "created",
        "message": "브리핑이 생성되었습니다."
    }


@router.get("/")
async def get_briefings():
    """
    브리핑 히스토리 조회
    """
    # TODO: 브리핑 히스토리 조회 로직 구현
    return {
        "briefings": [],
        "total": 0
    }


@router.get("/{briefing_id}")
async def get_briefing_detail(briefing_id: str):
    """
    브리핑 상세 조회
    """
    # TODO: 브리핑 상세 조회 로직 구현
    raise HTTPException(status_code=404, detail="브리핑을 찾을 수 없습니다.")

