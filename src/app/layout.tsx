import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improved font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Improved font loading
});

export const metadata: Metadata = {
  title: "Tech Society Recruitment",
  description: "Join our innovative community of tech enthusiasts at IIT Madras",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000", // Set theme-color to match our dark theme
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-nord0 text-nord6 min-h-screen`}
      >
        <ClerkProvider>
              {children}
        </ClerkProvider>
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}