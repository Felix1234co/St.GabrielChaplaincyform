"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmailModalProps {
  open: boolean
  onClose: () => void
  memberData: MemberData | null
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

export function EmailModal({ open, onClose, memberData }: EmailModalProps) {
  if (!memberData) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-green-600">📧 Registration Successful!</DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4">
          <p className="text-lg">🎉 Congratulations! Your registration has been completed successfully.</p>

          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold">Member ID: {memberData.id}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">📋 Registration Summary:</h4>
              <div className="space-y-2 text-sm text-left">
                <div>
                  <strong>Name:</strong> {memberData.name}
                </div>
                <div>
                  <strong>Email:</strong> {memberData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {memberData.phone}
                </div>
                <div>
                  <strong>Ministry:</strong> {memberData.ministry}
                </div>
                <div>
                  <strong>Status:</strong> {memberData.status}
                </div>
                <div>
                  <strong>Years in Faith:</strong> {memberData.yearsInFaith} years
                </div>
                <div>
                  <strong>Date of Birth:</strong> {formatDate(memberData.dob)}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2 text-sm">
            <p>📧 Admin has been notified with your registration details and will prepare your ID card for printing.</p>
            <p>🆔 Your membership ID card will be available for collection soon.</p>
            <p>🕊️ Welcome to St. Gabriel Chaplaincy family! May God bless you abundantly.</p>
          </div>

          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
            ✨ Continue to ID Card Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
