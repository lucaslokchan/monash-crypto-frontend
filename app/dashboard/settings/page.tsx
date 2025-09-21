"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, User, Shield, Save } from "lucide-react"
import { getCurrentUser, isPremiumBlogger } from "@/lib/auth"
import { PremiumUpgradeModal } from "@/components/premium-upgrade-modal"

export default function SettingsPage() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsPremium(isPremiumBlogger())

    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: "user@monash.edu", // Mock email
        role: currentUser.role,
      })
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update localStorage
    if (user) {
      const updatedUser = { ...user, username: formData.username }
      localStorage.setItem("mockUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }

    setSaveMessage("Settings saved successfully!")
    setIsSaving(false)

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(""), 3000)
  }

  if (!user) return null

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account Information</span>
                </CardTitle>
                <CardDescription>Update your account details and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {saveMessage && (
                  <Alert>
                    <AlertDescription>{saveMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={formData.email} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant={isPremium ? "default" : "secondary"} className="flex items-center space-x-1">
                      {isPremium && <Crown className="h-3 w-3" />}
                      <span>{isPremium ? "Premium Blogger" : "Basic Blogger"}</span>
                    </Badge>
                    {!isPremium && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUpgradeModal(true)}
                        className="flex items-center space-x-1"
                      >
                        <Crown className="h-3 w-3" />
                        <span>Upgrade</span>
                      </Button>
                    )}
                  </div>
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Account Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Account Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Type</span>
                    <Badge variant={isPremium ? "default" : "secondary"}>{isPremium ? "Premium" : "Basic"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="text-sm text-foreground">Jan 2024</span>
                  </div>
                </div>

                {!isPremium && (
                  <div className="pt-4 border-t border-border">
                    <Button onClick={() => setShowUpgradeModal(true)} className="w-full flex items-center space-x-2">
                      <Crown className="h-4 w-4" />
                      <span>Upgrade to Premium</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {isPremium && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <span>Premium Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Advanced Analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>User Journey Mapping</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Custom Reports</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Priority Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <PremiumUpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  )
}
