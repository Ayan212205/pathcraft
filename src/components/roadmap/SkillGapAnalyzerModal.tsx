"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  CheckCircle2,
  Clock,
  Lock,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Award,
} from "lucide-react";
import { RoadmapGraph, RoadmapNodeData } from "@/types/roadmap";

interface SkillGapAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  graph: RoadmapGraph;
  onToggleNodeStatus: (nodeId: string) => void;
}

export const SkillGapAnalyzerModal: React.FC<SkillGapAnalyzerModalProps> = ({
  isOpen,
  onClose,
  graph,
  onToggleNodeStatus,
}) => {
  if (!isOpen) return null;

  const totalCount = graph.nodes.length;
  const masteredNodes = graph.nodes.filter((n) => n.status === "completed");
  const inProgressNodes = graph.nodes.filter((n) => n.status === "unlocked");
  const missingNodes = graph.nodes.filter((n) => n.status === "locked");

  const readinessPercent = totalCount > 0 
    ? Math.round((masteredNodes.length / totalCount) * 100) 
    : 0;

  const totalRemainingHours = graph.nodes
    .filter((n) => n.status !== "completed")
    .reduce((sum, n) => sum + n.estimatedHours, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Skill-Gap Analyzer</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {readinessPercent}% Role Readiness
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Identify what you already have vs. what you still need for <strong className="text-slate-200">{graph.metadata.targetRole}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breakdown Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-b border-slate-800/60 text-xs">
          {/* Mastered */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                ✓ Mastered Competencies
              </span>
              <div className="text-2xl font-extrabold text-white">
                {masteredNodes.length} <span className="text-xs font-normal text-slate-400">/ {totalCount}</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* In-Progress */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                ● In-Progress / Active
              </span>
              <div className="text-2xl font-extrabold text-white">
                {inProgressNodes.length} <span className="text-xs font-normal text-slate-400">/ {totalCount}</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Missing / Locked */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                🔒 Missing Gap Nodes
              </span>
              <div className="text-2xl font-extrabold text-white">
                {missingNodes.length} <span className="text-xs font-normal text-slate-400">/ {totalCount}</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-500">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Scrollable Competencies List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Toggle skills to synchronize with your interactive roadmap canvas:</span>
            <span className="text-indigo-400 font-semibold">{totalRemainingHours}h needed to close gap</span>
          </div>

          {/* Mastered Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mastered Skills ({masteredNodes.length})
            </h4>
            <div className="space-y-2">
              {masteredNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-3 rounded-xl bg-slate-950 border border-emerald-900/40 flex items-center justify-between text-xs transition-colors hover:border-emerald-500/40"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => onToggleNodeStatus(node.id)}
                      className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-white block">{node.title}</span>
                      <span className="text-[11px] text-slate-400">{node.phase} • {node.estimatedHours} hrs</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                    Mastered
                  </span>
                </div>
              ))}
              {masteredNodes.length === 0 && (
                <p className="text-xs text-slate-500 italic p-2">No skills marked as mastered yet.</p>
              )}
            </div>
          </div>

          {/* In-Progress Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              In-Progress Next Steps ({inProgressNodes.length})
            </h4>
            <div className="space-y-2">
              {inProgressNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-3 rounded-xl bg-slate-950 border border-cyan-900/40 flex items-center justify-between text-xs transition-colors hover:border-cyan-500/40"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => onToggleNodeStatus(node.id)}
                      className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-white block">{node.title}</span>
                      <span className="text-[11px] text-slate-400">{node.phase} • {node.estimatedHours} hrs</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">
                    Ready to Learn
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing / Locked Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Missing Future Stepping Stones ({missingNodes.length})
            </h4>
            <div className="space-y-2">
              {missingNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs opacity-75"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => onToggleNodeStatus(node.id)}
                      className="accent-indigo-500 w-4 h-4 rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-slate-300 block">{node.title}</span>
                      <span className="text-[11px] text-slate-500">{node.phase} • Prereqs: {node.prerequisites.length} prior</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                    Locked
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {masteredNodes.length} of {totalCount} total competencies cleared
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-950"
          >
            Apply to Visual Tree
          </button>
        </div>
      </div>
    </div>
  );
};
