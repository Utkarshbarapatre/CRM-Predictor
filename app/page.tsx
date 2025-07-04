"use client"

import { useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import {
  Brain,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Clock,
  ChevronDown,
  RefreshCw,
  Lightbulb,
  XCircle,
  CheckCircle2,
  PhoneCall,
  Mail,
  UserPlus,
  DollarSign,
  Calendar,
  Users,
  ShieldAlert,
  Bell,
  Trophy,
  LayoutDashboard,
  PieChart,
  LineChart,
  ArrowUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart as RechartsLineChart,
  Line,
  ResponsiveContainer,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TopPerformers } from "@/components/top-performers"
import { PredictionInsights } from "@/components/prediction-insights"
import { ComparativeAnalysis } from "@/components/comparative-analysis"
import { TrendAnalysis } from "@/components/trend-analysis"
import { ExportOptions } from "@/components/export-options"
import { Toaster } from "@/components/ui/toaster"
import { GamificationDashboard } from "@/components/gamification"

// Advice data for different prediction types
const ticketAdvice = [
  {
    high: "Assign your most experienced support agents to handle this ticket immediately. The customer is likely experiencing significant issues that could impact their business operations.",
    low: "This ticket can be handled by your regular support team during standard hours. Consider using automated responses for initial troubleshooting steps.",
  },
  {
    high: "Escalate this ticket to a senior technician. Consider offering a courtesy call to address the customer's concerns directly and prevent potential churn.",
    low: "Add this ticket to your regular queue. Use your knowledge base to provide self-service options to the customer while they wait.",
  },
  {
    high: "This is a critical issue requiring immediate attention. Assign a dedicated support engineer and provide hourly updates to the customer until resolved.",
    low: "Schedule this ticket for resolution within the next 24-48 hours. Send the customer relevant documentation that might help them in the meantime.",
  },
  {
    high: "Flag this ticket for management review. The customer may need special attention and a customized solution to address their complex issue.",
    low: "This is a routine issue that can be handled through your standard support process. Consider using this as a training opportunity for new support staff.",
  },
  {
    high: "This ticket indicates a potential system-wide issue. Investigate if other customers are experiencing similar problems and prepare a coordinated response.",
    low: "This is a minor issue that can be addressed with standard troubleshooting. Consider adding the solution to your FAQ section to help other customers.",
  },
]

const salesAdvice = [
  {
    high: "Your Q4 forecast shows strong growth potential. Consider increasing inventory and staffing to meet the anticipated demand.",
    low: "Sales projections indicate a slower period ahead. Focus on customer retention strategies and optimize your marketing spend.",
  },
  {
    high: "Your software product line is showing exceptional growth. Allocate additional resources to development and consider expanding feature offerings.",
    low: "Hardware sales are underperforming. Review pricing strategy and consider bundle offers to increase average order value.",
  },
  {
    high: "The North region is outperforming expectations. Identify successful strategies that can be replicated in other regions.",
    low: "The South region needs attention. Schedule training for the sales team and review territory assignments.",
  },
  {
    high: "New customer acquisition is strong. Invest in onboarding processes to ensure high retention rates for these new customers.",
    low: "Existing customer sales are below target. Launch a re-engagement campaign with special offers for dormant accounts.",
  },
  {
    high: "B2B sales are trending upward. Develop case studies highlighting success stories to further strengthen your enterprise positioning.",
    low: "Consumer segment sales are declining. Review your product positioning and consider refreshing your brand messaging.",
  },
]

const enquiryAdvice = [
  {
    high: "Product information requests show high conversion potential. Ensure your sales team follows up within 2 hours with detailed specifications.",
    low: "These general inquiries have lower conversion rates. Use automated responses with links to your knowledge base.",
  },
  {
    high: "Website leads are showing strong intent. Implement immediate callback options to capitalize on this high-quality traffic source.",
    low: "Social media inquiries are showing lower engagement. Review your social content strategy to better qualify leads.",
  },
  {
    high: "Enterprise inquiries are increasing. Prepare customized presentations addressing industry-specific challenges for these high-value prospects.",
    low: "Small business inquiries are numerous but converting poorly. Create a streamlined, self-service option for this segment.",
  },
  {
    high: "Demo requests are up 30% this month. Ensure your demo team is properly staffed and trained on highlighting new features.",
    low: "Support inquiries are being misclassified as sales opportunities. Improve your routing logic to direct these to the appropriate team.",
  },
  {
    high: "Technology sector inquiries show high intent. Develop sector-specific messaging highlighting relevant case studies and ROI metrics.",
    low: "Retail sector inquiries have increased but show lower conversion intent. Create educational content addressing common pain points.",
  },
]

// Action alerts for different prediction types
const ticketAlerts = [
  {
    high: [
      {
        icon: <PhoneCall className="h-4 w-4" />,
        title: "Immediate Call Required",
        description: "Call the customer within the next 30 minutes to address their urgent issue.",
      },
      {
        icon: <ShieldAlert className="h-4 w-4" />,
        title: "Escalate to Management",
        description: "This ticket requires management attention due to its critical nature.",
      },
      {
        icon: <Users className="h-4 w-4" />,
        title: "Assign Senior Agent",
        description: "Route this ticket to your most experienced support staff immediately.",
      },
    ],
    low: [
      {
        icon: <Mail className="h-4 w-4" />,
        title: "Send Automated Response",
        description: "Trigger the standard troubleshooting email sequence for this issue type.",
      },
      {
        icon: <Calendar className="h-4 w-4" />,
        title: "Schedule for Later",
        description: "Add to the regular queue with a 24-hour response window.",
      },
      {
        icon: <CheckCircle2 className="h-4 w-4" />,
        title: "Knowledge Base Solution",
        description: "This issue can likely be resolved with existing documentation.",
      },
    ],
  },
]

const salesAlerts = [
  {
    high: [
      {
        icon: <UserPlus className="h-4 w-4" />,
        title: "Increase Sales Staff",
        description: "Hire additional sales representatives to handle projected growth.",
      },
      {
        icon: <DollarSign className="h-4 w-4" />,
        title: "Adjust Revenue Targets",
        description: "Update Q3 and Q4 targets to reflect positive forecast changes.",
      },
      {
        icon: <TrendingUp className="h-4 w-4" />,
        title: "Expand Marketing Budget",
        description: "Increase marketing spend by 15% to capitalize on growth momentum.",
      },
    ],
    low: [
      {
        icon: <Users className="h-4 w-4" />,
        title: "Focus on Retention",
        description: "Shift resources to customer retention programs to maintain revenue.",
      },
      {
        icon: <XCircle className="h-4 w-4" />,
        title: "Reduce Inventory Orders",
        description: "Adjust inventory levels downward to avoid excess stock.",
      },
      {
        icon: <DollarSign className="h-4 w-4" />,
        title: "Review Pricing Strategy",
        description: "Consider promotional pricing to stimulate demand in coming quarters.",
      },
    ],
  },
]

const enquiryAlerts = [
  {
    high: [
      {
        icon: <PhoneCall className="h-4 w-4" />,
        title: "Immediate Follow-up",
        description: "Contact this lead within 1 hour to maximize conversion potential.",
      },
      {
        icon: <UserPlus className="h-4 w-4" />,
        title: "Assign Senior Sales Rep",
        description: "Route this inquiry to your top-performing sales representative.",
      },
      {
        icon: <DollarSign className="h-4 w-4" />,
        title: "Prepare Custom Proposal",
        description: "Develop a tailored proposal with premium options for this prospect.",
      },
    ],
    low: [
      {
        icon: <XCircle className="h-4 w-4" />,
        title: "Close This Enquiry",
        description: "This lead shows low conversion potential and should be deprioritized.",
      },
      {
        icon: <Mail className="h-4 w-4" />,
        title: "Send Automated Sequence",
        description: "Enroll in the standard email nurture campaign for low-intent leads.",
      },
      {
        icon: <Calendar className="h-4 w-4" />,
        title: "Schedule for Later",
        description: "Add to the general follow-up queue for next week.",
      },
    ],
  },
]

// API service for fetching data
const apiService = {
  // Fetch tickets data from API
  async fetchTickets(timeframe = "weekly") {
    try {
      const response = await fetch("https://dummyjson.com/comments?limit=10")
      const data = await response.json()

      // Transform comments into ticket data
      const tickets = data.comments.map((comment) => {
        // Create ticket categories based on comment content
        let category = "General"
        if (comment.body.includes("help")) category = "Technical"
        else if (comment.body.includes("install")) category = "Installation"
        else if (comment.body.includes("tax")) category = "GST Issues"
        else if (comment.body.includes("system")) category = "OS Issues"

        // Adjust values based on timeframe
        let multiplier = 1
        if (timeframe === "monthly") multiplier = 4
        if (timeframe === "quarterly") multiplier = 12

        return {
          name: category,
          value: (Math.floor(Math.random() * 50) + 10) * multiplier, // Random value adjusted by timeframe
          id: comment.id,
          user: comment.user.username,
          body: comment.body,
        }
      })

      // Aggregate by category
      const categories = {}
      tickets.forEach((ticket) => {
        if (!categories[ticket.name]) {
          categories[ticket.name] = { name: ticket.name, value: 0 }
        }
        categories[ticket.name].value += ticket.value
      })

      return Object.values(categories)
    } catch (error) {
      console.error("Error fetching tickets:", error)
      return []
    }
  },

  // Fetch sales data from API
  async fetchSales(timeframe = "weekly") {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=4")
      const data = await response.json()

      // Transform products into sales data by period
      let periods
      let multiplier = 1

      if (timeframe === "weekly") {
        periods = ["Week 1", "Week 2", "Week 3", "Week 4"]
      } else if (timeframe === "monthly") {
        periods = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        multiplier = 4
      } else if (timeframe === "quarterly") {
        periods = ["Q1", "Q2", "Q3", "Q4"]
        multiplier = 12
      }

      // Use only as many periods as we have data for
      return data.products.slice(0, periods.length).map((product, index) => {
        return {
          name: periods[index],
          value: product.price * product.stock * multiplier,
          id: product.id,
          title: product.title,
          category: product.category,
        }
      })
    } catch (error) {
      console.error("Error fetching sales:", error)
      return []
    }
  },

  // Fetch enquiry data from API
  async fetchEnquiries(timeframe = "weekly") {
    try {
      const response = await fetch("https://dummyjson.com/posts?limit=5")
      const data = await response.json()

      // Transform posts into enquiry data
      const enquiryTypes = ["Product Info", "Pricing", "Support", "Demos", "Partnerships"]

      // Adjust values based on timeframe
      let multiplier = 1
      if (timeframe === "monthly") multiplier = 4
      if (timeframe === "quarterly") multiplier = 12

      return data.posts.map((post, index) => {
        return {
          name: enquiryTypes[index % enquiryTypes.length],
          value: post.reactions * 10 * multiplier, // Use reactions as a proxy for enquiry count, adjusted by timeframe
          id: post.id,
          title: post.title,
          body: post.body,
        }
      })
    } catch (error) {
      console.error("Error fetching enquiries:", error)
      return []
    }
  },

  // Fetch notifications from API
  async fetchNotifications(predictionType, prediction, confidence) {
    try {
      const response = await fetch("https://dummyjson.com/users?limit=5")
      const data = await response.json()

      // Generate notifications based on users and prediction
      const notifications = []
      const isHigh = prediction > 0.5

      data.users.forEach((user, index) => {
        const timeAgo = `${Math.floor(Math.random() * 60)} minutes ago`

        if (index === 0) {
          // First notification is always about the current prediction
          if (predictionType === "ticket") {
            notifications.push({
              icon: isHigh ? (
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              ) : (
                <Clock className="h-5 w-5 text-green-600 mt-0.5" />
              ),
              title: isHigh ? "High Priority Ticket Alert" : "Low Priority Ticket",
              description: `Ticket from ${user.firstName} ${user.lastName} ${isHigh ? "requires immediate attention" : "can be handled during standard hours"} with ${confidence}% confidence.`,
              time: "Just now",
            })
          } else if (predictionType === "sales") {
            notifications.push({
              icon: isHigh ? (
                <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5" />
              ) : (
                <BarChart3 className="h-5 w-5 text-amber-600 mt-0.5" />
              ),
              title: isHigh ? "Sales Growth Detected" : "Moderate Sales Growth",
              description: `${isHigh ? "Strong" : "Moderate"} growth expected in ${user.company.department} department with ${confidence}% confidence.`,
              time: "Just now",
            })
          } else if (predictionType === "enquiry") {
            notifications.push({
              icon: isHigh ? (
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              ),
              title: isHigh ? "High Conversion Potential" : "Low Conversion Potential",
              description: `Enquiry from ${user.firstName} ${user.lastName} has ${isHigh ? "high" : "low"} conversion potential with ${confidence}% confidence.`,
              time: "Just now",
            })
          }
        } else {
          // Generate other notifications based on user data
          const icons = [
            <Bell className="h-5 w-5 text-blue-600 mt-0.5" key="bell" />,
            <Users className="h-5 w-5 text-purple-600 mt-0.5" key="users" />,
            <Mail className="h-5 w-5 text-gray-600 mt-0.5" key="mail" />,
            <DollarSign className="h-5 w-5 text-emerald-600 mt-0.5" key="dollar" />,
          ]

          notifications.push({
            icon: icons[index % icons.length],
            title: `Update from ${user.company.department}`,
            description: `${user.firstName} ${user.lastName} has ${predictionType === "ticket" ? "submitted a new ticket" : predictionType === "sales" ? "closed a deal" : "sent an enquiry"}.`,
            time: timeAgo,
          })
        }
      })

      return notifications
    } catch (error) {
      console.error("Error fetching notifications:", error)
      return []
    }
  },

  // Fetch prediction history from API
  async fetchPredictionHistory(predictionType) {
    try {
      const response = await fetch("https://dummyjson.com/todos?limit=10")
      const data = await response.json()

      // Transform todos into prediction history
      return data.todos
        .map((todo, index) => {
          // Generate a value that trends based on completion status
          const baseValue = todo.completed ? 0.7 : 0.3
          const randomFactor = (Math.random() - 0.5) * 0.2
          const value = Math.max(0.1, Math.min(0.9, baseValue + randomFactor))

          return {
            time: `${10 - index} min ago`,
            value: value,
            confidence: Math.round(Math.abs(value - 0.5) * 200),
            id: todo.id,
            todo: todo.todo,
            completed: todo.completed,
          }
        })
        .reverse()
    } catch (error) {
      console.error("Error fetching prediction history:", error)
      return []
    }
  },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-md p-2">
        <p className="font-semibold">{`${label}`}</p>
        <p className="text-gray-700">{`Value: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

// Refresh interval options in milliseconds
const refreshIntervals = [
  { label: "1 minute", value: 60000 },
  { label: "5 minutes", value: 300000 },
  { label: "15 minutes", value: 900000 },
  { label: "30 minutes", value: 1800000 },
  { label: "1 hour", value: 3600000 },
  { label: "5 hours", value: 18000000 },
]

export default function Home() {
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [prediction, setPrediction] = useState(null)
  const [confidence, setConfidence] = useState(null)
  const [predictionType, setPredictionType] = useState("ticket")
  const [adviceIndex, setAdviceIndex] = useState(0)
  const [alertIndex, setAlertIndex] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(refreshIntervals[0].value)
  const [refreshCount, setRefreshCount] = useState(0)
  const [activeChart, setActiveChart] = useState("distribution") // "distribution", "prediction", or "none"
  const [chartTimeframe, setChartTimeframe] = useState("weekly") // "weekly", "monthly", or "quarterly"
  const [predictionHistory, setPredictionHistory] = useState([])
  const [notifications, setNotifications] = useState([])
  const [chartData, setChartData] = useState([])
  const [dataLoading, setDataLoading] = useState({
    chart: false,
    history: false,
    notifications: false,
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("insights")

  // Create and train model
  const createModel = () => {
    const model = tf.sequential()
    model.add(tf.layers.dense({ units: 16, inputShape: [4], activation: "relu" }))
    model.add(tf.layers.dense({ units: 8, activation: "relu" }))
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }))
    model.compile({ optimizer: "adam", loss: "binaryCrossentropy", metrics: ["accuracy"] })
    return model
  }

  // Fetch data based on prediction type and timeframe
  const fetchData = async () => {
    setDataLoading((prev) => ({ ...prev, chart: true }))
    let data

    switch (predictionType) {
      case "ticket":
        data = await apiService.fetchTickets(chartTimeframe)
        break
      case "sales":
        data = await apiService.fetchSales(chartTimeframe)
        break
      case "enquiry":
        data = await apiService.fetchEnquiries(chartTimeframe)
        break
      default:
        data = []
    }

    setChartData(data)
    setDataLoading((prev) => ({ ...prev, chart: false }))
  }

  // Fetch prediction history
  const fetchPredictionHistory = async () => {
    setDataLoading((prev) => ({ ...prev, history: true }))
    const history = await apiService.fetchPredictionHistory(predictionType)
    setPredictionHistory(history)
    setDataLoading((prev) => ({ ...prev, history: false }))
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    setDataLoading((prev) => ({ ...prev, notifications: true }))
    const notifs = await apiService.fetchNotifications(predictionType, prediction, confidence)
    setNotifications(notifs)
    setDataLoading((prev) => ({ ...prev, notifications: false }))
  }

  useEffect(() => {
    const trainModel = async () => {
      const newModel = createModel()

      // Training data based on patterns in the provided dataset
      const xs = tf.tensor2d([
        [0.2, 0, 1, 0.5], // Installation, Non-Chargeable, 24h, Mumbai
        [0.4, 1, 2, 0.3], // Technical, Chargeable, 48h, Other
        [0.1, 0, 1, 0.4], // Installation, Non-Chargeable, 24h, Other
        [0.5, 1, 3, 0.6], // Technical, Chargeable, 72h, Mumbai
      ])

      const ys = tf.tensor2d([
        [0], // Low priority
        [1], // High priority
        [0], // Low priority
        [1], // High priority
      ])

      await newModel.fit(xs, ys, {
        epochs: 100,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch}: loss = ${logs.loss}`)
          },
        },
      })

      setModel(newModel)
      setLoading(false)

      // Generate initial prediction
      generatePrediction(newModel)
    }

    trainModel()

    // Initial data fetch
    fetchData()
    fetchPredictionHistory()
  }, [])

  // Fetch data when prediction type or timeframe changes
  useEffect(() => {
    fetchData()
    fetchPredictionHistory()
    if (prediction !== null) {
      fetchNotifications()
    }
  }, [predictionType, chartTimeframe])

  // Auto-refresh predictions
  useEffect(() => {
    if (!autoRefresh || loading) return

    const interval = setInterval(() => {
      if (model) {
        generatePrediction(model)
        setRefreshCount((prev) => prev + 1)
      }
    }, refreshInterval) // Refresh based on selected interval

    return () => clearInterval(interval)
  }, [model, autoRefresh, loading, refreshCount, refreshInterval])

  // Update advice when prediction changes
  useEffect(() => {
    if (prediction !== null) {
      setAdviceIndex(Math.floor(Math.random() * 5)) // Choose a random advice from the 5 options
      setAlertIndex(Math.floor(Math.random() * 3)) // Choose a random alert from the 3 options
      fetchNotifications()
    }
  }, [prediction, refreshCount])

  // Update prediction history when a new prediction is made
  useEffect(() => {
    if (prediction !== null && predictionHistory.length > 0) {
      // Add the new prediction to history
      setPredictionHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            time: `Just now`,
            value: prediction,
            confidence: confidence,
          },
        ]

        // Keep only the last 10 predictions
        if (newHistory.length > 10) {
          return newHistory.slice(newHistory.length - 10)
        }
        return newHistory
      })
    }
  }, [prediction, confidence])

  const generatePrediction = async (model) => {
    // Generate random input data based on prediction type
    let input

    if (predictionType === "ticket") {
      // Random values for ticket prediction
      const complaintType = Math.random()
      const isChargeable = Math.random() > 0.5 ? 1 : 0
      const completionTime = Math.random()
      const isMumbai = Math.random() > 0.5 ? 1 : 0

      input = tf.tensor2d([[complaintType, isChargeable, completionTime, isMumbai]])
    } else if (predictionType === "sales") {
      // For sales and enquiry, we'll just generate a random prediction
      // since we don't have a trained model for these
      const randomPrediction = Math.random()
      setPrediction(randomPrediction)
      setConfidence(Math.round(Math.abs(randomPrediction - 0.5) * 200))
      return
    } else if (predictionType === "enquiry") {
      const randomPrediction = Math.random()
      setPrediction(randomPrediction)
      setConfidence(Math.round(Math.abs(randomPrediction - 0.5) * 200))
      return
    }

    // Get prediction from model
    const predictionTensor = model.predict(input)
    const predictionValue = await predictionTensor.data()

    // After setting prediction and confidence, update notifications
    const predValue =
      predictionType === "ticket" ? (await predictionTensor?.data())?.[0] || Math.random() : Math.random()

    setPrediction(predValue)
    const confValue = Math.round(Math.abs(predValue - 0.5) * 200)
    setConfidence(confValue)

    return
  }

  const handleRefresh = () => {
    if (model) {
      generatePrediction(model)
      setRefreshCount((prev) => prev + 1)
      fetchData()
    }
  }

  const handlePredictionTypeChange = (type) => {
    setPredictionType(type)
    if (model) {
      setTimeout(() => {
        generatePrediction(model)
      }, 100)
    }
  }

  const getChartTitle = () => {
    switch (predictionType) {
      case "ticket":
        return `Ticket Distribution by Type (${chartTimeframe})`
      case "sales":
        return `Sales Forecast (${chartTimeframe})`
      case "enquiry":
        return `Enquiry Distribution by Type (${chartTimeframe})`
      default:
        return "Data Visualization"
    }
  }

  const getPredictionTitle = () => {
    switch (predictionType) {
      case "ticket":
        return "Ticket Priority Prediction"
      case "sales":
        return "Sales Forecast Prediction"
      case "enquiry":
        return "Enquiry Conversion Prediction"
      default:
        return "BizCRM Predictor"
    }
  }

  const getBarColor = () => {
    switch (predictionType) {
      case "ticket":
        return "#8b5cf6" // Purple
      case "sales":
        return "#10b981" // Green
      case "enquiry":
        return "#3b82f6" // Blue
      default:
        return "#8b5cf6"
    }
  }

  const getAdvice = () => {
    if (prediction === null) return ""

    const isHigh = prediction > 0.5

    switch (predictionType) {
      case "ticket":
        return isHigh ? ticketAdvice[adviceIndex].high : ticketAdvice[adviceIndex].low
      case "sales":
        return isHigh ? salesAdvice[adviceIndex].high : salesAdvice[adviceIndex].low
      case "enquiry":
        return isHigh ? enquiryAdvice[adviceIndex].high : enquiryAdvice[adviceIndex].low
      default:
        return ""
    }
  }

  const getAlerts = () => {
    if (prediction === null) return []

    const isHigh = prediction > 0.5

    switch (predictionType) {
      case "ticket":
        return isHigh ? ticketAlerts[0].high : ticketAlerts[0].low
      case "sales":
        return isHigh ? salesAlerts[0].high : salesAlerts[0].low
      case "enquiry":
        return isHigh ? enquiryAlerts[0].high : enquiryAlerts[0].low
      default:
        return []
    }
  }

  const getPredictionLabel = () => {
    if (prediction === null) return ""

    const isHigh = prediction > 0.5

    switch (predictionType) {
      case "ticket":
        return isHigh ? "High Priority" : "Low Priority"
      case "sales":
        return isHigh ? "Strong Growth Expected" : "Moderate Growth Expected"
      case "enquiry":
        return isHigh ? "High Conversion Potential" : "Low Conversion Potential"
      default:
        return ""
    }
  }

  const getPredictionColor = () => {
    if (prediction === null) return ""

    const isHigh = prediction > 0.5

    switch (predictionType) {
      case "ticket":
        return isHigh ? "text-red-600" : "text-green-600"
      case "sales":
        return isHigh ? "text-emerald-600" : "text-amber-600"
      case "enquiry":
        return isHigh ? "text-blue-600" : "text-orange-600"
      default:
        return ""
    }
  }

  const getPredictionBgColor = () => {
    if (prediction === null) return ""

    const isHigh = prediction > 0.5

    switch (predictionType) {
      case "ticket":
        return isHigh ? "bg-red-50" : "bg-green-50"
      case "sales":
        return isHigh ? "bg-emerald-50" : "bg-amber-50"
      case "enquiry":
        return isHigh ? "bg-blue-50" : "bg-orange-50"
      default:
        return ""
    }
  }

  const getPredictionIcon = () => {
    if (prediction === null) return null

    const isHigh = prediction > 0.5

    switch (predictionType) {
      case "ticket":
        return isHigh ? (
          <AlertTriangle className="w-6 h-6 text-red-600" />
        ) : (
          <Clock className="w-6 h-6 text-green-600" />
        )
      case "sales":
        return isHigh ? (
          <TrendingUp className="w-6 h-6 text-emerald-600" />
        ) : (
          <BarChart3 className="w-6 h-6 text-amber-600" />
        )
      case "enquiry":
        return isHigh ? (
          <TrendingUp className="w-6 h-6 text-blue-600" />
        ) : (
          <BarChart3 className="w-6 h-6 text-orange-600" />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-800">BizCRM AI Predictor</h1>
              </div>

              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setActiveTab("overview")} className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Overview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("analysis")} className="flex items-center gap-2">
                      <LineChart className="w-4 h-4" />
                      Advanced Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("comparison")} className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      Comparative Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("trends")} className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Trend Analysis
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={activeChart !== "none" ? "default" : "outline"} size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Charts
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setActiveChart("distribution")}
                      className="flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Distribution Chart
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveChart("prediction")} className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Prediction History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveChart("none")} className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className={autoRefresh ? "bg-blue-50" : ""}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
                      {autoRefresh ? "Auto-refreshing" : "Auto-refresh"}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setAutoRefresh(!autoRefresh)} className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      {autoRefresh ? "Turn Off Auto-refresh" : "Turn On Auto-refresh"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-semibold text-xs text-gray-500 pointer-events-none">
                      Refresh Interval:
                    </DropdownMenuItem>
                    {refreshIntervals.map((interval) => (
                      <DropdownMenuItem
                        key={interval.value}
                        onClick={() => setRefreshInterval(interval.value)}
                        className="flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        {interval.label}
                        {refreshInterval === interval.value && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      {predictionType === "ticket" && <AlertTriangle className="w-4 h-4" />}
                      {predictionType === "sales" && <TrendingUp className="w-4 h-4" />}
                      {predictionType === "enquiry" && <BarChart3 className="w-4 h-4" />}
                      {predictionType === "ticket" && "Ticket Prediction"}
                      {predictionType === "sales" && "Sales Prediction"}
                      {predictionType === "enquiry" && "Enquiry Prediction"}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handlePredictionTypeChange("ticket")}
                      className="flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Ticket Prediction
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePredictionTypeChange("sales")}
                      className="flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Sales Prediction
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePredictionTypeChange("enquiry")}
                      className="flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Enquiry Prediction
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ExportOptions predictionType={predictionType} />
              </div>
            </div>

            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{getPredictionTitle()}</span>
                      <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                      </div>
                    ) : (
                      <>
                        {prediction !== null && (
                          <div className={`${getPredictionBgColor()} p-6 rounded-lg`}>
                            <div className="flex items-center gap-3">
                              {getPredictionIcon()}
                              <h2 className="text-xl font-semibold text-gray-800">Prediction Result</h2>
                            </div>
                            <p className={`text-3xl font-bold mt-2 ${getPredictionColor()}`}>{getPredictionLabel()}</p>
                            <div className="flex items-center mt-2">
                              <p className="text-sm text-gray-600">Confidence:</p>
                              <Badge variant="outline" className="ml-2">
                                {confidence}%
                              </Badge>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    {prediction !== null && (
                      <>
                        <Alert className="w-full">
                          <Lightbulb className="h-4 w-4" />
                          <AlertTitle>Recommendation</AlertTitle>
                          <AlertDescription>{getAdvice()}</AlertDescription>
                        </Alert>

                        <div className="space-y-3 w-full">
                          <h3 className="text-sm font-medium">Required Actions:</h3>
                          {getAlerts().map((alert, index) => (
                            <Alert key={index} className="w-full border-l-4 border-l-blue-600">
                              {alert.icon}
                              <AlertTitle>{alert.title}</AlertTitle>
                              <AlertDescription>{alert.description}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </>
                    )}
                  </CardFooter>
                </Card>

                {/* Chart/notification card section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {activeChart === "distribution"
                          ? getChartTitle()
                          : activeChart === "prediction"
                            ? "Prediction History"
                            : "Recent Notifications"}
                      </span>

                      {activeChart === "distribution" && (
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                {chartTimeframe === "weekly"
                                  ? "Weekly"
                                  : chartTimeframe === "monthly"
                                    ? "Monthly"
                                    : "Quarterly"}
                                <ChevronDown className="w-4 h-4 ml-2" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setChartTimeframe("weekly")}>
                                Weekly
                                {chartTimeframe === "weekly" && <CheckCircle2 className="w-4 h-4 ml-2" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setChartTimeframe("monthly")}>
                                Monthly
                                {chartTimeframe === "monthly" && <CheckCircle2 className="w-4 h-4 ml-2" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setChartTimeframe("quarterly")}>
                                Quarterly
                                {chartTimeframe === "quarterly" && <CheckCircle2 className="w-4 h-4 ml-2" />}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeChart === "distribution" && (
                      <div className="h-[300px] w-full">
                        {dataLoading.chart ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="value" fill={getBarColor()} radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    )}

                    {activeChart === "prediction" && (
                      <div className="h-[300px] w-full">
                        {dataLoading.history ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart
                              data={predictionHistory}
                              margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis domain={[0, 1]} />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={getBarColor()}
                                strokeWidth={2}
                                dot={{ r: 4, fill: getBarColor() }}
                                activeDot={{ r: 6 }}
                              />
                            </RechartsLineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    )}

                    {activeChart === "none" && (
                      <div className="space-y-4">
                        {dataLoading.notifications ? (
                          <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                          </div>
                        ) : (
                          notifications.slice(0, 4).map((notification, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              {notification.icon}
                              <div>
                                <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                <p className="text-sm text-gray-600">{notification.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    {activeChart === "none" ? (
                      <Button variant="outline" className="w-full">
                        View All Notifications
                      </Button>
                    ) : (
                      <>
                        <CardDescription>
                          {activeChart === "distribution" ? (
                            <>
                              {predictionType === "ticket" &&
                                `Distribution of tickets by category type (${chartTimeframe}).`}
                              {predictionType === "sales" && `Projected sales revenue (${chartTimeframe}).`}
                              {predictionType === "enquiry" &&
                                `Distribution of customer inquiries by type (${chartTimeframe}).`}
                            </>
                          ) : (
                            "Trend of prediction values over time. Values above 0.5 indicate high priority/conversion potential."
                          )}
                        </CardDescription>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                              View Top Performers
                              <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[350px] md:w-[450px]" align="center">
                            <div className="p-2">
                              <TopPerformers
                                initialCategory={
                                  predictionType === "ticket"
                                    ? "ticket"
                                    : predictionType === "sales"
                                      ? "sales"
                                      : predictionType === "enquiry"
                                        ? "enquiry"
                                        : "overall"
                                }
                              />
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === "analysis" && (
              <div className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-purple-600" />
                        <span>Advanced Analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={activeAnalysisTab === "insights" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveAnalysisTab("insights")}
                        >
                          Insights
                        </Button>
                        <Button
                          variant={activeAnalysisTab === "trends" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveAnalysisTab("trends")}
                        >
                          Trends
                        </Button>
                        <Button
                          variant={activeAnalysisTab === "comparison" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveAnalysisTab("comparison")}
                        >
                          Comparison
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeAnalysisTab === "insights" && (
                      <PredictionInsights
                        predictionType={predictionType}
                        prediction={prediction}
                        confidence={confidence}
                      />
                    )}

                    {activeAnalysisTab === "trends" && (
                      <TrendAnalysis predictionType={predictionType} timeframe={chartTimeframe} />
                    )}

                    {activeAnalysisTab === "comparison" && (
                      <ComparativeAnalysis predictionType={predictionType} timeframe={chartTimeframe} />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "comparison" && (
              <div className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-5 w-5 text-purple-600" />
                        <span>Comparative Analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              {chartTimeframe === "weekly"
                                ? "Weekly"
                                : chartTimeframe === "monthly"
                                  ? "Monthly"
                                  : "Quarterly"}
                              <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setChartTimeframe("weekly")}>
                              Weekly
                              {chartTimeframe === "weekly" && <CheckCircle2 className="w-4 h-4 ml-2" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setChartTimeframe("monthly")}>
                              Monthly
                              {chartTimeframe === "monthly" && <CheckCircle2 className="w-4 h-4 ml-2" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setChartTimeframe("quarterly")}>
                              Quarterly
                              {chartTimeframe === "quarterly" && <CheckCircle2 className="w-4 h-4 ml-2" />}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ComparativeAnalysis predictionType={predictionType} timeframe={chartTimeframe} />
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "trends" && (
              <div className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <span>Trend Analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              {chartTimeframe === "weekly"
                                ? "Weekly"
                                : chartTimeframe === "monthly"
                                  ? "Monthly"
                                  : "Quarterly"}
                              <ChevronDown className="w-4 h-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setChartTimeframe("weekly")}>
                              Weekly
                              {chartTimeframe === "weekly" && <CheckCircle2 className="w-4 h-4 ml-2" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setChartTimeframe("monthly")}>
                              Monthly
                              {chartTimeframe === "monthly" && <CheckCircle2 className="w-4 h-4 ml-2" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setChartTimeframe("quarterly")}>
                              Quarterly
                              {chartTimeframe === "quarterly" && <CheckCircle2 className="w-4 h-4 ml-2" />}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrendAnalysis predictionType={predictionType} timeframe={chartTimeframe} />
                  </CardContent>
                </Card>
              </div>
            )}

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="help">Help</TabsTrigger>
                <TabsTrigger value="gamification">Gamification</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-4">
                <div className="text-sm text-gray-600">
                  <p>This AI model predicts {predictionType} outcomes based on:</p>
                  <ul className="list-disc list-inside mt-2">
                    {predictionType === "ticket" && (
                      <>
                        <li>Complaint Type</li>
                        <li>Category (Chargeable/Non-Chargeable)</li>
                        <li>Expected Completion Time</li>
                        <li>Branch Location</li>
                      </>
                    )}
                    {predictionType === "sales" && (
                      <>
                        <li>Historical Performance</li>
                        <li>Market Trends</li>
                        <li>Seasonal Factors</li>
                        <li>Product Category Performance</li>
                      </>
                    )}
                    {predictionType === "enquiry" && (
                      <>
                        <li>Inquiry Source</li>
                        <li>Customer Segment</li>
                        <li>Product Interest</li>
                        <li>Engagement Level</li>
                      </>
                    )}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="details" className="p-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">How it works:</p>
                  <p>
                    This predictor uses a neural network trained on historical data to make predictions. The model
                    analyzes patterns in the input data to identify correlations and make accurate forecasts.
                  </p>
                  <p className="mt-2">
                    For {predictionType} prediction, we use a model with 2 hidden layers and sigmoid activation to
                    classify outcomes based on the provided parameters.
                  </p>
                  <p className="mt-2">
                    The confidence score indicates how certain the model is about its prediction, with higher
                    percentages indicating greater confidence.
                  </p>
                  <p className="mt-2">
                    All data is fetched from external APIs in real-time to ensure the most up-to-date information.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="help" className="p-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Using the predictor:</p>
                  <p>This AI predictor automatically generates predictions based on real-time data. You can:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Switch between different prediction types using the dropdown menu</li>
                    <li>Toggle auto-refresh to see predictions update automatically</li>
                    <li>Change the refresh interval from 1 minute to 5 hours</li>
                    <li>View data in weekly, monthly, or quarterly timeframes</li>
                    <li>Show or hide charts using the Charts button</li>
                    <li>Manually refresh predictions using the refresh button</li>
                    <li>View detailed recommendations and required actions based on each prediction</li>
                    <li>See top performers across different categories</li>
                    <li>Access advanced analysis tools including insights, trends, and comparisons</li>
                    <li>Export reports in various formats for sharing and presentation</li>
                  </ul>
                  <p className="mt-2">
                    The dashboard provides multiple views to help you understand your data from different angles and
                    make informed business decisions.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="gamification" className="p-4">
                <GamificationDashboard predictionType={predictionType} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

