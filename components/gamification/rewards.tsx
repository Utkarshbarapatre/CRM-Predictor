"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Gift,
  Star,
  Award,
  Trophy,
  Zap,
  Coffee,
  ShoppingBag,
  DollarSign,
  Clock,
  Calendar,
  Ticket,
  Heart,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface Reward {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: "monetary" | "privilege" | "recognition" | "experience"
  pointsCost: number
  featured?: boolean
  limited?: boolean
  expiresAt?: string
  claimable: boolean
}

interface RewardsProps {
  employeeId?: string
  availablePoints?: number
  categories?: ("monetary" | "privilege" | "recognition" | "experience")[]
}

export function Rewards({
  employeeId,
  availablePoints = 2750,
  categories = ["monetary", "privilege", "recognition", "experience"],
}: RewardsProps) {
  const [rewards, setRewards] = React.useState<Reward[]>([])
  const [loading, setLoading] = React.useState(true)
  const [claimedRewards, setClaimedRewards] = React.useState<string[]>([])
  const [filterCategory, setFilterCategory] = React.useState<string>("all")
  const [showAffordableOnly, setShowAffordableOnly] = React.useState(false)

  React.useEffect(() => {
    // Simulate loading rewards data
    setLoading(true)

    // Generate rewards data
    setTimeout(() => {
      // Sample rewards
      const sampleRewards: Reward[] = [
        {
          id: "r1",
          title: "Amazon Gift Card",
          description: "$50 Amazon gift card for your online shopping",
          icon: <ShoppingBag className="h-10 w-10 text-yellow-600" />,
          category: "monetary",
          pointsCost: 2000,
          claimable: true,
        },
        {
          id: "r2",
          title: "Extra Day Off",
          description: "Take an extra day off this month",
          icon: <Calendar className="h-10 w-10 text-blue-600" />,
          category: "privilege",
          pointsCost: 3000,
          featured: true,
          claimable: false,
        },
        {
          id: "r3",
          title: "Employee of the Month",
          description: "Recognition as Employee of the Month with featured profile in company newsletter",
          icon: <Trophy className="h-10 w-10 text-yellow-500" />,
          category: "recognition",
          pointsCost: 5000,
          claimable: false,
        },
        {
          id: "r4",
          title: "Coffee Package",
          description: "Premium coffee package for your home brewing",
          icon: <Coffee className="h-10 w-10 text-amber-800" />,
          category: "monetary",
          pointsCost: 1000,
          claimable: true,
        },
        {
          id: "r5",
          title: "2-Hour Lunch Break",
          description: "Extended lunch break for a week",
          icon: <Clock className="h-10 w-10 text-green-600" />,
          category: "privilege",
          pointsCost: 1500,
          claimable: true,
        },
        {
          id: "r6",
          title: "Conference Ticket",
          description: "Ticket to an industry conference of your choice",
          icon: <Ticket className="h-10 w-10 text-purple-600" />,
          category: "experience",
          pointsCost: 4000,
          featured: true,
          claimable: false,
        },
        {
          id: "r7",
          title: "Kudos Points",
          description: "Recognition from the CEO in the next company meeting",
          icon: <Award className="h-10 w-10 text-indigo-600" />,
          category: "recognition",
          pointsCost: 2500,
          claimable: true,
        },
        {
          id: "r8",
          title: "Charitable Donation",
          description: "$100 donated to a charity of your choice in your name",
          icon: <Heart className="h-10 w-10 text-red-600" />,
          category: "experience",
          pointsCost: 2000,
          claimable: true,
        },
        {
          id: "r9",
          title: "Performance Bonus",
          description: "$200 performance bonus added to your next paycheck",
          icon: <DollarSign className="h-10 w-10 text-green-700" />,
          category: "monetary",
          pointsCost: 8000,
          featured: true,
          claimable: false,
        },
      ]

      // Filter rewards by available categories
      const filteredRewards = sampleRewards.filter((r) => categories.includes(r.category))

      setRewards(filteredRewards)
      setLoading(false)
    }, 1000)
  }, [categories])

  const handleClaimReward = (reward: Reward) => {
    if (reward.pointsCost > availablePoints) {
      toast({
        title: "Not enough points",
        description: `You need ${reward.pointsCost - availablePoints} more points to claim this reward.`,
        variant: "destructive",
      })
      return
    }

    // Add to claimed rewards
    setClaimedRewards((prev) => [...prev, reward.id])

    // Show success toast
    toast({
      title: "Reward Claimed!",
      description: `You have successfully claimed: ${reward.title}`,
      action: (
        <ToastAction
          altText="View Reward"
          onClick={() => {
            toast({
              title: "Reward Details",
              description: `Your ${reward.title} has been added to your rewards dashboard. You will receive further instructions via email.`,
            })
          }}
        >
          View Reward
        </ToastAction>
      ),
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "monetary":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "privilege":
        return <Zap className="h-4 w-4 text-amber-600" />
      case "recognition":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "experience":
        return <Star className="h-4 w-4 text-purple-600" />
      default:
        return <Gift className="h-4 w-4 text-blue-600" />
    }
  }

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  const getFilteredRewards = () => {
    let filtered = rewards

    if (filterCategory !== "all") {
      filtered = filtered.filter((r) => r.category === filterCategory)
    }

    if (showAffordableOnly) {
      filtered = filtered.filter((r) => r.pointsCost <= availablePoints)
    }

    return filtered
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  const filteredRewards = getFilteredRewards()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-bold">Rewards Marketplace</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            You have <span className="font-bold text-purple-600">{availablePoints} points</span> to spend on rewards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="text-sm border rounded px-2 py-1"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {getCategoryLabel(cat)}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showAffordableOnly}
              onChange={() => setShowAffordableOnly(!showAffordableOnly)}
              className="rounded text-purple-600"
            />
            Affordable only
          </label>
        </div>
      </div>

      {/* Featured Rewards */}
      {filteredRewards.some((r) => r.featured) && (
        <div className="space-y-4">
          <h4 className="text-md font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Featured Rewards
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRewards
              .filter((r) => r.featured)
              .map((reward) => (
                <Card
                  key={reward.id}
                  className={`border-2 ${reward.featured ? "border-yellow-300" : "border-transparent"}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                      <Badge>{reward.pointsCost} points</Badge>
                    </div>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-center">
                      <div className="p-3 bg-gray-100 rounded-full">{reward.icon}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge variant="outline" className="flex gap-1 items-center">
                      {getCategoryIcon(reward.category)}
                      {getCategoryLabel(reward.category)}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleClaimReward(reward)}
                            disabled={
                              claimedRewards.includes(reward.id) ||
                              !reward.claimable ||
                              reward.pointsCost > availablePoints
                            }
                            variant={reward.pointsCost <= availablePoints ? "default" : "outline"}
                          >
                            {claimedRewards.includes(reward.id)
                              ? "Claimed"
                              : reward.claimable
                                ? "Claim Reward"
                                : "Coming Soon"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {claimedRewards.includes(reward.id)
                            ? "You've already claimed this reward"
                            : !reward.claimable
                              ? "This reward will be available soon"
                              : reward.pointsCost > availablePoints
                                ? `You need ${reward.pointsCost - availablePoints} more points`
                                : "Click to claim this reward"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* All Other Rewards */}
      <div className="space-y-4">
        <h4 className="text-md font-medium flex items-center gap-2">
          <Gift className="h-4 w-4 text-purple-600" />
          Available Rewards
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredRewards
            .filter((r) => !r.featured)
            .map((reward) => (
              <Card key={reward.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-md">{reward.title}</CardTitle>
                    <Badge variant={reward.pointsCost <= availablePoints ? "default" : "outline"}>
                      {reward.pointsCost} points
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-center">
                    <div className="p-2 bg-gray-100 rounded-full">{reward.icon}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge variant="outline" className="flex gap-1 items-center text-xs">
                    {getCategoryIcon(reward.category)}
                    {getCategoryLabel(reward.category)}
                  </Badge>
                  <Button
                    onClick={() => handleClaimReward(reward)}
                    disabled={
                      claimedRewards.includes(reward.id) || !reward.claimable || reward.pointsCost > availablePoints
                    }
                    variant={reward.pointsCost <= availablePoints ? "default" : "outline"}
                    size="sm"
                  >
                    {claimedRewards.includes(reward.id) ? "Claimed" : reward.claimable ? "Claim" : "Coming Soon"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>

        {filteredRewards.filter((r) => !r.featured).length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <Gift className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No rewards found matching your criteria</p>
            <Button
              variant="link"
              onClick={() => {
                setFilterCategory("all")
                setShowAffordableOnly(false)
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

