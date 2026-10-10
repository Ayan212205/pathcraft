"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRoadmap } from "@/context/RoadmapContext";
import { RoadmapCanvas } from "@/components/roadmap/RoadmapCanvas";
import { ResumeScannerModal } from "@/components/roadmap/ResumeScannerModal";
import { RoadmapCompletionModal } from "@/components/roadmap/RoadmapCompletionModal";
import {
  Sparkles,
  Search,
  Sliders,
  Share2,
  FileText,
  Compass,
  Trophy,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  PartyPopper,
  FileCheck,
  Calendar,
  PieChart,
  GitCompare,
  RotateCcw,
  Layers,
  X,
} from "lucide-react";

export default function Home() {
  const {
    graph,
    targetRole,
    setTargetRole,
    weeklyHours,
    setWeeklyHours,
    experienceLevel,
    setExperienceLevel,
    stats,
    targetCompletionDate,
    loading,
    error,
    setError,
    generateRoadmap,
    setGraph,
    resetToDefault,
  } = useRoadmap();

  const [hasUserCustomized, setHasUserCustomized] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [knownSkillsInput, setKnownSkillsInput] = useState<string>("");
  const [showPersonalization, setShowPersonalization] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [hasShownCompletionModal, setHasShownCompletionModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check if user previously searched or customized
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSearched = localStorage.getItem("pathcraft_has_searched");
      if (savedSearched === "true") {
        setHasUserCustomized(true);
        setRoleInput(targetRole);
      }
    }
  }, [targetRole]);

  // Trigger celebration modal when user reaches 100% mastery
  useEffect(() => {
    if (stats.progressPercent === 100 && !hasShownCompletionModal && stats.totalNodes > 0) {
      setIsCompletionModalOpen(true);
      setHasShownCompletionModal(true);
    }
  }, [stats.progressPercent, stats.totalNodes, hasShownCompletionModal]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = roleInput.trim();
    if (!query) {
      setError("Please type a target job (e.g. Java Developer, Cyber Security, DevOps) to generate your roadmap.");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("pathcraft_has_searched", "true");
    }
    setHasUserCustomized(true);

    const knownSkillsArray = knownSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await generateRoadmap(query, weeklyHours, experienceLevel, knownSkillsArray);
  };

  const handlePresetSelect = async (presetRole: string, presetKey: string) => {
    setRoleInput(presetRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("pathcraft_has_searched", "true");
    }
    setHasUserCustomized(true);
    resetToDefault(presetKey);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <main className="flex-1 flex flex-col space-y-6 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
      {/* P1: Generation Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-start justify-between gap-3 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-white block mb-0.5">Generation Notice</strong>
              <p className="text-rose-300 leading-relaxed">{error}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSearchSubmit({ preventDefault: () => {} } as any)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => setError(null)}
              className="p-1 rounded-lg text-rose-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Reverse-Engineered Career Roadmapper
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Transform Hyper-Specific Dream Jobs into{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Interactive Skill Trees
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Reverse-engineer real stepping stones, concrete weekend deliverables, and interview drills taken by engineers who landed the role.
        </p>
      </div>

      {/* Search Bar & Generation Input */}
      <div className="max-w-3xl mx-auto w-full space-y-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-2xl focus-within:border-indigo-500 transition-colors"
        >
          <div className="pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            placeholder="e.g. Cyber Security Engineer, DevOps Engineer, Climate Tech Dev, AI Agent Engineer..."
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none px-2"
          />
          <button
            type="button"
            onClick={() => setShowPersonalization((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border ${
              showPersonalization
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                : "bg-slate-800 text-slate-400 hover:text-white border-slate-700"
            }`}
            title="Personalize roadmap before generation"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Personalize</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-semibold text-xs text-white shadow-lg shadow-indigo-900/40 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Synthesizing...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Roadmap
              </>
            )}
          </button>
        </form>

        {/* Priority 5: Personalization before generation box */}
        {showPersonalization && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Personalize Your Baseline (3 Quick Questions)
              </span>
              <span className="text-[10px] text-slate-400">
                Customizes starting nodes & bypasses what you already know
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Experience Level */}
              <div className="space-y-1">
                <label className="text-slate-400 font-medium text-[11px]">
                  1. Current Experience Level:
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Student / Beginner">Student / Beginner (Building foundations)</option>
                  <option value="Self-Taught">Self-Taught (Some projects built)</option>
                  <option value="Junior Engineer (1-2 yrs)">Junior Engineer (1-2 yrs experience)</option>
                  <option value="Career Switcher">Career Switcher from another domain</option>
                </select>
              </div>

              {/* 2. Known Skills to Fast-Track */}
              <div className="space-y-1">
                <label className="text-slate-400 font-medium text-[11px]">
                  2. Skills You Already Know (Bypassed from Path):
                </label>
                <input
                  type="text"
                  value={knownSkillsInput}
                  onChange={(e) => setKnownSkillsInput(e.target.value)}
                  placeholder="e.g. Python, Linux, Git, SQL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Quick Preset Tags for known skills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Quick add:</span>
              {["Python", "Linux", "Git", "SQL", "Networking", "TypeScript", "Docker"].map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    if (!knownSkillsInput.toLowerCase().includes(skill.toLowerCase())) {
                      setKnownSkillsInput((prev) => (prev ? `${prev}, ${skill}` : skill));
                    }
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-indigo-300 transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Starter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
            Try Targets:
          </span>
          <button
            onClick={() => handlePresetSelect("Java & Spring Boot Developer", "java-developer")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all text-xs"
          >
            ☕ Java & Spring Boot
          </button>
          <button
            onClick={() => handlePresetSelect("Cyber Security Engineer", "cyber-security")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-xs"
          >
            🛡️ Cyber Security Engineer
          </button>
          <button
            onClick={() =>
              handlePresetSelect("Full Stack Developer at a Climate Tech Startup", "climate-tech")
            }
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all text-xs"
          >
            🌱 Climate Tech Full Stack
          </button>
          <button
            onClick={() => handlePresetSelect("Autonomous AI Agent Engineer", "ai-agents")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-all text-xs"
          >
            🤖 Autonomous AI Agent Engineer
          </button>
          <button
            onClick={() =>
              handleSearchSubmit({ preventDefault: () => setRoleInput("DevOps & Cloud Platform Engineer") } as any)
            }
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all text-xs"
          >
            ☁️ DevOps & Cloud Platform
          </button>
        </div>
      </div>

      {/* Metrics Bar with Colorful Jewel Tones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        {/* Progress metric (Emerald) */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              Mastery Progress
              {stats.completedNodes === 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold">
                  Not Started
                </span>
              )}
              {stats.completedNodes > 0 && stats.progressPercent < 100 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  In Progress
                </span>
              )}
              {stats.progressPercent === 100 && (
                <button
                  onClick={() => setIsCompletionModalOpen(true)}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1 animate-pulse"
                >
                  <PartyPopper className="w-3 h-3" />
                  Mastered!
                </button>
              )}
            </div>
            <div className="text-lg font-bold text-white flex items-baseline gap-2">
              {stats.progressPercent}%
              <span className="text-xs font-normal text-slate-400">
                ({stats.completedNodes}/{stats.totalNodes} Nodes)
              </span>
            </div>
          </div>
        </div>

        {/* Time Budget Calculation (Cyan) */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {stats.completedNodes === 0
                ? "Est. Program Duration"
                : stats.progressPercent === 100
                ? "Program Status"
                : "Est. Completion"}
            </div>
            <div className="text-lg font-bold text-white">
              {stats.progressPercent === 100 ? (
                "Completed 🎉"
              ) : (
                <>
                  ~{stats.calculatedWeeks} Weeks
                  <span className="text-xs font-normal text-slate-400 ml-1.5">
                    {stats.completedNodes === 0
                      ? `(${stats.remainingHours}h curriculum)`
                      : `(${stats.remainingHours}h left)`}
                  </span>
                </>
              )}
            </div>
            <div className="text-[11px] font-semibold flex items-center gap-1 mt-0.5">
              {stats.completedNodes === 0 ? (
                <span className="text-amber-400/90 font-medium">
                  Status: Not Started • (e.g. {targetCompletionDate} if started today)
                </span>
              ) : stats.progressPercent === 100 ? (
                <span className="text-emerald-400">All Milestones Achieved!</span>
              ) : (
                <span className="text-cyan-400">Target Finish: {targetCompletionDate}</span>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Hours Slider (Amber) */}
        <div className="space-y-1.5 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Weekly Pace:
            </span>
            <span className="font-bold text-amber-300">{weeklyHours} hrs/week</span>
          </div>
          <input
            type="range"
            min={4}
            max={40}
            step={2}
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="text-[10px] text-slate-500 text-right">
            Drag to recalculate target date
          </div>
        </div>

        {/* Dedicated Pages Quick Navigation Bar */}
        <div className="flex items-center gap-2 justify-end flex-wrap">
          <Link
            href="/ats-auditor"
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
            ATS Lab
          </Link>
          <Link
            href="/weekly-plan"
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Weekly Plan
          </Link>
          <Link
            href="/skill-gap"
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <PieChart className="w-3.5 h-3.5 text-emerald-400" />
            Skill Gap
          </Link>
          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            {copiedLink ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* Target Meta Insight Banner */}
      <div className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-indigo-950/30 via-slate-900 to-cyan-950/20 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 text-xs shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {!hasUserCustomized ? (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                Sample Track Preview (Not Started)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                Active Career Track
              </span>
            )}
            <span className="font-bold text-indigo-300 uppercase tracking-wider text-[11px]">
              Target: {graph.metadata.targetRole}
            </span>
            {graph.metadata.generationMode === "gemini-live" ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                🟢 Live Gemini AI Generation
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                ⚡ Resilient Synthesized Mode (Offline Verified)
              </span>
            )}
          </div>
          <p className="text-slate-300 mt-0.5">{graph.metadata.roleOverview}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="font-semibold text-cyan-300 uppercase tracking-wider text-[10px] block">
            Curriculum Strategy
          </span>
          <p className="text-slate-400 mt-0.5 max-w-md">{graph.metadata.whyThisPath}</p>
        </div>
      </div>

      {/* Program Not Started Onboarding Banner */}
      {stats.completedNodes === 0 && (
        <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span>
              <strong>Curriculum Not Started Yet:</strong> Click the first active milestone (in cyan) below to start learning or mark it mastered to begin tracking live completion progress!
            </span>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0">
            Total curriculum workload: ~{stats.calculatedWeeks} weeks at {weeklyHours}h/wk
          </span>
        </div>
      )}

      {/* Dynamic Rerouting Feedback Alert */}
      {stats.completedNodes > 0 && (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              <strong>Dynamic Reroute Active:</strong> {stats.completedNodes} milestone(s) mastered. Downstream paths automatically unlocked and timeline recalculated!
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 hidden sm:inline-block">
            {stats.completedNodes * 25}h coursework saved
          </span>
        </div>
      )}

      {/* Interactive Skill Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            Interactive Skill Canvas — Click any milestone to open weekend projects & interview drills
          </span>
          <span className="text-[11px] text-slate-500">
            Drag to pan • Scroll to zoom • Green glows indicate mastered milestones
          </span>
        </div>

        {loading ? (
          <div className="relative w-full h-[680px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl flex flex-col items-center justify-center p-8 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm animate-pulse">
              <Sparkles className="w-5 h-5 animate-spin" />
              Synthesizing DAG Topological Nodes for &quot;{roleInput}&quot;...
            </div>
            <div className="w-full max-w-lg space-y-3">
              <div className="h-3 bg-slate-800/80 rounded-full animate-pulse w-3/4 mx-auto" />
              <div className="h-2.5 bg-slate-800/50 rounded-full animate-pulse w-1/2 mx-auto" />
            </div>
          </div>
        ) : (
          <RoadmapCanvas graph={graph} onUpdateGraph={setGraph} />
        )}
      </div>

      {/* Roadmap Completion Celebration Modal */}
      <RoadmapCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        targetRole={graph.metadata.targetRole}
        totalHours={graph.nodes.reduce((sum, n) => sum + n.estimatedHours, 0)}
        onCompareRoles={() => {}}
        onExportPng={() => {
          const exportBtn = document.querySelector('button:has(svg.lucide-camera)') as HTMLButtonElement;
          if (exportBtn) exportBtn.click();
        }}
        onExploreNewRole={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }}
      />
    </main>
  );
}
