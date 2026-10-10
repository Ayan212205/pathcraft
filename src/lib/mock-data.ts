import { RoadmapGraph } from "@/types/roadmap";

export const sampleRoadmaps: Record<string, RoadmapGraph> = {
  "cyber-security": {
    metadata: {
      targetRole: "Cyber Security Engineer",
      domain: "Offensive Security & Enterprise Defense",
      weeklyCommitment: 12,
      totalEstimatedWeeks: 14,
      roleOverview: "Design secure network perimeters, conduct automated vulnerability assessments, and implement Zero-Trust threat containment pipelines.",
      whyThisPath: "Entry-level candidates often only learn tools like Wireshark without understanding Linux packet filtering (eBPF/iptables), OWASP remediation, or cloud IAM architectures.",
      generationMode: "synthesized-fallback"
    },
    nodes: [
      {
        id: "node-1",
        title: "Linux Kernel Security & Networking Protocols",
        phase: "Foundation",
        category: "Language",
        status: "unlocked", // Starts Active!
        estimatedHours: 25,
        difficulty: "Beginner",
        prerequisites: [],
        summary: "Master TCP/IP handshakes, packet headers, DNS spoofing vectors, and Linux system call auditing.",
        whatToLearnAndWhy: "Every security exploit manipulates fundamental operating system primitives or network protocols. You must understand how raw sockets and packet fragmentation work before you can defend against them.",
        actionable: {
          weekendProject: {
            title: "Custom Scapy Packet Sniffer & Anomaly Detector",
            description: "Build a Python network monitor using Scapy that inspects incoming packets, flags SYN flood attempts, and generates alert logs.",
            deliverable: "GitHub repository with automated PCAP packet analysis scripts and unit tests."
          },
          recommendedRepos: [
            { name: "secdev/scapy", url: "https://github.com/secdev/scapy", description: "Packet manipulation library for Python." }
          ],
          interviewQuestions: [
            {
              question: "Explain the TCP 3-way handshake and how a SYN flood attack exploits the embryonic connection backlog.",
              idealAnswer: "The client sends SYN, server responds SYN-ACK allocating half-open state in memory. If ACK never arrives, connection tables exhaust. Defended using SYN cookies."
            }
          ],
          skillsLearned: ["TCP/IP Analysis", "Scapy", "Linux System Calls", "Network Traffic Sniffing"],
          verifiedResources: [
            {
              name: "PortSwigger Web Security Academy",
              type: "Course / Guide",
              url: "https://portswigger.net/web-security",
              isVerified: true,
              notes: "Free, hands-on enterprise security training labs by the makers of Burp Suite."
            },
            {
              name: "NIST Special Publication 800-53",
              type: "Official Documentation",
              url: "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final",
              isVerified: true,
              notes: "National Institute of Standards security and privacy controls."
            },
            {
              name: "CompTIA Security+ / CEH (Optional Industry Reference)",
              type: "Industry Standard (Optional)",
              url: "https://www.comptia.org/certifications/security",
              isVerified: true,
              notes: "Widely referenced foundational body of knowledge. Useful for syllabus structure, though personal projects carry more interview weight."
            }
          ]
        }
      },
      {
        id: "node-2",
        title: "Web App Penetration Testing & OWASP Top 10",
        phase: "Core Architecture",
        category: "Architecture",
        status: "locked",
        estimatedHours: 35,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Identify and remediate SQL injection, Cross-Site Scripting (XSS), SSRF, and broken object-level authorization (BOLA).",
        whatToLearnAndWhy: "Over 80% of modern breaches exploit application layer vulnerabilities. Recruiters test candidates heavily on explaining exact exploit mechanisms and code-level patches.",
        actionable: {
          weekendProject: {
            title: "Vulnerable Lab Audit & Code Remediation",
            description: "Audit an intentionally vulnerable web application (DVWA/Juice Shop), document exploit proofs-of-concept, and submit code patches fixing all identified flaws.",
            deliverable: "Comprehensive Penetration Test Report with before/after patched code diffs."
          },
          recommendedRepos: [
            { name: "OWASP/CheatSheetSeries", url: "https://github.com/OWASP/CheatSheetSeries", description: "The OWASP security developer cheat sheet series." }
          ],
          interviewQuestions: [
            {
              question: "What is Server-Side Request Forgery (SSRF) and how do attackers use it to access AWS cloud metadata?",
              idealAnswer: "SSRF tricks a server into making HTTP requests to internal IP addresses (like 169.254.169.254 in AWS) to harvest temporary IAM security credentials."
            }
          ],
          skillsLearned: ["OWASP Top 10", "Burp Suite", "Remediation Diffing", "Input Sanitization"],
          verifiedResources: [
            {
              name: "OWASP Top 10 Official Documentation",
              type: "Official Documentation",
              url: "https://owasp.org/www-project-top-ten/",
              isVerified: true,
              notes: "The global benchmark standard for web application security awareness."
            }
          ]
        }
      },
      {
        id: "node-3",
        title: "Cloud Infrastructure Security & IAM Hardening",
        phase: "Specialization",
        category: "Architecture",
        status: "locked",
        estimatedHours: 30,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Enforce least-privilege IAM policies, audit S3 bucket ACLs, and implement automated Terraform security linting.",
        whatToLearnAndWhy: "Modern infrastructure lives in the cloud. Misconfigured IAM roles and unencrypted storage are the leading causes of massive data leaks today.",
        actionable: {
          weekendProject: {
            title: "Automated Cloud Misconfiguration Scanner",
            description: "Write a tool using AWS SDK / Boto3 that audits cloud resources for publicly accessible storage buckets, wildcard permissions, and unrotated API keys.",
            deliverable: "Python CLI tool with JSON compliance reporting against CIS AWS Benchmarks."
          },
          recommendedRepos: [
            { name: "aquasecurity/trivy", url: "https://github.com/aquasecurity/trivy", description: "Comprehensive security scanner for vulnerabilities and misconfigurations." }
          ],
          interviewQuestions: [
            {
              question: "How do you enforce the principle of least privilege in cloud environments without breaking developer velocity?",
              idealAnswer: "Use permission boundaries, automated SCP guardrails, ephemeral just-in-time access (e.g. AWS IAM Identity Center), and automated policy access analysis."
            }
          ],
          skillsLearned: ["Cloud IAM", "Terraform Security", "CIS Benchmarks", "Least Privilege"],
          verifiedResources: [
            {
              name: "AWS Well-Architected Security Pillar",
              type: "Official Documentation",
              url: "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html",
              isVerified: true,
              notes: "Core architectural guidelines for building secure workloads in AWS."
            }
          ]
        }
      },
      {
        id: "node-4",
        title: "SOC Telemetry & SIEM Incident Response",
        phase: "Specialization",
        category: "Domain Knowledge",
        status: "locked",
        estimatedHours: 28,
        difficulty: "Advanced",
        prerequisites: ["node-2", "node-3"],
        summary: "Aggregate security event logs, write Sigma detection rules, and automate incident response runbooks.",
        whatToLearnAndWhy: "Prevention is only half the battle; real organizations need rapid detection and containment within minutes of an adversary gaining initial access.",
        actionable: {
          weekendProject: {
            title: "Simulated SOC Detection Pipeline",
            description: "Deploy an ELK / Wazuh SIEM stack in Docker, ingest Windows Event Logs and Sysmon feeds, and write custom Sigma rules to alert on Mimikatz credential dumps.",
            deliverable: "Dockerized SIEM environment with alert triage dashboard and tested Sigma rules."
          },
          recommendedRepos: [
            { name: "SigmaHQ/sigma", url: "https://github.com/SigmaHQ/sigma", description: "Generic signature format for SIEM detection rules." }
          ],
          interviewQuestions: [
            {
              question: "What is the difference between an Indicator of Compromise (IoC) and an Indicator of Attack (IoA)?",
              idealAnswer: "IoCs are forensic artifacts of past compromise (hashes, IPs); IoAs identify proactive adversary intent and behavior in real-time regardless of specific malware."
            }
          ],
          skillsLearned: ["SIEM (Wazuh/ELK)", "Sigma Rules", "Sysmon Log Analysis", "Incident Response"],
          verifiedResources: [
            {
              name: "MITRE ATT&CK Framework",
              type: "Official Documentation",
              url: "https://attack.mitre.org/",
              isVerified: true,
              notes: "Globally accessible knowledge base of adversary tactics and techniques."
            }
          ]
        }
      },
      {
        id: "node-5",
        title: "Enterprise Zero-Trust Defense Capstone",
        phase: "Capstone & Portfolio",
        category: "Project",
        status: "locked",
        estimatedHours: 40,
        difficulty: "Advanced",
        prerequisites: ["node-4"],
        summary: "Deploy an end-to-end Zero-Trust architecture featuring Mutual TLS (mTLS), automated secret rotation, and intrusion containment.",
        whatToLearnAndWhy: "A capstone project proving you can design and defend complete organizational topologies, standing out dramatically from applicants who only possess textbook knowledge.",
        actionable: {
          weekendProject: {
            title: "AegisShield — Autonomous Zero-Trust Architecture",
            description: "Deploy a microservice cluster secured with HashiCorp Vault for dynamic secret injection, Envoy mTLS service mesh, and automated quarantine scripts upon alert triggers.",
            deliverable: "Public GitHub repository with complete Docker Compose / Kubernetes manifests and architecture defense deck."
          },
          recommendedRepos: [
            { name: "hashicorp/vault", url: "https://github.com/hashicorp/vault", description: "Tool for secrets management, encryption, and privileged access." }
          ],
          interviewQuestions: [
            {
              question: "Walk me through how you designed AegisShield to prevent lateral movement after an initial node compromise.",
              idealAnswer: "By implementing strict mTLS service-to-service authorization with SPIFFE identities and short-lived ephemeral tokens issued by HashiCorp Vault."
            }
          ],
          skillsLearned: ["Zero-Trust Architecture", "HashiCorp Vault", "Mutual TLS", "Defense-in-Depth"],
          verifiedResources: [
            {
              name: "NIST Special Publication 800-207 (Zero Trust)",
              type: "Official Documentation",
              url: "https://csrc.nist.gov/publications/detail/sp/800-207/final",
              isVerified: true,
              notes: "Authoritative architectural definition of Zero Trust Architecture standards."
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
  },
  "climate-tech": {
    metadata: {
      targetRole: "Full Stack Developer at a Climate Tech Startup",
      domain: "Climate Tech & Grid Analytics",
      weeklyCommitment: 12,
      totalEstimatedWeeks: 16,
      roleOverview: "Build high-throughput time-series dashboards for solar/wind microgrids, carbon accounting APIs, and IoT sensor telemetry pipelines.",
      whyThisPath: "Traditional web dev teaches CRUD apps. Climate tech requires streaming time-series data, geospatial map visualizations, and carbon calculation standards (GHG Protocol).",
      generationMode: "synthesized-fallback"
    },
    nodes: [
      {
        id: "node-1",
        title: "Modern TypeScript & Async Systems",
        phase: "Foundation",
        category: "Language",
        status: "unlocked", // Starts Active!
        estimatedHours: 25,
        difficulty: "Beginner",
        prerequisites: [],
        summary: "Robust type systems for modeling real-world physical sensor devices and asynchronous event streams.",
        whatToLearnAndWhy: "IoT microgrids stream asynchronous metrics with variable schema quality. Type safety prevents runtime parsing failures that disrupt live solar telemetry monitoring.",
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
          skillsLearned: ["TypeScript Generics", "Zod", "Async/Await", "Error Boundaries"],
          verifiedResources: [
            {
              name: "Official TypeScript Handbook",
              type: "Official Documentation",
              url: "https://www.typescriptlang.org/docs/handbook/intro.html",
              isVerified: true,
              notes: "The authoritative language specification and type system reference."
            },
            {
              name: "GHG Protocol Corporate Standard",
              type: "Official Documentation",
              url: "https://ghgprotocol.org/corporate-standard",
              isVerified: true,
              notes: "The global official standard for measuring corporate greenhouse gas emissions."
            }
          ]
        }
      },
      {
        id: "node-2",
        title: "High-Frequency Time-Series DBs",
        phase: "Core Architecture",
        category: "Architecture",
        status: "locked",
        estimatedHours: 35,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Storing millions of solar/wind telemetry datapoints per minute using TimescaleDB or ClickHouse instead of standard Postgres tables.",
        whatToLearnAndWhy: "Relational B-Tree indexes degrade severely under millions of daily timestamp writes. Time-series hypertables automate chunk partitioning and continuous aggregate rollups.",
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
          skillsLearned: ["TimescaleDB", "Hypertables", "Continuous Aggregates", "Data Retention Policies"],
          verifiedResources: [
            {
              name: "TimescaleDB Documentation",
              type: "Official Documentation",
              url: "https://docs.timescale.com/",
              isVerified: true,
              notes: "Architecture guides and hypertable best practices."
            }
          ]
        }
      },
      {
        id: "node-3",
        title: "Geospatial Data & Map Visualizations",
        phase: "Core Architecture",
        category: "Framework",
        status: "locked",
        estimatedHours: 30,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Displaying live solar farms, wind turbine statuses, and transmission line heatmaps using Mapbox GL and Deck.gl.",
        whatToLearnAndWhy: "Energy infrastructure is geographic. Hiring managers expect candidates who can render 100k+ point coordinates with GPU instancing rather than sluggish SVG elements.",
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
              idealAnswer: "Offload rendering to WebGL using GPU instanced point clouds (e.g., Deck.gl ScatterplotLayer) and vector tile services."
            }
          ],
          skillsLearned: ["Deck.gl", "Mapbox GL JS", "GeoJSON", "GPU Instancing"],
          verifiedResources: [
            {
              name: "Deck.gl Official Documentation",
              type: "Official Documentation",
              url: "https://deck.gl/docs",
              isVerified: true,
              notes: "GPU-powered data visualization framework docs."
            }
          ]
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
        whatToLearnAndWhy: "Enterprise carbon compliance requires strict mathematical audits using regional emission factor tables (EPA eGRID / UK DEFRA).",
        actionable: {
          weekendProject: {
            title: "Automated Scope 2 Carbon Emissions Calculator",
            description: "A RESTful microservice that takes electricity bill kWh inputs, matches them with regional grid emission factors, and computes MTCO2e emissions.",
            deliverable: "Microservice with open OpenAPI/Swagger specs and unit-tested emission conversions."
          },
          recommendedRepos: [
            { name: "climatiq/climatiq-python", url: "https://github.com/climatiq/climatiq-python", description: "Open climate intelligence calculations API." }
          ],
          interviewQuestions: [
            {
              question: "Explain the difference between location-based and market-based Scope 2 emissions reporting.",
              idealAnswer: "Location-based reflects average grid emissions where electricity is consumed; market-based factors in contractual instruments like RECs and green tariffs."
            }
          ],
          skillsLearned: ["GHG Protocol", "Emission Factors", "Carbon Auditing", "Compliance Schemas"],
          verifiedResources: [
            {
              name: "EPA eGRID Datasets",
              type: "Official Documentation",
              url: "https://www.epa.gov/egrid",
              isVerified: true,
              notes: "Emissions & Generation Resource Integrated Database official factors."
            }
          ]
        }
      },
      {
        id: "node-5",
        title: "Production Grid Ops Capstone",
        phase: "Capstone & Portfolio",
        category: "Project",
        status: "locked",
        estimatedHours: 45,
        difficulty: "Advanced",
        prerequisites: ["node-3", "node-4"],
        summary: "A production-grade, end-to-end Microgrid Telemetry & Carbon Accounting Platform ready to showcase in interviews.",
        whatToLearnAndWhy: "Tie your entire stack together into a cohesive SaaS deployment that immediately proves your readiness for climate-tech startups.",
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
          skillsLearned: ["System Architecture", "End-to-End Delivery", "Observability", "Portfolio Presentation"],
          verifiedResources: [
            {
              name: "Open Climate Fix Community Docs",
              type: "Course / Guide",
              url: "https://openclimatefix.org/",
              isVerified: true,
              notes: "Open source AI models and solar forecasting infrastructure."
            }
          ]
        }
      }
    ],
    edges: [
      { id: "e1-2", source: "node-1", target: "node-2" },
      { id: "e1-3", source: "node-1", target: "node-3" },
      { id: "e2-4", source: "node-2", target: "node-4" },
      { id: "e3-5", source: "node-3", target: "node-5" },
      { id: "e4-5", source: "node-4", target: "node-5" }
    ]
  },
  "ai-agents": {
    metadata: {
      targetRole: "Autonomous AI Agent Engineer",
      domain: "AI Systems & Multi-Agent Orchestration",
      weeklyCommitment: 15,
      totalEstimatedWeeks: 14,
      roleOverview: "Design, build, and deploy multi-agent systems with tool-calling capabilities, memory persistence, human-in-the-loop validation, and latency optimization.",
      whyThisPath: "Basic tutorials only teach simple prompt wrappers. True agent engineering requires deterministic state machines, vector search with re-ranking, and evals.",
      generationMode: "synthesized-fallback"
    },
    nodes: [
      {
        id: "node-1",
        title: "Python Async & Type Safe Architectures",
        phase: "Foundation",
        category: "Language",
        status: "unlocked", // Starts Active!
        estimatedHours: 20,
        difficulty: "Beginner",
        prerequisites: [],
        summary: "Pydantic V2 schema validation and asyncio for concurrent LLM tool execution.",
        whatToLearnAndWhy: "Agents frequently trigger concurrent external API tools. Asynchronous concurrency and strict schema validation guarantee type safety without halting the main agent process.",
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
          skillsLearned: ["Pydantic V2", "Asyncio", "Type Hints", "JSON Schema"],
          verifiedResources: [
            {
              name: "Official Python Asyncio Documentation",
              type: "Official Documentation",
              url: "https://docs.python.org/3/library/asyncio.html",
              isVerified: true,
              notes: "Asynchronous I/O, event loop, and coroutine specifications."
            },
            {
              name: "Pydantic V2 Documentation",
              type: "Official Documentation",
              url: "https://docs.pydantic.dev/latest/",
              isVerified: true,
              notes: "Fast, ergonomic type validation for Python."
            }
          ]
        }
      },
      {
        id: "node-2",
        title: "Hybrid Vector Search & Re-ranking (RAG)",
        phase: "Core Architecture",
        category: "Architecture",
        status: "locked",
        estimatedHours: 30,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Dense embedding retrieval combined with BM25 sparse keyword search and cross-encoder re-ranking.",
        whatToLearnAndWhy: "Pure semantic vector retrieval misses exact technical terms and code snippets. Hybrid search ensures both conceptual understanding and precise token matching.",
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
              idealAnswer: "Dense search fails on exact keywords, version numbers, and error codes. Hybrid search couples sparse BM25 keyword matching with semantic vector proximity."
            }
          ],
          skillsLearned: ["Qdrant", "BM25", "Cross-Encoders", "Chunking Strategies"],
          verifiedResources: [
            {
              name: "Qdrant Vector Database Documentation",
              type: "Official Documentation",
              url: "https://qdrant.tech/documentation/",
              isVerified: true,
              notes: "Vector search engine guides and hybrid search tutorials."
            }
          ]
        }
      },
      {
        id: "node-3",
        title: "Cyclic State Machines (LangGraph & AutoGen)",
        phase: "Core Architecture",
        category: "Framework",
        status: "locked",
        estimatedHours: 35,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Moving beyond simple linear chains to graph-based multi-turn agent state machines with conditional routing.",
        whatToLearnAndWhy: "Real enterprise agents need loops, retries, and human verification before executing destructive tool actions.",
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
          skillsLearned: ["State Machines", "LangGraph", "Cyclic Routing", "Sandbox Execution"],
          verifiedResources: [
            {
              name: "LangGraph Documentation",
              type: "Official Documentation",
              url: "https://langchain-ai.github.io/langgraph/",
              isVerified: true,
              notes: "State-machine-based multi-agent orchestration."
            }
          ]
        }
      },
      {
        id: "node-4",
        title: "Autonomous DevSecOps Engineer Capstone",
        phase: "Capstone & Portfolio",
        category: "Project",
        status: "locked",
        estimatedHours: 40,
        difficulty: "Advanced",
        prerequisites: ["node-2", "node-3"],
        summary: "A production multi-agent system that reviews incoming GitHub Pull Requests, discovers security vulnerabilities, and commits suggested patches.",
        whatToLearnAndWhy: "An impressive, deployable portfolio asset that directly demonstrates agent operations, sandbox safety, and real developer workflow integration.",
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
          skillsLearned: ["Security Auditing", "GitHub Apps", "Sandboxing", "Production Agent Ops"],
          verifiedResources: [
            {
              name: "OWASP Top 10 for Large Language Model Applications",
              type: "Official Documentation",
              url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
              isVerified: true,
              notes: "Standard security vulnerabilities in LLM and agent architectures."
            }
          ]
        }
      }
    ],
    edges: [
      { id: "e1-2", source: "node-1", target: "node-2" },
      { id: "e1-3", source: "node-1", target: "node-3" },
      { id: "e2-4", source: "node-2", target: "node-4" },
      { id: "e3-4", source: "node-3", target: "node-4" }
    ]
  },
  "java-developer": {
    metadata: {
      targetRole: "Java & Spring Boot Developer",
      domain: "Enterprise Backend Systems & Spring Boot 3 Microservices",
      weeklyCommitment: 12,
      totalEstimatedWeeks: 16,
      roleOverview: "Architect production-grade enterprise RESTful APIs using Spring Boot 3, optimize relational persistence with Hibernate and Spring Data JPA, secure microservices with Spring Security, and scale with Apache Kafka.",
      whyThisPath: "Companies hiring Java developers do not just test basic syntax; they evaluate candidates on Spring Boot 3 autoconfiguration, JPA N+1 query elimination, stateless JWT security, and event-driven microservices with Kafka.",
      generationMode: "synthesized-fallback"
    },
    nodes: [
      {
        id: "node-1",
        title: "Modern Core Java & JVM Architecture (Virtual Threads & Concurrency)",
        phase: "Foundation",
        category: "Language",
        status: "unlocked",
        estimatedHours: 25,
        difficulty: "Beginner",
        prerequisites: [],
        summary: "Master Java 17/21 LTS features (Records, Pattern Matching), Virtual Threads (Project Loom), JVM Garbage Collection (G1/ZGC), and memory layout.",
        whatToLearnAndWhy: "Enterprise Java requires deep understanding of JVM memory mechanics, classloaders, and how virtual threads scale to high concurrent request loads without thread starvation.",
        actionable: {
          weekendProject: {
            title: "High-Concurrency Virtual Threads Benchmark Engine",
            description: "Build a non-blocking multi-threaded task processor using Java 21 Virtual Threads and ExecutorService with zero external libraries, benchmarking 50,000 concurrent requests.",
            deliverable: "Maven/Gradle repository with JMH (Java Microbenchmark Harness) performance reports and unit tests."
          },
          recommendedRepos: [
            { name: "openjdk/jdk", url: "https://github.com/openjdk/jdk", description: "Official OpenJDK repository." }
          ],
          interviewQuestions: [
            {
              question: "How do Java 21 Virtual Threads differ from traditional platform threads, and how does the JVM schedule them over carrier threads?",
              idealAnswer: "Platform threads are 1:1 OS kernel threads with 1MB stack memory; Virtual Threads are M:N lightweight green threads managed by the JVM (ForkJoinPool) with tiny ephemeral stacks, preventing thread exhaustion under blocking I/O."
            }
          ],
          skillsLearned: ["Core Java", "Java 21 LTS", "Virtual Threads", "JVM Memory Model", "OOP & Design Patterns", "Data Structures"],
          verifiedResources: [
            {
              name: "Oracle Official Java Documentation",
              type: "Official Documentation",
              url: "https://docs.oracle.com/en/java/",
              isVerified: true,
              notes: "Authoritative language specification and JVM runtime reference."
            }
          ]
        }
      },
      {
        id: "node-2",
        title: "Spring Boot 3 Core, IoC & RESTful Microservices",
        phase: "Core Architecture",
        category: "Framework",
        status: "locked",
        estimatedHours: 35,
        difficulty: "Intermediate",
        prerequisites: ["node-1"],
        summary: "Build production REST APIs with Spring Boot 3, Dependency Injection (DI), Spring MVC, custom DTO validation, and Actuator observability.",
        whatToLearnAndWhy: "Spring Boot is the global enterprise standard for Java services. Hiring teams focus on bean lifecycles, configuration properties, exception handling (@ControllerAdvice), and actuator health endpoints.",
        actionable: {
          weekendProject: {
            title: "Production Spring Boot 3 Multi-Tier REST API",
            description: "Build a layered REST service with Spring Boot 3 featuring request validation, custom exception advisors, Actuator telemetry endpoints, and automated OpenAPI 3.0 documentation.",
            deliverable: "Spring Boot GitHub repository with OpenAPI/Swagger UI and MockMvc automated integration test suites."
          },
          recommendedRepos: [
            { name: "spring-projects/spring-boot", url: "https://github.com/spring-projects/spring-boot", description: "Spring Boot official framework repository." }
          ],
          interviewQuestions: [
            {
              question: "Explain the Spring Bean lifecycle and the distinction between @Component, @Service, and @Repository.",
              idealAnswer: "Beans instantiate, inject dependencies, run @PostConstruct, serve traffic, and cleanup via @PreDestroy. @Service holds business logic, @Repository translates database SQLExceptions into Spring's unified DataAccessException hierarchy."
            }
          ],
          skillsLearned: ["Spring Boot 3", "Spring Framework", "Inversion of Control (IoC)", "Dependency Injection", "Spring MVC", "OpenAPI / Swagger"],
          verifiedResources: [
            {
              name: "Spring Boot 3 Official Reference Guide",
              type: "Official Documentation",
              url: "https://docs.spring.io/spring-boot/docs/current/reference/html/",
              isVerified: true,
              notes: "Official Spring Boot reference documentation."
            }
          ]
        }
      },
      {
        id: "node-3",
        title: "Spring Data JPA, Hibernate ORM & PostgreSQL Optimization",
        phase: "Core Architecture",
        category: "Architecture",
        status: "locked",
        estimatedHours: 32,
        difficulty: "Intermediate",
        prerequisites: ["node-2"],
        summary: "Model relational databases with JPA entities, optimize Hibernate queries, eliminate N+1 query traps, configure HikariCP, and run Flyway migrations.",
        whatToLearnAndWhy: "Over 50% of enterprise Java interview questions center on ORM performance. Developers must know when to use JPQL, native queries, fetch joins, and how to prevent connection leaks.",
        actionable: {
          weekendProject: {
            title: "High-Throughput Financial Ledger with JPA & HikariCP",
            description: "Implement optimistic locking (@Version), transaction propagation (@Transactional), and database versioning using Flyway, handling concurrent account balance debits without race conditions.",
            deliverable: "Dockerized PostgreSQL integration with Flyway migration scripts and Testcontainers automated test suite."
          },
          recommendedRepos: [
            { name: "hibernate/hibernate-orm", url: "https://github.com/hibernate/hibernate-orm", description: "Core Hibernate ORM repository." }
          ],
          interviewQuestions: [
            {
              question: "What is the N+1 problem in Hibernate and how do you resolve it using JOIN FETCH or @EntityGraph?",
              idealAnswer: "It occurs when loading N child entities triggers N additional SQL select queries. Resolved using JOIN FETCH in JPQL or declaring @EntityGraph to load relations in a single SQL query."
            }
          ],
          skillsLearned: ["Spring Data JPA", "Hibernate ORM", "Flyway Migrations", "HikariCP", "N+1 Optimization", "Testcontainers"],
          verifiedResources: [
            {
              name: "Spring Data JPA Official Documentation",
              type: "Official Documentation",
              url: "https://spring.io/projects/spring-data-jpa",
              isVerified: true,
              notes: "Official guide on repositories, query methods, and JPA transaction management."
            }
          ]
        }
      },
      {
        id: "node-4",
        title: "Enterprise Security: Spring Security 6, JWT & RBAC",
        phase: "Specialization",
        category: "Framework",
        status: "locked",
        estimatedHours: 28,
        difficulty: "Advanced",
        prerequisites: ["node-3"],
        summary: "Secure enterprise APIs with Spring Security 6 filter chains, stateless JWT token issuing, BCrypt password hashing, and Role-Based Access Control (@PreAuthorize).",
        whatToLearnAndWhy: "Enterprise backends cannot use vulnerable basic auth. You must know how to implement custom SecurityFilterChain beans, handle CORS/CSRF, and invalidate compromised tokens in distributed systems.",
        actionable: {
          weekendProject: {
            title: "Stateless OAuth2 / JWT Enterprise Authentication Gateway",
            description: "Build a standalone authentication microservice with refresh token rotation, Redis token blacklist, and rate-limiting bucket filters.",
            deliverable: "Secure Spring Security microservice with Postman test collection and automated integration tests."
          },
          recommendedRepos: [
            { name: "spring-projects/spring-security", url: "https://github.com/spring-projects/spring-security", description: "Spring Security official repository." }
          ],
          interviewQuestions: [
            {
              question: "How does the Spring Security Filter Chain intercept requests and why is JWT preferred over HTTP sessions in microservices?",
              idealAnswer: "Requests traverse the SecurityFilterChain. JWT is stateless and digitally signed, allowing independent microservices to validate authorization claims without shared session databases."
            }
          ],
          skillsLearned: ["Spring Security 6", "SecurityFilterChain", "JWT & OAuth2", "Role-Based Access Control (RBAC)", "BCrypt Hashing"],
          verifiedResources: [
            {
              name: "Spring Security Official Reference Documentation",
              type: "Official Documentation",
              url: "https://docs.spring.io/spring-security/reference/",
              isVerified: true,
              notes: "Authoritative architectural guide for modern Java application security."
            }
          ]
        }
      },
      {
        id: "node-5",
        title: "Distributed Event Streaming with Apache Kafka & Spring Cloud",
        phase: "Specialization",
        category: "Architecture",
        status: "locked",
        estimatedHours: 35,
        difficulty: "Advanced",
        prerequisites: ["node-3"],
        summary: "Build asynchronous microservices with Spring Cloud (Gateway, Discovery) and Apache Kafka message streaming with idempotency and dead-letter queues.",
        whatToLearnAndWhy: "High-scale enterprise Java systems communicate asynchronously via event-driven messaging (Kafka) with circuit breaker fallbacks (Resilience4j) rather than fragile synchronous chains.",
        actionable: {
          weekendProject: {
            title: "Event-Driven Order Processing Pipeline with Kafka & Resilience4j",
            description: "Build an Order Service and Inventory Service communicating asynchronously via Kafka topics, with Resilience4j circuit breakers handling inventory service downtime.",
            deliverable: "Docker Compose cluster running Kafka, Zookeeper/KRaft, and Spring Boot microservices with end-to-end integration tests."
          },
          recommendedRepos: [
            { name: "spring-cloud/spring-cloud-gateway", url: "https://github.com/spring-cloud/spring-cloud-gateway", description: "Spring Cloud Gateway repository." }
          ],
          interviewQuestions: [
            {
              question: "How do you prevent message loss and ensure at-least-once delivery with Apache Kafka in Spring Boot?",
              idealAnswer: "Set acks=all on KafkaProducer, configure min.insync.replicas=2, use manual acknowledgment on consumer, and enforce idempotent consumer processing with unique message keys."
            }
          ],
          skillsLearned: ["Apache Kafka", "Spring Cloud Gateway", "Resilience4j", "Event-Driven Architecture", "Circuit Breakers"],
          verifiedResources: [
            {
              name: "Apache Kafka Official Documentation",
              type: "Official Documentation",
              url: "https://kafka.apache.org/documentation/",
              isVerified: true,
              notes: "Production distributed event streaming platform specifications."
            }
          ]
        }
      },
      {
        id: "node-6",
        title: "Enterprise Production Spring Boot Microservices Capstone",
        phase: "Capstone & Portfolio",
        category: "Project",
        status: "locked",
        estimatedHours: 40,
        difficulty: "Advanced",
        prerequisites: ["node-4", "node-5"],
        summary: "Deploy an end-to-end enterprise platform featuring Spring Boot 3, Spring Data JPA, Spring Security, Kafka event streaming, Redis caching, and Prometheus/Grafana observability on Docker.",
        whatToLearnAndWhy: "The ultimate interview showcase: a live deployed Java microservices platform that proves you can architect real-world enterprise software like a senior engineer.",
        actionable: {
          weekendProject: {
            title: "ApexEnterprise — Distributed Banking & Payment Microservices",
            description: "Deploy a multi-service Spring Boot ecosystem with API Gateway, JWT auth, Kafka distributed transactions, PostgreSQL ACID compliance, and Prometheus metrics.",
            deliverable: "Complete GitHub repository with Docker Compose manifests, CI/CD GitHub Actions, and an architecture deck for interview presentations."
          },
          recommendedRepos: [
            { name: "spring-petclinic/spring-petclinic-microservices", url: "https://github.com/spring-petclinic/spring-petclinic-microservices", description: "Spring PetClinic Microservices reference implementation." }
          ],
          interviewQuestions: [
            {
              question: "Walk me through how you handled distributed transactions across microservices in your capstone project without 2-phase commit (2PC).",
              idealAnswer: "Using the Saga Pattern with choreographed Kafka events and compensating transactions to ensure eventual data consistency across autonomous database instances."
            }
          ],
          skillsLearned: ["Enterprise Microservices", "Saga Pattern", "Docker & Kubernetes Deployment", "Prometheus & Grafana", "Architecture Defense"],
          verifiedResources: [
            {
              name: "Spring PetClinic Microservices Reference",
              type: "Course / Guide",
              url: "https://github.com/spring-petclinic/spring-petclinic-microservices",
              isVerified: true,
              notes: "Official canonical multi-service Spring Boot reference implementation."
            }
          ]
        }
      }
    ],
    edges: [
      { id: "e1-2", source: "node-1", target: "node-2" },
      { id: "e2-3", source: "node-2", target: "node-3" },
      { id: "e3-4", source: "node-3", target: "node-4" },
      { id: "e3-5", source: "node-3", target: "node-5" },
      { id: "e4-6", source: "node-4", target: "node-6" },
      { id: "e5-6", source: "node-5", target: "node-6" }
    ]
  }
};
