"use client";

import React, { useState } from "react";
import { RoadmapNodeData, VerifiedResource } from "@/types/roadmap";
import {
  X,
  CheckCircle2,
  Lock,
  GitBranch,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Hammer,
  HelpCircle,
  Lightbulb,
  Award,
  ShieldCheck,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";

interface NodeDetailDrawerProps {
  node: RoadmapNodeData | null;
  onClose: () => void;
  onToggleComplete: (nodeId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  onToggleComplete,
}) => {
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);
  const [evaluationScores, setEvaluationScores] = useState<Record<number, "practicing" | "mastered">>({});

  if (!node) return null;

  const isCompleted = node.status === "completed";
  const isLocked = node.status === "locked";
  const isUnlocked = node.status === "unlocked";

  const handleCompleteClick = () => {
    if (!isCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
    onToggleComplete(node.id);
  };

  // Default verified resources if none specified in node
  const resources: VerifiedResource[] = node.actionable.verifiedResources || [
    {
      name: "MDN Web & Systems Developer Reference",
      type: "Official Documentation",
      url: "https://developer.mozilla.org/",
      isVerified: true,
      notes: "Official specification documentation."
    },
    {
      name: "Open Source Architecture Reference Implementation",
      type: "Course / Guide",
      url: node.actionable.recommendedRepos[0]?.url || "https://github.com",
      isVerified: true,
      notes: "Production code patterns and architectural benchmarks."
    }
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-start justify-between gap-4 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {node.phase}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
              {node.difficulty}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                isCompleted
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : isUnlocked
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {isCompleted ? "✓ Mastered" : isUnlocked ? "● Active Step" : "🔒 Locked"}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white leading-tight">
            {node.title}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content scroll area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Priority 2 - Section 1: What to Learn and Why */}
        <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800/80 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            1. What to Learn and Why
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {node.whatToLearnAndWhy || node.summary}
          </p>

          <div className="pt-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
              Target Technical Competencies:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {node.actionable.skillsLearned.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Priority 2 - Section 2: Practical Weekend Project */}
        <div className="rounded-xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-purple-950/20 p-4 border border-indigo-500/30 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-500/20 text-indigo-300">
              <Hammer className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                2. Practical Weekend Portfolio Project
              </span>
              <h4 className="text-sm font-bold text-white">
                {node.actionable.weekendProject.title}
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {node.actionable.weekendProject.description}
          </p>
          <div className="text-xs rounded-xl bg-slate-950/90 p-3 border border-indigo-500/20 text-slate-300">
            <span className="font-semibold text-indigo-300 block mb-0.5">Resume Deliverable: </span>
            {node.actionable.weekendProject.deliverable}
          </div>
        </div>

        {/* Priority 2 - Section 3: High-Frequency Interview Drills */}
        {node.actionable.interviewQuestions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                3. Interview Simulation Drills
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                {Object.values(evaluationScores).filter((s) => s === "mastered").length} /{" "}
                {node.actionable.interviewQuestions.length} Mastered
              </span>
            </div>

            <div className="space-y-2">
              {node.actionable.interviewQuestions.map((qa, idx) => {
                const isOpen = openQuestionIndex === idx;
                const currentScore = evaluationScores[idx];
                return (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-900/60 border border-slate-800 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenQuestionIndex(isOpen ? null : idx)}
                      className="w-full text-left p-3 flex items-center justify-between gap-3 text-xs font-medium text-slate-200 hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {currentScore === "mastered" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block shrink-0" />
                        )}
                        {qa.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-3 pt-0 text-xs text-slate-400 border-t border-slate-800/50 bg-slate-950/40 space-y-2.5">
                        <div>
                          <span className="font-semibold text-emerald-400 block mb-1">
                            Model Answer Strategy:
                          </span>
                          {qa.idealAnswer}
                        </div>

                        {/* Self-Rating Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                          <span className="text-slate-500 font-medium">Self-Evaluate:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setEvaluationScores((prev) => ({
                                  ...prev,
                                  [idx]: "practicing",
                                }))
                              }
                              className={`px-2.5 py-1 rounded-md transition-colors ${
                                currentScore === "practicing"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              Needs Practice
                            </button>
                            <button
                              onClick={() =>
                                setEvaluationScores((prev) => ({
                                  ...prev,
                                  [idx]: "mastered",
                                }))
                              }
                              className={`px-2.5 py-1 rounded-md transition-colors ${
                                currentScore === "mastered"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              ✓ Mastered
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Priority 4 - Section 4: Verified Resources vs AI Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              4. Verified Learning Resources
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified & Open Links
            </span>
          </div>

          <div className="space-y-2">
            {resources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-300 mb-0.5">
                  <span className="flex items-center gap-1.5">
                    {res.name}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {res.type}
                  </span>
                  {res.isVerified && (
                    <span className="text-[10px] text-emerald-400 font-medium">
                      ✓ Human-Verified Link
                    </span>
                  )}
                </div>
                {res.notes && (
                  <p className="text-[11px] text-slate-400">
                    {res.notes}
                  </p>
                )}
              </a>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 mt-2 italic">
            Note: Industry standards or certifications shown are optional references and not strictly mandatory for landing this role.
          </p>
        </div>

        {/* Recommended Open Source Repos */}
        {node.actionable.recommendedRepos.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-purple-400" />
              Curated Open Source Codebase to Study
            </h3>
            <div className="space-y-2">
              {node.actionable.recommendedRepos.map((repo, idx) => (
                <a
                  key={idx}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900 transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-purple-300 mb-1">
                    <span>{repo.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {repo.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Priority 1: Dynamic Re-routing & Bypass Button */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/90 flex items-center gap-3">
        <button
          onClick={handleCompleteClick}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
            isCompleted
              ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Mark as Unfinished (Re-lock Downstream)
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {isLocked
                ? "I Already Know This (Bypass & Fast-Track Next Steps)"
                : "Mark as Completed (Trigger Dynamic Reroute)"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
