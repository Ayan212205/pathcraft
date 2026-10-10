"use client";

import React, { useEffect } from "react";
import {
  Trophy,
  Sparkles,
  GitCompare,
  Download,
  ArrowRight,
  CheckCircle,
  X,
  Share2,
  Rocket,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

interface RoadmapCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: string;
  totalHours: number;
  onCompareRoles: () => void;
  onExportPng: () => void;
  onExploreNewRole: () => void;
}

export const RoadmapCompletionModal: React.FC<RoadmapCompletionModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  totalHours,
  onCompareRoles,
  onExportPng,
  onExploreNewRole,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Big celebratory fireworks confetti sequence
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextTierSuggestions = [
    {
      title: "Staff Systems Architecture & Distributed Consensus",
      type: "Staff Engineering",
      reason: "Take your systems design from standard microservices to Raft/Paxos fault-tolerant architectures.",
    },
    {
      title: "Zero-Knowledge Proofs & Cryptographic Attestation",
      type: "Next-Gen Security",
      reason: "Add cutting-edge cryptographic verification to prove carbon/sensor telemetry validity.",
    },
    {
      title: "Kernel-Level eBPF Network Tracing & Performance",
      type: "Ultra Low Latency",
      reason: "Optimize packet latency to sub-millisecond throughput for high-frequency operations.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] text-slate-100 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Celebration */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-900/40 mx-auto mb-2 animate-bounce">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            100% Placement-Ready Candidate
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Congratulations! You Mastered the Path
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            You conquered all critical stepping stones for{" "}
            <span className="font-semibold text-emerald-400">{targetRole}</span>,
            logging approximately <span className="font-semibold text-white">{totalHours} hours</span> of production-grade project work!
          </p>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Portfolio & Readiness Badge Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Verified Portfolio Competency</span>
                <span className="text-[11px] text-slate-400">All weekend projects & interview drills cleared.</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onExportPng();
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Save Certificate / Map
            </button>
          </div>

          {/* Next Level Horizon: What to learn next */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-cyan-400" />
                Staff-Level Horizon (Next Skills to Explore)
              </h4>
              <span className="text-[10px] text-indigo-400 font-medium">Future-Proofing</span>
            </div>

            <div className="space-y-2">
              {nextTierSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-100">{item.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Career Pivot Comparison CTA */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-950 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <GitCompare className="w-4 h-4 text-purple-400" />
                Transfer Your Skills to Adjacent Dream Roles
              </span>
              <p className="text-[11px] text-slate-300">
                You already possess 60%+ of the prerequisite foundation for roles like Autonomous AI Agent Engineering.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onCompareRoles();
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-lg shadow-purple-950"
            >
              Compare Pivot Roles
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-4">
          <button
            onClick={() => {
              onClose();
              onExploreNewRole();
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Explore Another Dream Role
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-950"
          >
            Awesome, Keep Practicing!
          </button>
        </div>
      </div>
    </div>
  );
};
