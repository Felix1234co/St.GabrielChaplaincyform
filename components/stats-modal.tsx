"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, Calendar, TrendingUp, Download, RotateCcw } from "lucide-react"

interface StatsModalProps {
  open: boolean
  onClose: () => void
}

interface Stats {
  daily: Record<string, number>
  monthly: Record<string, number>
  yearly: Record<string, number>
}

export function StatsModal({ open, onClose }: StatsModalProps) {
  const [stats, setStats] = useState<Stats>({ daily: {}, monthly: {}, yearly: {} })
  const [totalMembers, setTotalMembers] = useState(0)

  useEffect(() => {
    if (open && typeof window !== "undefined") {
      loadStats()
    }
  }, [open])

  const loadStats = () => {
    try {
      const savedStats = localStorage.getItem("registrationStats")
      const memberCounter = localStorage.getItem("memberCounter")

      if (savedStats) {
        setStats(JSON.parse(savedStats))
      }

      if (memberCounter) {
        setTotalMembers(Number.parseInt(memberCounter))
      }
    } catch (error) {
      console.error("Error loading stats:", error)
      setStats({ daily: {}, monthly: {}, yearly: {} })
      setTotalMembers(0)
    }
  }

  const getTodayStats = () => {
    const today = new Date().toISOString().split("T")[0]
    return stats.daily[today] || 0
  }

  const getThisMonthStats = () => {
    const thisMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`
    return stats.monthly[thisMonth] || 0
  }

  const getThisYearStats = () => {
    const thisYear = new Date().getFullYear().toString()
    return stats.yearly[thisYear] || 0
  }

  const exportStats = () => {
    const exportData = {
      totalMembers,
      todayRegistrations: getTodayStats(),
      thisMonthRegistrations: getThisMonthStats(),
      thisYearRegistrations: getThisYearStats(),
      detailedStats: stats,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `registration-stats-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const resetStats = () => {
    if (confirm("Are you sure you want to reset all statistics? This action cannot be undone.")) {
      localStorage.removeItem("registrationStats")
      localStorage.removeItem("memberCounter")
      setStats({ daily: {}, monthly: {}, yearly: {} })
      setTotalMembers(0)
    }
  }

  const getRecentDays = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      days.push({
        date: dateStr,
        label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        count: stats.daily[dateStr] || 0,
      })
    }
    return days
  }

  const getRecentMonths = () => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
      months.push({
        month: monthStr,
        label: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        count: stats.monthly[monthStr] || 0,
      })
    }
    return months
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Registration Statistics
          </DialogTitle>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalMembers}</div>
              <div className="text-sm opacity-90">Total Members</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{getTodayStats()}</div>
              <div className="text-sm opacity-90">Today</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{getThisMonthStats()}</div>
              <div className="text-sm opacity-90">This Month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{getThisYearStats()}</div>
              <div className="text-sm opacity-90">This Year</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily Stats</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecentDays().map((day) => (
                    <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{day.label}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min((day.count / Math.max(...getRecentDays().map((d) => d.count), 1)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="font-bold text-blue-600 w-8 text-right">{day.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Last 6 Months</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRecentMonths().map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{month.label}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min((month.count / Math.max(...getRecentMonths().map((m) => m.count), 1)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="font-bold text-purple-600 w-8 text-right">{month.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button onClick={exportStats} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button
            onClick={resetStats}
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Stats
          </Button>
          <Button onClick={onClose} className="flex-1 sm:flex-none">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
