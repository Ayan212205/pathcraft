"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { RoadmapNodeData } from "@/types/roadmap";
import { CheckCircle2, Lock, PlayCircle, Clock, Sparkles } from "lucide-react";

const phaseColors: Record<string, { bg: string; text: string; border: string }> = {
  Foundation: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  "Core Architecture": { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  Specialization: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  "Capstone & Portfolio": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  "Target Role": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
};

export const RoadmapNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as RoadmapNodeData;
  const isCompleted = nodeData.status === "completed";
  const isLocked = nodeData.status === "locked";
  const isUnlocked = nodeData.status === "unlocked";

  const phaseStyle = phaseColors[nodeData.phase] || {
    bg: "bg-slate-800",
    text: "text-slate-300",
    border: "border-slate-700",
  };

  return (
    <div
      className={`relative w-[260px] rounded-xl p-3.5 transition-all duration-300 select-none cursor-pointer backdrop-blur-xl border ${
        isCompleted
          ? "bg-slate-900/90 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:border-emerald-400"
          : isUnlocked
          ? "bg-slate-900/90 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:border-cyan-400"
          : "bg-slate-950/70 border-slate-800 text-slate-500 opacity-60 hover:opacity-80"
      } ${selected ? "ring-2 ring-indigo-400 scale-[1.03]" : ""}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-slate-900"
      />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border ${phaseStyle.bg} ${phaseStyle.text} ${phaseStyle.border}`}
        >
          {nodeData.phase}
        </span>

        <div className="flex items-center gap-1 text-[11px]">
          {isCompleted && (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </span>
          )}
          {isUnlocked && (
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <PlayCircle className="w-3.5 h-3.5 animate-pulse" />
              Active
            </span>
          )}
          {isLocked && (
            <span className="flex items-center gap-1 text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              Locked
            </span>
          )}
        </div>
      </div>

      <h4
        className={`font-semibold text-sm leading-snug line-clamp-2 mb-1.5 ${
          isCompleted ? "text-slate-100" : isUnlocked ? "text-cyan-50" : "text-slate-400"
        }`}
      >
        {nodeData.title}
      </h4>

      <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
        {nodeData.summary}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {nodeData.estimatedHours} hrs
        </span>
        <span className="flex items-center gap-1 text-indigo-400 font-medium">
          <Sparkles className="w-3 h-3" />
          {nodeData.category}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-900"
      />
    </div>
  );
});

RoadmapNode.displayName = "RoadmapNode";
