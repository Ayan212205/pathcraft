"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Target,
  Sparkles,
  CheckCircle2,
  X,
  ChevronRight,
  Download,
  BookOpen,
  Hammer,
  Award,
} from "lucide-react";
import { RoadmapGraph } from "@/types/roadmap";

interface WeeklyActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  graph: RoadmapGraph;
}

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

export const WeeklyActionPlanModal: React.FC<WeeklyActionPlanModalProps> = ({
  isOpen,
  onClose,
  graph,
}) => {
  const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [weeklyHours, setWeeklyHours] = useState<number>(12);
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
      const durationForThisNode = nodeIdx === remainingNodes.length - 1 
        ? totalWeeks - currentWeek + 1 
        : Math.min(weeksPerNode, totalWeeks - currentWeek);

      for (let w = 0; w < Math.max(1, durationForThisNode); w++) {
        const weekNum = currentWeek++;
        if (weekNum > totalWeeks) break;

        const isCapstone = node.phase === "Capstone & Portfolio";
        const taskType = w === 0 ? "Fundamentals & Mental Model" : "Architecture & Hands-on Implementation";

        generated.push({
          weekNumber: weekNum,
          title: `Week ${weekNum}: ${node.title} (${taskType})`,
          focusArea: node.phase,
          milestoneId: node.id,
          weeklyHours,
          learningTasks: [
            `Deep dive: Study official specs and best practices for ${node.actionable.skillsLearned.slice(0, 2).join(" & ")}.`,
            `Code lab: Build prototype implementing ${node.category.toLowerCase()} paradigms.`,
            `Interview drill: Rehearse questions on ${node.actionable.interviewQuestions[0]?.question || node.title}.`,
            `Documentation & push: Commit progress with clean Git commit messages.`,
          ],
          deliverable: w === 0 
            ? `Functional micro-module for ${node.actionable.weekendProject.title}` 
            : `Completed & tested milestone: ${node.actionable.weekendProject.deliverable}`,
          isCompleted: node.status === "completed" || !!completedWeeks[weekNum],
        });
      }
    });

    return generated;
  }, [graph, targetMonths, weeklyHours, completedWeeks]);

  if (!isOpen) return null;

  const toggleWeekDone = (weekNum: number) => {
    setCompletedWeeks((prev) => ({
      ...prev,
      [weekNum]: !prev[weekNum],
    }));
  };

  const currentWeekData = schedule.find((w) => w.weekNumber === activeWeekTab) || schedule[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Personalized Weekly Action Plan</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {targetMonths * 4}-Week Blueprint
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tailored schedule for <strong className="text-slate-200">{graph.metadata.targetRole}</strong> broken down into daily sprints
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

        {/* Configuration Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-b border-slate-800/60 text-xs">
          {/* Skill Level */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              Current Skill Level
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSkillLevel(lvl)}
                  className={`py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    skillLevel === lvl
                      ? "bg-indigo-600 text-white font-semibold"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Hours */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Available Commitment
              </span>
              <span className="text-cyan-300 font-bold">{weeklyHours}h / week</span>
            </div>
            <input
              type="range"
              min={5}
              max={35}
              step={1}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Target Deadline */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Target Deadline
            </span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: "2 Months", val: 2 },
                { label: "3 Months", val: 3 },
                { label: "4 Months", val: 4 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setTargetMonths(opt.val)}
                  className={`py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    targetMonths === opt.val
                      ? "bg-emerald-600 text-white font-semibold"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Week Tabs & Content Split */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
          {/* Week Selector List (Left 4 cols) */}
          <div className="md:col-span-4 overflow-y-auto space-y-2 pr-1 max-h-[460px]">
            {schedule.map((item) => (
              <button
                key={item.weekNumber}
                onClick={() => setActiveWeekTab(item.weekNumber)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                  activeWeekTab === item.weekNumber
                    ? "bg-indigo-600/20 border-indigo-500/50 text-white shadow-md"
                    : "bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <div className="space-y-0.5">
                  <span className="font-bold block text-slate-200">
                    Week {item.weekNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">
                    {item.focusArea}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Week View (Right 8 cols) */}
          {currentWeekData && (
            <div className="md:col-span-8 overflow-y-auto bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 max-h-[460px]">
              {/* Week Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {currentWeekData.focusArea}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Target: {currentWeekData.weeklyHours} Hours (~{Math.round(currentWeekData.weeklyHours / 5)}h/day)
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {currentWeekData.title}
                  </h4>
                </div>

                <button
                  onClick={() => toggleWeekDone(currentWeekData.weekNumber)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    currentWeekData.isCompleted
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {currentWeekData.isCompleted ? "Completed" : "Mark as Done"}
                </button>
              </div>

              {/* Weekly Learning Tasks */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Sprint Roadmap Tasks
                </h5>
                <ul className="space-y-2 text-xs">
                  {currentWeekData.learningTasks.map((task, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-cyan-400 shrink-0">
                        {idx + 1}
                      </span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weekly Weekend Project Deliverable */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 to-slate-900 border border-indigo-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Hammer className="w-4 h-4" />
                  Sunday Deliverable Milestone
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  {currentWeekData.deliverable}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {Object.values(completedWeeks).filter(Boolean).length} of {schedule.length} weeks completed
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-950"
          >
            Start My Week 1 Sprint
          </button>
        </div>
      </div>
    </div>
  );
};
