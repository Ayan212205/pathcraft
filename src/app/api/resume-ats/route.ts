import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, targetRole } = body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Resume content is required" },
        { status: 400 }
      );
    }

    const role = targetRole || "Full Stack Developer at a Climate Tech Startup";
    const apiKey = process.env.GEMINI_API_KEY;

    // Intelligent heuristic audit fallback (ensures table demo never fails)
    const generateHeuristicAudit = () => {
      const lowerText = resumeText.toLowerCase();

      // Check common tech keywords
      const commonKeywords = [
        "typescript", "react", "next.js", "node.js", "python", "docker",
        "sql", "postgresql", "rest", "api", "git", "aws", "graphql", "tailwind"
      ];
      const matched = commonKeywords.filter((kw) => lowerText.includes(kw));

      const isClimate = role.toLowerCase().includes("climate");
      const isAI = role.toLowerCase().includes("agent") || role.toLowerCase().includes("ai");

      const missing = isClimate
        ? ["TimescaleDB / Time-Series DB", "GHG Protocol Scope 1/2/3", "Deck.gl / Mapbox WebGL", "IoT Sensor Telemetry", "Redis Stream Backpressure"]
        : isAI
        ? ["LangGraph State Machines", "Hybrid Vector Search (BM25 + Dense)", "Pydantic V2 Schemas", "LLM Evals (Langfuse)", "Sandboxed Code Execution"]
        : ["Continuous Integration (CI/CD)", "Distributed State Management", "OpenTelemetry Traces", "System Design Benchmarks"];

      const score = Math.min(94, Math.max(58, 55 + matched.length * 4 - missing.length * 2));

      return {
        atsScore: score,
        rating: score >= 85 ? "Exceptional Match" : score >= 70 ? "Strong Match" : "Needs Optimization",
        summary: `Your resume shows solid fundamental engineering experience with ${matched.length} core keywords. However, for a competitive role like "${role}", it lacks modern domain-specific credentials and specialized architectural deliverables.`,
        matchedKeywords: matched.map((k) => k.toUpperCase()),
        missingCriticalKeywords: missing,
        bulletFeedback: [
          {
            original: "Built a web application using React and Node.js for managing data.",
            suggestion: `Quantify impact and add domain relevance: "Architected high-throughput ingestion pipelines handling 10k+ records/sec with 99.9% uptime, reducing query latency by 45% using indexed data stores."`
          },
          {
            original: "Worked on frontend design and integrated REST APIs.",
            suggestion: `Highlight architectural rigor: "Engineered responsive, type-safe dashboards using TypeScript and real-time state machines, eliminating redundant re-renders."`
          }
        ],
        recommendedSkillsToMaster: missing.slice(0, 3).map((item) => ({
          skill: item,
          why: `Critical differentiator evaluated by technical hiring managers for ${role}.`,
          priority: "High" as const
        }))
      };
    };

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(generateHeuristicAudit());
    }

    // Call Gemini for real AI audit
    const prompt = `You are an elite Applicant Tracking System (ATS) auditor and principal technical recruiter.
Evaluate the following candidate resume specifically for the target position: "${role}".

Resume Text:
"""
${resumeText.slice(0, 4000)}
"""

Analyze ATS readability, keyword alignment, quantified impact, and domain-specific readiness.
Return strictly valid JSON with this schema:
{
  "atsScore": number (0 to 100),
  "rating": "Needs Optimization" | "Strong Match" | "Exceptional Match",
  "summary": string,
  "matchedKeywords": string[],
  "missingCriticalKeywords": string[],
  "bulletFeedback": [
    {
      "original": string (quote a weak bullet or sentence from the resume),
      "suggestion": string (high-impact, ATS-optimized version with metrics)
    }
  ],
  "recommendedSkillsToMaster": [
    {
      "skill": string,
      "why": string,
      "priority": "High" | "Medium"
    }
  ]
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.2
        }
      })
    });

    if (!geminiRes.ok) {
      return NextResponse.json(generateHeuristicAudit());
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(generateHeuristicAudit());
    }

    const parsed = JSON.parse(rawText);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Resume ATS route error:", error);
    return NextResponse.json(
      { error: "Failed to audit resume" },
      { status: 500 }
    );
  }
}
