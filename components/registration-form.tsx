"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Phone, Building2, AlertTriangle } from "lucide-react"

interface RegistrationFormProps {
  onSubmit: (data: FormData) => void
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

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    emailAddress: "",
    ministry: "",
    customMinistry: "",
    sacramentStatus: "",
    yearsInFaith: "",
    passport: null as File | null,
    paymentScreenshot: null as File | null,
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null)
  const [showCustomMinistry, setShowCustomMinistry] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (field === "passport") {
          setPhotoPreview(e.target?.result as string)
        } else if (field === "paymentScreenshot") {
          setPaymentPreview(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMinistryChange = (value: string) => {
    handleInputChange("ministry", value)
    setShowCustomMinistry(value === "Other")
    if (value !== "Other") {
      handleInputChange("customMinistry", "")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !formData.fullName ||
      !formData.dateOfBirth ||
      !formData.phoneNumber ||
      !formData.emailAddress ||
      !formData.ministry ||
      !formData.sacramentStatus ||
      !formData.yearsInFaith ||
      !formData.passport
    ) {
      alert("Please fill in all required fields and upload your passport photo.")
      return
    }

    if (formData.ministry === "Other" && !formData.customMinistry) {
      alert("Please specify your ministry/domain.")
      return
    }

    onSubmit(formData)
  }

  const ministries = [
    { value: "Choir", label: "🎵 Choir" },
    { value: "Altar Server", label: "⛪ Altar Server" },
    { value: "Board of Lector", label: "📖 Board of Lector" },
    { value: "CMO", label: "👨‍👥 Catholic Men Organization (CMO)" },
    { value: "CWO", label: "👩‍👥 Catholic Women Organization (CWO)" },
    { value: "St. Vincent de Paul", label: "❤️ St. Vincent de Paul" },
    { value: "Legion of Mary", label: "🌹 Legion of Mary" },
    { value: "Youth Ministry", label: "🌟 Youth Ministry" },
    { value: "Catechist", label: "📚 Catechist" },
    { value: "Usher", label: "🚪 Usher" },
    { value: "Parish Council", label: "🏛️ Parish Council" },
    { value: "Other", label: "✍️ Other (Please specify)" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Contact Information */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">Contact Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="+234 XXX XXX XXXX"
                required
              />
            </div>
            <div>
              <Label htmlFor="emailAddress">Email Address *</Label>
              <Input
                id="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passport Photo Upload */}
      <div>
        <Label htmlFor="passport">Upload Passport Photo *</Label>
        <div className="mt-2">
          <label
            htmlFor="passport"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-blue-500" />
              <p className="text-sm text-blue-600">
                {formData.passport ? "✅ Photo uploaded successfully" : "📷 Click to upload your passport photo"}
              </p>
            </div>
            <input
              id="passport"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange("passport", e.target.files?.[0] || null)}
              required
            />
          </label>
          {photoPreview && (
            <div className="mt-4 text-center">
              <img
                src={photoPreview || "/placeholder.svg"}
                alt="Photo preview"
                className="max-w-32 max-h-32 rounded-lg border-2 border-blue-300 mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Ministry Selection */}
      <div>
        <Label htmlFor="ministry">Church Ministry/Domain *</Label>
        <Select value={formData.ministry} onValueChange={handleMinistryChange}>
          <SelectTrigger>
            <SelectValue placeholder="✨ Select your ministry" />
          </SelectTrigger>
          <SelectContent>
            {ministries.map((ministry) => (
              <SelectItem key={ministry.value} value={ministry.value}>
                {ministry.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showCustomMinistry && (
          <div className="mt-4 animate-in slide-in-from-top-2">
            <Label htmlFor="customMinistry" className="text-amber-700 font-semibold flex items-center gap-2">
              ✨ Please specify your ministry/domain
            </Label>
            <Input
              id="customMinistry"
              value={formData.customMinistry}
              onChange={(e) => handleInputChange("customMinistry", e.target.value)}
              placeholder="e.g., Prayer Group, Bible Study, Hospital Visitation, etc."
              className="border-amber-300 bg-amber-50"
            />
          </div>
        )}
      </div>

      {/* Years in Catholic Faith */}
      <div>
        <Label htmlFor="yearsInFaith">Years in Catholic Faith *</Label>
        <Input
          id="yearsInFaith"
          type="number"
          min="0"
          max="100"
          value={formData.yearsInFaith}
          onChange={(e) => handleInputChange("yearsInFaith", e.target.value)}
          placeholder="Enter number of years"
          required
        />
      </div>

      {/* Sacramental Status */}
      <div>
        <Label>Sacramental Status *</Label>
        <RadioGroup
          value={formData.sacramentStatus}
          onValueChange={(value) => handleInputChange("sacramentStatus", value)}
          className="flex flex-wrap gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Communicant" id="communicant" />
            <Label htmlFor="communicant">Communicant</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Baptized Only" id="baptized" />
            <Label htmlFor="baptized">Baptized Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="None" id="none" />
            <Label htmlFor="none">None</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Bank Transfer Section */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">Parish Bank Account Details</h3>
          </div>
          <p className="text-center text-blue-600 mb-4">Choose your preferred payment method below</p>

          <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 mb-4">
            <div className="space-y-2 text-sm">
              <div>
                <strong>Bank Name:</strong> Fidelity Bank Nigeria
              </div>
              <div>
                <strong>Account Number:</strong> 1234567890
              </div>
              <div>
                <strong>Account Name:</strong> St. Gabriel Chaplaincy
              </div>
              <div>
                <strong>Amount:</strong> ₦1,000
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="paymentScreenshot">Upload Payment Screenshot (Optional)</Label>
            <div className="mt-2">
              <label
                htmlFor="paymentScreenshot"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-green-500" />
                  <p className="text-sm text-green-600">
                    {formData.paymentScreenshot
                      ? "✅ Payment screenshot uploaded!"
                      : "💳 Upload payment screenshot/receipt (if using bank transfer)"}
                  </p>
                </div>
                <input
                  id="paymentScreenshot"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange("paymentScreenshot", e.target.files?.[0] || null)}
                />
              </label>
              {paymentPreview && (
                <div className="mt-4 text-center">
                  <img
                    src={paymentPreview || "/placeholder.svg"}
                    alt="Payment preview"
                    className="max-w-48 max-h-48 rounded-lg border-2 border-green-300 mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Privacy & Data Usage Disclaimer</h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                By submitting this form, you agree to your information being used by the Parish for official purposes
                only. Your personal data will be kept confidential and used solely for church membership records,
                communication, and parish activities. We respect your privacy and will not share your information with
                third parties without your explicit consent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg font-semibold"
      >
        💳 Pay & Generate ID Card
      </Button>
    </form>
  )
}
