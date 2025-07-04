"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MilestoneTracker } from "@/components/gamification/milestone-tracker"
import { Rewards } from "@/components/gamification/rewards"
import { Leaderboard } from "@/components/gamification/leaderboard"
import { Badges } from "@/components/gamification/badges"
import { Trophy, Award, Gift, Target } from "lucide-react"

interface GamificationDashboardProps {
  initialTab?: string
  employeeId?: string
  predictionType?: "ticket" | "sales" | "enquiry" | "overall"
}

export function GamificationDashboard({
  initialTab = "milestones",
  employeeId,
  predictionType = "overall",
}: GamificationDashboardProps) {
  const mappedCategory =
    predictionType === "ticket"
      ? "ticket"
      : predictionType === "sales"
        ? "sales"
        : predictionType === "enquiry"
          ? "enquiry"
          : "general"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Employee Gamification Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="milestones" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-1">
              <Gift className="h-4 w-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="mt-4">
            <MilestoneTracker employeeId={employeeId} category={mappedCategory} />
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <Rewards employeeId={employeeId} />
          </TabsContent>

          <TabsContent value="badges" className="mt-4">
            <Badges employeeId={employeeId} />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <Leaderboard
              category={
                predictionType === "overall"
                  ? "overall"
                  : predictionType === "ticket"
                    ? "tickets"
                    : predictionType === "sales"
                      ? "sales"
                      : "enquiries"
              }
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

