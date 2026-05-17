// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UAT Help — All University Admission Notices in One Place",
    template: "%s | UAT Help",
  },
  description:
    "Find all Bangladeshi university admission notices, circulars, results, admit cards, seat plans, deadlines, PDFs, guides, and preparation tips in one place.",
  keywords: [
    "university admission Bangladesh",
    "admission notice",
    "Dhaka University admission",
    "admission circular 2025",
    "university result",
    "admit card",
    "seat plan",
    "admission tips",
  ],
  authors: [{ name: "UAT Help" }],
  creator: "UAT Help",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://uathelp.com",
    siteName: "UAT Help",
    title: "UAT Help — All University Admission Notices in One Place",
    description:
      "Find all Bangladeshi university admission notices, circulars, results, admit cards, seat plans, deadlines, PDFs, guides, and preparation tips in one place.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UAT Help — All University Admission Notices in One Place",
    description:
      "Find all Bangladeshi university admission notices, circulars, results, admit cards, seat plans, deadlines, PDFs, guides, and preparation tips in one place.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
