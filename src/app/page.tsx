"use client";

import React, { useState, useMemo } from "react";
import { RoadmapCanvas } from "@/components/roadmap/RoadmapCanvas";
import { ResumeScannerModal } from "@/components/roadmap/ResumeScannerModal";
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
} from "lucide-react";

export default function Home() {
  const [roleInput, setRoleInput] = useState("Full Stack Developer at a Climate Tech Startup");
  const [weeklyHours, setWeeklyHours] = useState<number>(12);
  const [loading, setLoading] = useState(false);
  const [graph, setGraph] = useState<RoadmapGraph>(sampleRoadmaps["climate-tech"]);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
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

  const handleGenerate = async (target: string = roleInput) => {
    if (!target.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: target, weeklyHours }),
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

          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generative AI DAG Engine (Strict Schema & Dynamic Re-routing)</span>
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
              placeholder="e.g. Full Stack Developer at a Climate Tech Startup, AI Agent Engineer..."
              className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none px-2"
            />
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

          {/* Quick Starter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              Try Targets:
            </span>
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
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-xs"
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
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-all text-xs"
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
              <div className="text-xs text-slate-400 font-medium">Mastery Progress</div>
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
                  ({stats.remainingHours}h remaining)
                </span>
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
          </div>

          {/* Innovation Action Buttons */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
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
          <div>
            <span className="font-semibold text-indigo-300 uppercase tracking-wider text-[10px] block">
              Domain Insight
            </span>
            <p className="text-slate-300 mt-0.5">{graph.metadata.roleOverview}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="font-semibold text-cyan-300 uppercase tracking-wider text-[10px] block">
              Why This Strategy
            </span>
            <p className="text-slate-400 mt-0.5 max-w-md">{graph.metadata.whyThisPath}</p>
          </div>
        </div>

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

          <RoadmapCanvas graph={graph} onUpdateGraph={setGraph} />
        </div>
      </div>

      {/* Resume Scanner Modal */}
      <ResumeScannerModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        graph={graph}
        onApplySkills={handleApplyResumeSkills}
      />
    </main>
  );
}
