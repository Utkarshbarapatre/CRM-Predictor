"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PredictionInsightsProps {
  predictionType: "ticket" | "sales" | "enquiry"
  prediction: number | null
  confidence: number | null
}

export function PredictionInsights({ predictionType, prediction, confidence }: PredictionInsightsProps) {
  const [insights, setInsights] = React.useState<any>({
    accuracy: 0,
    trend: 0,
    volatility: 0,
    seasonality: 0,
    anomalies: 0,
    timeToResolve: 0,
    riskFactor: 0,
    impactScore: 0,
  })

  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate loading insights data
    setLoading(true)

    // Generate insights based on prediction type and value
    setTimeout(() => {
      const isHigh = prediction !== null && prediction > 0.5

      // Generate random but somewhat consistent insights
      const baseAccuracy = confidence ? confidence / 100 : 0.7
      const baseTrend = isHigh ? 0.15 : -0.08
      const randomFactor = () => (Math.random() - 0.5) * 0.2

      setInsights({
        accuracy: Math.min(0.98, baseAccuracy + randomFactor()),
        trend: baseTrend + randomFactor(),
        volatility: Math.max(0.1, Math.min(0.9, 0.4 + randomFactor())),
        seasonality: Math.max(0.1, Math.min(0.9, 0.5 + randomFactor())),
        anomalies: Math.max(0, Math.min(5, Math.floor(Math.random() * 6))),
        timeToResolve:
          predictionType === "ticket"
            ? isHigh
              ? Math.floor(Math.random() * 4) + 1
              : Math.floor(Math.random() * 24) + 24
            : null,
        riskFactor: Math.max(0.1, Math.min(0.9, isHigh ? 0.7 + randomFactor() : 0.3 + randomFactor())),
        impactScore: Math.max(0.1, Math.min(0.9, isHigh ? 0.8 + randomFactor() : 0.4 + randomFactor())),
      })

      setLoading(false)
    }, 1000)
  }, [prediction, confidence, predictionType])

  if (loading || prediction === null) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  const isHigh = prediction > 0.5

  const getInsightColor = (value: number, inverse = false) => {
    if (inverse) {
      return value > 0.6 ? "text-red-600" : value > 0.3 ? "text-amber-600" : "text-green-600"
    }
    return value > 0.6 ? "text-green-600" : value > 0.3 ? "text-amber-600" : "text-red-600"
  }

  const getProgressColor = (value: number, inverse = false) => {
    if (inverse) {
      return value > 0.6 ? "bg-red-600" : value > 0.3 ? "bg-amber-600" : "bg-green-600"
    }
    return value > 0.6 ? "bg-green-600" : value > 0.3 ? "bg-amber-600" : "bg-red-600"
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Prediction Accuracy</span>
            </div>
            <Badge variant="outline" className={getInsightColor(insights.accuracy)}>
              {Math.round(insights.accuracy * 100)}%
            </Badge>
          </div>
          <Progress className="mt-2" value={insights.accuracy * 100} />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {insights.trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">Trend</span>
            </div>
            <Badge variant={insights.trend > 0 ? "success" : "destructive"}>
              {insights.trend > 0 ? "+" : ""}
              {Math.round(insights.trend * 100)}%
            </Badge>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {insights.trend > 0
              ? `Increasing trend over the past ${predictionType === "sales" ? "quarter" : "month"}`
              : `Decreasing trend over the past ${predictionType === "sales" ? "quarter" : "month"}`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Volatility</span>
            </div>
            <Badge variant="outline" className={getInsightColor(insights.volatility, true)}>
              {Math.round(insights.volatility * 100)}%
            </Badge>
          </div>
          <Progress
            className={`mt-2 ${getProgressColor(insights.volatility, true)}`}
            value={insights.volatility * 100}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium">Seasonality</span>
            </div>
            <Badge variant="outline">{Math.round(insights.seasonality * 100)}%</Badge>
          </div>
          <Progress className="mt-2 bg-indigo-600" value={insights.seasonality * 100} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {predictionType === "ticket" && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium">Est. Time to Resolve</span>
              </div>
              <Badge variant={isHigh ? "destructive" : "outline"}>
                {insights.timeToResolve} {insights.timeToResolve === 1 ? "hour" : "hours"}
              </Badge>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {isHigh
                ? "Requires immediate attention for quick resolution"
                : "Can be handled within standard SLA timeframe"}
            </div>
          </div>
        )}

        {predictionType === "sales" && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Market Share Impact</span>
              </div>
              <Badge variant={isHigh ? "success" : "outline"}>
                {isHigh ? "+" : ""}
                {Math.round((isHigh ? 0.05 : -0.02) * 100)}%
              </Badge>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {isHigh ? "Projected to increase market share" : "May result in slight market share decrease"}
            </div>
          </div>
        )}

        {predictionType === "enquiry" && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Conversion Rate</span>
              </div>
              <Badge variant={isHigh ? "success" : "outline"}>{Math.round((isHigh ? 0.35 : 0.12) * 100)}%</Badge>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {isHigh ? "High probability of conversion to sale" : "Lower conversion potential, may need nurturing"}
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Risk Factor</span>
            </div>
            <Badge variant="outline" className={getInsightColor(insights.riskFactor, true)}>
              {Math.round(insights.riskFactor * 100)}%
            </Badge>
          </div>
          <Progress
            className={`mt-2 ${getProgressColor(insights.riskFactor, true)}`}
            value={insights.riskFactor * 100}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Anomaly Detection</span>
          </div>
          <Badge variant={insights.anomalies > 0 ? "destructive" : "outline"}>
            {insights.anomalies} {insights.anomalies === 1 ? "anomaly" : "anomalies"} detected
          </Badge>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {insights.anomalies > 0
            ? `System detected ${insights.anomalies} unusual pattern${insights.anomalies === 1 ? "" : "s"} in the data`
            : "No unusual patterns detected in the data"}
        </div>
      </div>
    </div>
  )
}

