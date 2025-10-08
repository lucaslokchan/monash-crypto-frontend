import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { PageViewTracker } from "@/components/page-view-tracker"
import "./globals.css"

export const metadata: Metadata = {
  title: "Monash CryptoBlog - Insights on Digital Assets",
  description: "A university blog platform focused on cryptocurrency, blockchain, and digital asset insights",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
