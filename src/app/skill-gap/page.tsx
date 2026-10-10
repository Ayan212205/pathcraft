"use client";

import React from "react";
import Link from "next/link";
import { useRoadmap } from "@/context/RoadmapContext";
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
  Hammer,
} from "lucide-react";

export default function SkillGapPage() {
  const { graph, targetRole, toggleNodeComplete, stats } = useRoadmap();

  const totalCount = graph.nodes.length;
  const masteredNodes = graph.nodes.filter((n) => n.status === "completed");
  const inProgressNodes = graph.nodes.filter((n) => n.status === "unlocked");
  const missingNodes = graph.nodes.filter((n) => n.status === "locked");

  const readinessPercent = totalCount > 0 ? Math.round((masteredNodes.length / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 mb-2">
            <PieChart className="w-3.5 h-3.5" />
            Interactive Competency & Gap Analyzer
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Skill-Gap Analysis Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Compare your mastered competencies against the target profile for{" "}
            <span className="text-emerald-300 font-semibold">{targetRole}</span>. Click any milestone to toggle its
            status and observe the dynamic topological cascade unlock downstream steps!
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

      {/* Summary Scorecard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mastered */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900/80 border border-emerald-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-400 block mb-1">
              ✓ Mastered Competencies
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {masteredNodes.length} <span className="text-sm font-normal text-slate-400">/ {totalCount}</span>
            </div>
            <span className="text-[11px] text-emerald-400/80 mt-1 block">
              {masteredNodes.reduce((acc, n) => acc + n.estimatedHours, 0)} hours completed
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* In-Progress */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-900/80 border border-cyan-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs uppercase font-bold text-cyan-400 block mb-1">
              ● Active Stepping Stones
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {inProgressNodes.length} <span className="text-sm font-normal text-slate-400">/ {totalCount}</span>
            </div>
            <span className="text-[11px] text-cyan-400/80 mt-1 block">
              Prerequisites cleared & ready to build
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
              🔒 Locked Prerequisite Milestones
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {missingNodes.length} <span className="text-sm font-normal text-slate-400">/ {totalCount}</span>
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
                No milestones marked as mastered yet.
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
                  <p className="text-[11px] text-slate-400 line-clamp-2">{node.summary}</p>
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

        {/* Column 2: In-Progress */}
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
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{node.summary}</p>
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

        {/* Column 3: Missing / Locked */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-500/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              Locked Milestones ({missingNodes.length})
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
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-500 font-semibold shrink-0">
                      Locked
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{node.summary}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500">Prereqs: {node.prerequisites.join(", ")}</span>
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
