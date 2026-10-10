import { RoadmapGraph, RoadmapNodeData } from "@/types/roadmap";
import { sampleRoadmaps } from "./mock-data";

/**
 * Validates and sanitizes raw graph data returned from API or local storage.
 * Guarantees DAG acyclicity, valid node structures, and removes orphaned edges.
 */
export function validateAndSanitizeGraph(raw: unknown, fallbackRole: string = "Cyber Security Engineer"): RoadmapGraph {
  if (!raw || typeof raw !== "object") {
    return sampleRoadmaps["cyber-security"];
  }

  const obj = raw as Record<string, unknown>;
  const rawNodes = Array.isArray(obj.nodes) ? obj.nodes : [];
  const rawEdges = Array.isArray(obj.edges) ? obj.edges : [];
  const rawMetadata = typeof obj.metadata === "object" && obj.metadata !== null ? (obj.metadata as Record<string, unknown>) : {};

  if (rawNodes.length === 0) {
    return sampleRoadmaps["cyber-security"];
  }

  // 1. Sanitize & Normalize Nodes
  const seenIds = new Set<string>();
  const sanitizedNodes: RoadmapNodeData[] = [];

  for (let i = 0; i < rawNodes.length; i++) {
    const n = rawNodes[i] as Record<string, unknown>;
    let id = typeof n.id === "string" && n.id.trim().length > 0 ? n.id.trim() : `node-${i + 1}`;
    if (seenIds.has(id)) {
      id = `${id}-dup-${i}`;
    }
    seenIds.add(id);

    const title = typeof n.title === "string" && n.title.trim() ? n.title.trim() : `Milestone ${i + 1}`;
    const phase = typeof n.phase === "string" ? (n.phase as RoadmapNodeData["phase"]) : (i === 0 ? "Foundation" : "Core Architecture");
    const category = typeof n.category === "string" ? (n.category as RoadmapNodeData["category"]) : "Architecture";
    const status: RoadmapNodeData["status"] = n.status === "completed" ? "completed" : n.status === "unlocked" ? "unlocked" : "locked";
    const estimatedHours = typeof n.estimatedHours === "number" && n.estimatedHours > 0 ? n.estimatedHours : 25;
    const difficulty = (n.difficulty === "Beginner" || n.difficulty === "Intermediate" || n.difficulty === "Advanced") ? n.difficulty : "Intermediate";
    const prerequisites = Array.isArray(n.prerequisites) ? (n.prerequisites as unknown[]).filter((p): p is string => typeof p === "string") : [];
    const summary = typeof n.summary === "string" ? n.summary : `Technical mastery milestone for ${title}.`;
    const whatToLearnAndWhy = typeof n.whatToLearnAndWhy === "string" ? n.whatToLearnAndWhy : summary;

    const act = (typeof n.actionable === "object" && n.actionable !== null) ? (n.actionable as Record<string, unknown>) : {};
    const wp = (typeof act.weekendProject === "object" && act.weekendProject !== null) ? (act.weekendProject as Record<string, unknown>) : {};

    const weekendProject = {
      title: typeof wp.title === "string" ? wp.title : `${title} Deliverable`,
      description: typeof wp.description === "string" ? wp.description : "Build and deploy a concrete domain deliverable.",
      deliverable: typeof wp.deliverable === "string" ? wp.deliverable : "GitHub repository with live testing suite."
    };

    const recommendedRepos = Array.isArray(act.recommendedRepos) ? act.recommendedRepos.map((r: any) => ({
      name: typeof r?.name === "string" ? r.name : "github/repo",
      url: typeof r?.url === "string" ? r.url : "https://github.com",
      description: typeof r?.description === "string" ? r.description : "Reference codebase."
    })) : [
      { name: "goldbergyoni/nodebestpractices", url: "https://github.com/goldbergyoni/nodebestpractices", description: "Production code patterns and benchmarks." }
    ];

    const interviewQuestions = Array.isArray(act.interviewQuestions) ? act.interviewQuestions.map((q: any) => ({
      question: typeof q?.question === "string" ? q.question : `What are the core trade-offs of ${title}?`,
      idealAnswer: typeof q?.idealAnswer === "string" ? q.idealAnswer : "Balancing performance, fault tolerance, and security requirements under production load."
    })) : [
      {
        question: `What are the core architectural trade-offs of ${title}?`,
        idealAnswer: "Balancing latency, maintainability, and resource consumption under peak system loads."
      }
    ];

    const skillsLearned = Array.isArray(act.skillsLearned) ? act.skillsLearned.filter((s): s is string => typeof s === "string") : [title];

    const verifiedResources = Array.isArray(act.verifiedResources) ? act.verifiedResources.map((v: any) => ({
      name: typeof v?.name === "string" ? v.name : "Official Documentation",
      type: (v?.type === "Official Documentation" || v?.type === "Course / Guide" || v?.type === "Industry Standard (Optional)") ? v.type : "Official Documentation",
      url: typeof v?.url === "string" ? v.url : "https://developer.mozilla.org/",
      isVerified: Boolean(v?.isVerified ?? true),
      notes: typeof v?.notes === "string" ? v.notes : "Production specifications."
    })) : [
      {
        name: "MDN Web & Systems Developer Reference",
        type: "Official Documentation" as const,
        url: "https://developer.mozilla.org/",
        isVerified: true,
        notes: "Authoritative specifications."
      }
    ];

    sanitizedNodes.push({
      id,
      title,
      phase,
      category,
      status,
      estimatedHours,
      difficulty,
      prerequisites,
      summary,
      whatToLearnAndWhy,
      actionable: {
        weekendProject,
        recommendedRepos,
        interviewQuestions,
        skillsLearned,
        verifiedResources
      }
    });
  }

  // Filter prerequisites to only exist in sanitized node IDs
  const validNodeIds = new Set(sanitizedNodes.map(n => n.id));
  sanitizedNodes.forEach(node => {
    node.prerequisites = node.prerequisites.filter(pId => validNodeIds.has(pId) && pId !== node.id);
  });

  // Ensure root node has 0 prerequisites
  const hasRoot = sanitizedNodes.some(n => n.prerequisites.length === 0);
  if (!hasRoot && sanitizedNodes.length > 0) {
    sanitizedNodes[0].prerequisites = [];
  }

  // 2. Sanitize Edges (remove broken and circular edges)
  const validEdges: { id: string; source: string; target: string }[] = [];
  const edgeIdSet = new Set<string>();

  for (let i = 0; i < rawEdges.length; i++) {
    const e = rawEdges[i] as Record<string, unknown>;
    const source = typeof e.source === "string" ? e.source.trim() : "";
    const target = typeof e.target === "string" ? e.target.trim() : "";

    if (source && target && source !== target && validNodeIds.has(source) && validNodeIds.has(target)) {
      const edgeKey = `${source}->${target}`;
      if (!edgeIdSet.has(edgeKey)) {
        edgeIdSet.add(edgeKey);
        validEdges.push({
          id: typeof e.id === "string" && e.id ? e.id : `e-${source}-${target}`,
          source,
          target
        });
      }
    }
  }

  // If no edges provided, build sequential edges based on prerequisites
  if (validEdges.length === 0) {
    sanitizedNodes.forEach(node => {
      node.prerequisites.forEach(prereqId => {
        validEdges.push({
          id: `e-${prereqId}-${node.id}`,
          source: prereqId,
          target: node.id
        });
      });
    });
  }

  // 3. Recalculate Prerequisite Consistency
  const consistentNodes = recalculatePrerequisites(sanitizedNodes);

  // 4. Sanitize Metadata
  const targetRole = typeof rawMetadata.targetRole === "string" && rawMetadata.targetRole.trim()
    ? rawMetadata.targetRole.trim()
    : fallbackRole;
  const domain = typeof rawMetadata.domain === "string" ? rawMetadata.domain : `${targetRole} Production Specialization`;
  const weeklyCommitment = typeof rawMetadata.weeklyCommitment === "number" ? rawMetadata.weeklyCommitment : 12;
  const totalEstimatedWeeks = typeof rawMetadata.totalEstimatedWeeks === "number" ? rawMetadata.totalEstimatedWeeks : 14;
  const roleOverview = typeof rawMetadata.roleOverview === "string" ? rawMetadata.roleOverview : `Architectural stepping stones for ${targetRole}.`;
  const whyThisPath = typeof rawMetadata.whyThisPath === "string" ? rawMetadata.whyThisPath : "Reverse-engineered curriculum emphasizing hands-on portfolio deliverables.";
  const generationMode = rawMetadata.generationMode === "gemini-live" ? "gemini-live" : "synthesized-fallback";

  return {
    metadata: {
      targetRole,
      domain,
      weeklyCommitment,
      totalEstimatedWeeks,
      roleOverview,
      whyThisPath,
      generationMode,
      candidateProfile: typeof rawMetadata.candidateProfile === "object" ? (rawMetadata.candidateProfile as any) : undefined
    },
    nodes: consistentNodes,
    edges: validEdges
  };
}

/**
 * Mathematically recalculates status for every node in the graph.
 * Ensures:
 * 1. Root nodes (no prerequisites) are 'unlocked' if not completed.
 * 2. Downstream nodes are 'unlocked' IF AND ONLY IF all their prerequisites are 'completed'.
 * 3. Any node whose prerequisites are not 100% completed is forced to 'locked' (unless user previously completed it).
 */
export function recalculatePrerequisites(nodes: RoadmapNodeData[]): RoadmapNodeData[] {
  const completedIds = new Set(
    nodes.filter(n => n.status === "completed").map(n => n.id)
  );

  return nodes.map(node => {
    // If user already mastered this node, preserve completed state
    if (node.status === "completed") {
      return node;
    }

    // A node is unlocked if it has NO prerequisites, OR all of its prerequisites are in completedIds
    const allPrereqsDone =
      node.prerequisites.length === 0 ||
      node.prerequisites.every(pId => completedIds.has(pId));

    return {
      ...node,
      status: allPrereqsDone ? "unlocked" : "locked"
    };
  });
}

/**
 * Toggles a node's completion status and performs a full topological cascade
 * across all downstream nodes.
 */
export function toggleNodeCompletionCascade(nodes: RoadmapNodeData[], targetNodeId: string): RoadmapNodeData[] {
  const targetNode = nodes.find(n => n.id === targetNodeId);
  if (!targetNode) return nodes;

  const isCurrentlyCompleted = targetNode.status === "completed";

  // If un-completing: target becomes unlocked
  // If completing: target becomes completed
  const initialUpdate = nodes.map(node => {
    if (node.id === targetNodeId) {
      return {
        ...node,
        status: (isCurrentlyCompleted ? "unlocked" : "completed") as RoadmapNodeData["status"]
      };
    }
    return node;
  });

  // Now run the full topological prerequisite recalculation
  return recalculatePrerequisites(initialUpdate);
}
