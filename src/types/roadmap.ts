export type PhaseType = 
  | "Foundation" 
  | "Core Architecture" 
  | "Specialization" 
  | "Capstone & Portfolio" 
  | "Target Role";

export type CategoryType = 
  | "Language" 
  | "Framework" 
  | "Architecture" 
  | "Project" 
  | "Certification"
  | "Domain Knowledge";

export type NodeStatus = "locked" | "unlocked" | "completed";

export interface RepoRecommendation {
  name: string;
  url: string;
  description: string;
}

export interface InterviewQuestion {
  question: string;
  idealAnswer: string;
}

export interface WeekendProject {
  title: string;
  description: string;
  deliverable: string;
}

export interface RoadmapNodeData extends Record<string, unknown> {
  id: string;
  title: string;
  phase: PhaseType;
  category: CategoryType;
  status: NodeStatus;
  estimatedHours: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string[];
  summary: string;
  actionable: {
    weekendProject: WeekendProject;
    recommendedRepos: RepoRecommendation[];
    interviewQuestions: InterviewQuestion[];
    skillsLearned: string[];
  };
}

export interface RoadmapMetadata {
  targetRole: string;
  domain: string;
  weeklyCommitment: number;
  totalEstimatedWeeks: number;
  roleOverview: string;
  whyThisPath: string;
}

export interface RoadmapGraph {
  metadata: RoadmapMetadata;
  nodes: RoadmapNodeData[];
  edges: { id: string; source: string; target: string }[];
}
