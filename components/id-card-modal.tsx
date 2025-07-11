"use client"

import { useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Printer, Download, X } from "lucide-react"

interface IDCardModalProps {
  open: boolean
  onClose: () => void
  memberData: MemberData | null
  formData: FormData | null
}

interface MemberData {
  id: string
  name: string
  email: string
  phone: string
  dob: string
  ministry: string
  status: string
  yearsInFaith: string
}

interface FormData {
  fullName: string
  dateOfBirth: string
  phoneNumber: string
  emailAddress: string
  ministry: string
  customMinistry: string
  sacramentStatus: string
  yearsInFaith: string
  passport: File | null
  paymentScreenshot: File | null
}

export function IDCardModal({ open, onClose, memberData, formData }: IDCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  if (!memberData || !formData) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handlePrint = () => {
    if (cardRef.current) {
      const printContent = cardRef.current.innerHTML
      const originalContent = document.body.innerHTML

      document.body.innerHTML = `
        <style>
          @media print {
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
            }
            .id-card { 
              width: 3.375in; 
              height: 2.125in; 
              border: 2px solid #000;
              border-radius: 8px;
              overflow: hidden;
              page-break-inside: avoid;
            }
            .no-print { display: none !important; }
          }
        </style>
        <div class="id-card">${printContent}</div>
      `

      window.print()
      document.body.innerHTML = originalContent
      window.location.reload()
    }
  }

  const handleDownload = async () => {
    try {
      // This is a simplified version - in production you'd use html2canvas
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (ctx && cardRef.current) {
        canvas.width = 540 // 3.375 inches * 160 DPI
        canvas.height = 340 // 2.125 inches * 160 DPI

        // Simple canvas drawing - replace with html2canvas for better results
        ctx.fillStyle = "#4F46E5"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = "white"
        ctx.font = "16px Arial"
        ctx.fillText("ST. GABRIEL CHAPLAINCY", 20, 30)
        ctx.font = "12px Arial"
        ctx.fillText("MEMBERSHIP CARD", 20, 50)

        ctx.font = "14px Arial"
        ctx.fillText(`Name: ${memberData.name}`, 20, 100)
        ctx.fillText(`ID: ${memberData.id}`, 20, 120)
        ctx.fillText(`Ministry: ${memberData.ministry}`, 20, 140)
        ctx.fillText(`Status: ${memberData.status}`, 20, 160)

        // Download the canvas as image
        const link = document.createElement("a")
        link.download = `${memberData.name}-ID-Card.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    } catch (error) {
      console.error("Download failed:", error)
      alert("Download failed. Please use the print option instead.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl">🆔 Your Membership ID Card</DialogTitle>
          <p className="text-center text-muted-foreground text-sm sm:text-base">Your blessed membership card preview</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-4 no-print">
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>

          {/* ID Card Preview */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="w-80 h-48 sm:w-96 sm:h-56 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 rounded-lg shadow-2xl overflow-hidden relative print:shadow-none"
            >
              {/* Background Pattern */}
              <div className="absolute top-2 right-2 w-16 h-16 rounded-full border-4 border-white/30 bg-white/10 flex items-center justify-center">
                <span className="text-2xl">⛪</span>
              </div>

              {/* Member ID Badge */}
              <div className="absolute top-2 left-2 bg-white/20 px-3 py-1 rounded-full text-xs">{memberData.id}</div>

              {/* Header */}
              <div className="text-center mb-6 relative z-10 pt-4">
                <h2 className="text-xl font-bold mb-1 text-white">St. Gabriel Chaplaincy</h2>
                <p className="text-sm opacity-90 text-white">Member Identification Card</p>
                <p className="text-xs italic mt-1 opacity-80 text-white">Under the protection of St. Gabriel</p>
              </div>

              {/* Content */}
              <div className="flex gap-4 relative z-10 px-4">
                {/* Photo */}
                <div className="w-20 h-20 rounded-lg border-3 border-white overflow-hidden bg-white/20 flex items-center justify-center">
                  {formData.passport ? (
                    <img
                      src={URL.createObjectURL(formData.passport) || "/placeholder.svg"}
                      alt="Member photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-white">👤</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2 text-sm text-white">
                  <div>
                    <div className="text-xs opacity-80 uppercase tracking-wide">Name</div>
                    <div className="font-semibold truncate">{memberData.name}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80 uppercase tracking-wide">Date of Birth</div>
                    <div className="text-xs">{formatDate(memberData.dob)}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80 uppercase tracking-wide">Ministry</div>
                    <div className="text-xs truncate">{memberData.ministry}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80 uppercase tracking-wide">Status</div>
                    <div className="text-xs">{memberData.status}</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-2 right-4 text-xs opacity-70 relative z-10 text-white">
                Issued: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Member Details Summary */}
          <Card className="no-print">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 text-sm sm:text-base">📋 Complete Member Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Full Name:</strong> {memberData.name}
                </div>
                <div>
                  <strong>Member ID:</strong> {memberData.id}
                </div>
                <div>
                  <strong>Email:</strong> {memberData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {memberData.phone}
                </div>
                <div>
                  <strong>Date of Birth:</strong> {formatDate(memberData.dob)}
                </div>
                <div>
                  <strong>Ministry:</strong> {memberData.ministry}
                </div>
                <div>
                  <strong>Sacrament Status:</strong> {memberData.status}
                </div>
                <div>
                  <strong>Years in Faith:</strong> {memberData.yearsInFaith} years
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-green-50 border-green-200 no-print">
            <CardContent className="p-4">
              <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">🎉 Registration Complete!</h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>✅ Your membership has been successfully registered</p>
                <p>📧 Admin has been notified for ID card printing</p>
                <p>🆔 You can print this preview or download it</p>
                <p>🕊️ Welcome to St. Gabriel Chaplaincy family!</p>
              </div>
            </CardContent>
          </Card>

          {/* Final Action Button */}
          <div className="text-center no-print">
            <Button onClick={onClose} className="w-full sm:w-auto px-8">
              ✅ Complete Registration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
