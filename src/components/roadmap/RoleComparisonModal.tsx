"use client";

import React, { useState } from "react";
import { GitCompare, X, CheckCircle, Split, Sparkles, Layers } from "lucide-react";
import { sampleRoadmaps } from "@/lib/mock-data";

interface RoleComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string;
}

export const RoleComparisonModal: React.FC<RoleComparisonModalProps> = ({
  isOpen,
  onClose,
  currentRole,
}) => {
  const [compareTarget, setCompareTarget] = useState("Autonomous AI Agent Engineer");

  if (!isOpen) return null;

  const sharedFoundations = [
    {
      skill: "Type-Safe Asynchronous Architectures",
      role1Context: "Climate Tech: IoT sensor event streaming & telemetry validation",
      role2Context: "AI Agents: Concurrent tool execution & Pydantic state loops",
    },
    {
      skill: "High-Throughput State Persistence",
      role1Context: "Climate Tech: TimescaleDB time-series hypertables",
      role2Context: "AI Agents: Vector embeddings & memory caches (Qdrant/Redis)",
    },
    {
      skill: "Production Observability & Guardrails",
      role1Context: "Climate Tech: Grid frequency drops & error alerting backplanes",
      role2Context: "AI Agents: Token tracing & hallucination evaluation suites",
    },
  ];

  const uniqueToCurrent = [
    "Geospatial Mapbox & Deck.gl WebGL point cloud rendering",
    "GHG Protocol Scope 1/2/3 Corporate Carbon Accounting APIs",
    "Smart Inverter Telemetry & Microgrid Ingestion",
  ];

  const uniqueToCompare = [
    "LangGraph cyclic state machines & human-in-the-loop nodes",
    "Dense vector search + BM25 hybrid retrieval with re-ranking",
    "Automated regression benchmarks & LLM-as-a-judge pipelines",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Fork in the Road — Dual Career Comparison</h3>
              <p className="text-xs text-slate-400">Discover skill overlaps and pivot feasibility between two dream roles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Targets Selector */}
        <div className="py-4 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex-1 min-w-[200px] p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-indigo-400 block mb-0.5">Primary Target</span>
            <span className="font-semibold text-slate-200">{currentRole}</span>
          </div>

          <div className="p-2 rounded-full bg-slate-800 text-slate-400">
            <Split className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-[200px] p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-cyan-400 block mb-0.5">Compare Against</span>
            <select
              value={compareTarget}
              onChange={(e) => setCompareTarget(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none font-semibold cursor-pointer"
            >
              <option value="Autonomous AI Agent Engineer" className="bg-slate-900">
                Autonomous AI Agent Engineer
              </option>
              <option value="Fintech UI/UX Designer" className="bg-slate-900">
                Fintech UI/UX Designer
              </option>
              <option value="DeFi Smart Contract Auditor" className="bg-slate-900">
                DeFi Smart Contract Auditor
              </option>
            </select>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Overlap Summary */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-cyan-950/40 border border-purple-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-purple-300">62% Overlapping Foundational Architecture</span>
                <p className="text-[11px] text-slate-300">
                  Mastering the foundational tier allows you to pivot between either role with minimal extra friction.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold shrink-0">
              High Synergy
            </span>
          </div>

          {/* Shared Foundation Section */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              Shared Core Stepping Stones
            </h4>
            <div className="space-y-2">
              {sharedFoundations.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    {item.skill}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-900/30">
                      <span className="text-indigo-400 font-medium block">Path A:</span>
                      {item.role1Context}
                    </div>
                    <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-900/30">
                      <span className="text-cyan-400 font-medium block">Path B:</span>
                      {item.role2Context}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diverging Specializations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-indigo-900/40">
              <h5 className="text-xs font-bold text-indigo-400 mb-2">Unique Specialization (Current)</h5>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {uniqueToCurrent.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-400">•</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-900/40">
              <h5 className="text-xs font-bold text-cyan-400 mb-2">Unique Specialization (Compared)</h5>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {uniqueToCompare.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400">•</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
