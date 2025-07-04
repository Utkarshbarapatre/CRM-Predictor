"use client"

import type React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, type TooltipProps } from "recharts"

export { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip }

// Custom tooltip component
export const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sm">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

// Chart container component
export const ChartContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`w-full h-full ${className || ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

