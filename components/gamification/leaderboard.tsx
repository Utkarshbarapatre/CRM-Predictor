"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star, ChevronUp, ChevronDown, Minus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  department: string
  points: number
  level: number
  badges: string[]
  rank: number
  previousRank: number
  recentAchievement?: string
}

interface LeaderboardProps {
  category?: "sales" | "tickets" | "enquiries" | "overall"
  timeframe?: "weekly" | "monthly" | "quarterly" | "yearly"
  limit?: number
}

export function Leaderboard({ category = "overall", timeframe = "monthly", limit = 10 }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedCategory, setSelectedCategory] = React.useState(category)
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(timeframe)

  React.useEffect(() => {
    // Simulate loading leaderboard data
    setLoading(true)

    // Generate sample  => {
    // Simulate loading leaderboard data
    setLoading(true)

    // Generate sample leaderboard data
    setTimeout(() => {
      // Create random leaderboard entries
      const departments = ["Sales", "Support", "Marketing", "Development", "Customer Success"]
      const achievements = [
        "Closed 5 high-value deals",
        "Resolved 20 tickets in record time",
        "Achieved 95% customer satisfaction",
        "Improved response time by 30%",
        "Converted 15 leads to customers",
      ]

      const sampleLeaderboard: LeaderboardEntry[] = Array.from({ length: 15 }, (_, i) => {
        const points = Math.floor(Math.random() * 10000) + 1000
        const level = Math.floor(points / 1000) + 1
        const previousRank = i + 1 + Math.floor(Math.random() * 5) - 2

        return {
          id: `user-${i + 1}`,
          name: `Employee ${i + 1}`,
          avatar: `/placeholder.svg?height=40&width=40&text=${i + 1}`,
          department: departments[Math.floor(Math.random() * departments.length)],
          points,
          level,
          badges: Array.from(
            { length: Math.floor(Math.random() * 5) },
            (_, j) => ["Gold", "Silver", "Bronze", "Platinum", "Diamond"][j],
          ),
          rank: i + 1,
          previousRank,
          recentAchievement:
            Math.random() > 0.3 ? achievements[Math.floor(Math.random() * achievements.length)] : undefined,
        }
      })

      // Sort by points descending
      sampleLeaderboard.sort((a, b) => b.points - a.points)

      // Reassign ranks after sorting
      sampleLeaderboard.forEach((entry, index) => {
        entry.rank = index + 1
      })

      setLeaderboard(sampleLeaderboard)
      setLoading(false)
    }, 1000)
  }, [selectedCategory, selectedTimeframe])

  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current
    if (diff > 0) {
      return { icon: <ChevronUp className="h-4 w-4 text-green-600" />, text: `Up ${diff}`, color: "text-green-600" }
    } else if (diff < 0) {
      return {
        icon: <ChevronDown className="h-4 w-4 text-red-600" />,
        text: `Down ${Math.abs(diff)}`,
        color: "text-red-600",
      }
    } else {
      return { icon: <Minus className="h-4 w-4 text-gray-600" />, text: "No change", color: "text-gray-600" }
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="h-5 w-5 text-yellow-500" />
    } else if (rank === 2) {
      return <Medal className="h-5 w-5 text-gray-400" />
    } else if (rank === 3) {
      return <Medal className="h-5 w-5 text-amber-700" />
    } else {
      return <span className="font-bold">{rank}</span>
    }
  }

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case "sales":
        return "Sales Performance"
      case "tickets":
        return "Ticket Resolution"
      case "enquiries":
        return "Enquiry Handling"
      default:
        return "Overall Performance"
    }
  }

  const getTimeframeLabel = () => {
    switch (selectedTimeframe) {
      case "weekly":
        return "This Week"
      case "monthly":
        return "This Month"
      case "quarterly":
        return "This Quarter"
      case "yearly":
        return "This Year"
      default:
        return "All Time"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h3 className="text-lg font-bold">{getCategoryTitle()} Leaderboard</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">{getTimeframeLabel()} top performers</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="text-sm border rounded px-2 py-1"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
          >
            <option value="overall">Overall</option>
            <option value="sales">Sales</option>
            <option value="tickets">Tickets</option>
            <option value="enquiries">Enquiries</option>
          </select>

          <select
            className="text-sm border rounded px-2 py-1"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {/* Top 3 podium */}
        {leaderboard.length > 2 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* 2nd place */}
            <div className="col-start-1 flex flex-col items-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-400">
                  <img
                    src={leaderboard[1].avatar || `/placeholder.svg?height=64&width=64&text=2`}
                    alt={leaderboard[1].name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full">
                  <Medal className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <p className="font-medium mt-2">{leaderboard[1].name}</p>
              <p className="text-xs text-gray-600">{leaderboard[1].department}</p>
              <Badge className="mt-1">{leaderboard[1].points.toLocaleString()} XP</Badge>
            </div>

            {/* 1st place */}
            <div className="col-start-2 flex flex-col items-center -mt-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden border-4 border-yellow-500">
                  <img
                    src={leaderboard[0].avatar || `/placeholder.svg?height=80&width=80&text=1`}
                    alt={leaderboard[0].name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              <p className="font-bold mt-2">{leaderboard[0].name}</p>
              <p className="text-xs text-gray-600">{leaderboard[0].department}</p>
              <Badge className="mt-1 bg-yellow-500">{leaderboard[0].points.toLocaleString()} XP</Badge>
            </div>

            {/* 3rd place */}
            <div className="col-start-3 flex flex-col items-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden border-4 border-amber-700">
                  <img
                    src={leaderboard[2].avatar || `/placeholder.svg?height=64&width=64&text=3`}
                    alt={leaderboard[2].name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full">
                  <Medal className="h-6 w-6 text-amber-700" />
                </div>
              </div>
              <p className="font-medium mt-2">{leaderboard[2].name}</p>
              <p className="text-xs text-gray-600">{leaderboard[2].department}</p>
              <Badge className="mt-1">{leaderboard[2].points.toLocaleString()} XP</Badge>
            </div>
          </div>
        )}

        {/* Rest of the leaderboard */}
        <div className="bg-white rounded-lg shadow divide-y">
          {leaderboard.slice(3, limit).map((entry) => {
            const rankChange = getRankChange(entry.rank, entry.previousRank)

            return (
              <div key={entry.id} className="p-4 flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">{getRankBadge(entry.rank)}</div>

                <div className="flex-shrink-0 relative">
                  <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={entry.avatar || `/placeholder.svg?height=40&width=40`}
                      alt={entry.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {entry.level >= 5 && (
                    <div className="absolute -top-1 -right-1 bg-white p-0.5 rounded-full">
                      <Star className="h-3 w-3 text-yellow-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{entry.name}</p>
                    <Badge>{entry.points.toLocaleString()} XP</Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{entry.department}</span>
                    <div className="flex items-center gap-1">
                      <span>Level {entry.level}</span>
                      {entry.badges.length > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex -space-x-1">
                                {entry.badges.slice(0, 3).map((badge, i) => (
                                  <Award key={i} className="h-4 w-4 text-yellow-500" />
                                ))}
                                {entry.badges.length > 3 && (
                                  <span className="text-xs ml-1">+{entry.badges.length - 3}</span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs">
                                {entry.badges.map((badge, i) => (
                                  <div key={i} className="flex items-center gap-1">
                                    <Award className="h-3 w-3 text-yellow-500" />
                                    <span>{badge} Badge</span>
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm flex items-center gap-1">
                  {rankChange.icon}
                  <span className={rankChange.color}>{rankChange.text}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

