import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NODENEXUS — Reality Check | Bridge Your Hireability Gap",
  description:
    "AI-powered career gap analysis. Upload your syllabus, paste your dream job, and get a brutally honest roadmap to close the gap — with exact resources.",
  keywords: [
    "career gap analysis",
    "hireability",
    "syllabus vs job",
    "learning roadmap",
    "AI career coach",
    "tech skills",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050510] text-[#f0f0f5]`}
      >
        {children}
      </body>
    </html>
  );
}
