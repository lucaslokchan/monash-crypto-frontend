"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { PremiumUpgradeModal } from "./premium-upgrade-modal"

interface PremiumFeatureLockProps {
  title: string
  description: string
  children: React.ReactNode
}

export function PremiumFeatureLock({ title, description, children }: PremiumFeatureLockProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  return (
    <>
      <div className="relative">
        <div className="filter blur-sm pointer-events-none">{children}</div>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg border border-border">
          <div className="text-center space-y-4 p-8 max-w-sm">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button onClick={() => setShowUpgradeModal(true)} className="w-full">
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>

      <PremiumUpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  )
}
