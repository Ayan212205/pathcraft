"use client";

import React, { useState, useMemo, useEffect } from "react";
import { RoadmapCanvas } from "@/components/roadmap/RoadmapCanvas";
import { ResumeScannerModal } from "@/components/roadmap/ResumeScannerModal";
import { RoleComparisonModal } from "@/components/roadmap/RoleComparisonModal";
import { RoadmapCompletionModal } from "@/components/roadmap/RoadmapCompletionModal";
import { AtsResumeAuditorModal } from "@/components/roadmap/AtsResumeAuditorModal";
import { WeeklyActionPlanModal } from "@/components/roadmap/WeeklyActionPlanModal";
import { SkillGapAnalyzerModal } from "@/components/roadmap/SkillGapAnalyzerModal";
import { sampleRoadmaps } from "@/lib/mock-data";
import { RoadmapGraph, RoadmapNodeData } from "@/types/roadmap";
import {
  Sparkles,
  Search,
  Sliders,
  Share2,
  FileText,
  Compass,
  Trophy,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  GitCompare,
  PartyPopper,
  FileCheck,
  Calendar,
  PieChart,
} from "lucide-react";

export default function Home() {
  const [roleInput, setRoleInput] = useState("Cyber Security Engineer");
  const [weeklyHours, setWeeklyHours] = useState<number>(12);
  const [experienceLevel, setExperienceLevel] = useState<string>("Student / Beginner");
  const [knownSkillsInput, setKnownSkillsInput] = useState<string>("");
  const [showPersonalization, setShowPersonalization] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [graph, setGraph] = useState<RoadmapGraph>(sampleRoadmaps["cyber-security"]);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isWeeklyPlanOpen, setIsWeeklyPlanOpen] = useState(false);
  const [isSkillGapOpen, setIsSkillGapOpen] = useState(false);
  const [hasShownCompletionModal, setHasShownCompletionModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Compute live statistics
  const stats = useMemo(() => {
    const totalNodes = graph.nodes.length;
    const completedNodes = graph.nodes.filter((n) => n.status === "completed").length;
    const unlockedNodes = graph.nodes.filter((n) => n.status === "unlocked").length;
    const lockedNodes = graph.nodes.filter((n) => n.status === "locked").length;
    const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

    const remainingHours = graph.nodes
      .filter((n) => n.status !== "completed")
      .reduce((sum, n) => sum + n.estimatedHours, 0);

    const calculatedWeeks = weeklyHours > 0 ? Math.ceil(remainingHours / weeklyHours) : 0;

    return {
      totalNodes,
      completedNodes,
      unlockedNodes,
      lockedNodes,
      progressPercent,
      remainingHours,
      calculatedWeeks,
    };
  }, [graph, weeklyHours]);

  // Priority 3: Realistic timeline calculator - exact target date
  const [targetCompletionDate, setTargetCompletionDate] = useState<string>("Calculating...");

  useEffect(() => {
    if (stats.calculatedWeeks === 0) {
      setTargetCompletionDate("Target Reached!");
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + stats.calculatedWeeks * 7);
    setTargetCompletionDate(
      date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    );
  }, [stats.calculatedWeeks]);

  // Trigger celebration modal when user masters all roadmap milestones
  React.useEffect(() => {
    if (stats.progressPercent === 100 && !hasShownCompletionModal && stats.totalNodes > 0) {
      setIsCompletionModalOpen(true);
      setHasShownCompletionModal(true);
    }
  }, [stats.progressPercent, stats.totalNodes, hasShownCompletionModal]);

  const handleGenerate = async (target: string = roleInput) => {
    if (!target.trim()) return;
    setLoading(true);
    setHasShownCompletionModal(false);

    const knownSkillsArray = knownSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: target,
          weeklyHours,
          experienceLevel,
          knownSkills: knownSkillsArray,
        }),
      });
      if (res.ok) {
        const data: RoadmapGraph = await res.json();
        setGraph(data);
      }
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (presetTitle: string, presetKey: string) => {
    setRoleInput(presetTitle);
    if (sampleRoadmaps[presetKey]) {
      setGraph(sampleRoadmaps[presetKey]);
    } else {
      handleGenerate(presetTitle);
    }
  };

  const handleApplyResumeSkills = (matchingNodeIds: string[]) => {
    const updatedNodes = graph.nodes.map((node) => {
      if (matchingNodeIds.includes(node.id)) {
        return { ...node, status: "completed" as RoadmapNodeData["status"] };
      }
      return node;
    });

    const completedIds = new Set(
      updatedNodes.filter((n) => n.status === "completed").map((n) => n.id)
    );

    const recalibratedNodes = updatedNodes.map((node) => {
      if (node.status === "completed") return node;
      const allPrereqsDone =
        node.prerequisites.length === 0 ||
        node.prerequisites.every((prereqId) => completedIds.has(prereqId));

      return {
        ...node,
        status: (allPrereqsDone ? "unlocked" : "locked") as RoadmapNodeData["status"],
      };
    });

    setGraph({ ...graph, nodes: recalibratedNodes });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Banner & AI Notice */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">Azisly Hackathon 2026</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400 font-medium">Problem Statement #1</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            {graph.metadata.generationMode === "gemini-live" ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Gemini 1.5 Flash Model
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Synthesized Domain Mode (Offline Verified)
              </span>
            )}
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Strict DAG Schema & Dynamic Re-routing</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Header / Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            Reverse-Engineered Career Roadmapper
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Transform Hyper-Specific Dream Jobs into{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Interactive Skill Trees
            </span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Forget generic &quot;learn React&quot; checklists. Reverse-engineer real stepping stones,
            concrete portfolio deliverables, and targeted interview drills taken by engineers who landed the role.
          </p>
        </div>

        {/* Search Bar & Generation Input */}
        <div className="max-w-3xl mx-auto w-full space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-2xl focus-within:border-indigo-500 transition-colors"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="e.g. Cyber Security Engineer, Climate Tech Dev, AI Agent Engineer..."
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-lg shadow-indigo-900/40 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  Generating Tree...
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
                {["Python", "Linux", "Git", "SQL", "Networking", "TypeScript"].map((skill) => (
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
              onClick={() =>
                handlePresetClick(
                  "Cyber Security Engineer",
                  "cyber-security"
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-xs"
            >
              🛡️ Cyber Security Engineer
            </button>
            <button
              onClick={() =>
                handlePresetClick(
                  "Full Stack Developer at a Climate Tech Startup",
                  "climate-tech"
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all text-xs"
            >
              🌱 Climate Tech Full Stack
            </button>
            <button
              onClick={() =>
                handlePresetClick("Autonomous AI Agent Engineer", "ai-agents")
              }
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-all text-xs"
            >
              🤖 Autonomous AI Agent Engineer
            </button>
            <button
              onClick={() =>
                handlePresetClick(
                  "UI/UX Designer for Fintech Apps",
                  "fintech-designer"
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all text-xs"
            >
              💳 Fintech UI/UX Specialist
            </button>
          </div>
        </div>

        {/* Dashboard Control & Dynamic Recalibration Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          {/* Progress metric */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                Mastery Progress
                {stats.progressPercent === 100 && (
                  <button
                    onClick={() => setIsCompletionModalOpen(true)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors font-bold flex items-center gap-1 animate-pulse"
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

          {/* Time Budget Calculation */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Est. Completion</div>
              <div className="text-lg font-bold text-white">
                ~{stats.calculatedWeeks} Weeks
                <span className="text-xs font-normal text-slate-400 ml-1.5">
                  ({stats.remainingHours}h left)
                </span>
              </div>
              <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1 mt-0.5">
                <span>Target: {targetCompletionDate}</span>
              </div>
            </div>
          </div>

          {/* Weekly Hours Slider */}
          <div className="space-y-1.5 flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Weekly Pace:
              </span>
              <span className="font-bold text-indigo-300">{weeklyHours} hrs/week</span>
            </div>
            <input
              type="range"
              min={4}
              max={40}
              step={2}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="text-[10px] text-slate-500 text-right">
              Drag pace to recalculate completion date
            </div>
          </div>

          {/* Innovation Action Buttons */}
          <div className="flex items-center gap-2 justify-end flex-wrap">
            <button
              onClick={() => setIsWeeklyPlanOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Weekly Plan
            </button>
            <button
              onClick={() => setIsSkillGapOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <PieChart className="w-3.5 h-3.5 text-emerald-400" />
              Skill Gap
            </button>
            <button
              onClick={() => setIsAtsModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              ATS Auditor
            </button>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5 text-purple-400" />
              Compare Roles
            </button>
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Resume Delta
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              {copiedLink ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        {/* Target Meta Insight Banner */}
        <div className="px-5 py-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
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

        {/* Priority 1: Dynamic Rerouting Feedback Alert */}
        {stats.completedNodes > 0 && (
          <div className="px-4 py-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                <strong>Dynamic Reroute Active:</strong> {stats.completedNodes} milestone(s) mastered. Downstream paths automatically unlocked and timeline recalculated!
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 hidden sm:inline-block">
              {stats.completedNodes * 25}h generic coursework saved
            </span>
          </div>
        )}

        {/* Core Visualisation: Interactive Skill Canvas */}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl pt-6 opacity-40">
                <div className="h-28 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
                <div className="h-28 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse delay-100" />
                <div className="h-28 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse delay-200" />
              </div>
            </div>
          ) : (
            <RoadmapCanvas graph={graph} onUpdateGraph={setGraph} />
          )}
        </div>
      </div>

      {/* Resume Scanner Modal */}
      <ResumeScannerModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        graph={graph}
        onApplySkills={handleApplyResumeSkills}
      />

      {/* Role Comparison Modal */}
      <RoleComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        currentRole={graph.metadata.targetRole}
      />

      {/* Roadmap Completion Celebration Modal */}
      <RoadmapCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        targetRole={graph.metadata.targetRole}
        totalHours={graph.nodes.reduce((sum, n) => sum + n.estimatedHours, 0)}
        onCompareRoles={() => setIsCompareModalOpen(true)}
        onExportPng={() => {
          const exportBtn = document.querySelector(".react-flow__viewport") as HTMLElement;
          if (exportBtn) {
            const btn = document.querySelector('button:has(svg.lucide-camera)') as HTMLButtonElement;
            if (btn) btn.click();
          }
        }}
        onExploreNewRole={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }}
      />

      {/* AI ATS Resume Auditor Modal */}
      <AtsResumeAuditorModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        targetRole={graph.metadata.targetRole}
        onApplyMissingSkills={(missingKeywords) => {
          // Focus the missing skills on the roadmap
          const updatedNodes = graph.nodes.map((node) => {
            const hasMatch = missingKeywords.some((kw) =>
              `${node.title} ${node.summary} ${node.actionable.skillsLearned.join(" ")}`
                .toLowerCase()
                .includes(kw.toLowerCase())
            );
            if (hasMatch && node.status === "locked") {
              return { ...node, status: "unlocked" as RoadmapNodeData["status"] };
            }
            return node;
          });
          setGraph({ ...graph, nodes: updatedNodes });
        }}
      />

      {/* Personalized Weekly Action Plan Modal */}
      <WeeklyActionPlanModal
        isOpen={isWeeklyPlanOpen}
        onClose={() => setIsWeeklyPlanOpen(false)}
        graph={graph}
      />

      {/* Interactive Skill-Gap Analyzer Modal */}
      <SkillGapAnalyzerModal
        isOpen={isSkillGapOpen}
        onClose={() => setIsSkillGapOpen(false)}
        graph={graph}
        onToggleNodeStatus={(nodeId) => {
          const updatedNodes = graph.nodes.map((node) => {
            if (node.id === nodeId) {
              const newStatus = node.status === "completed" ? "unlocked" : "completed";
              return { ...node, status: newStatus as RoadmapNodeData["status"] };
            }
            return node;
          });

          const completedIds = new Set(
            updatedNodes.filter((n) => n.status === "completed").map((n) => n.id)
          );

          const recalibratedNodes = updatedNodes.map((node) => {
            if (node.status === "completed") return node;
            const allPrereqsDone =
              node.prerequisites.length === 0 ||
              node.prerequisites.every((prereqId) => completedIds.has(prereqId));

            return {
              ...node,
              status: (allPrereqsDone ? "unlocked" : "locked") as RoadmapNodeData["status"],
            };
          });

          setGraph({ ...graph, nodes: recalibratedNodes });
        }}
      />
    </main>
  );
}
