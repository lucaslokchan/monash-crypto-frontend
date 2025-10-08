"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Crown, TrendingUp, Users, BarChart3 } from "lucide-react"

interface PremiumUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

const premiumFeatures = [
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description: "Detailed time series charts and performance metrics",
  },
  {
    icon: Users,
    title: "User Journey Mapping",
    description: "Track detailed user interactions and behavior patterns",
  },
  {
    icon: BarChart3,
    title: "Custom Reports",
    description: "Generate comprehensive analytics reports",
  },
  {
    icon: Crown,
    title: "Priority Support",
    description: "Get premium support and feature requests",
  },
]

export function PremiumUpgradeModal({ isOpen, onClose }: PremiumUpgradeModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)

  const handleUpgrade = async () => {
    setIsUpgrading(true)

    // Simulate upgrade process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsUpgrading(false)
    // Update user role in localStorage (mock implementation)
    // const currentUser = localStorage.getItem("user")
    // if (currentUser) {
    //   const user = JSON.parse(currentUser)
    //   user.role = "PREMIUM_BLOGGER"
    //   localStorage.setItem("user", JSON.stringify(user))
    // }

    // setIsUpgrading(false)
    // onClose()

    // Refresh the page to update the UI
    // window.location.reload()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-primary" />
            <span>Upgrade to Premium</span>
          </DialogTitle>
          <DialogDescription>Unlock advanced analytics and insights to grow your blog audience</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <Crown className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Premium Blogger</CardTitle>
              </div>
              <CardDescription>Everything you need to grow your audience</CardDescription>
              <div className="text-4xl font-bold text-foreground">
                $9.99
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button onClick={handleUpgrade} className="flex-1" disabled={isUpgrading}>
              {isUpgrading ? "Upgrading..." : "Upgrade to Premium"}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isUpgrading}>
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This is a demo. No actual payment will be processed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
