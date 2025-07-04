"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, AlertTriangle, MessageSquare, Star } from "lucide-react"

// API service for fetching top performers
const performersService = {
  async fetchTopPerformers(category) {
    try {
      const response = await fetch("https://dummyjson.com/users?limit=10")
      const data = await response.json()

      // Transform users into performers with metrics
      return (
        data.users
          .map((user) => {
            // Generate random performance metrics based on category
            let score, metric

            if (category === "sales") {
              score = Math.floor(Math.random() * 500000) + 100000
              metric = `$${(score / 1000).toFixed(1)}k`
            } else if (category === "enquiry") {
              score = Math.floor(Math.random() * 100) + 20
              metric = `${score}%`
            } else if (category === "ticket") {
              score = Math.floor(Math.random() * 150) + 50
              metric = score
            } else {
              // Overall
              score = Math.floor(Math.random() * 100) + 50
              metric = score
            }

            return {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              avatar: user.image,
              department: user.company.department,
              score: score,
              metric: metric,
            }
          })
          // Sort by score in descending order
          .sort((a, b) => b.score - a.score)
          // Take top 3
          .slice(0, 3)
      )
    } catch (error) {
      console.error(`Error fetching ${category} performers:`, error)
      return []
    }
  },
}

export function TopPerformers({
  initialCategory = "overall",
}: { initialCategory?: "overall" | "sales" | "enquiry" | "ticket" }) {
  const [activeTab, setActiveTab] = React.useState(initialCategory)
  const [performers, setPerformers] = React.useState({
    sales: [],
    enquiry: [],
    ticket: [],
    overall: [],
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchAllPerformers = async () => {
      setLoading(true)

      const salesPerformers = await performersService.fetchTopPerformers("sales")
      const enquiryPerformers = await performersService.fetchTopPerformers("enquiry")
      const ticketPerformers = await performersService.fetchTopPerformers("ticket")
      const overallPerformers = await performersService.fetchTopPerformers("overall")

      setPerformers({
        sales: salesPerformers,
        enquiry: enquiryPerformers,
        ticket: ticketPerformers,
        overall: overallPerformers,
      })

      setLoading(false)
    }

    fetchAllPerformers()
  }, [])

  const getCategoryIcon = (category) => {
    switch (category) {
      case "sales":
        return <TrendingUp className="h-5 w-5 text-emerald-600" />
      case "enquiry":
        return <MessageSquare className="h-5 w-5 text-blue-600" />
      case "ticket":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case "overall":
        return <Star className="h-5 w-5 text-purple-600" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  const getCategoryTitle = (category) => {
    switch (category) {
      case "sales":
        return "Top Sales Performers"
      case "enquiry":
        return "Top Enquiry Conversion"
      case "ticket":
        return "Top Ticket Resolution"
      case "overall":
        return "Overall Top Performers"
      default:
        return "Top Performers"
    }
  }

  const getCategoryMetric = (category) => {
    switch (category) {
      case "sales":
        return "Revenue Generated"
      case "enquiry":
        return "Conversion Rate"
      case "ticket":
        return "Tickets Resolved"
      case "overall":
        return "Performance Score"
      default:
        return "Score"
    }
  }

  const renderPerformersList = (category) => {
    const categoryPerformers = performers[category]

    if (loading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {categoryPerformers.map((performer, index) => (
          <div key={performer.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 relative">
              <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={performer.avatar || `/placeholder.svg?height=48&width=48&text=${performer.name.charAt(0)}`}
                  alt={performer.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = `/placeholder.svg?height=48&width=48&text=${performer.name.charAt(0)}`
                  }}
                />
              </div>
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white flex items-center justify-center">
                <Trophy
                  className={`h-4 w-4 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-700"}`}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{performer.name}</h4>
                <Badge variant="outline" className="ml-2">
                  #{index + 1}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{performer.department}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{performer.metric}</p>
              <p className="text-xs text-gray-500">{getCategoryMetric(category)}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overall" className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Overall</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Sales</span>
            </TabsTrigger>
            <TabsTrigger value="enquiry" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Enquiry</span>
            </TabsTrigger>
            <TabsTrigger value="ticket" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Ticket</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              {getCategoryIcon("overall")}
              {getCategoryTitle("overall")}
            </h3>
            {renderPerformersList("overall")}
          </TabsContent>

          <TabsContent value="sales" className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              {getCategoryIcon("sales")}
              {getCategoryTitle("sales")}
            </h3>
            {renderPerformersList("sales")}
          </TabsContent>

          <TabsContent value="enquiry" className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              {getCategoryIcon("enquiry")}
              {getCategoryTitle("enquiry")}
            </h3>
            {renderPerformersList("enquiry")}
          </TabsContent>

          <TabsContent value="ticket" className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              {getCategoryIcon("ticket")}
              {getCategoryTitle("ticket")}
            </h3>
            {renderPerformersList("ticket")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

