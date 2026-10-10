"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoadmap } from "@/context/RoadmapContext";
import {
  Compass,
  FileCheck,
  Calendar,
  PieChart,
  GitCompare,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { graph, targetRole, resetToDefault, stats } = useRoadmap();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const navItems = [
    {
      label: "Skill Canvas",
      href: "/",
      icon: Compass,
      color: "text-indigo-400 group-hover:text-indigo-300",
      activeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    },
    {
      label: "ATS Auditor",
      href: "/ats-auditor",
      icon: FileCheck,
      color: "text-cyan-400 group-hover:text-cyan-300",
      activeBg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    },
    {
      label: "Weekly Plan",
      href: "/weekly-plan",
      icon: Calendar,
      color: "text-amber-400 group-hover:text-amber-300",
      activeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    {
      label: "Skill Gap",
      href: "/skill-gap",
      icon: PieChart,
      color: "text-emerald-400 group-hover:text-emerald-300",
      activeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    },
    {
      label: "Compare Roles",
      href: "/compare",
      icon: GitCompare,
      color: "text-purple-400 group-hover:text-purple-300",
      activeBg: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      {/* Top micro-bar */}
      <div className="border-b border-slate-800/40 bg-slate-900/40 px-4 py-1.5 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">Azisly Hackathon 2026</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400 font-medium">Problem Statement #1</span>
          </div>

          <div className="flex items-center gap-3">
            {graph.metadata.generationMode === "gemini-live" ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-semibold flex items-center gap-1.5 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Gemini 1.5 Flash Model
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 font-semibold flex items-center gap-1.5 text-[10px]">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Synthesized Domain Mode (Offline Verified)
              </span>
            )}
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-500">Persistent State Enabled (Refresh Safe)</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                PathCraft
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                DAG
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5 font-medium">
              Career Roadmapper
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all group border ${
                  isActive
                    ? item.activeBg
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "" : item.color} transition-colors`} />
                <span>{item.label}</span>
                {item.href === "/skill-gap" && stats.progressPercent > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    {stats.progressPercent}%
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* Active Role Indicator */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-2 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="max-w-[130px] sm:max-w-[180px] truncate">{targetRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Quick Load Target
                </div>
                {[
                  { title: "Cyber Security Engineer", key: "cyber-security", icon: "🛡️" },
                  { title: "Climate Tech Full Stack", key: "climate-tech", icon: "🌱" },
                  { title: "Autonomous AI Agent Engineer", key: "ai-agents", icon: "🤖" },
                ].map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => {
                      resetToDefault(preset.key);
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <span>{preset.icon}</span>
                    <span className="truncate">{preset.title}</span>
                  </button>
                ))}

                <div className="border-t border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      resetToDefault("cyber-security");
                      setShowRoleDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-amber-400 hover:bg-amber-500/10 flex items-center gap-2 transition-colors font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Progress to 0%
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset progress button for judges */}
          <button
            onClick={() => resetToDefault()}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset progress to 0% for demo testing"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar (horizontal scroll on phones) */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-slate-900/60 no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all border ${
                isActive
                  ? item.activeBg
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
