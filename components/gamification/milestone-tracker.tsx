"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Trophy, Star, Award, Medal, Flag, CheckCircle2 } from "lucide-react"

interface Milestone {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  category: "sales" | "ticket" | "enquiry" | "general"
  level: "bronze" | "silver" | "gold" | "platinum"
  points: number
  icon: React.ReactNode
  dueDate?: string
  completedDate?: string
}

interface MilestoneTrackerProps {
  employeeId?: string
  category?: "sales" | "ticket" | "enquiry" | "general"
}

export function MilestoneTracker({ employeeId, category = "general" }: MilestoneTrackerProps) {
  const [milestones, setMilestones] = React.useState<Milestone[]>([])
  const [loading, setLoading] = React.useState(true)
  const [totalPoints, setTotalPoints] = React.useState(0)
  const [level, setLevel] = React.useState(1)
  const [showCompleted, setShowCompleted] = React.useState(false)

  React.useEffect(() => {
    // Simulate loading milestone data
    setLoading(true)

    // Generate milestone data
    setTimeout(() => {
      // Sample milestones
      const sampleMilestones: Milestone[] = [
        {
          id: "m1",
          title: "Ticket Resolution Expert",
          description: "Resolve 50 customer tickets with high satisfaction rating",
          target: 50,
          current: 32,
          unit: "tickets",
          category: "ticket",
          level: "silver",
          points: 500,
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        },
        {
          id: "m2",
          title: "Sales Champion",
          description: "Achieve $100,000 in quarterly sales",
          target: 100000,
          current: 78500,
          unit: "$",
          category: "sales",
          level: "gold",
          points: 1000,
          icon: <Trophy className="h-5 w-5 text-yellow-500" />,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        },
        {
          id: "m3",
          title: "Lead Converter",
          description: "Convert 25 enquiries to sales",
          target: 25,
          current: 18,
          unit: "conversions",
          category: "enquiry",
          level: "silver",
          points: 500,
          icon: <Target className="h-5 w-5 text-blue-600" />,
          dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        },
        {
          id: "m4",
          title: "Quick Resolver",
          description: "Resolve 10 high-priority tickets within 1 hour",
          target: 10,
          current: 10,
          unit: "tickets",
          category: "ticket",
          level: "bronze",
          points: 300,
          icon: <Flag className="h-5 w-5 text-red-600" />,
          completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        },
        {
          id: "m5",
          title: "Customer Satisfaction Hero",
          description: "Maintain a 95% satisfaction rating for 30 days",
          target: 30,
          current: 30,
          unit: "days",
          category: "general",
          level: "platinum",
          points: 2000,
          icon: <Star className="h-5 w-5 text-purple-600" />,
          completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        },
        {
          id: "m6",
          title: "Team Collaborator",
          description: "Contribute to 15 team projects",
          target: 15,
          current: 8,
          unit: "projects",
          category: "general",
          level: "bronze",
          points: 300,
          icon: <Medal className="h-5 w-5 text-orange-600" />,
          dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        },
      ]

      // Filter milestones by category if specified
      const filteredMilestones =
        category === "general"
          ? sampleMilestones
          : sampleMilestones.filter((m) => m.category === category || m.category === "general")

      setMilestones(filteredMilestones)

      // Calculate total points
      const earned = filteredMilestones.filter((m) => m.current >= m.target).reduce((sum, m) => sum + m.points, 0)

      setTotalPoints(earned)

      // Calculate level (1 level per 1000 points)
      setLevel(Math.max(1, Math.floor(earned / 1000) + 1))

      setLoading(false)
    }, 1000)
  }, [category])

  const getLevelColor = (level: number) => {
    if (level >= 10) return "text-purple-600"
    if (level >= 7) return "text-indigo-600"
    if (level >= 5) return "text-blue-600"
    if (level >= 3) return "text-green-600"
    return "text-gray-600"
  }

  const getLevelBadge = (milestoneLevel: string) => {
    switch (milestoneLevel) {
      case "bronze":
        return <Badge className="bg-amber-700">Bronze</Badge>
      case "silver":
        return <Badge className="bg-gray-400">Silver</Badge>
      case "gold":
        return <Badge className="bg-yellow-500">Gold</Badge>
      case "platinum":
        return <Badge className="bg-purple-600">Platinum</Badge>
      default:
        return <Badge>Basic</Badge>
    }
  }

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 100) return "bg-green-600"
    if (percentage >= 75) return "bg-blue-600"
    if (percentage >= 50) return "bg-amber-600"
    return "bg-gray-600"
  }

  const getNextLevelPoints = () => {
    return level * 1000
  }

  const getPointsToNextLevel = () => {
    return getNextLevelPoints() - totalPoints
  }

  const getInProgressMilestones = () => {
    return milestones.filter((m) => !m.completedDate)
  }

  const getCompletedMilestones = () => {
    return milestones.filter((m) => m.completedDate)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Award className={`h-6 w-6 ${getLevelColor(level)}`} />
            <h3 className="text-lg font-bold">Level {level}</h3>
            <Badge variant="outline" className="ml-1">
              {totalPoints} XP
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {getPointsToNextLevel()} XP to Level {level + 1}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`text-xs px-3 py-1.5 rounded-full ${showCompleted ? "bg-purple-100 text-purple-700" : "text-gray-600 border"}`}
          >
            {showCompleted ? "Hide Completed" : "Show Completed"}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <div className="flex justify-between mb-1 text-sm">
          <span>Progress to Level {level + 1}</span>
          <span>
            {totalPoints} / {getNextLevelPoints()} XP
          </span>
        </div>
        <Progress value={(totalPoints / getNextLevelPoints()) * 100} className="h-2" />
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-semibold">Active Milestones</h3>
        {getInProgressMilestones().length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No active milestones found</p>
          </div>
        ) : (
          getInProgressMilestones().map((milestone) => (
            <div key={milestone.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gray-100">{milestone.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                    {getLevelBadge(milestone.level)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>

                  <div className="mt-3">
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Progress</span>
                      <span>
                        {milestone.current.toLocaleString()} / {milestone.target.toLocaleString()} {milestone.unit}
                      </span>
                    </div>
                    <Progress
                      value={(milestone.current / milestone.target) * 100}
                      className={`h-1.5 ${getProgressColor(milestone.current, milestone.target)}`}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className="text-xs">
                      {milestone.points} XP
                    </Badge>
                    {milestone.dueDate && <span className="text-xs text-gray-500">Due: {milestone.dueDate}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showCompleted && getCompletedMilestones().length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-md font-semibold flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
            Completed Milestones
          </h3>

          {getCompletedMilestones().map((milestone) => (
            <div key={milestone.id} className="bg-gray-50 border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-100">{milestone.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                    {getLevelBadge(milestone.level)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>

                  <div className="mt-3">
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Completed</span>
                      <span>
                        {milestone.target.toLocaleString()} {milestone.unit}
                      </span>
                    </div>
                    <Progress value={100} className="h-1.5 bg-green-600" />
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className="text-xs bg-green-50">
                      +{milestone.points} XP
                    </Badge>
                    {milestone.completedDate && (
                      <span className="text-xs text-gray-500">Completed: {milestone.completedDate}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

