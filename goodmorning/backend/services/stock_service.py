"""
주식 데이터 서비스 - yahooquery 연동
"""
from yahooquery import Screener, Ticker
from typing import Optional


class StockService:
    """주식 데이터 조회 서비스"""
    
    def __init__(self):
        self.screener = Screener()
    
    def get_trending_stocks(self) -> dict:
        """
        화제 종목 조회
        - most_actives: 거래량 상위
        - day_gainers: 상승률 상위
        """
        try:
            # 거래량 상위 종목
            actives_data = self.screener.get_screeners('most_actives')
            most_actives = actives_data.get('most_actives', {}).get('quotes', [])[:10]
            
            # 상승률 상위 종목
            gainers_data = self.screener.get_screeners('day_gainers')
            day_gainers = gainers_data.get('day_gainers', {}).get('quotes', [])[:10]
            
            # 화제 종목 선정 (거래량 + 상승률 교집합에서 TOP 5)
            trending = self._select_trending_stocks(most_actives, day_gainers)
            
            return {
                "trending": trending,
                "most_actives": self._format_stocks(most_actives[:5]),
                "day_gainers": self._format_stocks(day_gainers[:5]),
                "source": "yahooquery"
            }
        except Exception as e:
            print(f"Error fetching trending stocks: {e}")
            return {
                "trending": [],
                "most_actives": [],
                "day_gainers": [],
                "source": "yahooquery",
                "error": str(e)
            }
    
    def _select_trending_stocks(self, actives: list, gainers: list) -> list:
        """
        화제 종목 선정 알고리즘
        - 거래량 TOP 25 ∩ 상승률 TOP 25 교집합 중 거래량 1위
        """
        # 심볼 기준 교집합 찾기
        active_symbols = {stock['symbol'] for stock in actives}
        gainer_symbols = {stock['symbol'] for stock in gainers}
        intersection = active_symbols & gainer_symbols
        
        # 교집합 종목을 거래량 순으로 정렬
        trending = []
        for stock in actives:
            if stock['symbol'] in intersection:
                trending.append(stock)
        
        # 교집합이 없으면 거래량 TOP 5 사용
        if not trending:
            trending = actives[:5]
        
        return self._format_stocks(trending[:5])
    
    def _format_stocks(self, stocks: list) -> list:
        """주식 데이터 포맷팅"""
        formatted = []
        for stock in stocks:
            formatted.append({
                "symbol": stock.get('symbol', ''),
                "name": stock.get('shortName', stock.get('longName', '')),
                "price": stock.get('regularMarketPrice', 0),
                "change": stock.get('regularMarketChange', 0),
                "change_percent": stock.get('regularMarketChangePercent', 0),
                "volume": stock.get('regularMarketVolume', 0),
                "market_cap": stock.get('marketCap', 0),
            })
        return formatted
    
    def get_stock_detail(self, symbol: str) -> Optional[dict]:
        """
        종목 상세 정보 조회
        """
        try:
            ticker = Ticker(symbol)
            
            # 기본 정보
            summary = ticker.summary_detail.get(symbol, {})
            profile = ticker.asset_profile.get(symbol, {})
            price_data = ticker.price.get(symbol, {})
            
            if isinstance(summary, str) or isinstance(price_data, str):
                return None
            
            return {
                "symbol": symbol,
                "name": price_data.get('shortName', ''),
                "long_name": price_data.get('longName', ''),
                "price": price_data.get('regularMarketPrice', 0),
                "change": price_data.get('regularMarketChange', 0),
                "change_percent": price_data.get('regularMarketChangePercent', 0),
                "volume": price_data.get('regularMarketVolume', 0),
                "market_cap": summary.get('marketCap', 0),
                "pe_ratio": summary.get('trailingPE', None),
                "fifty_two_week_high": summary.get('fiftyTwoWeekHigh', 0),
                "fifty_two_week_low": summary.get('fiftyTwoWeekLow', 0),
                "sector": profile.get('sector', ''),
                "industry": profile.get('industry', ''),
                "description": profile.get('longBusinessSummary', ''),
                "source": "yahooquery"
            }
        except Exception as e:
            print(f"Error fetching stock detail for {symbol}: {e}")
            return None

