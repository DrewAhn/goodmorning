"""
yahooquery Screener의 실제 응답 구조를 확인하기 위한 디버그 스크립트
"""

from yahooquery import Screener

screener = Screener()

# 스크리너 데이터 조회
print("get_screeners() 호출...")
data = screener.get_screeners(['most_actives'], 1)

print(f"\n데이터 타입: {type(data)}")
print(f"\n데이터 구조:")
print(data)

if isinstance(data, dict):
    print(f"\nDict 키: {data.keys()}")
    for key, value in data.items():
        print(f"\n[{key}]")
        print(f"  타입: {type(value)}")
        if hasattr(value, 'shape'):
            print(f"  Shape: {value.shape}")
        print(f"  내용: {value}")
