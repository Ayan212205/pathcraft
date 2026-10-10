"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRoadmap } from "@/context/RoadmapContext";
import {
  GitCompare,
  Split,
  Sparkles,
  CheckCircle2,
  Compass,
  ArrowRight,
  TrendingUp,
  Layers,
  Award,
} from "lucide-react";

export default function CompareRolesPage() {
  const { targetRole } = useRoadmap();
  const [compareTarget, setCompareTarget] = useState("Autonomous AI Agent Engineer");

  const sharedFoundations = [
    {
      skill: "Type-Safe Asynchronous Architecture & Event Loops",
      role1Context: `${targetRole}: Resilient data parsing and asynchronous thread execution`,
      role2Context: `${compareTarget}: Concurrent execution pipelines & schema validation`,
    },
    {
      skill: "High-Throughput State Persistence & Caching",
      role1Context: `${targetRole}: Relational indexing and persistent storage mechanisms`,
      role2Context: `${compareTarget}: Vector memory stores and distributed key-value caches`,
    },
    {
      skill: "Production Observability, Guardrails & CI/CD",
      role1Context: `${targetRole}: Automated unit test suites and telemetry backplanes`,
      role2Context: `${compareTarget}: Automated regression evaluations and regression alerts`,
    },
    {
      skill: "System Design Trade-offs (Latency vs Consistency)",
      role1Context: `${targetRole}: Scalability planning under heavy peak traffic loads`,
      role2Context: `${compareTarget}: Throughput optimization and compute allocation budgeting`,
    },
  ];

  const uniqueToCurrent = [
    `Domain-specific protocols and specialized tooling for ${targetRole}`,
    "Dedicated framework conventions and production security profiles",
    "Specialized industry compliance and architectural constraints",
  ];

  const uniqueToCompare = [
    `Specialized ecosystem runtime paradigms for ${compareTarget}`,
    "Niche algorithmic pipelines and evaluation benchmarks",
    "Advanced domain APIs and hardware-accelerated computation",
  ];

  const overlapPercent = 65;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            Fork in the Road — Career Pivot Feasibility
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dual-Role Comparison & Skill Overlap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Torn between two paths? Discover how much foundational engineering DNA is shared between{" "}
            <span className="text-indigo-300 font-semibold">{targetRole}</span> and{" "}
            <span className="text-purple-300 font-semibold">{compareTarget}</span> to eliminate career pivot anxiety.
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
        >
          <Compass className="w-4 h-4 text-indigo-400" />
          Back to Skill Canvas
        </Link>
      </div>

      {/* Selector Ribbon */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
        {/* Primary Role */}
        <div className="w-full md:flex-1 p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
            Primary Target Path
          </span>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            {targetRole}
          </div>
        </div>

        {/* Fork Split Icon & Overlap Badge */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="p-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Split className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-purple-300 mt-1">
            {overlapPercent}% Shared DNA
          </span>
        </div>

        {/* Secondary Role */}
        <div className="w-full md:flex-1 p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
            Compare Against Secondary Path
          </span>
          <select
            value={compareTarget}
            onChange={(e) => setCompareTarget(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
          >
            <option value="Autonomous AI Agent Engineer" className="bg-slate-900">
              Autonomous AI Agent Engineer
            </option>
            <option value="DevOps & Cloud Platform Engineer" className="bg-slate-900">
              DevOps & Cloud Platform Engineer
            </option>
            <option value="Machine Learning & AI Systems Engineer" className="bg-slate-900">
              Machine Learning & AI Systems Engineer
            </option>
            <option value="Full Stack Developer at a Climate Tech Startup" className="bg-slate-900">
              Climate Tech Full Stack Developer
            </option>
            <option value="DeFi Smart Contract Auditor" className="bg-slate-900">
              DeFi Smart Contract Auditor
            </option>
            <option value="Fintech UI/UX Designer" className="bg-slate-900">
              Fintech UI/UX Designer
            </option>
          </select>
        </div>
      </div>

      {/* Shared Foundational Stepping Stones */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Shared Foundational Stepping Stones (~{overlapPercent}% Transferable)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Mastering these competencies counts toward BOTH roles, cutting your preparation time nearly in half.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hidden sm:inline-block">
            High Transferability
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sharedFoundations.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5 text-xs"
            >
              <div className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {item.skill}
              </div>
              <div className="space-y-1 text-[11px] text-slate-400 pl-4 border-l border-slate-800">
                <p>• {item.role1Context}</p>
                <p>• {item.role2Context}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diverging Specializations Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unique to Role 1 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            Specialized Stepping Stones: {targetRole}
          </div>
          <div className="space-y-2.5">
            {uniqueToCurrent.map((u, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
              >
                <span className="text-indigo-400 font-bold shrink-0 mt-0.5">#{idx + 1}</span>
                <span>{u}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unique to Role 2 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            Specialized Stepping Stones: {compareTarget}
          </div>
          <div className="space-y-2.5">
            {uniqueToCompare.map((u, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
              >
                <span className="text-purple-400 font-bold shrink-0 mt-0.5">#{idx + 1}</span>
                <span>{u}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
