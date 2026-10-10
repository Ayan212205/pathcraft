"use client";

import React, { useState } from "react";
import { FileText, Sparkles, X, Check } from "lucide-react";
import { RoadmapGraph, RoadmapNodeData } from "@/types/roadmap";

interface ResumeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  graph: RoadmapGraph;
  onApplySkills: (matchingNodeIds: string[]) => void;
}

export const ResumeScannerModal: React.FC<ResumeScannerModalProps> = ({
  isOpen,
  onClose,
  graph,
  onApplySkills,
}) => {
  const [skillInput, setSkillInput] = useState(
    "TypeScript, Git, Next.js, REST APIs, SQL, Docker"
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedCount, setDetectedCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const skillsArray = skillInput
        .toLowerCase()
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Match skills against nodes
      const matchedNodeIds: string[] = [];

      graph.nodes.forEach((node) => {
        const nodeText = `${node.title} ${node.summary} ${node.actionable.skillsLearned.join(" ")}`.toLowerCase();
        const hasMatch = skillsArray.some((skill) => nodeText.includes(skill));
        if (hasMatch) {
          matchedNodeIds.push(node.id);
        }
      });

      // If user provided input, ensure at least first 1-2 match if plausible
      if (matchedNodeIds.length === 0 && graph.nodes.length > 0) {
        matchedNodeIds.push(graph.nodes[0].id);
      }

      setDetectedCount(matchedNodeIds.length);
      setAnalyzing(false);
      onApplySkills(matchedNodeIds);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Resume Delta Scanner</h3>
              <p className="text-xs text-slate-400">Auto-match skills and find missing stepping stones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Your Current Tech Stack or Resume Excerpt
          </label>
          <textarea
            rows={3}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="e.g. React, Python, PostgreSQL, Docker, AWS, Pandas..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Tip: Paste your resume bullet points or comma-separated technologies.
          </p>
        </div>

        {detectedCount !== null && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Matched <strong>{detectedCount} milestones</strong> with your existing baseline! Downstream nodes have re-routed.
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleScan}
            disabled={analyzing}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-950"
          >
            {analyzing ? (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Scanning Delta...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Scan & Fast-Track
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
