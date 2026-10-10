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
  const [candidateAnswers, setCandidateAnswers] = useState<Record<number, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [masteryChecks, setMasteryChecks] = useState<{
    projectBuilt: boolean;
    interviewPracticed: boolean;
    priorMastery: boolean;
  }>({
    projectBuilt: false,
    interviewPracticed: false,
    priorMastery: false,
  });

  React.useEffect(() => {
    setCandidateAnswers({});
    setRevealedAnswers({});
    setMasteryChecks({
      projectBuilt: false,
      interviewPracticed: false,
      priorMastery: false,
    });
  }, [node?.id]);

  if (!node) return null;

  const isCompleted = node.status === "completed";
  const isLocked = node.status === "locked";
  const isUnlocked = node.status === "unlocked";

  const hasVerifiedMastery =
    isCompleted ||
    masteryChecks.projectBuilt ||
    masteryChecks.interviewPracticed ||
    masteryChecks.priorMastery ||
    Object.values(evaluationScores).some((s) => s === "mastered");

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

        {/* Priority 2 - Section 3: Interactive Interview Simulation Drills */}
        {node.actionable.interviewQuestions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                3. Interactive Interview Drills
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                {Object.values(evaluationScores).filter((s) => s === "mastered").length} /{" "}
                {node.actionable.interviewQuestions.length} Mastered
              </span>
            </div>

            <div className="space-y-3">
              {node.actionable.interviewQuestions.map((qa, idx) => {
                const isOpen = openQuestionIndex === idx;
                const currentScore = evaluationScores[idx];
                const isRevealed = !!revealedAnswers[idx];
                const candidateAttempt = candidateAnswers[idx] || "";

                return (
                  <div
                    key={idx}
                    className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => setOpenQuestionIndex(isOpen ? null : idx)}
                      className="w-full text-left p-3.5 flex items-center justify-between gap-3 text-xs font-medium text-slate-200 hover:text-white transition-colors bg-slate-900/40"
                    >
                      <span className="flex items-start gap-2.5">
                        {currentScore === "mastered" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-600 inline-block shrink-0 mt-0.5" />
                        )}
                        <span className="font-semibold text-slate-100">{qa.question}</span>
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 pt-2 text-xs border-t border-slate-800/60 bg-slate-950/60 space-y-3">
                        {/* Interactive candidate input */}
                        {!isRevealed ? (
                          <div className="space-y-2 pt-1">
                            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                              Candidate Practice Sandbox — Test Your Answer:
                            </label>
                            <textarea
                              value={candidateAttempt}
                              onChange={(e) =>
                                setCandidateAnswers((prev) => ({
                                  ...prev,
                                  [idx]: e.target.value,
                                }))
                              }
                              rows={3}
                              placeholder="Type your explanation or technical approach here as if answering in a real interview..."
                              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            />
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-slate-500 italic">
                                {candidateAttempt.trim().length > 0
                                  ? `${candidateAttempt.trim().split(/\s+/).length} words typed`
                                  : "Type your approach, or reveal directly to study the strategy"}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setRevealedAnswers((prev) => ({
                                    ...prev,
                                    [idx]: true,
                                  }))
                                }
                                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-900/30 transition-all"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Reveal Model Answer & Evaluate
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 pt-1">
                            {/* Candidate's attempt */}
                            {candidateAttempt.trim().length > 0 && (
                              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-slate-300">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-300 mb-1">
                                  <span className="flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-indigo-400" />
                                    Your Attempt:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRevealedAnswers((prev) => ({
                                        ...prev,
                                        [idx]: false,
                                      }))
                                    }
                                    className="text-[10px] text-indigo-400 hover:text-indigo-200 underline"
                                  >
                                    Edit Answer
                                  </button>
                                </div>
                                <p className="text-xs italic text-slate-300 whitespace-pre-wrap">
                                  &quot;{candidateAttempt}&quot;
                                </p>
                              </div>
                            )}

                            {/* Model Answer Strategy */}
                            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-1.5">
                              <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5" />
                                Model Answer Strategy & Key Benchmarks:
                              </span>
                              <p className="text-xs text-slate-200 leading-relaxed">
                                {qa.idealAnswer}
                              </p>
                            </div>

                            {/* Interviewer Evaluation Rubric */}
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-1.5">
                              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block">
                                Interviewer Evaluation Rubric:
                              </span>
                              <ul className="text-slate-300 space-y-1 list-disc list-inside">
                                <li>Did you articulate architectural trade-offs (latency, consistency, scale)?</li>
                                <li>Did you cite concrete production failure modes or edge cases?</li>
                                <li>Did you demonstrate structural reasoning rather than memorized syntax?</li>
                              </ul>
                            </div>

                            {/* Self-Rating Controls */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                              <span className="text-slate-400 font-medium">Self-Assessment:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    setEvaluationScores((prev) => ({
                                      ...prev,
                                      [idx]: "practicing",
                                    }))
                                  }
                                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium text-xs ${
                                    currentScore === "practicing"
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                      : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60"
                                  }`}
                                >
                                  Needs More Practice
                                </button>
                                <button
                                  onClick={() => {
                                    setEvaluationScores((prev) => ({
                                      ...prev,
                                      [idx]: "mastered",
                                    }));
                                    setMasteryChecks((prev) => ({
                                      ...prev,
                                      interviewPracticed: true,
                                    }));
                                  }}
                                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium text-xs ${
                                    currentScore === "mastered"
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                      : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60"
                                  }`}
                                >
                                  ✓ Mastered & Articulated
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
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

      {/* Proof of Mastery Verification Gate */}
      {!isCompleted && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Proof of Mastery Verification
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                hasVerifiedMastery
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
              }`}
            >
              {hasVerifiedMastery ? "✓ Verified Ready" : "Select at least 1 proof"}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <label className="flex items-start gap-2 text-slate-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={masteryChecks.projectBuilt}
                onChange={(e) =>
                  setMasteryChecks((prev) => ({ ...prev, projectBuilt: e.target.checked }))
                }
                className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 bg-slate-950"
              />
              <span>
                <strong>Project Deliverable Built:</strong> Completed &quot;{node.actionable.weekendProject.deliverable}&quot;
              </span>
            </label>

            <label className="flex items-start gap-2 text-slate-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={masteryChecks.interviewPracticed}
                onChange={(e) =>
                  setMasteryChecks((prev) => ({ ...prev, interviewPracticed: e.target.checked }))
                }
                className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 bg-slate-950"
              />
              <span>
                <strong>Interview Drill Articulated:</strong> Attempted & mastered technical interview questions above
              </span>
            </label>

            <label className="flex items-start gap-2 text-slate-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={masteryChecks.priorMastery}
                onChange={(e) =>
                  setMasteryChecks((prev) => ({ ...prev, priorMastery: e.target.checked }))
                }
                className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 bg-slate-950"
              />
              <span>
                <strong>Prior Hands-on Competency:</strong> Already worked with this technology in prior projects
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Priority 1: Dynamic Re-routing & Bypass Button */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/90 flex items-center gap-3">
        <button
          onClick={handleCompleteClick}
          disabled={!isCompleted && !hasVerifiedMastery}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
            isCompleted
              ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              : hasVerifiedMastery
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950"
              : "bg-slate-800 text-slate-400 border border-slate-700"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Mark as Unfinished (Re-lock Downstream)
            </>
          ) : hasVerifiedMastery ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {isLocked
                ? "I Already Know This (Bypass & Fast-Track Next Steps)"
                : "Mark as Completed (Trigger Dynamic Reroute)"}
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-slate-400" />
              Certify Mastery Above to Complete
            </>
          )}
        </button>

        {!isCompleted && !hasVerifiedMastery && (
          <button
            type="button"
            onClick={() => {
              setMasteryChecks({ projectBuilt: false, interviewPracticed: false, priorMastery: true });
              handleCompleteClick();
            }}
            className="px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-[11px] font-semibold whitespace-nowrap transition-colors"
            title="Fast-track directly if you already know this milestone"
          >
            Fast Bypass
          </button>
        )}
      </div>
    </div>
  );
};
