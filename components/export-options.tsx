"use client"
import { Button } from "@/components/ui/button"
import {
  Download,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileJson,
  FileImage,
  Share2,
  Mail,
  Calendar,
  Printer,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface ExportOptionsProps {
  predictionType: "ticket" | "sales" | "enquiry"
}

export function ExportOptions({ predictionType }: ExportOptionsProps) {
  const handleExport = (format: string) => {
    // Generate a filename based on prediction type and current date
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `${predictionType}-prediction-${timestamp}`

    // Store the format and filename for later download
    const exportInfo = { format, filename }

    // Store export info in session storage for retrieval when "View exports" is clicked
    sessionStorage.setItem("lastExport", JSON.stringify(exportInfo))

    // Show toast with action to download
    toast({
      title: "Export ready",
      description: `Your ${predictionType} data has been exported as ${format.toUpperCase()}`,
      action: (
        <ToastAction altText="Download export" onClick={() => downloadExport(exportInfo)}>
          Download
        </ToastAction>
      ),
    })
  }

  const downloadExport = (exportInfo: { format: string; filename: string }) => {
    const { format, filename } = exportInfo

    // Generate dummy data based on format
    switch (format.toLowerCase()) {
      case "excel":
        // For Excel, create a CSV file (simplified approach)
        const csvContent = `Date,Category,Value\n${new Date().toLocaleDateString()},${predictionType},${Math.round(Math.random() * 100)}`
        downloadFile(csvContent, `${filename}.csv`, "text/csv")
        break

      case "pdf":
        // For PDF, we'd normally use a library like jsPDF
        // This is a placeholder that creates a text file with PDF content description
        const pdfContent = `This would be a PDF document for ${predictionType} prediction data.`
        downloadFile(pdfContent, `${filename}.txt`, "text/plain")
        break

      case "json":
        // For JSON, create a simple JSON structure
        const jsonData = {
          predictionType,
          timestamp: new Date().toISOString(),
          data: [
            { category: "Category 1", value: Math.round(Math.random() * 100) },
            { category: "Category 2", value: Math.round(Math.random() * 100) },
            { category: "Category 3", value: Math.round(Math.random() * 100) },
          ],
        }
        downloadFile(JSON.stringify(jsonData, null, 2), `${filename}.json`, "application/json")
        break

      case "image":
        // For image, we'd normally generate a canvas and export it
        // This is a placeholder that creates a text file with image description
        const imageContent = `This would be a PNG image of the ${predictionType} prediction chart.`
        downloadFile(imageContent, `${filename}.txt`, "text/plain")
        break

      default:
        console.error(`Unsupported export format: ${format}`)
    }
  }

  const downloadFile = (content: string, filename: string, contentType: string) => {
    // Create a blob with the content
    const blob = new Blob([content], { type: contentType })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.style.display = "none"

    // Add to document, trigger click, and clean up
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  const handleShare = (method: string) => {
    // Generate a filename based on prediction type and current date
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `${predictionType}-shared-${timestamp}`

    // Store the method and filename for later download
    const shareInfo = { method, filename }
    sessionStorage.setItem("lastShare", JSON.stringify(shareInfo))

    // Simulate sharing process
    toast({
      title: "Share ready",
      description: `Your ${predictionType} data has been prepared for sharing via ${method}`,
      action: (
        <ToastAction
          altText="View share"
          onClick={() => {
            if (method === "email") {
              // For email, create a sample email content
              const emailContent = `Subject: ${predictionType} Prediction Report\n\nHere is the ${predictionType} prediction report you requested.`
              downloadFile(emailContent, `${filename}.eml`, "message/rfc822")
            } else if (method === "link") {
              // For link, create a sample shareable link
              const linkContent = `https://example.com/share/${predictionType}/${timestamp}`
              navigator.clipboard.writeText(linkContent)
              toast({
                title: "Link copied",
                description: "Shareable link has been copied to clipboard",
              })
            }
          }}
        >
          {method === "email" ? "Download" : "Copy Link"}
        </ToastAction>
      ),
    })
  }

  const handleSchedule = () => {
    // Simulate scheduling process
    toast({
      title: "Report scheduled",
      description: `Your ${predictionType} report has been scheduled for weekly delivery`,
      action: <ToastAction altText="View schedule">View schedule</ToastAction>,
    })
  }

  const handlePrint = () => {
    // Simulate print process
    toast({
      title: "Print initiated",
      description: `Your ${predictionType} report is being prepared for printing`,
    })
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleExport("excel")} className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            Excel Spreadsheet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("pdf")} className="flex items-center gap-2">
            <FilePdf className="h-4 w-4 text-red-600" />
            PDF Document
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("json")} className="flex items-center gap-2">
            <FileJson className="h-4 w-4 text-blue-600" />
            JSON Data
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("image")} className="flex items-center gap-2">
            <FileImage className="h-4 w-4 text-purple-600" />
            Image (PNG)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Share Options</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleShare("email")} className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            Email Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("link")} className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-purple-600" />
            Share Link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSchedule} className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Schedule Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-gray-600" />
            Print Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

