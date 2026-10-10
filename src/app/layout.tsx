import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RoadmapProvider } from "@/context/RoadmapContext";
import { Navbar } from "@/components/common/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PathCraft — Reverse-Engineered Career Roadmapper | Azisly Hackathon",
  description:
    "Transform hyper-specific dream roles into gamified interactive visual skill trees with dynamic re-routing and actionable portfolio milestones.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <RoadmapProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </RoadmapProvider>
      </body>
    </html>
  );
}
