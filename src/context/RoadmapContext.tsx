"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { RoadmapGraph, RoadmapNodeData } from "@/types/roadmap";
import { sampleRoadmaps } from "@/lib/mock-data";
import { validateAndSanitizeGraph, toggleNodeCompletionCascade } from "@/lib/graph-validator";

interface RoadmapContextType {
  graph: RoadmapGraph;
  loading: boolean;
  error: string | null;
  targetRole: string;
  weeklyHours: number;
  experienceLevel: string;
  targetCompletionDate: string;
  stats: {
    totalNodes: number;
    completedNodes: number;
    unlockedNodes: number;
    lockedNodes: number;
    progressPercent: number;
    remainingHours: number;
    calculatedWeeks: number;
  };
  setTargetRole: (role: string) => void;
  setWeeklyHours: (hours: number) => void;
  setExperienceLevel: (exp: string) => void;
  setError: (err: string | null) => void;
  setGraph: (graph: RoadmapGraph) => void;
  toggleNodeComplete: (nodeId: string) => void;
  generateRoadmap: (role?: string, hours?: number, exp?: string, known?: string[]) => Promise<boolean>;
  resetToDefault: (presetKey?: string) => void;
  applyMissingKeywords: (keywords: string[]) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

const STORAGE_KEY_GRAPH = "pathcraft_graph_v2";
const STORAGE_KEY_HOURS = "pathcraft_hours_v2";
const STORAGE_KEY_EXP = "pathcraft_exp_v2";
const STORAGE_KEY_ROLE = "pathcraft_role_v2";

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [graph, setGraphState] = useState<RoadmapGraph>(sampleRoadmaps["cyber-security"]);
  const [targetRole, setTargetRole] = useState<string>("Cyber Security Engineer");
  const [weeklyHours, setWeeklyHoursState] = useState<number>(12);
  const [experienceLevel, setExperienceLevelState] = useState<string>("Student / Beginner");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // P0 Persistence: Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedGraphStr = localStorage.getItem(STORAGE_KEY_GRAPH);
      const savedHoursStr = localStorage.getItem(STORAGE_KEY_HOURS);
      const savedExpStr = localStorage.getItem(STORAGE_KEY_EXP);
      const savedRoleStr = localStorage.getItem(STORAGE_KEY_ROLE);

      if (savedHoursStr) {
        const parsedHours = Number(savedHoursStr);
        if (!isNaN(parsedHours) && parsedHours >= 4 && parsedHours <= 40) {
          setWeeklyHoursState(parsedHours);
        }
      }

      if (savedExpStr) {
        setExperienceLevelState(savedExpStr);
      }

      if (savedRoleStr) {
        setTargetRole(savedRoleStr);
      }

      if (savedGraphStr) {
        const parsed = JSON.parse(savedGraphStr);
        const validated = validateAndSanitizeGraph(parsed, savedRoleStr || "Cyber Security Engineer");
        setGraphState(validated);
      }
    } catch (err) {
      console.warn("Could not load from localStorage, using default preset:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // P0 Persistence: Sync state to localStorage whenever it changes
  const setGraph = useCallback((newGraph: RoadmapGraph) => {
    const validated = validateAndSanitizeGraph(newGraph, newGraph.metadata.targetRole);
    setGraphState(validated);
    try {
      localStorage.setItem(STORAGE_KEY_GRAPH, JSON.stringify(validated));
      localStorage.setItem(STORAGE_KEY_ROLE, validated.metadata.targetRole);
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
    }
  }, []);

  const setWeeklyHours = useCallback((hours: number) => {
    setWeeklyHoursState(hours);
    try {
      localStorage.setItem(STORAGE_KEY_HOURS, String(hours));
    } catch (err) {
      console.warn("Could not save hours:", err);
    }
  }, []);

  const setExperienceLevel = useCallback((exp: string) => {
    setExperienceLevelState(exp);
    try {
      localStorage.setItem(STORAGE_KEY_EXP, exp);
    } catch (err) {
      console.warn("Could not save experience:", err);
    }
  }, []);

  // Prerequisite consistency: Toggle milestone completion with topological cascade
  const toggleNodeComplete = useCallback((nodeId: string) => {
    setGraphState((prevGraph) => {
      const recalibratedNodes = toggleNodeCompletionCascade(prevGraph.nodes, nodeId);
      const updatedGraph: RoadmapGraph = {
        ...prevGraph,
        nodes: recalibratedNodes,
      };

      try {
        localStorage.setItem(STORAGE_KEY_GRAPH, JSON.stringify(updatedGraph));
      } catch (e) {
        console.warn("Failed to persist toggle:", e);
      }

      return updatedGraph;
    });
  }, []);

  // Compute live statistics
  const stats = useMemo(() => {
    const totalNodes = graph.nodes.length;
    const completedNodes = graph.nodes.filter((n) => n.status === "completed").length;
    const unlockedNodes = graph.nodes.filter((n) => n.status === "unlocked").length;
    const lockedNodes = graph.nodes.filter((n) => n.status === "locked").length;
    const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

    const remainingHours = graph.nodes
      .filter((n) => n.status !== "completed")
      .reduce((sum, n) => sum + n.estimatedHours, 0);

    const calculatedWeeks = weeklyHours > 0 ? Math.ceil(remainingHours / weeklyHours) : 0;

    return {
      totalNodes,
      completedNodes,
      unlockedNodes,
      lockedNodes,
      progressPercent,
      remainingHours,
      calculatedWeeks,
    };
  }, [graph, weeklyHours]);

  // Priority 3: Target Completion Date calculation
  const [targetCompletionDate, setTargetCompletionDate] = useState<string>("Calculating...");

  useEffect(() => {
    if (stats.calculatedWeeks === 0) {
      setTargetCompletionDate("Target Reached!");
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + stats.calculatedWeeks * 7);
    setTargetCompletionDate(
      date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    );
  }, [stats.calculatedWeeks]);

  // Generate roadmap with robust error handling and validation
  const generateRoadmap = useCallback(
    async (roleToGen?: string, hoursToUse?: number, expToUse?: string, knownToUse?: string[]) => {
      const queryRole = (roleToGen || targetRole).trim();
      if (!queryRole) {
        setError("Please enter a target job title or career role.");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetRole: queryRole,
            weeklyHours: hoursToUse ?? weeklyHours,
            experienceLevel: expToUse ?? experienceLevel,
            knownSkills: knownToUse ?? [],
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error || `Server responded with status ${res.status}. Switched to resilient synthesized mode.`;
          setError(errMsg);
          // Fall back gracefully to sample or synthetic
          const fallback = sampleRoadmaps["cyber-security"];
          setGraph(fallback);
          return false;
        }

        const rawData = await res.json();
        const validated = validateAndSanitizeGraph(rawData, queryRole);
        setGraph(validated);
        setTargetRole(queryRole);
        return true;
      } catch (err: any) {
        console.error("API error during generation:", err);
        setError("Network connection issue while calling AI engine. Loaded resilient synthesized mode.");
        setGraph(sampleRoadmaps["cyber-security"]);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [targetRole, weeklyHours, experienceLevel, setGraph]
  );

  // Reset to default sample roadmap
  const resetToDefault = useCallback((presetKey: string = "cyber-security") => {
    const defaultGraph = sampleRoadmaps[presetKey] || sampleRoadmaps["cyber-security"];
    setGraphState(defaultGraph);
    setTargetRole(defaultGraph.metadata.targetRole);
    setError(null);
    try {
      localStorage.setItem(STORAGE_KEY_GRAPH, JSON.stringify(defaultGraph));
      localStorage.setItem(STORAGE_KEY_ROLE, defaultGraph.metadata.targetRole);
    } catch (e) {
      console.warn("Could not reset localStorage:", e);
    }
  }, []);

  // Apply missing keywords to unlock corresponding roadmap nodes
  const applyMissingKeywords = useCallback((missingKeywords: string[]) => {
    setGraphState((prevGraph) => {
      const updatedNodes = prevGraph.nodes.map((node) => {
        const text = `${node.title} ${node.summary} ${node.actionable.skillsLearned.join(" ")}`.toLowerCase();
        const hasMatch = missingKeywords.some((kw) => text.includes(kw.toLowerCase()));
        if (hasMatch && node.status === "locked") {
          return { ...node, status: "unlocked" as RoadmapNodeData["status"] };
        }
        return node;
      });

      const updatedGraph = { ...prevGraph, nodes: updatedNodes };
      try {
        localStorage.setItem(STORAGE_KEY_GRAPH, JSON.stringify(updatedGraph));
      } catch (e) {
        console.warn("Could not save missing keywords update:", e);
      }
      return updatedGraph;
    });
  }, []);

  return (
    <RoadmapContext.Provider
      value={{
        graph,
        loading,
        error,
        targetRole,
        weeklyHours,
        experienceLevel,
        targetCompletionDate,
        stats,
        setTargetRole,
        setWeeklyHours,
        setExperienceLevel,
        setError,
        setGraph,
        toggleNodeComplete,
        generateRoadmap,
        resetToDefault,
        applyMissingKeywords,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error("useRoadmap must be used within a RoadmapProvider");
  }
  return context;
};
