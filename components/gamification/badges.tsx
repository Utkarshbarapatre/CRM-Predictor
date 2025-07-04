"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Award, Shield, Target, Star, Zap, CheckCircle2, Clock, Trophy, Lock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface EmployeeBadge {
  id: string
  title: string
  description: string
  category: "sales" | "support" | "performance" | "teamwork" | "innovation"
  level: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  icon: React.ReactNode
  earned: boolean
  earnedAt?: string
  progress?: {
    current: number
    target: number
    unit: string
  }
}

interface BadgesProps {
  employeeId?: string
  filter?: "all" | "earned" | "inprogress"
}

export function Badges({ employeeId, filter = "all" }: BadgesProps) {
  const [badges, setBadges] = React.useState<EmployeeBadge[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeFilter, setActiveFilter] = React.useState(filter)
  const [activeCategory, setActiveCategory] = React.useState<string>("all")

  React.useEffect(() => {
    // Simulate loading badges data
    setLoading(true)

    // Generate sample badges data
    setTimeout(() => {
      const sampleBadges: EmployeeBadge[] = [
        {
          id: "b1",
          title: "Sales Rookie",
          description: "Achieved first 10 sales",
          category: "sales",
          level: "bronze",
          icon: <Trophy className="h-8 w-8 text-amber-700" />,
          earned: true,
          earnedAt: "2023-05-15",
        },
        {
          id: "b2",
          title: "Support Specialist",
          description: "Resolved 50 customer tickets",
          category: "support",
          level: "silver",
          icon: <Shield className="h-8 w-8 text-gray-400" />,
          earned: true,
          earnedAt: "2023-07-22",
        },
        {
          id: "b3",
          title: "Sales Master",
          description: "Achieved $100,000 in sales",
          category: "sales",
          level: "gold",
          icon: <Trophy className="h-8 w-8 text-yellow-500" />,
          earned: false,
          progress: {
            current: 72500,
            target: 100000,
            unit: "$",
          },
        },
        {
          id: "b4",
          title: "Quick Responder",
          description: "Maintained average response time under 2 hours for a month",
          category: "support",
          level: "silver",
          icon: <Zap className="h-8 w-8 text-gray-400" />,
          earned: true,
          earnedAt: "2023-08-10",
        },
        {
          id: "b5",
          title: "Team Player",
          description: "Collaborated on 15 cross-department projects",
          category: "teamwork",
          level: "bronze",
          icon: <Star className="h-8 w-8 text-amber-700" />,
          earned: false,
          progress: {
            current: 8,
            target: 15,
            unit: "projects",
          },
        },
        {
          id: "b6",
          title: "Innovation Champion",
          description: "Had 3 improvement suggestions implemented",
          category: "innovation",
          level: "gold",
          icon: <Target className="h-8 w-8 text-yellow-500" />,
          earned: false,
          progress: {
            current: 1,
            target: 3,
            unit: "implementations",
          },
        },
        {
          id: "b7",
          title: "Perfect Attendance",
          description: "Perfect attendance for 6 months",
          category: "performance",
          level: "silver",
          icon: <CheckCircle2 className="h-8 w-8 text-gray-400" />,
          earned: true,
          earnedAt: "2023-06-30",
        },
        {
          id: "b8",
          title: "Customer Satisfaction",
          description: "Maintained 95% customer satisfaction for 3 months",
          category: "performance",
          level: "platinum",
          icon: <Award className="h-8 w-8 text-purple-600" />,
          earned: false,
          progress: {
            current: 2,
            target: 3,
            unit: "months",
          },
        },
        {
          id: "b9",
          title: "Sales Legend",
          description: "Achieved $1,000,000 in lifetime sales",
          category: "sales",
          level: "diamond",
          icon: <Trophy className="h-8 w-8 text-blue-500" />,
          earned: false,
          progress: {
            current: 350000,
            target: 1000000,
            unit: "$",
          },
        },
      ]

      setBadges(sampleBadges)
      setLoading(false)
    }, 1000)
  }, [employeeId])

  const getBadgeBgColor = (level: string) => {
    switch (level) {
      case "bronze":
        return "bg-amber-100"
      case "silver":
        return "bg-gray-100"
      case "gold":
        return "bg-yellow-100"
      case "platinum":
        return "bg-purple-100"
      case "diamond":
        return "bg-blue-100"
      default:
        return "bg-gray-100"
    }
  }

  const getBadgeBorderColor = (level: string) => {
    switch (level) {
      case "bronze":
        return "border-amber-700"
      case "silver":
        return "border-gray-400"
      case "gold":
        return "border-yellow-500"
      case "platinum":
        return "border-purple-600"
      case "diamond":
        return "border-blue-500"
      default:
        return "border-gray-300"
    }
  }

  const getLevelTag = (level: string) => {
    switch (level) {
      case "bronze":
        return <Badge className="bg-amber-700">Bronze</Badge>
      case "silver":
        return <Badge className="bg-gray-400">Silver</Badge>
      case "gold":
        return <Badge className="bg-yellow-500">Gold</Badge>
      case "platinum":
        return <Badge className="bg-purple-600">Platinum</Badge>
      case "diamond":
        return <Badge className="bg-blue-500">Diamond</Badge>
      default:
        return <Badge>Basic</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sales":
        return <Trophy className="h-4 w-4 text-green-600" />
      case "support":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "performance":
        return <Target className="h-4 w-4 text-red-600" />
      case "teamwork":
        return <Star className="h-4 w-4 text-purple-600" />
      case "innovation":
        return <Zap className="h-4 w-4 text-amber-600" />
      default:
        return <Award className="h-4 w-4 text-gray-600" />
    }
  }

  const getFilteredBadges = () => {
    let filtered = badges

    if (activeFilter === "earned") {
      filtered = filtered.filter((b) => b.earned)
    } else if (activeFilter === "inprogress") {
      filtered = filtered.filter((b) => !b.earned)
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter((b) => b.category === activeCategory)
    }

    return filtered
  }

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 75) return "bg-green-600"
    if (percentage >= 50) return "bg-blue-600"
    if (percentage >= 25) return "bg-amber-600"
    return "bg-gray-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  const filteredBadges = getFilteredBadges()
  const earnedCount = badges.filter((b) => b.earned).length
  const totalCount = badges.length

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "sales", label: "Sales" },
    { id: "support", label: "Support" },
    { id: "performance", label: "Performance" },
    { id: "teamwork", label: "Teamwork" },
    { id: "innovation", label: "Innovation" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            <h3 className="text-lg font-bold">Achievement Badges</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Earned {earnedCount} of {totalCount} available badges
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex overflow-x-auto space-x-1 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-full ${activeFilter === "all" ? "bg-white shadow-sm" : "text-gray-600"}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("earned")}
              className={`text-xs px-3 py-1.5 rounded-full ${activeFilter === "earned" ? "bg-white shadow-sm" : "text-gray-600"}`}
            >
              Earned
            </button>
            <button
              onClick={() => setActiveFilter("inprogress")}
              className={`text-xs px-3 py-1.5 rounded-full ${activeFilter === "inprogress" ? "bg-white shadow-sm" : "text-gray-600"}`}
            >
              In Progress
            </button>
          </div>

          <select
            className="text-xs border rounded px-2 py-1.5"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Overall Badge Progress</span>
            <span>
              {earnedCount} / {totalCount} Badges
            </span>
          </div>
          <Progress value={(earnedCount / totalCount) * 100} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className={`border-2 rounded-lg overflow-hidden ${badge.earned ? getBadgeBorderColor(badge.level) : "border-gray-200"}`}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-lg ${getBadgeBgColor(badge.level)}`}>{badge.icon}</div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{badge.title}</h4>
                    {getLevelTag(badge.level)}
                  </div>

                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>

                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className="flex gap-1 items-center text-xs">
                      {getCategoryIcon(badge.category)}
                      {badge.category.charAt(0).toUpperCase() + badge.category.slice(1)}
                    </Badge>

                    {badge.earned ? (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        <span>Earned {badge.earnedAt && new Date(badge.earnedAt).toLocaleDateString()}</span>
                      </div>
                    ) : badge.progress ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                            <span>In Progress</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <div className="font-medium mb-1">Progress</div>
                              <div className="flex items-center justify-between gap-2">
                                <span>{badge.progress.current.toLocaleString()}</span>
                                <span>of</span>
                                <span>
                                  {badge.progress.target.toLocaleString()} {badge.progress.unit}
                                </span>
                              </div>
                              <Progress
                                value={(badge.progress.current / badge.progress.target) * 100}
                                className={`h-1.5 mt-1 ${getProgressColor(badge.progress.current, badge.progress.target)}`}
                              />
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!badge.earned && badge.progress && (
                <div className="mt-3">
                  <div className="flex justify-between mb-1 text-xs text-gray-500">
                    <span>Progress</span>
                    <span>
                      {badge.progress.current.toLocaleString()} / {badge.progress.target.toLocaleString()}{" "}
                      {badge.progress.unit}
                    </span>
                  </div>
                  <Progress
                    value={(badge.progress.current / badge.progress.target) * 100}
                    className={`h-1.5 ${getProgressColor(badge.progress.current, badge.progress.target)}`}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <Award className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No badges found matching your criteria</p>
          <button
            className="text-sm text-purple-600 mt-2 hover:underline"
            onClick={() => {
              setActiveFilter("all")
              setActiveCategory("all")
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}

