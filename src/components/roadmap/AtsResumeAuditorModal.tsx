"use client";

import React, { useState } from "react";
import {
  FileCheck,
  X,
  UploadCloud,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
  Compass,
} from "lucide-react";

interface AtsAuditResult {
  atsScore: number;
  rating: string;
  summary: string;
  matchedKeywords: string[];
  missingCriticalKeywords: string[];
  bulletFeedback: { original: string; suggestion: string }[];
  recommendedSkillsToMaster: { skill: string; why: string; priority: "High" | "Medium" }[];
}

interface AtsResumeAuditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: string;
  onApplyMissingSkills?: (missingKeywords: string[]) => void;
}

const SAMPLE_RESUME = `Mohammad Ayan
Computer Science Engineering | CGPA: 8.7
Email: ayan@example.com | GitHub: github.com/ayan | LinkedIn: linkedin.com/in/ayan

TECHNICAL SKILLS:
- Languages: TypeScript, JavaScript, Python, SQL, HTML, CSS
- Frameworks & Libraries: React.js, Next.js, Node.js, Express, Tailwind CSS
- Databases & Tools: PostgreSQL, MongoDB, Git, Docker, REST APIs, Vercel

PROJECTS:
1. E-Commerce Web Application (React, Node.js, MongoDB)
- Developed a full-stack e-commerce website with user authentication and payment checkout.
- Built RESTful APIs for product catalogs, cart management, and order processing.
- Deployed on Vercel and render with automated CI pipelines.

2. Campus Placement Portal (Next.js, TypeScript, PostgreSQL)
- Created an interactive portal for students to register for campus recruitment drives.
- Integrated role-based access control for students and placement coordinators.
- Optimized database queries to improve page load speed by 30%.

EXPERIENCE:
Software Engineering Intern | TechNova Solutions (June 2025 - August 2025)
- Collaborated with senior engineers to build responsive frontend dashboards in React.
- Fixed 20+ UI bug tickets and improved cross-browser responsiveness.
- Wrote unit tests for core API endpoints.`;

export const AtsResumeAuditorModal: React.FC<AtsResumeAuditorModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  onApplyMissingSkills,
}) => {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsAuditResult | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleAudit = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/resume-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetRole }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error("Resume ATS audit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (score >= 65) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    return "text-rose-400 border-rose-500/40 bg-rose-500/10";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">AI ATS Resume Auditor</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                  Target: {targetRole}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audit your resume against modern ATS algorithms & discover missing stepping stones
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Resume Upload / Input Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold uppercase tracking-wider text-slate-400">
                Your Resume Text or Document
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-medium">
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload .txt / Document
                  <input
                    type="file"
                    accept=".txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={() => setResumeText(SAMPLE_RESUME)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Load Sample
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here (Experience, Projects, Technical Skills)..."
              className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {resumeText.length} characters analyzed
              </span>

              <button
                onClick={handleAudit}
                disabled={loading || !resumeText.trim()}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-950 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Running ATS Neural Audit...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Audit Resume for {targetRole.split(" ")[0] || "Target"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Audit Results View */}
          {result && (
            <div className="space-y-4 pt-2 border-t border-slate-800 animate-in fade-in duration-300">
              {/* Score Banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-extrabold ${getScoreColor(
                      result.atsScore
                    )}`}
                  >
                    <span className="text-xl leading-none">{result.atsScore}</span>
                    <span className="text-[10px] uppercase font-semibold">ATS</span>
                  </div>

                  <div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getScoreColor(
                        result.atsScore
                      )}`}
                    >
                      {result.rating}
                    </span>
                    <p className="text-xs text-slate-300 mt-1 max-w-md">
                      {result.summary}
                    </p>
                  </div>
                </div>

                {onApplyMissingSkills && result.missingCriticalKeywords.length > 0 && (
                  <button
                    onClick={() => {
                      onApplyMissingSkills(result.missingCriticalKeywords);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-950"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Map Missing Skills to Tree
                  </button>
                )}
              </div>

              {/* Keyword Alignment Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Matched Keywords */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Matched ATS Keywords ({result.matchedKeywords.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedKeywords.length > 0 ? (
                      result.matchedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">None detected.</span>
                    )}
                  </div>
                </div>

                {/* Missing Critical Keywords */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-900/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Missing Critical Role Keywords ({result.missingCriticalKeywords.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingCriticalKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-amber-950/40 text-amber-300 border border-amber-800/40"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable Bullet Optimization */}
              {result.bulletFeedback.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Bullet Point Polish (From Weak to Recruiter-Magnet)
                  </h4>

                  <div className="space-y-2.5">
                    {result.bulletFeedback.map((fb, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="text-slate-400 line-through text-[11px]">
                          <span className="text-rose-400 font-semibold mr-1">Before:</span>
                          &quot;{fb.original}&quot;
                        </div>
                        <div className="text-emerald-300 text-[11px] font-medium">
                          <span className="text-emerald-400 font-semibold mr-1">Recruiter ATS Polish:</span>
                          &quot;{fb.suggestion}&quot;
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills to Master */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-400" />
                  High-Priority Stepping Stones to Master Next
                </h4>
                <div className="space-y-2">
                  {result.recommendedSkillsToMaster.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-100 block">
                          {item.skill}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.why}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 shrink-0 font-medium">
                        {item.priority} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Auditor
          </button>
        </div>
      </div>
    </div>
  );
};
