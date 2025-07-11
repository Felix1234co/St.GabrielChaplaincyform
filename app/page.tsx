"use client"

import { useState } from "react"
import { RegistrationForm } from "@/components/registration-form"
import { PaymentModal } from "@/components/payment-modal"
import { IdCardModal } from "@/components/id-card-modal"
import { StatsModal } from "@/components/stats-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Users, Church, Calendar } from "lucide-react"

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

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "idcard">("form")
  const [formData, setFormData] = useState<FormData | null>(null)
  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [showStats, setShowStats] = useState(false)

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setCurrentStep("payment")
  }

  const handlePaymentSuccess = (data: MemberData) => {
    setMemberData(data)
    setCurrentStep("idcard")
  }

  const handleBackToForm = () => {
    setCurrentStep("form")
    setFormData(null)
    setMemberData(null)
  }

  const getTotalMembers = () => {
    if (typeof window === "undefined") return 0
    return Number.parseInt(localStorage.getItem("memberCounter") || "0")
  }

  const getTodayRegistrations = () => {
    if (typeof window === "undefined") return 0
    const stats = JSON.parse(localStorage.getItem("registrationStats") || '{"daily": {}}')
    const today = new Date().toISOString().split("T")[0]
    return stats.daily[today] || 0
  }

  const getThisMonthRegistrations = () => {
    if (typeof window === "undefined") return 0
    const stats = JSON.parse(localStorage.getItem("registrationStats") || '{"monthly": {}}')
    const thisMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`
    return stats.monthly[thisMonth] || 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Church className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">St. Gabriel Chaplaincy</h1>
                <p className="text-sm text-gray-600">Member Registration Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(true)}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Statistics</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === "form" && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Community</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join St. Gabriel Chaplaincy and become part of our vibrant Catholic community. Complete your
                registration to receive your official membership ID card.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Members</p>
                      <p className="text-3xl font-bold">{getTotalMembers()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">This Month</p>
                      <p className="text-3xl font-bold">{getThisMonthRegistrations()}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Today</p>
                      <p className="text-3xl font-bold">{getTodayRegistrations()}</p>
                    </div>
                    <Church className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <RegistrationForm onSubmit={handleFormSubmit} />
          </div>
        )}
      </main>

      {/* Modals */}
      <PaymentModal
        open={currentStep === "payment"}
        onClose={handleBackToForm}
        onSuccess={handlePaymentSuccess}
        formData={formData}
      />

      <IdCardModal
        open={currentStep === "idcard"}
        onClose={handleBackToForm}
        memberData={memberData}
        formData={formData}
      />

      <StatsModal open={showStats} onClose={() => setShowStats(false)} />

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">© 2024 St. Gabriel Chaplaincy. All rights reserved.</p>
            <p className="text-sm text-gray-500 mt-2">Building a stronger Catholic community together</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
