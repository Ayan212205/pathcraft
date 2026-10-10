"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRoadmap } from "@/context/RoadmapContext";
import {
  Calendar,
  Clock,
  Target,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Download,
  BookOpen,
  Hammer,
  Award,
  Sliders,
  Compass,
  Check,
} from "lucide-react";

interface WeekSchedule {
  weekNumber: number;
  title: string;
  focusArea: string;
  milestoneId: string;
  weeklyHours: number;
  learningTasks: string[];
  deliverable: string;
  isCompleted: boolean;
}

export default function WeeklyPlanPage() {
  const { graph, weeklyHours, setWeeklyHours, targetRole, targetCompletionDate } = useRoadmap();
  const [skillLevel, setSkillLevel] = useState<string>("Intermediate");
  const [targetMonths, setTargetMonths] = useState<number>(3);
  const [activeWeekTab, setActiveWeekTab] = useState<number>(1);
  const [completedWeeks, setCompletedWeeks] = useState<Record<number, boolean>>({});

  // Generate realistic week-by-week plan based on roadmap nodes and parameters
  const schedule: WeekSchedule[] = useMemo(() => {
    const totalWeeks = targetMonths * 4;
    const remainingNodes = graph.nodes;

    if (remainingNodes.length === 0) return [];

    const weeksPerNode = Math.max(1, Math.floor(totalWeeks / remainingNodes.length));
    const generated: WeekSchedule[] = [];

    let currentWeek = 1;

    remainingNodes.forEach((node, nodeIdx) => {
      const durationForThisNode =
        nodeIdx === remainingNodes.length - 1
          ? totalWeeks - currentWeek + 1
          : Math.min(weeksPerNode, totalWeeks - currentWeek);

      for (let w = 0; w < Math.max(1, durationForThisNode); w++) {
        const weekNum = currentWeek++;
        if (weekNum > totalWeeks) break;

        const taskType = w === 0 ? "Fundamentals & Mental Model" : "Architecture & Hands-on Implementation";

        generated.push({
          weekNumber: weekNum,
          title: `Week ${weekNum}: ${node.title} (${taskType})`,
          focusArea: node.phase,
          milestoneId: node.id,
          weeklyHours,
          learningTasks: [
            `Deep dive: Study official specs and best practices for ${node.actionable.skillsLearned.slice(0, 2).join(" & ") || node.title}.`,
            `Code lab: Build prototype implementing ${node.category.toLowerCase()} paradigms.`,
            `Interview drill: Rehearse questions on ${node.actionable.interviewQuestions[0]?.question || node.title}.`,
            `Documentation & push: Commit progress with clean Git commit messages.`,
          ],
          deliverable:
            w === 0
              ? `Functional micro-module for ${node.actionable.weekendProject.title}`
              : `Completed & tested milestone: ${node.actionable.weekendProject.deliverable}`,
          isCompleted: node.status === "completed" || !!completedWeeks[weekNum],
        });
      }
    });

    return generated;
  }, [graph, targetMonths, weeklyHours, completedWeeks]);

  const toggleWeekDone = (weekNum: number) => {
    setCompletedWeeks((prev) => ({
      ...prev,
      [weekNum]: !prev[weekNum],
    }));
  };

  const activeWeekData = schedule.find((s) => s.weekNumber === activeWeekTab) || schedule[0];
  const totalCompleted = schedule.filter((s) => s.isCompleted).length;
  const progressPercent = schedule.length > 0 ? Math.round((totalCompleted / schedule.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Adaptive Sprint Calendar Generator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Weekly Action Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Turns your abstract goal of becoming a{" "}
            <span className="text-amber-300 font-semibold">{targetRole}</span> into concrete, week-by-week
            actionable sprints with daily learning checklists and Sunday deliverables.
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

      {/* Control Dashboard & Parameters */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-5 shadow-xl">
        {/* Experience Level */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            Current Experience
          </label>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="Beginner">Student / Beginner (Foundations focus)</option>
            <option value="Intermediate">Self-Taught / Intermediate (Build fast)</option>
            <option value="Advanced">Junior / Advanced (Production polish)</option>
          </select>
        </div>

        {/* Weekly Commitment Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Weekly Commitment
            </label>
            <span className="font-bold text-amber-300">{weeklyHours} hrs/week</span>
          </div>
          <input
            type="range"
            min={4}
            max={40}
            step={2}
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-2"
          />
          <div className="text-[10px] text-slate-500">~{Math.round(weeklyHours / 7)} hrs/day</div>
        </div>

        {/* Target Deadline */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Target Sprint Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[2, 3, 4].map((m) => (
              <button
                key={m}
                onClick={() => setTargetMonths(m)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  targetMonths === m
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {m} Months
              </button>
            ))}
          </div>
        </div>

        {/* Sprint Progress Summary */}
        <div className="flex flex-col justify-center rounded-xl bg-slate-950/80 p-3.5 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Sprint Completion</span>
            <span className="font-bold text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500">
            {totalCompleted} of {schedule.length} weeks cleared • Target: {targetCompletionDate}
          </span>
        </div>
      </div>

      {/* Week Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {schedule.map((item) => (
          <button
            key={item.weekNumber}
            onClick={() => setActiveWeekTab(item.weekNumber)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-2 ${
              activeWeekTab === item.weekNumber
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg"
                : item.isCompleted
                ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/30"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            {item.isCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" />
            )}
            <span>Week {item.weekNumber}</span>
          </button>
        ))}
      </div>

      {/* Active Week Sprint Card */}
      {activeWeekData && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {activeWeekData.focusArea}
                </span>
                <span className="text-xs text-slate-400">
                  Allocated: {activeWeekData.weeklyHours} hours
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">{activeWeekData.title}</h2>
            </div>

            <button
              onClick={() => toggleWeekDone(activeWeekData.weekNumber)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                activeWeekData.isCompleted
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {activeWeekData.isCompleted ? "Week Completed! (Click to Undo)" : "Mark Week as Completed"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Tasks Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Monday – Saturday: Technical Work Breakdown
              </h3>
              <div className="space-y-2">
                {activeWeekData.learningTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-3"
                  >
                    <span className="text-cyan-400 font-bold shrink-0 mt-0.5">#{idx + 1}</span>
                    <span className="leading-relaxed">{task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sunday Deliverable */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Hammer className="w-4 h-4 text-amber-400" />
                Sunday: Milestone Verification Deliverable
              </h3>
              <div className="p-5 rounded-xl bg-gradient-to-br from-amber-950/20 via-slate-950 to-slate-950 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Award className="w-4 h-4" />
                  Portfolio Deliverable Benchmark
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeWeekData.deliverable}
                </p>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
                  💡 <strong>Tip for Evaluators:</strong> Completing this Sunday deliverable qualifies you for the{" "}
                  <em>Proof-of-Mastery Gate</em> on the main skill tree canvas!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
