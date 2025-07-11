"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, CreditCard, Smartphone, Building2 } from "lucide-react"

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (memberData: MemberData) => void
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
  paymentMethod: string
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

export function PaymentModal({ open, onClose, onSuccess, formData }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [processing, setProcessing] = useState(false)
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    mobileProvider: "",
    mobileNumber: "",
    accountNumber: "",
    accountHolder: "",
  })

  const paymentMethods = [
    { id: "card", label: "Credit Card", icon: CreditCard },
    { id: "mobile", label: "Mobile Money", icon: Smartphone },
    { id: "bank", label: "Bank Transfer", icon: Building2 },
  ]

  const generateMemberID = () => {
    if (typeof window === "undefined") return "SGC-0001"

    const counter = Number.parseInt(localStorage.getItem("memberCounter") || "0") + 1
    localStorage.setItem("memberCounter", counter.toString())
    return `SGC-${counter.toString().padStart(4, "0")}`
  }

  const updateStats = () => {
    if (typeof window === "undefined") return

    const now = new Date()
    const today = now.toISOString().split("T")[0]
    const thisMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`
    const thisYear = now.getFullYear().toString()

    const stats = JSON.parse(localStorage.getItem("registrationStats") || '{"daily": {}, "monthly": {}, "yearly": {}}')

    stats.daily[today] = (stats.daily[today] || 0) + 1
    stats.monthly[thisMonth] = (stats.monthly[thisMonth] || 0) + 1
    stats.yearly[thisYear] = (stats.yearly[thisYear] || 0) + 1

    localStorage.setItem("registrationStats", JSON.stringify(stats))
  }

  const sendAdminNotification = async (memberData: MemberData) => {
    setEmailStatus("sending")

    try {
      // Store registration for admin review (local storage backup)
      const registrationData = {
        ...memberData,
        registrationDate: new Date().toISOString(),
        formData: formData,
      }

      const existingRegistrations = JSON.parse(localStorage.getItem("pendingRegistrations") || "[]")
      existingRegistrations.push(registrationData)
      localStorage.setItem("pendingRegistrations", JSON.stringify(existingRegistrations))

      // Simulate email sending (replace with actual EmailJS implementation)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setEmailStatus("sent")
      return true
    } catch (error) {
      console.error("Error sending notification:", error)
      setEmailStatus("error")
      return false
    }
  }

  const handlePayment = async () => {
    if (!formData || !selectedMethod) return

    setProcessing(true)

    try {
      // Generate member ID and create member data
      const memberId = generateMemberID()
      const memberData: MemberData = {
        id: memberId,
        name: formData.fullName,
        email: formData.emailAddress,
        phone: formData.phoneNumber,
        dob: formData.dateOfBirth,
        ministry: formData.ministry === "Other" ? formData.customMinistry : formData.ministry,
        status: formData.sacramentStatus,
        yearsInFaith: formData.yearsInFaith,
        paymentMethod: selectedMethod,
      }

      // Store member data
      const existingMembers = JSON.parse(localStorage.getItem("registeredMembers") || "[]")
      existingMembers.push(memberData)
      localStorage.setItem("registeredMembers", JSON.stringify(existingMembers))

      // Update statistics
      updateStats()

      // Send admin notification
      await sendAdminNotification(memberData)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onSuccess(memberData)
    } catch (error) {
      console.error("Payment processing error:", error)
    } finally {
      setProcessing(false)
    }
  }

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, cardNumber: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, cvv: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={paymentData.cardholderName}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, cardholderName: e.target.value }))}
              />
            </div>
          </div>
        )

      case "mobile":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="mobileProvider">Mobile Money Provider</Label>
              <Select onValueChange={(value) => setPaymentData((prev) => ({ ...prev, mobileProvider: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                  <SelectItem value="airtel">Airtel Money</SelectItem>
                  <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                placeholder="0XX XXX XXXX"
                value={paymentData.mobileNumber}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, mobileNumber: e.target.value }))}
              />
            </div>
          </div>
        )

      case "bank":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="1234567890"
                value={paymentData.accountNumber}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, accountNumber: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="accountHolder">Account Holder Name</Label>
              <Input
                id="accountHolder"
                placeholder="John Doe"
                value={paymentData.accountHolder}
                onChange={(e) => setPaymentData((prev) => ({ ...prev, accountHolder: e.target.value }))}
              />
            </div>
            <Alert>
              <AlertDescription>Please transfer GHS 50 to Account: 1234567890, Bank: ABC Bank</AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Registration Payment</DialogTitle>
          <DialogDescription>Registration fee: GHS 50.00</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <Label className="text-base font-medium">Select Payment Method</Label>
            <div className="grid grid-cols-1 gap-3 mt-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-colors ${
                      selectedMethod === method.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent className="flex items-center space-x-3 p-4">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{method.label}</span>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Payment Form */}
          {selectedMethod && (
            <div>
              <Label className="text-base font-medium">Payment Details</Label>
              <div className="mt-3">{renderPaymentForm()}</div>
            </div>
          )}

          {/* Email Status */}
          {emailStatus === "sending" && (
            <Alert>
              <AlertDescription>Sending admin notification...</AlertDescription>
            </Alert>
          )}

          {emailStatus === "sent" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Admin notification sent successfully!</AlertDescription>
            </Alert>
          )}

          {emailStatus === "error" && (
            <Alert variant="destructive">
              <AlertDescription>Failed to send admin notification. Registration will still proceed.</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={!selectedMethod || processing} className="flex-1">
              {processing ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
