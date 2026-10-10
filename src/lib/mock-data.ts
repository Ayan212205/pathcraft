import { RoadmapGraph } from "@/types/roadmap";

export const sampleRoadmaps: Record<string, RoadmapGraph> = {
  "climate-tech": {
    metadata: {
      targetRole: "Full Stack Developer at a Climate Tech Startup",
      domain: "Climate Tech & Grid Analytics",
      weeklyCommitment: 12,
      totalEstimatedWeeks: 16,
      roleOverview: "Build high-throughput time-series dashboards for solar/wind microgrids, carbon accounting APIs, and IoT sensor telemetry pipelines.",
      whyThisPath: "Traditional web dev teaches CRUD apps. Climate tech requires streaming time-series data, geospatial map visualizations, and carbon calculation standards (GHG Protocol)."
    },
    nodes: [
      {
        id: "node-1",
        title: "Modern TypeScript & Async Systems",
        phase: "Foundation",
        category: "Language",
        status: "completed",
        estimatedHours: 25,
        difficulty: "Beginner",
        prerequisites: [],
        summary: "Robust type systems for modeling real-world physical sensor devices and asynchronous event streams.",
        actionable: {
          weekendProject: {
            title: "Strict Energy Metric Validator",
            description: "Build an npm library in TypeScript with Zod schemas that parses and validates raw telemetry feeds from smart energy inverters.",
            deliverable: "GitHub repo with 95%+ test coverage and type-safe Zod models."
          },
          recommendedRepos: [
            { name: "colinhacks/zod", url: "https://github.com/colinhacks/zod", description: "TypeScript-first schema validation with static type inference." }
          ],
          interviewQuestions: [
            {
              question: "How do you handle floating-point precision issues when aggregating megawatt-hour energy units in TypeScript?",
              idealAnswer: "Use BigInt or fixed-point decimal libraries (like bignumber.js) rather than standard IEEE 754 floating points to prevent cumulative billing discrepancies."
            }
          ],
          skillsLearned: ["TypeScript Generics", "Zod", "Async/Await", "Error Boundaries"]
        }
      },
      {
        id: "node-2",
        title: "High-Frequency Time-Series DBs",
        phase: "Core Architecture",
        category: "Architecture",
        status: "unlocked",
        estimatedHours: 35,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Storing millions of solar/wind telemetry datapoints per minute using TimescaleDB or ClickHouse instead of standard Postgres tables.",
        actionable: {
          weekendProject: {
            title: "Simulated Microgrid Telemetry Ingestor",
            description: "Spin up TimescaleDB with Docker, create hypertables with continuous aggregates, and ingest 50,000 synthetic kilowatt telemetry records per second.",
            deliverable: "Docker Compose setup with SQL migration scripts and query benchmarks."
          },
          recommendedRepos: [
            { name: "timescale/timescaledb", url: "https://github.com/timescale/timescaledb", description: "An open-source time-series SQL database built on PostgreSQL." }
          ],
          interviewQuestions: [
            {
              question: "What is a hypertable in TimescaleDB and why does it outperform regular PostgreSQL partitioning for sensor logs?",
              idealAnswer: "Hypertables abstract physical chunks partitioned by time intervals, automating chunk management, parallel disk writes, and continuous aggregate rollups."
            }
          ],
          skillsLearned: ["TimescaleDB", "Hypertables", "Continuous Aggregates", "Data Retention Policies"]
        }
      },
      {
        id: "node-3",
        title: "Geospatial Data & Map Visualizations",
        phase: "Core Architecture",
        category: "Framework",
        status: "unlocked",
        estimatedHours: 30,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Displaying live solar farms, wind turbine statuses, and transmission line heatmaps using Mapbox GL and Deck.gl.",
        actionable: {
          weekendProject: {
            title: "National Grid Clean Energy Map",
            description: "Build an interactive Mapbox/Deck.gl interactive dashboard showing real-time carbon intensity per state using the open electricityMap API.",
            deliverable: "Deployed Next.js interactive web app with choropleth layers."
          },
          recommendedRepos: [
            { name: "visgl/deck.gl", url: "https://github.com/visgl/deck.gl", description: "WebGL-powered framework for large-scale data visualization." }
          ],
          interviewQuestions: [
            {
              question: "How do you render 100,000 IoT sensor coordinates on a web map without freezing the browser thread?",
              idealAnswer: "Offload rendering to WebGL using GPU instanced point clouds (e.g., Deck.gl ScatterplotLayer) and vector tile services like GeoJSON vector tiles with Tippecanoe."
            }
          ],
          skillsLearned: ["Deck.gl", "Mapbox GL JS", "GeoJSON", "GPU Instancing"]
        }
      },
      {
        id: "node-4",
        title: "GHG Protocol & Scope 1/2/3 APIs",
        phase: "Specialization",
        category: "Domain Knowledge",
        status: "locked",
        estimatedHours: 20,
        difficulty: "Intermediate",
        prerequisites: ["node-2"],
        summary: "Implementing standardized corporate carbon accounting calculations following the global Greenhouse Gas (GHG) protocol.",
        actionable: {
          weekendProject: {
            title: "Automated Scope 2 Carbon Emissions Calculator",
            description: "A RESTful microservice that takes electricity bill kWh inputs, matches them with regional grid emission factors (EPA eGRID / UK DEFRA), and computes MTCO2e emissions.",
            deliverable: "Microservice with open OpenAPI/Swagger specs and unit-tested emission conversions."
          },
          recommendedRepos: [
            { name: "climatiq/climatiq-python", url: "https://github.com/climatiq/climatiq-python", description: "Open climate intelligence calculations API." }
          ],
          interviewQuestions: [
            {
              question: "Explain the difference between location-based and market-based Scope 2 emissions reporting.",
              idealAnswer: "Location-based reflects average grid emissions where electricity is consumed; market-based factors in contractual instruments like RECs, PPAs, and green tariffs."
            }
          ],
          skillsLearned: ["GHG Protocol", "Emission Factors", "Carbon Auditing", "Compliance Schemas"]
        }
      },
      {
        id: "node-5",
        title: "Real-Time WebSocket Ingestion Pipeline",
        phase: "Specialization",
        category: "Architecture",
        status: "locked",
        estimatedHours: 40,
        difficulty: "Advanced",
        prerequisites: ["node-2", "node-3"],
        summary: "Building low-latency WebSocket backplanes with Redis Pub/Sub to push grid frequency drops and inverter faults directly to client UIs.",
        actionable: {
          weekendProject: {
            title: "Fault Alert Dispatch Engine",
            description: "A fast WebSocket server in Node.js/Go that detects inverter voltage surges and broadcasts prioritized alert banners to subscribed operators.",
            deliverable: "End-to-end WebSocket connection handling with automatic reconnection and backoff."
          },
          recommendedRepos: [
            { name: "redis/ioredis", url: "https://github.com/redis/ioredis", description: "Robust, full-featured Redis client for Node.js." }
          ],
          interviewQuestions: [
            {
              question: "How do you prevent WebSocket message drops during high spike events like sudden grid frequency anomalies?",
              idealAnswer: "Implement a message queue buffer (e.g. Kafka or Redis Streams) with backpressure regulation and client-side delta compression."
            }
          ],
          skillsLearned: ["WebSockets", "Redis Pub/Sub", "Backpressure", "Event-Driven Systems"]
        }
      },
      {
        id: "node-6",
        title: "Production Grid Ops Capstone",
        phase: "Capstone & Portfolio",
        category: "Project",
        status: "locked",
        estimatedHours: 45,
        difficulty: "Advanced",
        prerequisites: ["node-4", "node-5"],
        summary: "A production-grade, end-to-end Microgrid Telemetry & Carbon Accounting Platform ready to showcase in interviews.",
        actionable: {
          weekendProject: {
            title: "VoltPulse — Autonomous Microgrid Control Center",
            description: "Integrate TimescaleDB, Deck.gl geospatial maps, live WebSockets, and GHG Scope 2 carbon audits into a single cohesive SaaS platform with CI/CD deployment.",
            deliverable: "Live deployed URL on Vercel with automated seed demo data and a 2-minute Loom walkthrough."
          },
          recommendedRepos: [
            { name: "shadcn-ui/ui", url: "https://github.com/shadcn-ui/ui", description: "Accessible UI components for dashboard building." }
          ],
          interviewQuestions: [
            {
              question: "Walk me through how you architected VoltPulse for resilience when telemetry gateways go offline.",
              idealAnswer: "We use store-and-forward local gateway caching with idempotency keys on ingestion to guarantee deduplication upon reconnect."
            }
          ],
          skillsLearned: ["System Architecture", "End-to-End Delivery", "Observability", "Portfolio Presentation"]
        }
      }
    ],
    edges: [
      { id: "e1-2", source: "node-1", target: "node-2" },
      { id: "e1-3", source: "node-1", target: "node-3" },
      { id: "e2-4", source: "node-2", target: "node-4" },
      { id: "e2-5", source: "node-2", target: "node-5" },
      { id: "e3-5", source: "node-3", target: "node-5" },
      { id: "e4-6", source: "node-4", target: "node-6" },
      { id: "e5-6", source: "node-5", target: "node-6" }
    ]
  },
  "ai-agents": {
    metadata: {
      targetRole: "Autonomous AI Agent Engineer",
      domain: "AI Systems & Multi-Agent Orchestration",
      weeklyCommitment: 15,
      totalEstimatedWeeks: 14,
      roleOverview: "Design, build, and deploy multi-agent systems with tool-calling capabilities, memory persistence, human-in-the-loop validation, and latency optimization.",
      whyThisPath: "Basic tutorials only teach simple prompt wrappers. True agent engineering requires deterministic state machines, vector search with re-ranking, and evals."
    },
    nodes: [
      {
        id: "node-1",
        title: "Python Async & Type Safe Architectures",
        phase: "Foundation",
        category: "Language",
        status: "completed",
        estimatedHours: 20,
        difficulty: "Beginner",
        prerequisites: [],
        summary: "Pydantic V2 schema validation and asyncio for concurrent LLM tool execution.",
        actionable: {
          weekendProject: {
            title: "Structured Output Extractor",
            description: "Build a CLI that processes messy invoice PDFs into strictly validated Pydantic models using function calling.",
            deliverable: "Python package with unit tests and Pydantic JSON schemas."
          },
          recommendedRepos: [
            { name: "pydantic/pydantic", url: "https://github.com/pydantic/pydantic", description: "Data validation using Python type annotations." }
          ],
          interviewQuestions: [
            {
              question: "Why is Pydantic V2 significantly faster for agent validation loops than V1?",
              idealAnswer: "Pydantic V2 core validation logic is written in Rust (pydantic-core), reducing JSON parsing overhead by 5-10x during rapid agent tool-use cycles."
            }
          ],
          skillsLearned: ["Pydantic V2", "Asyncio", "Type Hints", "JSON Schema"]
        }
      },
      {
        id: "node-2",
        title: "Hybrid Vector Search & Re-ranking (RAG)",
        phase: "Core Architecture",
        category: "Architecture",
        status: "unlocked",
        estimatedHours: 30,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Dense embedding retrieval combined with BM25 sparse keyword search and cross-encoder re-ranking.",
        actionable: {
          weekendProject: {
            title: "Multi-Modal Codebase Indexer",
            description: "Index your local git repository using Qdrant/Chroma and implement hybrid BM25 + dense semantic retrieval with Cohere re-ranking.",
            deliverable: "Terminal assistant that retrieves exact lines of code with context windows."
          },
          recommendedRepos: [
            { name: "qdrant/qdrant", url: "https://github.com/qdrant/qdrant", description: "Vector search engine for next-generation AI." }
          ],
          interviewQuestions: [
            {
              question: "When does pure dense vector search fail, and why does hybrid search fix it?",
              idealAnswer: "Dense search fails on exact keywords, version numbers, and error codes. Hybrid search couples sparse BM25 keyword matching with semantic vector proximity for high recall."
            }
          ],
          skillsLearned: ["Qdrant", "BM25", "Cross-Encoders", "Chunking Strategies"]
        }
      },
      {
        id: "node-3",
        title: "Cyclic State Machines (LangGraph & AutoGen)",
        phase: "Core Architecture",
        category: "Framework",
        status: "unlocked",
        estimatedHours: 35,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Moving beyond simple linear chains to graph-based multi-turn agent state machines with conditional routing.",
        actionable: {
          weekendProject: {
            title: "Self-Correcting Code Generation Agent",
            description: "Build an agent loop that writes Python code, runs it in an isolated sandbox, catches stack traces, and iterates until unit tests pass.",
            deliverable: "A LangGraph state machine with cyclic error-recovery nodes."
          },
          recommendedRepos: [
            { name: "langchain-ai/langgraph", url: "https://github.com/langchain-ai/langgraph", description: "Build resilient multi-agent applications." }
          ],
          interviewQuestions: [
            {
              question: "How do you guarantee an agent loop terminates and doesn't get stuck in an infinite retry cycle?",
              idealAnswer: "Enforce deterministic loop guardrails: maximum recursion depth limits, exponential backoff, and fallback escalation to human-in-the-loop nodes."
            }
          ],
          skillsLearned: ["State Machines", "LangGraph", "Cyclic Routing", "Sandbox Execution"]
        }
      },
      {
        id: "node-4",
        title: "Agent Observability & Evals (Langfuse / Phoenix)",
        phase: "Specialization",
        category: "Architecture",
        status: "locked",
        estimatedHours: 25,
        difficulty: "Intermediate",
        prerequisites: ["node-2", "node-3"],
        summary: "Tracing latency, token costs, hallucination rates, and benchmarking agent decisions with automated unit test suites.",
        actionable: {
          weekendProject: {
            title: "Automated Regression Benchmark Suite",
            description: "Create an eval dataset of 50 edge-case prompts and evaluate your agent's tool-calling accuracy using Langfuse traces.",
            deliverable: "CI pipeline that blocks PRs if agent precision drops below 90%."
          },
          recommendedRepos: [
            { name: "langfuse/langfuse", url: "https://github.com/langfuse/langfuse", description: "Open source LLM engineering platform." }
          ],
          interviewQuestions: [
            {
              question: "What is LLM-as-a-judge and how do you calibrate it against human evaluation?",
              idealAnswer: "Using a larger model to score output criteria with few-shot rubrics, calibrated against Cohen's Kappa score on human-annotated test datasets."
            }
          ],
          skillsLearned: ["Langfuse", "LLM Evals", "Token Tracing", "Regression Benchmarking"]
        }
      },
      {
        id: "node-5",
        title: "Autonomous DevSecOps Engineer Capstone",
        phase: "Capstone & Portfolio",
        category: "Project",
        status: "locked",
        estimatedHours: 40,
        difficulty: "Advanced",
        prerequisites: ["node-4"],
        summary: "A production multi-agent system that reviews incoming GitHub Pull Requests, discovers security vulnerabilities, and commits suggested patches.",
        actionable: {
          weekendProject: {
            title: "PatchPilot — Autonomous Security PR Agent",
            description: "Deploy a GitHub App that triggers on PR creation, conducts AST security analysis, verifies findings with multi-agent consensus, and opens clean diff comments.",
            deliverable: "Working GitHub App deployed on AWS Lambda/Modal with documentation."
          },
          recommendedRepos: [
            { name: "ast-grep/ast-grep", url: "https://github.com/ast-grep/ast-grep", description: "Fast and easy tool for code searching, linting and rewriting." }
          ],
          interviewQuestions: [
            {
              question: "How do you protect your agent against prompt injection attacks hidden inside user code files?",
              idealAnswer: "Strict separation of data and instruction channels, prompt sandwiching, and running tools in non-privileged microVM sandboxes."
            }
          ],
          skillsLearned: ["Security Auditing", "GitHub Apps", "Sandboxing", "Production Agent Ops"]
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
  }
};
