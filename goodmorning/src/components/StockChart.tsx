'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { ChartDataPoint, ChartPeriod, stockChartData, generateChartInsight } from '@/lib/mockData'
import { useTheme } from '@/contexts/ThemeContext'

interface StockChartProps {
  symbol: string
  isPositive: boolean
}

// 기간 레이블
const periodLabels: Record<ChartPeriod, string> = {
  '5d': '5일',
  '1mo': '1개월',
  '3mo': '3개월',
}

export default function StockChart({ symbol, isPositive }: StockChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>('5d')
  const [isMounted, setIsMounted] = useState(false)
  
  // 클라이언트에서만 렌더링하기 위한 처리
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // 테마별 색상
  const bgSecondary = isDark ? 'bg-dark-bg' : 'bg-light-bg'
  const borderColor = isDark ? 'border-dark-border' : 'border-light-border'
  const textSecondary = isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
  const textNormal = isDark ? 'text-dark-text' : 'text-light-text'
  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const tickColor = isDark ? '#9ca3af' : '#6b7280'
  const tooltipBg = isDark ? 'bg-dark-card' : 'bg-light-card'
  
  // 캐싱: 한 번 로드된 데이터는 유지됨 (컴포넌트 내 상태로 관리)
  const [loadedPeriods, setLoadedPeriods] = useState<Set<ChartPeriod>>(new Set(['5d']))
  
  // 기간 선택 핸들러
  const handlePeriodChange = useCallback((period: ChartPeriod) => {
    setSelectedPeriod(period)
    setLoadedPeriods(prev => new Set([...prev, period]))
  }, [])
  
  // 현재 선택된 기간의 차트 데이터
  const chartData = useMemo(() => {
    return stockChartData[symbol]?.[selectedPeriod] || []
  }, [symbol, selectedPeriod])
  
  // 차트 색상 (상승: 녹색, 하락: 빨간색)
  const chartColor = isPositive ? '#22c55e' : '#ef4444'
  const chartColorLight = isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
  
  // 차트 해설 생성
  const insight = useMemo(() => {
    return generateChartInsight(chartData, selectedPeriod)
  }, [chartData, selectedPeriod])
  
  // Y축 도메인 계산 (데이터 범위에 여유 추가)
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100]
    const prices = chartData.map(d => d.close)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const padding = (max - min) * 0.1
    return [min - padding, max + padding]
  }, [chartData])
  
  // 시작가 (기준선)
  const startPrice = chartData[0]?.close || 0
  
  // X축 포맷터
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr)
    if (selectedPeriod === '5d') {
      return `${date.getMonth() + 1}/${date.getDate()}`
    } else if (selectedPeriod === '1mo') {
      return `${date.getMonth() + 1}/${date.getDate()}`
    } else {
      return `${date.getMonth() + 1}월`
    }
  }
  
  // 거래량 포맷터
  const formatVolume = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`
    return value.toString()
  }
  
  // 툴팁 커스텀
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`${tooltipBg} border ${borderColor} rounded-lg p-3 shadow-lg`}>
          <p className={`${textSecondary} text-xs mb-1`}>{label}</p>
          <p className={`${isDark ? 'text-white' : 'text-light-text'} font-semibold`}>${data.close.toFixed(2)}</p>
          <p className={`${textSecondary} text-xs mt-1`}>
            거래량: {formatVolume(data.volume)}
          </p>
        </div>
      )
    }
    return null
  }

  // 서버/클라이언트 불일치 방지: 클라이언트 마운트 전에는 스켈레톤 표시
  if (!isMounted) {
    return (
      <div className="mt-4 mb-4">
        <div className="flex gap-2 mb-3">
          {(Object.keys(periodLabels) as ChartPeriod[]).map((period) => (
            <div
              key={period}
              className={`px-3 py-1.5 rounded-lg text-xs ${bgSecondary} ${textSecondary}`}
            >
              {periodLabels[period]}
            </div>
          ))}
        </div>
        <div className={`${bgSecondary} rounded-lg p-3 border ${borderColor}`}>
          <div className="h-32 flex items-center justify-center">
            <span className={`${textSecondary} text-sm`}>차트 로딩 중...</span>
          </div>
          <div className="h-12 mt-1" />
        </div>
        <div className={`mt-3 p-3 rounded-lg border ${bgSecondary} ${borderColor}`}>
          <div className="flex items-start gap-2">
            <span className="text-sm">📊</span>
            <p className={`text-sm ${textSecondary}`}>해설 로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 mb-4">
      {/* 기간 선택 탭 */}
      <div className="flex gap-2 mb-3">
        {(Object.keys(periodLabels) as ChartPeriod[]).map((period) => {
          const isLoaded = loadedPeriods.has(period)
          const isSelected = selectedPeriod === period
          
          return (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${isSelected 
                  ? `${isPositive ? 'bg-stock-up/20 text-stock-up border border-stock-up/30' : 'bg-stock-down/20 text-stock-down border border-stock-down/30'}` 
                  : `${bgSecondary} ${textSecondary} hover:${isDark ? 'text-white' : 'text-light-text'} border border-transparent hover:${borderColor}`
                }
              `}
            >
              {periodLabels[period]}
              {!isLoaded && !isSelected && (
                <span className="ml-1 text-[10px] opacity-50">•</span>
              )}
            </button>
          )
        })}
      </div>
      
      {/* 차트 영역 */}
      <div className={`${bgSecondary} rounded-lg p-3 border ${borderColor} transition-colors duration-300`}>
        {/* 가격 라인 차트 */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 10, fill: tickColor }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={yDomain}
                tick={{ fontSize: 10, fill: tickColor }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={startPrice} 
                stroke={tickColor} 
                strokeDasharray="3 3" 
                strokeOpacity={0.5}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: chartColor, stroke: isDark ? '#1f2937' : '#ffffff', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* 거래량 바 차트 */}
        <div className="h-12 mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                tick={false}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 8, fill: tickColor }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatVolume}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="volume" 
                fill={chartColor}
                opacity={0.4}
                radius={[2, 2, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* 거래량 라벨 */}
        <div className="flex justify-between items-center mt-1 px-1">
          <span className={`text-[10px] ${textSecondary}`}>거래량</span>
        </div>
      </div>
      
      {/* 차트 해설 (규칙 기반) */}
      <div className={`
        mt-3 p-3 rounded-lg border
        ${isPositive 
          ? 'bg-stock-up/5 border-stock-up/20' 
          : 'bg-stock-down/5 border-stock-down/20'
        }
      `}>
        <div className="flex items-start gap-2">
          <span className="text-sm">📊</span>
          <p className={`text-sm ${textNormal}`}>{insight}</p>
        </div>
      </div>
    </div>
  )
}

