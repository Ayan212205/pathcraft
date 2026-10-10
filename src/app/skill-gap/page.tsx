"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRoadmap } from "@/context/RoadmapContext";
import { recalculatePrerequisites } from "@/lib/graph-validator";
import { RoadmapGraph, RoadmapNodeData } from "@/types/roadmap";
import {
  PieChart,
  CheckCircle2,
  Clock,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  AlertCircle,
  UploadCloud,
  FileText,
  Zap,
  Check,
  RotateCcw,
  FileCheck,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

const SAMPLE_RESUMES: Record<string, string> = {
  java: `Mohammad Ayan
Computer Science Student | Java & Backend Aspirant
Email: ayan@example.com | GitHub: github.com/ayan

TECHNICAL PROFICIENCIES:
- Languages: Java (Java 8/11/17), C++, SQL, HTML, CSS, JavaScript
- Core Fundamentals: Object-Oriented Programming (OOP), Data Structures & Algorithms (DSA), Collections Framework, Exception Handling, Multithreading basics
- Tools & Databases: Git, GitHub, MySQL, Maven, IntelliJ IDEA, VS Code

ACADEMIC PROJECTS:
1. Student Information & Grading Management System (Java & MySQL)
- Built a command-line application in Core Java utilizing OOP principles and JDBC.
- Designed relational schemas in MySQL with normalized foreign keys.
- Implemented file logging and custom exception handlers.

2. Inventory Tracking Utility (Java & Swing)
- Designed an interactive desktop GUI for tracking warehouse products.
- Employed Java Collections (HashMap, ArrayList) for in-memory caching.`,

  cyber: `Ayan - Cybersecurity & Systems Student
Email: ayan.sec@example.com | GitHub: github.com/ayan-sec

TECHNICAL PROFICIENCIES:
- Networking & OS: Linux (Ubuntu/Debian), Bash scripting, TCP/IP, DNS, OSI Model, Wireshark, Nmap
- Security Fundamentals: Packet Analysis, Port Scanning, Basic Cryptography, SSH configuration
- Programming: Python scripting, Shell scripting, Git

PRACTICAL LABS & PROJECTS:
1. Network Traffic Sniffer & Anomaly Monitor (Python & Wireshark)
- Captured and analyzed live TCP/UDP traffic using Scapy and Wireshark.
- Detected ARP spoofing attempts on local subnets.
2. Linux Server Hardening Lab
- Configured iptables firewall rules, disabled root SSH login, and enforced key-based authentication.`,
};

export default function SkillGapPage() {
  const {
    graph,
    targetRole,
    toggleNodeComplete,
    stats,
    setGraph,
    resetToDefault,
  } = useRoadmap();

  // Resume analysis states
  const [resumeText, setResumeText] = useState(
    targetRole.toLowerCase().includes("java")
      ? SAMPLE_RESUMES.java
      : SAMPLE_RESUMES.cyber
  );
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [appliedSync, setAppliedSync] = useState(false);
  const [matchedNodeIds, setMatchedNodeIds] = useState<string[]>([]);
  const [gapNodeIds, setGapNodeIds] = useState<string[]>([]);

  // Calculate high-level counts
  const totalCount = graph.nodes.length;
  const masteredNodes = graph.nodes.filter((n) => n.status === "completed");
  const inProgressNodes = graph.nodes.filter((n) => n.status === "unlocked");
  const missingNodes = graph.nodes.filter((n) => n.status === "locked");

  const readinessPercent =
    totalCount > 0 ? Math.round((masteredNodes.length / totalCount) * 100) : 0;

  // Handle file upload (.txt, .md, .json)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text);
        setHasScanned(false);
        setAppliedSync(false);
      }
    };
    reader.readAsText(file);
  };

  // Perform intelligent skill gap scan against current roadmap milestones
  const handleScanGaps = () => {
    if (!resumeText.trim()) return;
    setIsScanning(true);
    setAppliedSync(false);

    // Heuristic & keyword semantic analyzer against graph nodes
    setTimeout(() => {
      const lowerResume = resumeText.toLowerCase();

      const matched: string[] = [];
      const gaps: string[] = [];

      graph.nodes.forEach((node) => {
        const titleWords = node.title.toLowerCase().split(/[\s,&/]+/);
        const skills = node.actionable.skillsLearned.map((s) => s.toLowerCase());

        // Check if skills in this node are significantly mentioned in the resume
        let skillMatches = 0;
        skills.forEach((skill) => {
          // split multi-word skill e.g. "Core Java" or "TCP/IP"
          const tokens = skill.split(/[\s/]+/);
          if (tokens.some((t) => t.length > 2 && lowerResume.includes(t))) {
            skillMatches++;
          }
        });

        // Specific high-value keyword checks
        const isJavaNode1 =
          node.title.toLowerCase().includes("core java") &&
          (lowerResume.includes("java") || lowerResume.includes("oop"));
        const isLinuxNode1 =
          node.title.toLowerCase().includes("linux") &&
          (lowerResume.includes("linux") || lowerResume.includes("tcp"));
        const isSpringNode =
          node.title.toLowerCase().includes("spring boot") &&
          lowerResume.includes("spring");
        const isKafkaNode =
          node.title.toLowerCase().includes("kafka") &&
          lowerResume.includes("kafka");

        // Foundation nodes match if candidate has core basics
        const hasCoreMatch =
          (isJavaNode1 && !isSpringNode) ||
          isLinuxNode1 ||
          skillMatches >= Math.max(1, Math.ceil(skills.length * 0.4));

        if (hasCoreMatch && !node.title.toLowerCase().includes("capstone")) {
          matched.push(node.id);
        } else {
          gaps.push(node.id);
        }
      });

      setMatchedNodeIds(matched);
      setGapNodeIds(gaps);
      setHasScanned(true);
      setIsScanning(false);
    }, 600);
  };

  // 1-Click Sync: Apply verified resume skills directly to live roadmap
  const handleApplyToRoadmap = () => {
    if (matchedNodeIds.length === 0) return;

    // Mark matched nodes as completed
    const updatedNodes: RoadmapNodeData[] = graph.nodes.map((node) => {
      if (matchedNodeIds.includes(node.id)) {
        return {
          ...node,
          status: "completed" as const,
        };
      }
      return node;
    });

    // Mathematically recalculate prerequisites using topological sorting
    const recalibratedNodes = recalculatePrerequisites(updatedNodes);

    const updatedGraph: RoadmapGraph = {
      ...graph,
      nodes: recalibratedNodes,
    };

    setGraph(updatedGraph);
    setAppliedSync(true);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 mb-2">
            <PieChart className="w-3.5 h-3.5" />
            Resume-to-Role Competency & Skill Gap Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Skill-Gap Analysis & Resume Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Upload or paste your resume to automatically scan what competencies you
            already possess versus what critical skills are left/incomplete for{" "}
            <span className="text-emerald-300 font-semibold">{targetRole}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            Interactive Skill Canvas
          </Link>
        </div>
      </div>

      {/* Target Role Selector Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-200">Active Target Role:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
            {targetRole}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 mr-1 text-[11px]">Quick Switch:</span>
          <button
            onClick={() => {
              resetToDefault("java-developer");
              setResumeText(SAMPLE_RESUMES.java);
              setHasScanned(false);
              setAppliedSync(false);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
          >
            ☕ Java & Spring Boot
          </button>
          <button
            onClick={() => {
              resetToDefault("cyber-security");
              setResumeText(SAMPLE_RESUMES.cyber);
              setHasScanned(false);
              setAppliedSync(false);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
          >
            🛡️ Cyber Security
          </button>
          <button
            onClick={() => {
              resetToDefault("ai-agents");
              setResumeText(SAMPLE_RESUMES.java);
              setHasScanned(false);
              setAppliedSync(false);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
          >
            🤖 AI Agents
          </button>
        </div>
      </div>

      {/* Resume Upload & Gap Analyzer Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/20 border border-emerald-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Upload Resume to Detect Skill Gaps
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-semibold">
                  Live AI Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Paste your resume text below or upload a document (.txt / .md). The AI will compare your qualifications against {targetRole}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setResumeText(
                  targetRole.toLowerCase().includes("java")
                    ? SAMPLE_RESUMES.java
                    : SAMPLE_RESUMES.cyber
                );
                setHasScanned(false);
                setAppliedSync(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Sample Resume
            </button>
            <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1.5 transition-colors">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Choose File
              <input
                type="file"
                accept=".txt,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Textarea Input */}
        <div className="relative">
          <textarea
            value={resumeText}
            onChange={(e) => {
              setResumeText(e.target.value);
              setHasScanned(false);
              setAppliedSync(false);
            }}
            placeholder="Paste candidate resume or technical experience here..."
            rows={7}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-4 font-mono text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              Targeting: <strong className="text-slate-200">{targetRole}</strong> ({graph.nodes.length} Milestones)
            </span>
          </div>

          <button
            onClick={handleScanGaps}
            disabled={isScanning || !resumeText.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scanning Resume Competencies...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-emerald-200" />
                Scan Resume for Skill Gaps
              </>
            )}
          </button>
        </div>

        {/* Results Banner when Scanned */}
        {hasScanned && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    Resume Analysis Complete for {targetRole}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Detected <strong className="text-emerald-300">{matchedNodeIds.length} Mastered Milestones</strong> in your resume, and identified <strong className="text-rose-300">{gapNodeIds.length} Incomplete Skill Gaps</strong> required for this role.
                </p>
              </div>

              {/* 1-Click Sync Button */}
              <button
                onClick={handleApplyToRoadmap}
                disabled={appliedSync || matchedNodeIds.length === 0}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg ${
                  appliedSync
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40"
                }`}
              >
                {appliedSync ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    ✓ Live Roadmap Synchronized!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    ⚡ Apply Resume Skills to Roadmap Canvas
                  </>
                )}
              </button>
            </div>

            {/* Quick Pill Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-850">
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                  ✓ Verified In Resume ({matchedNodeIds.length} Milestones)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchedNodeIds.map((id) => {
                    const node = graph.nodes.find((n) => n.id === id);
                    return (
                      <span
                        key={id}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-medium"
                      >
                        {node?.title || id}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
                <span className="text-[11px] font-bold text-rose-400 block mb-1">
                  ⚠️ Critical Skill Gaps To Bridge ({gapNodeIds.length} Milestones)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {gapNodeIds.map((id) => {
                    const node = graph.nodes.find((n) => n.id === id);
                    return (
                      <span
                        key={id}
                        className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-medium"
                      >
                        {node?.title || id}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {appliedSync && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
                <span>
                  🎉 Verified milestones marked as mastered! Prerequisite-cleared stepping stones are now active.
                </span>
                <Link
                  href="/"
                  className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  View Canvas <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mastered */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900/80 border border-emerald-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-400 block mb-1">
              ✓ Mastered Competencies
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {masteredNodes.length}{" "}
              <span className="text-sm font-normal text-slate-400">
                / {totalCount}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400/80 mt-1 block">
              {masteredNodes.reduce((acc, n) => acc + n.estimatedHours, 0)} hours completed
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* In-Progress / Active */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-900/80 border border-cyan-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-400 block mb-1">
              ● Active Stepping Stones
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {inProgressNodes.length}{" "}
              <span className="text-sm font-normal text-slate-400">
                / {totalCount}
              </span>
            </div>
            <span className="text-[11px] text-cyan-400/80 mt-1 block">
              Prerequisites cleared & ready to learn
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Missing / Locked */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/20 to-slate-900/80 border border-rose-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs uppercase font-bold text-rose-400 block mb-1">
              🔒 Incomplete Prerequisite Gaps
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {missingNodes.length}{" "}
              <span className="text-sm font-normal text-slate-400">
                / {totalCount}
              </span>
            </div>
            <span className="text-[11px] text-rose-400/80 mt-1 block">
              Requires mastering upstream nodes first
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Lock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3-Column Categorized Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Column 1: Mastered */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Mastered ({masteredNodes.length})
            </h3>
            <span className="text-[10px] text-slate-500">Click to toggle</span>
          </div>

          <div className="space-y-3">
            {masteredNodes.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                No milestones marked as mastered yet. Upload resume above or toggle manually.
              </div>
            ) : (
              masteredNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2.5 transition-all shadow-md group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {node.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold shrink-0">
                      Mastered
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {node.summary}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500">{node.estimatedHours}h saved</span>
                    <button
                      onClick={() => toggleNodeComplete(node.id)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      Re-lock Downstream
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In-Progress / Active */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Active Steps ({inProgressNodes.length})
            </h3>
            <span className="text-[10px] text-slate-500">Ready to build</span>
          </div>

          <div className="space-y-3">
            {inProgressNodes.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                All milestones either completed or locked.
              </div>
            ) : (
              inProgressNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2.5 transition-all shadow-md group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {node.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-semibold shrink-0">
                      Active Next
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {node.summary}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500">~{node.estimatedHours} hours</span>
                    <button
                      onClick={() => toggleNodeComplete(node.id)}
                      className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                    >
                      Mark Mastered
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Incomplete / Locked Gaps */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-500/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              Incomplete Gaps ({missingNodes.length})
            </h3>
            <span className="text-[10px] text-slate-500">Prereqs required</span>
          </div>

          <div className="space-y-3">
            {missingNodes.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                🎉 All prerequisite milestones unlocked!
              </div>
            ) : (
              missingNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5 opacity-80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-300">{node.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-semibold shrink-0">
                      Skill Gap
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {node.summary}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500 text-[10px]">
                      Requires upstream completion
                    </span>
                    <button
                      onClick={() => toggleNodeComplete(node.id)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]"
                    >
                      Fast Bypass
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
