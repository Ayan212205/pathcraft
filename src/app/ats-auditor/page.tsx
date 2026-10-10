"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRoadmap } from "@/context/RoadmapContext";
import {
  FileCheck,
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
  Check,
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

export default function AtsAuditorPage() {
  const { targetRole, applyMissingKeywords } = useRoadmap();
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsAuditResult | null>(null);
  const [applied, setApplied] = useState(false);

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
    setApplied(false);

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
      console.error("ATS audit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMissing = () => {
    if (result && result.missingCriticalKeywords) {
      applyMissingKeywords(result.missingCriticalKeywords);
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            AI Resume Auditor & ATS Benchmark Lab
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ATS Compatibility & Role Alignment
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Evaluate your resume against industry hiring filters for{" "}
            <span className="text-cyan-300 font-semibold">{targetRole}</span>. Uncover keyword blindspots,
            rewrite weak bullets into impact metrics, and sync missing skills directly to your visual skill canvas.
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Resume Input Sandbox */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Resume Document Content
              </label>

              {/* Upload file button */}
              <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer flex items-center gap-1.5 border border-slate-700 transition-colors">
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                Upload File (.txt, .md)
                <input
                  type="file"
                  accept=".txt,.md,.doc"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={16}
              placeholder="Paste complete resume text here (experience, skills, projects)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-colors resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{resumeText.trim().split(/\s+/).filter(Boolean).length} words</span>
              <button
                type="button"
                onClick={() => setResumeText(SAMPLE_RESUME)}
                className="text-cyan-400 hover:underline text-[11px]"
              >
                Reset to Sample Resume
              </button>
            </div>

            <button
              onClick={handleAudit}
              disabled={loading || !resumeText.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-500 hover:from-cyan-500 hover:to-indigo-400 font-bold text-xs text-white shadow-xl shadow-cyan-950 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                  Auditing Keywords Against &quot;{targetRole}&quot;...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  Run AI ATS Compatibility Audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Audit Results & Matrix */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !loading && (
            <div className="h-full min-h-[460px] p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <FileCheck className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-base font-bold text-white">Ready for ATS Evaluation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click <strong>&quot;Run AI ATS Compatibility Audit&quot;</strong> to parse your resume against modern ATS algorithmic filters for {targetRole}.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[460px] p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">Parsing Technical Competencies...</h3>
                <p className="text-xs text-slate-500">Matching keywords with industry benchmarks for {targetRole}</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Scorecard Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-extrabold border shadow-lg ${
                      result.atsScore >= 75
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-950"
                        : result.atsScore >= 55
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-950"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-950"
                    }`}
                  >
                    <span className="text-2xl leading-none">{result.atsScore}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 mt-1">/ 100</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                      {result.rating}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">ATS Compatibility Index</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{result.summary}</p>
                  </div>
                </div>

                {result.missingCriticalKeywords.length > 0 && (
                  <button
                    onClick={handleApplyMissing}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 shrink-0"
                  >
                    {applied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        Mapped to Canvas!
                      </>
                    ) : (
                      <>
                        <Compass className="w-3.5 h-3.5" />
                        Map Missing to Roadmap
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Keyword Alignment Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matched Keywords */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    Detected Keywords ({result.matchedKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 font-medium"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-2.5">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    Missing ATS Keywords ({result.missingCriticalKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingCriticalKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/20 font-medium"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bullet Point Rewrite Lab */}
              {result.bulletFeedback.length > 0 && (
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <TrendingUp className="w-4 h-4" />
                    Resume Bullet Point Rewrite Lab (STAR Method)
                  </div>
                  <div className="space-y-3">
                    {result.bulletFeedback.map((fb, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Original Bullet:</span>
                          <p className="text-slate-400 italic line-through mt-0.5">&quot;{fb.original}&quot;</p>
                        </div>
                        <div className="pt-1.5 border-t border-slate-900">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 block">ATS Impact Rewrite:</span>
                          <p className="text-emerald-300 font-medium mt-0.5">&quot;{fb.suggestion}&quot;</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Next Skills */}
              {result.recommendedSkillsToMaster.length > 0 && (
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                    <Lightbulb className="w-4 h-4" />
                    High-Priority Additions for {targetRole}
                  </div>
                  <div className="space-y-2">
                    {result.recommendedSkillsToMaster.map((rec, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-slate-200 flex items-center gap-2">
                            <span>{rec.skill}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                              {rec.priority} Priority
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">{rec.why}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
