"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, LineChartIcon, ArrowRight, Calendar, Clock } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface TrendAnalysisProps {
  predictionType: "ticket" | "sales" | "enquiry"
  timeframe: "weekly" | "monthly" | "quarterly"
}

export function TrendAnalysis({ predictionType, timeframe }: TrendAnalysisProps) {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [forecastData, setForecastData] = React.useState<any[]>([])
  const [trendMetrics, setTrendMetrics] = React.useState({
    slope: 0,
    direction: "neutral",
    strength: "moderate",
    forecast: 0,
    seasonalityIndex: 0,
  })

  React.useEffect(() => {
    // Simulate loading data
    setLoading(true)

    // Generate trend data based on prediction type and timeframe
    setTimeout(() => {
      const historicalData: any[] = []
      const forecast: any[] = []

      let periods = 12
      if (timeframe === "weekly") periods = 7
      else if (timeframe === "monthly") periods = 4

      // Generate base trend with some randomness
      const trendDirection = Math.random() > 0.5 ? 1 : -1
      const trendStrength = Math.random() * 0.2 + 0.1
      let baseValue = 50 + Math.random() * 50

      // Add seasonality component
      const seasonalityAmplitude = Math.random() * 20
      const seasonalityPhase = Math.random() * Math.PI * 2

      // Generate historical data
      for (let i = 0; i < periods; i++) {
        const seasonalComponent = seasonalityAmplitude * Math.sin((i / periods) * Math.PI * 2 + seasonalityPhase)
        const trendComponent = trendDirection * trendStrength * i
        const randomComponent = (Math.random() - 0.5) * 10

        const value = Math.max(0, baseValue + trendComponent + seasonalComponent + randomComponent)

        historicalData.push({
          period: i + 1,
          value: Math.round(value),
          date: getDateLabel(i, timeframe),
        })

        baseValue = value
      }

      // Generate forecast data (3 periods into the future)
      for (let i = 0; i < 3; i++) {
        const periodIndex = periods + i
        const seasonalComponent =
          seasonalityAmplitude * Math.sin((periodIndex / periods) * Math.PI * 2 + seasonalityPhase)
        const trendComponent = trendDirection * trendStrength * periodIndex

        // Add more uncertainty to forecasts
        const randomComponent = (Math.random() - 0.5) * 15

        const value = Math.max(0, baseValue + trendComponent + seasonalComponent + randomComponent)

        forecast.push({
          period: periodIndex + 1,
          value: Math.round(value),
          date: getDateLabel(periodIndex, timeframe),
          isForecast: true,
        })

        baseValue = value
      }

      // Calculate trend metrics
      const slope = trendDirection * trendStrength * 100
      const direction = slope > 0.5 ? "positive" : slope < -0.5 ? "negative" : "neutral"
      const strength = Math.abs(slope) > 10 ? "strong" : Math.abs(slope) > 5 ? "moderate" : "weak"

      setTrendMetrics({
        slope: slope,
        direction: direction,
        strength: strength,
        forecast: forecast[forecast.length - 1].value,
        seasonalityIndex: seasonalityAmplitude / baseValue,
      })

      setData(historicalData)
      setForecastData(forecast)
      setLoading(false)
    }, 1000)
  }, [predictionType, timeframe])

  // Helper function to generate date labels based on timeframe
  const getDateLabel = (index: number, timeframe: string) => {
    const now = new Date()

    if (timeframe === "weekly") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      return days[index % 7]
    } else if (timeframe === "monthly") {
      return `Week ${index + 1}`
    } else {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return months[index % 12]
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  const combinedData = [...data, ...forecastData]

  const getDirectionIcon = (direction: string) => {
    if (direction === "positive") {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (direction === "negative") {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    } else {
      return <ArrowRight className="h-4 w-4 text-gray-600" />
    }
  }

  const getDirectionColor = (direction: string) => {
    if (direction === "positive") {
      return "text-green-600"
    } else if (direction === "negative") {
      return "text-red-600"
    } else {
      return "text-gray-600"
    }
  }

  const getTitle = () => {
    switch (predictionType) {
      case "ticket":
        return "Ticket Volume Trend"
      case "sales":
        return "Sales Performance Trend"
      case "enquiry":
        return "Enquiry Conversion Trend"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LineChartIcon className="h-5 w-5 text-purple-600" />
          <h3 className="text-sm font-medium">{getTitle()} Analysis</h3>
        </div>

        <Badge
          variant={
            trendMetrics.direction === "positive"
              ? "success"
              : trendMetrics.direction === "negative"
                ? "destructive"
                : "outline"
          }
        >
          {trendMetrics.strength.charAt(0).toUpperCase() + trendMetrics.strength.slice(1)} {trendMetrics.direction}{" "}
          trend
        </Badge>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value}`, predictionType === "sales" ? "Revenue" : "Count"]}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Legend />
              <ReferenceLine x={data.length} stroke="#666" strokeDasharray="3 3" label="Now" />
              <Line
                type="monotone"
                dataKey="value"
                name="Historical"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Forecast"
                stroke="#82ca9d"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={{ r: 4 }}
                data={forecastData}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            {getDirectionIcon(trendMetrics.direction)}
            <span className="text-sm font-medium">Trend Direction</span>
          </div>
          <p className={`text-lg font-bold mt-1 ${getDirectionColor(trendMetrics.direction)}`}>
            {trendMetrics.direction.charAt(0).toUpperCase() + trendMetrics.direction.slice(1)}
            {trendMetrics.slope > 0 ? " +" : " "}
            {trendMetrics.slope.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Per {timeframe === "weekly" ? "day" : timeframe === "monthly" ? "week" : "month"} change rate
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Seasonality</span>
          </div>
          <p className="text-lg font-bold mt-1">{(trendMetrics.seasonalityIndex * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">Seasonal variation impact</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Forecast</span>
          </div>
          <p className="text-lg font-bold mt-1">{trendMetrics.forecast}</p>
          <p className="text-xs text-gray-500 mt-1">
            Projected in {timeframe === "weekly" ? "7 days" : timeframe === "monthly" ? "4 weeks" : "3 months"}
          </p>
        </div>
      </div>
    </div>
  )
}

