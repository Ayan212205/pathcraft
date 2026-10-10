import { NextRequest, NextResponse } from "next/server";
import { RoadmapGraph, RoadmapNodeData } from "@/types/roadmap";
import { sampleRoadmaps } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      targetRole,
      weeklyHours = 12,
      experienceLevel = "Intermediate",
      knownSkills = [],
    } = body;

    if (!targetRole || typeof targetRole !== "string" || targetRole.trim().length === 0) {
      return NextResponse.json(
        { error: "Target role is required" },
        { status: 400 }
      );
    }

    const cleanRole = targetRole.trim().toLowerCase();

    // Helper to apply known skills (Priority 5 Personalization)
    const applyKnownSkills = (graph: RoadmapGraph): RoadmapGraph => {
      if (!Array.isArray(knownSkills) || knownSkills.length === 0) {
        return graph;
      }

      const lowerKnown = knownSkills.map((s: string) => s.toLowerCase().trim()).filter(Boolean);
      if (lowerKnown.length === 0) return graph;

      const updatedNodes = graph.nodes.map((node) => {
        const text = `${node.title} ${node.summary} ${node.actionable.skillsLearned.join(" ")}`.toLowerCase();
        const matches = lowerKnown.some((k) => text.includes(k));
        if (matches) {
          return { ...node, status: "completed" as RoadmapNodeData["status"] };
        }
        return node;
      });

      // Recalculate downstream unlocking
      const completedIds = new Set(
        updatedNodes.filter((n) => n.status === "completed").map((n) => n.id)
      );

      const recalibratedNodes = updatedNodes.map((node) => {
        if (node.status === "completed") return node;
        const allPrereqsDone =
          node.prerequisites.length === 0 ||
          node.prerequisites.every((prereqId) => completedIds.has(prereqId));

        return {
          ...node,
          status: (allPrereqsDone ? "unlocked" : "locked") as RoadmapNodeData["status"],
        };
      });

      return {
        ...graph,
        metadata: {
          ...graph.metadata,
          candidateProfile: {
            experienceLevel,
            knownSkills,
          },
        },
        nodes: recalibratedNodes,
      };
    };

    // Fast-path match for sample queries if offline or for lightning-fast demo
    if (cleanRole.includes("cyber") || cleanRole.includes("security") || cleanRole.includes("penetration")) {
      return NextResponse.json(applyKnownSkills(sampleRoadmaps["cyber-security"]));
    }
    if (cleanRole.includes("climate") || cleanRole.includes("green")) {
      return NextResponse.json(applyKnownSkills(sampleRoadmaps["climate-tech"]));
    }
    if (cleanRole.includes("agent") || cleanRole.includes("autonomous")) {
      return NextResponse.json(applyKnownSkills(sampleRoadmaps["ai-agents"]));
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Parametric synthesis fallback when API key is not configured
    const generateSynthesized = (): RoadmapGraph => {
      const baseRole = targetRole.split(" ")[0] || "Software";
      const totalHours = 25 + 35 + 30 + 28 + 40;
      const estimatedWeeks = Math.ceil(totalHours / weeklyHours);

      const rawGraph: RoadmapGraph = {
        metadata: {
          targetRole,
          domain: `${targetRole} Production Engineering`,
          weeklyCommitment: weeklyHours,
          totalEstimatedWeeks: estimatedWeeks,
          roleOverview: `Reverse-engineered stepping stones for ${targetRole}, calibrated for a ${experienceLevel} level candidate with hands-on deliverables.`,
          whyThisPath: `Tailored curriculum emphasizing actionable portfolio projects, system design trade-offs, and domain-specific tools over generic checklists.`,
          candidateProfile: {
            experienceLevel,
            knownSkills,
          },
        },
        nodes: [
          {
            id: "node-1",
            title: `Foundations of ${baseRole} Engineering`,
            phase: "Foundation",
            category: "Language",
            status: "unlocked", // Starts Active!
            estimatedHours: 25,
            difficulty: "Beginner",
            prerequisites: [],
            summary: `Core foundational competencies, syntax idioms, and architectural mental models required for ${targetRole}.`,
            whatToLearnAndWhy: `Before touching complex enterprise distributed pipelines, you must understand core language primitives, memory models, and async execution flows.`,
            actionable: {
              weekendProject: {
                title: `${baseRole} Domain CLI Toolkit`,
                description: `Build an open-source CLI utility with strict schema validation and test suites tailored for ${targetRole} workflows.`,
                deliverable: "GitHub repository with automated CI workflows and 90%+ test coverage."
              },
              recommendedRepos: [
                { name: "goldbergyoni/nodebestpractices", url: "https://github.com/goldbergyoni/nodebestpractices", description: "Production best practices and design patterns." }
              ],
              interviewQuestions: [
                {
                  question: `What is the most critical design constraint when building systems for ${targetRole}?`,
                  idealAnswer: "Balancing maintainability and strict type safety against latency and data throughput under peak load."
                }
              ],
              skillsLearned: ["Core Paradigms", "Async Systems", "Testing", "Design Patterns"],
              verifiedResources: [
                {
                  name: "MDN Web & System Architecture Specs",
                  type: "Official Documentation",
                  url: "https://developer.mozilla.org/",
                  isVerified: true,
                  notes: "Authoritative specifications and standards."
                }
              ]
            }
          },
          {
            id: "node-2",
            title: "Data Pipelines & State Management",
            phase: "Core Architecture",
            category: "Architecture",
            status: "locked",
            estimatedHours: 35,
            difficulty: "Intermediate",
            prerequisites: ["node-1"],
            summary: "Managing distributed state, caching layers, and high-volume data streams.",
            whatToLearnAndWhy: "Modern production applications cannot rely on naive memory storage. You need scalable database schemas, indexing strategies, and caching layers.",
            actionable: {
              weekendProject: {
                title: "Event-Driven State Machine",
                description: "Implement a persistent queue with exponential backoff, dead-letter topics, and idempotency handling.",
                deliverable: "Dockerized service with benchmark test suites."
              },
              recommendedRepos: [
                { name: "redis/ioredis", url: "https://github.com/redis/ioredis", description: "Enterprise-grade in-memory key-value client." }
              ],
              interviewQuestions: [
                {
                  question: "How do you guarantee exactly-once processing in distributed event pipelines?",
                  idealAnswer: "Combine at-least-once delivery with persistent idempotency keys in an atomic transactional data store."
                }
              ],
              skillsLearned: ["Idempotency", "Redis", "Message Queues", "Fault Tolerance"],
              verifiedResources: [
                {
                  name: "PostgreSQL Official Documentation",
                  type: "Official Documentation",
                  url: "https://www.postgresql.org/docs/",
                  isVerified: true,
                  notes: "Core relational query execution and concurrency guides."
                }
              ]
            }
          },
          {
            id: "node-3",
            title: "Domain-Specific Niche Tooling & Protocols",
            phase: "Specialization",
            category: "Framework",
            status: "locked",
            estimatedHours: 30,
            difficulty: "Intermediate",
            prerequisites: ["node-1"],
            summary: `Specialized tools, protocols, and micro-credentials distinguishing candidates in ${targetRole}.`,
            whatToLearnAndWhy: "Generalist developers struggle because they don't know the exact domain libraries hiring managers test for.",
            actionable: {
              weekendProject: {
                title: "Production Integration Module",
                description: `Build an integration library connecting third-party domain APIs directly into your stack.`,
                deliverable: "Published npm/pip module with live sandbox documentation."
              },
              recommendedRepos: [
                { name: "public-apis/public-apis", url: "https://github.com/public-apis/public-apis", description: "Curated collection of free APIs." }
              ],
              interviewQuestions: [
                {
                  question: "Which trade-off defines architectural choices in this domain?",
                  idealAnswer: "Consistency versus availability according to the CAP theorem, tailored to user business expectations."
                }
              ],
              skillsLearned: ["API Integration", "Protocol Buffers", "Benchmarking", "Telemetry"],
              verifiedResources: [
                {
                  name: "OWASP & Cloud Native Computing Foundation (CNCF)",
                  type: "Official Documentation",
                  url: "https://www.cncf.io/",
                  isVerified: true,
                  notes: "Open source vendor-neutral cloud computing foundation."
                }
              ]
            }
          },
          {
            id: "node-4",
            title: "Production Security & Observability",
            phase: "Specialization",
            category: "Architecture",
            status: "locked",
            estimatedHours: 28,
            difficulty: "Advanced",
            prerequisites: ["node-2", "node-3"],
            summary: "Telemetry instrumentation, distributed tracing, and enterprise-grade security guardrails.",
            whatToLearnAndWhy: "In senior and mid-level interviews, candidates are judged on how they monitor and safeguard live systems when failures occur.",
            actionable: {
              weekendProject: {
                title: "OpenTelemetry Dashboard & Alerting",
                description: "Instrument services with OpenTelemetry traces and build Prometheus/Grafana dashboards.",
                deliverable: "Docker Compose environment with live Grafana dashboards."
              },
              recommendedRepos: [
                { name: "open-telemetry/opentelemetry-js", url: "https://github.com/open-telemetry/opentelemetry-js", description: "The OpenTelemetry JavaScript SDK." }
              ],
              interviewQuestions: [
                {
                  question: "What is the difference between metrics, logs, and traces?",
                  idealAnswer: "Metrics are aggregated counters over time; logs are discreet timestamped events; traces track end-to-end request lifecycle across microservice boundaries."
                }
              ],
              skillsLearned: ["OpenTelemetry", "Distributed Tracing", "Security Hardening", "Alerting"],
              verifiedResources: [
                {
                  name: "OpenTelemetry Official Documentation",
                  type: "Official Documentation",
                  url: "https://opentelemetry.io/docs/",
                  isVerified: true,
                  notes: "High-quality, ubiquitous, and portable telemetry specifications."
                }
              ]
            }
          },
          {
            id: "node-5",
            title: `Flagship Portfolio Capstone for ${targetRole}`,
            phase: "Capstone & Portfolio",
            category: "Project",
            status: "locked",
            estimatedHours: 40,
            difficulty: "Advanced",
            prerequisites: ["node-4"],
            summary: `End-to-end showcase project demonstrating full mastery of ${targetRole} to hiring managers.`,
            whatToLearnAndWhy: "Having a deployed, working flagship project in your resume gives you immediate credibility over applicants who only list coursework.",
            actionable: {
              weekendProject: {
                title: `Apex — ${targetRole} Flagship Platform`,
                description: `Deploy a production-grade application incorporating real-world data pipelines, auth, and automated CI/CD.`,
                deliverable: "Live public URL with full GitHub repository and 2-minute video walkthrough."
              },
              recommendedRepos: [
                { name: "shadcn-ui/ui", url: "https://github.com/shadcn-ui/ui", description: "Accessible UI components." }
              ],
              interviewQuestions: [
                {
                  question: "How does your capstone project solve a real business challenge?",
                  idealAnswer: "By eliminating manual reconciliation friction and slashing query latency by 4x through continuous aggregate caches."
                }
              ],
              skillsLearned: ["Production Architecture", "Full-Stack Deployment", "Portfolio Polish", "Technical Communication"],
              verifiedResources: [
                {
                  name: "GitHub Actions CI/CD Documentation",
                  type: "Official Documentation",
                  url: "https://docs.github.com/en/actions",
                  isVerified: true,
                  notes: "Automated continuous integration and deployment documentation."
                }
              ]
            }
          }
        ],
        edges: [
          { id: "e1-2", source: "node-1", target: "node-2" },
          { id: "e1-3", source: "node-1", target: "node-3" },
          { id: "e2-4", source: "node-2", target: "node-4" },
          { id: "e3-4", source: "node-3", target: "node-4" },
          { id: "e4-5", source: "node-4", target: "node-5" }
        ]
      };

      return applyKnownSkills(rawGraph);
    };

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(generateSynthesized());
    }

    // Call Gemini API with strict schema
    const systemPrompt = `You are an elite Silicon Valley technical recruiter and principal engineer.
The user wants to reverse-engineer their dream role into an interactive DAG (Directed Acyclic Graph) skill tree.
Target Position: "${targetRole}"
Candidate Profile:
- Experience Level: ${experienceLevel}
- Known Skills to Bypass / Fast-Track: ${knownSkills.length > 0 ? knownSkills.join(", ") : "None specified"}
- Weekly Available Hours: ${weeklyHours}

IMPORTANT RULES:
1. The first foundational milestone (node-1) MUST have status "unlocked" (Active) so the user can start learning, NOT "completed", UNLESS it explicitly matches one of the user's Known Skills!
2. Downstream milestones must have status "locked".
3. Provide realistic, non-generic advice: real architectures, concrete weekend projects, and actual interview questions.
4. Distinguish verified official documentation / resources with real URLs.

Output must be valid JSON strictly adhering to this TypeScript structure:
{
  "metadata": {
    "targetRole": string,
    "domain": string,
    "weeklyCommitment": number,
    "totalEstimatedWeeks": number,
    "roleOverview": string,
    "whyThisPath": string
  },
  "nodes": [
    {
      "id": "node-1", // sequential
      "title": string,
      "phase": "Foundation" | "Core Architecture" | "Specialization" | "Capstone & Portfolio" | "Target Role",
      "category": "Language" | "Framework" | "Architecture" | "Project" | "Certification" | "Domain Knowledge",
      "status": "unlocked" | "locked", // First node unlocked, rest locked
      "estimatedHours": number,
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "prerequisites": string[], // ids of prior nodes
      "summary": string,
      "whatToLearnAndWhy": string,
      "actionable": {
        "weekendProject": {
          "title": string,
          "description": string,
          "deliverable": string
        },
        "recommendedRepos": [
          { "name": string, "url": string, "description": string }
        ],
        "interviewQuestions": [
          { "question": string, "idealAnswer": string }
        ],
        "skillsLearned": string[],
        "verifiedResources": [
          {
            "name": string,
            "type": "Official Documentation" | "Course / Guide" | "Industry Standard (Optional)",
            "url": string,
            "isVerified": boolean,
            "notes": string
          }
        ]
      }
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "node-1", "target": "node-2" }
  ]
}

Ensure the nodes and edges form a valid Directed Acyclic Graph (DAG) with 5 to 7 nodes total.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.25
        }
      })
    });

    if (!geminiRes.ok) {
      return NextResponse.json(generateSynthesized());
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(generateSynthesized());
    }

    const parsed: RoadmapGraph = JSON.parse(rawText);
    return NextResponse.json(applyKnownSkills(parsed));

  } catch (error) {
    console.error("API error in /api/generate:", error);
    return NextResponse.json(sampleRoadmaps["cyber-security"]);
  }
}
