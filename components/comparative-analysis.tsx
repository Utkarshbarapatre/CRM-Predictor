"use client"

import React from "react"
import { ArrowUpRight, ArrowDownRight, ArrowRight, Calendar, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ComparativeAnalysisProps {
  predictionType: "ticket" | "sales" | "enquiry"
  timeframe: "weekly" | "monthly" | "quarterly"
}

export function ComparativeAnalysis({ predictionType, timeframe }: ComparativeAnalysisProps) {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [comparisonPeriod, setComparisonPeriod] = React.useState<"previous" | "year-ago">("previous")

  React.useEffect(() => {
    // Simulate loading data
    setLoading(true)

    // Generate comparative data based on prediction type and timeframe
    setTimeout(() => {
      const currentData: any[] = []
      const previousData: any[] = []
      const yearAgoData: any[] = []

      let labels: string[] = []

      // Set labels based on timeframe
      if (timeframe === "weekly") {
        labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      } else if (timeframe === "monthly") {
        labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
      } else {
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      }

      // Use only a subset of labels for quarterly view
      if (timeframe === "quarterly") {
        labels = labels.slice(0, 4)
      }

      // Generate data for each period
      labels.forEach((label) => {
        const currentValue = Math.floor(Math.random() * 100) + 50
        const previousValue = Math.floor(Math.random() * 100) + 30
        const yearAgoValue = Math.floor(Math.random() * 100) + 20

        currentData.push({
          name: label,
          current: currentValue,
          previous: previousValue,
          yearAgo: yearAgoValue,
          currentVsPrevious: ((currentValue - previousValue) / previousValue) * 100,
          currentVsYearAgo: ((currentValue - yearAgoValue) / yearAgoValue) * 100,
        })
      })

      setData(currentData)
      setLoading(false)
    }, 1000)
  }, [predictionType, timeframe])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  // Calculate overall change
  const calculateOverallChange = () => {
    if (data.length === 0) return 0

    const currentTotal = data.reduce((sum, item) => sum + item.current, 0)
    const comparisonTotal = data.reduce(
      (sum, item) => sum + (comparisonPeriod === "previous" ? item.previous : item.yearAgo),
      0,
    )

    return ((currentTotal - comparisonTotal) / comparisonTotal) * 100
  }

  const overallChange = calculateOverallChange()

  const getChangeColor = (value: number) => {
    return value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-600"
  }

  const getChangeIcon = (value: number) => {
    return value > 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : value < 0 ? (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    ) : (
      <ArrowRight className="h-4 w-4 text-gray-600" />
    )
  }

  const getTitle = () => {
    let title = ""

    switch (predictionType) {
      case "ticket":
        title = "Ticket Volume"
        break
      case "sales":
        title = "Sales Performance"
        break
      case "enquiry":
        title = "Enquiry Conversion"
        break
    }

    return `${title} Comparison (${timeframe})`
  }

  const getComparisonLabel = () => {
    if (comparisonPeriod === "previous") {
      switch (timeframe) {
        case "weekly":
          return "vs Previous Week"
        case "monthly":
          return "vs Previous Month"
        case "quarterly":
          return "vs Previous Quarter"
      }
    } else {
      return "vs Year Ago"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <h3 className="text-sm font-medium">{getTitle()}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setComparisonPeriod("previous")}
            className={`text-xs px-2 py-1 rounded ${comparisonPeriod === "previous" ? "bg-purple-100 text-purple-700" : "text-gray-600"}`}
          >
            Previous Period
          </button>
          <button
            onClick={() => setComparisonPeriod("year-ago")}
            className={`text-xs px-2 py-1 rounded ${comparisonPeriod === "year-ago" ? "bg-purple-100 text-purple-700" : "text-gray-600"}`}
          >
            Year Ago
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Overall Change {getComparisonLabel()}</span>
          </div>
          <div className="flex items-center gap-1">
            {getChangeIcon(overallChange)}
            <span className={`font-medium ${getChangeColor(overallChange)}`}>
              {overallChange > 0 ? "+" : ""}
              {overallChange.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "currentVsPrevious" || name === "currentVsYearAgo") {
                    return [`${value.toFixed(1)}%`, "Change"]
                  }
                  return [value, name === "current" ? "Current" : name === "previous" ? "Previous" : "Year Ago"]
                }}
              />
              <Legend />
              <Bar dataKey="current" name="Current" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey={comparisonPeriod === "previous" ? "previous" : "yearAgo"}
                name={comparisonPeriod === "previous" ? "Previous" : "Year Ago"}
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.name}</span>
              <div className="flex items-center gap-1">
                {getChangeIcon(comparisonPeriod === "previous" ? item.currentVsPrevious : item.currentVsYearAgo)}
                <span
                  className={`text-xs font-medium ${getChangeColor(comparisonPeriod === "previous" ? item.currentVsPrevious : item.currentVsYearAgo)}`}
                >
                  {(comparisonPeriod === "previous" ? item.currentVsPrevious : item.currentVsYearAgo) > 0 ? "+" : ""}
                  {(comparisonPeriod === "previous" ? item.currentVsPrevious : item.currentVsYearAgo).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-end gap-2 mt-2">
              <div
                className="bg-purple-600 rounded-t"
                style={{
                  height: `${Math.min(100, (item.current / Math.max(...data.map((d) => d.current))) * 100)}px`,
                  width: "45%",
                }}
              ></div>
              <div
                className="bg-green-500 rounded-t"
                style={{
                  height: `${Math.min(100, ((comparisonPeriod === "previous" ? item.previous : item.yearAgo) / Math.max(...data.map((d) => d.current))) * 100)}px`,
                  width: "45%",
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Current: {item.current}</span>
              <span>
                {comparisonPeriod === "previous" ? "Prev" : "Year Ago"}:{" "}
                {comparisonPeriod === "previous" ? item.previous : item.yearAgo}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

