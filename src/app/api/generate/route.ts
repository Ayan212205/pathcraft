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
    const applyKnownSkills = (
      graph: RoadmapGraph,
      mode: "gemini-live" | "synthesized-fallback"
    ): RoadmapGraph => {
      let baseGraph = { ...graph };

      if (Array.isArray(knownSkills) && knownSkills.length > 0) {
        const lowerKnown = knownSkills
          .map((s: string) => s.toLowerCase().trim())
          .filter(Boolean);

        if (lowerKnown.length > 0) {
          const updatedNodes = baseGraph.nodes.map((node) => {
            const isFoundation = node.phase === "Foundation" || node.category === "Language";
            const isCapstone = node.phase === "Capstone & Portfolio";

            const matches = lowerKnown.some((k) => {
              const cleanK = k.trim().toLowerCase();
              if (!cleanK) return false;

              // Check if keyword is a broad programming language or academic concept
              const isGeneralLangOrConcept = [
                "java", "python", "javascript", "typescript", "c++", "c#", "go", "rust",
                "oop", "object oriented programing", "object oriented programming",
                "dsa", "data structure", "data structures", "data structure and algorithm",
                "data structures and algorithms", "coding", "programming", "sql", "linux", "git"
              ].includes(cleanK);

              if (isGeneralLangOrConcept) {
                // Broad language/concept ONLY bypasses foundational / language milestones
                if (!isFoundation) return false;

                const nodeText = `${node.title} ${node.actionable.skillsLearned.join(" ")}`.toLowerCase();
                return nodeText.includes(cleanK);
              }

              // Advanced framework keywords (like "spring", "spring boot", "kafka", "docker", "hibernate")
              if (isCapstone) return false;

              const nodeKeywords = [
                node.title.toLowerCase(),
                ...node.actionable.skillsLearned.map((s) => s.toLowerCase())
              ];

              return nodeKeywords.some((kw) => kw.includes(cleanK) || cleanK.includes(kw));
            });

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

          baseGraph = {
            ...baseGraph,
            nodes: recalibratedNodes,
          };
        }
      }

      const totalRemainingHours = baseGraph.nodes
        .filter((n) => n.status !== "completed")
        .reduce((sum, n) => sum + n.estimatedHours, 0);

      const computedWeeks = Math.ceil(totalRemainingHours / (weeklyHours || 12)) || baseGraph.metadata.totalEstimatedWeeks;

      return {
        ...baseGraph,
        metadata: {
          ...baseGraph.metadata,
          targetRole: graph.metadata.targetRole || targetRole,
          weeklyCommitment: weeklyHours,
          totalEstimatedWeeks: computedWeeks,
          candidateProfile: {
            experienceLevel,
            knownSkills,
          },
          generationMode: mode,
        },
      };
    };

    // Synthesized domain fallback builder (Multi-domain ontology for resilient offline/no-key evaluation)
    const getDomainFallback = (): RoadmapGraph => {
      // 0. Java & Spring Boot Developer (Full Beginning-to-End Enterprise Path)
      if (
        cleanRole.includes("java") ||
        cleanRole.includes("spring") ||
        cleanRole.includes("springboot") ||
        cleanRole.includes("jvm") ||
        cleanRole.includes("hibernate")
      ) {
        return sampleRoadmaps["java-developer"];
      }

      // 1. Cyber Security
      if (
        cleanRole.includes("cyber") ||
        cleanRole.includes("security") ||
        cleanRole.includes("penetration") ||
        cleanRole.includes("soc") ||
        cleanRole.includes("infosec")
      ) {
        return sampleRoadmaps["cyber-security"];
      }

      // 2. Climate Tech
      if (
        cleanRole.includes("climate") ||
        cleanRole.includes("green") ||
        cleanRole.includes("carbon") ||
        cleanRole.includes("renewable")
      ) {
        return sampleRoadmaps["climate-tech"];
      }

      // 3. AI Agents
      if (
        cleanRole.includes("agent") ||
        cleanRole.includes("autonomous") ||
        cleanRole.includes("llm") ||
        cleanRole.includes("langchain")
      ) {
        return sampleRoadmaps["ai-agents"];
      }

      // 4. DevOps / SRE / Cloud Platform
      if (
        cleanRole.includes("devops") ||
        cleanRole.includes("sre") ||
        cleanRole.includes("cloud") ||
        cleanRole.includes("infrastructure") ||
        cleanRole.includes("platform") ||
        cleanRole.includes("kubernetes")
      ) {
        return {
          metadata: {
            targetRole: "DevOps & Cloud Platform Engineer",
            domain: "Cloud Infrastructure, Container Orchestration & CI/CD",
            weeklyCommitment: weeklyHours,
            totalEstimatedWeeks: 15,
            roleOverview: "Design high-availability cloud infrastructure, automate deployment pipelines with GitOps, and scale Kubernetes clusters with enterprise observability.",
            whyThisPath: "Companies hire DevOps engineers who understand container runtimes, immutable infrastructure as code (Terraform), and production telemetry—not just basic shell scripts.",
          },
          nodes: [
            {
              id: "node-1",
              title: "Linux Kernel Internals, Networking & Bash Automation",
              phase: "Foundation",
              category: "Language",
              status: "unlocked",
              estimatedHours: 25,
              difficulty: "Beginner",
              prerequisites: [],
              summary: "Master Linux namespaces, cgroups, systemd services, TCP socket diagnostics, and robust Bash shell scripting.",
              whatToLearnAndWhy: "Containers are simply isolated Linux processes governed by namespaces and cgroups. Without understanding OS primitives, debugging pod crashes in Kubernetes is impossible.",
              actionable: {
                weekendProject: {
                  title: "Self-Healing Linux System Health Daemon",
                  description: "Write a Bash/Python daemon that monitors CPU/memory thresholds, auto-rotates logs, and fires webhook alerts to Discord/Slack upon anomalies.",
                  deliverable: "Systemd service manifest with automated automated test suites and alert logs."
                },
                recommendedRepos: [
                  { name: "dylanaraps/pure-bash-bible", url: "https://github.com/dylanaraps/pure-bash-bible", description: "POSIX-compliant bash scripting guide." }
                ],
                interviewQuestions: [
                  {
                    question: "Explain the difference between Linux cgroups and namespaces in container isolation.",
                    idealAnswer: "Namespaces isolate what a process can see (network, mount points, PID tree); cgroups control how much hardware resources a process can consume (CPU, RAM, I/O)."
                  }
                ],
                skillsLearned: ["Linux Systemd", "Cgroups & Namespaces", "Bash Automation", "Network Triage"],
                verifiedResources: [
                  {
                    name: "Linux Foundation Sysadmin Course Reference",
                    type: "Official Documentation",
                    url: "https://www.kernel.org/doc/html/latest/",
                    isVerified: true,
                    notes: "Official Linux kernel administration and runtime documentation."
                  }
                ]
              }
            },
            {
              id: "node-2",
              title: "Docker Microservices & Multi-Stage Builds",
              phase: "Core Architecture",
              category: "Framework",
              status: "locked",
              estimatedHours: 28,
              difficulty: "Intermediate",
              prerequisites: ["node-1"],
              summary: "Containerize microservices with multi-stage Dockerfiles, minimize image attack surfaces, and orchestrate with Docker Compose.",
              whatToLearnAndWhy: "Enterprise cloud teams require production Docker images under 50MB with zero root vulnerabilities using distroless bases.",
              actionable: {
                weekendProject: {
                  title: "Hardened Polyglot Microservices Sandbox",
                  description: "Containerize a Node.js + Go microservices app with multi-stage builds, non-root user execution, and vulnerability scanning with Trivy.",
                  deliverable: "Docker Compose setup with Trivy automated vulnerability scan reports."
                },
                recommendedRepos: [
                  { name: "aquasecurity/trivy", url: "https://github.com/aquasecurity/trivy", description: "Comprehensive security scanner for container images." }
                ],
                interviewQuestions: [
                  {
                    question: "Why should you avoid running containers as root and how do multi-stage builds mitigate this?",
                    idealAnswer: "Root in container is UID 0 on host; multi-stage builds discard compilers, package managers, and run the final binary under a non-privileged UID."
                  }
                ],
                skillsLearned: ["Multi-Stage Builds", "Distroless Containers", "Trivy Scanning", "Docker Compose"],
                verifiedResources: [
                  {
                    name: "Docker Official Best Practices Guide",
                    type: "Official Documentation",
                    url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/",
                    isVerified: true,
                    notes: "Official production Docker image optimization standards."
                  }
                ]
              }
            },
            {
              id: "node-3",
              title: "Infrastructure as Code (Terraform) & Cloud IAM",
              phase: "Core Architecture",
              category: "Architecture",
              status: "locked",
              estimatedHours: 35,
              difficulty: "Intermediate",
              prerequisites: ["node-1"],
              summary: "Provision repeatable cloud infrastructure across AWS/GCP with modular Terraform, remote state locking, and least-privilege IAM.",
              whatToLearnAndWhy: "Manual AWS console clicks create configuration drift. Hiring managers expect Infrastructure as Code (IaC) with automated plan/apply checks in pull requests.",
              actionable: {
                weekendProject: {
                  title: "Terraform Production VPC & Cluster Blueprint",
                  description: "Write modular Terraform modules for multi-AZ VPC, private subnets, NAT gateways, and S3 backend with DynamoDB state locking.",
                  deliverable: "GitHub repository with Terraform CI/CD automated linting (tflint) and automated unit tests."
                },
                recommendedRepos: [
                  { name: "terraform-aws-modules/terraform-aws-vpc", url: "https://github.com/terraform-aws-modules/terraform-aws-vpc", description: "Industry standard AWS VPC Terraform module." }
                ],
                interviewQuestions: [
                  {
                    question: "How do you handle sensitive secrets and state file security in Terraform?",
                    idealAnswer: "Never commit plaintext secrets; use HashiCorp Vault or AWS KMS encrypted S3 backends with DynamoDB locking and short-lived assumed IAM roles."
                  }
                ],
                skillsLearned: ["Terraform HCL", "State Locking", "AWS VPC Architecture", "Least-Privilege IAM"],
                verifiedResources: [
                  {
                    name: "HashiCorp Terraform Documentation",
                    type: "Official Documentation",
                    url: "https://developer.hashicorp.com/terraform/docs",
                    isVerified: true,
                    notes: "Authoritative language specs and cloud provider architecture guides."
                  }
                ]
              }
            },
            {
              id: "node-4",
              title: "Kubernetes Orchestration & Helm Packaging",
              phase: "Specialization",
              category: "Framework",
              status: "locked",
              estimatedHours: 40,
              difficulty: "Advanced",
              prerequisites: ["node-2", "node-3"],
              summary: "Deploy resilient stateful and stateless workloads on Kubernetes with custom Helm charts, Horizontal Pod Autoscalers (HPA), and ingress controllers.",
              whatToLearnAndWhy: "Kubernetes is the undisputed operating system of modern cloud computing. You need to prove you can handle zero-downtime rolling updates and liveness/readiness probes.",
              actionable: {
                weekendProject: {
                  title: "Production Helm Chart & Canary Deployment",
                  description: "Package a production service into a reusable Helm chart featuring automated HPA scaling, Pod Disruption Budgets, and TLS ingress via Cert-Manager.",
                  deliverable: "Tested Helm chart running on local Minikube/Kind with rolling update verification."
                },
                recommendedRepos: [
                  { name: "kubernetes/kubernetes", url: "https://github.com/kubernetes/kubernetes", description: "Production-Grade Container Scheduling and Management." }
                ],
                interviewQuestions: [
                  {
                    question: "What is the difference between a Liveness Probe and a Readiness Probe in Kubernetes?",
                    idealAnswer: "Liveness restarts failing pods that deadlock; readiness removes unhealthy pods from traffic service routing until they recover, preventing dropped user requests."
                  }
                ],
                skillsLearned: ["Kubernetes Workloads", "Helm Charts", "HPA Scaling", "Ingress Controllers"],
                verifiedResources: [
                  {
                    name: "Kubernetes Official Documentation",
                    type: "Official Documentation",
                    url: "https://kubernetes.io/docs/home/",
                    isVerified: true,
                    notes: "Authoritative cloud-native architecture specifications."
                  }
                ]
              }
            },
            {
              id: "node-5",
              title: "Enterprise GitOps (ArgoCD) & Observability (Prometheus/Grafana)",
              phase: "Capstone & Portfolio",
              category: "Project",
              status: "locked",
              estimatedHours: 42,
              difficulty: "Advanced",
              prerequisites: ["node-4"],
              summary: "Deploy an automated GitOps delivery pipeline with ArgoCD, instrument full-stack telemetry with Prometheus/Grafana, and configure SLO/SLA alerts.",
              whatToLearnAndWhy: "The final deliverable that wins cloud platform engineering interviews: a live, auto-syncing GitOps pipeline backed by real-time latency and error-budget dashboards.",
              actionable: {
                weekendProject: {
                  title: "ApexCloud — Enterprise GitOps & SRE Platform",
                  description: "Set up ArgoCD for automated declarative deployments, OpenTelemetry request tracing, and Prometheus alerting on 99.9% error-budget burn rates.",
                  deliverable: "Live cluster repository with public Grafana dashboard snapshot and architecture whitepaper."
                },
                recommendedRepos: [
                  { name: "argoproj/argo-cd", url: "https://github.com/argoproj/argo-cd", description: "Declarative continuous delivery for Kubernetes." }
                ],
                interviewQuestions: [
                  {
                    question: "Explain the four golden signals of monitoring and how you calculate error budgets.",
                    idealAnswer: "Latency, Traffic, Errors, and Saturation. Error budget is 100% minus the target SLA percentage over a rolling 30-day window."
                  }
                ],
                skillsLearned: ["ArgoCD GitOps", "Prometheus & Grafana", "SLO/SLA Error Budgets", "Production Observability"],
                verifiedResources: [
                  {
                    name: "Google SRE Book (Site Reliability Engineering)",
                    type: "Course / Guide",
                    url: "https://sre.google/sre-book/table-of-contents/",
                    isVerified: true,
                    notes: "The foundational industry standard on engineering dependable cloud systems."
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
      }

      // 5. Machine Learning / Data Science
      if (
        cleanRole.includes("data") ||
        cleanRole.includes("machine learning") ||
        cleanRole.includes("ml") ||
        cleanRole.includes("deep learning") ||
        cleanRole.includes("ai engineer")
      ) {
        return {
          metadata: {
            targetRole: "Machine Learning & AI Systems Engineer",
            domain: "Predictive Modeling, PyTorch Deep Learning & ML Systems",
            weeklyCommitment: weeklyHours,
            totalEstimatedWeeks: 16,
            roleOverview: "Design high-performance machine learning pipelines, train PyTorch neural networks, and deploy low-latency inference services with MLflow.",
            whyThisPath: "Junior candidates only run Kaggle Jupyter notebooks. Production AI teams test for vector processing, data leakage prevention, distributed training, and low-latency inference APIs.",
          },
          nodes: [
            {
              id: "node-1",
              title: "Scientific Python & Numerical Vectorization (NumPy/Pandas)",
              phase: "Foundation",
              category: "Language",
              status: "unlocked",
              estimatedHours: 25,
              difficulty: "Beginner",
              prerequisites: [],
              summary: "Master vectorized operations, broadcasting, memory alignment, and high-performance tabular manipulation in NumPy and Pandas.",
              whatToLearnAndWhy: "Looping through rows in Python is 100x slower than SIMD vector operations. Production ML engineering demands clean vectorized data math.",
              actionable: {
                weekendProject: {
                  title: "Vectorized Financial Market Backtester",
                  description: "Build a zero-loop backtesting engine in pure NumPy calculating Sharpe ratios, drawdowns, and portfolio volatility across 1M+ simulated trade records.",
                  deliverable: "GitHub repo with benchmark tests proving 50x speedup over iterative methods."
                },
                recommendedRepos: [
                  { name: "numpy/numpy", url: "https://github.com/numpy/numpy", description: "The fundamental package for scientific computing with Python." }
                ],
                interviewQuestions: [
                  {
                    question: "How does NumPy broadcasting work and what are the shape compatibility rules?",
                    idealAnswer: "Two dimensions are compatible if they are equal, or one of them is 1. Operations align trailing dimensions first and broadcast along axes of size 1."
                  }
                ],
                skillsLearned: ["NumPy Vectorization", "Broadcasting", "Pandas DataFrames", "Memory Profiling"],
                verifiedResources: [
                  {
                    name: "Official NumPy Documentation",
                    type: "Official Documentation",
                    url: "https://numpy.org/doc/stable/",
                    isVerified: true,
                    notes: "Authoritative numerical computing and array operations reference."
                  }
                ]
              }
            },
            {
              id: "node-2",
              title: "Feature Engineering, Cross-Validation & Scikit-Learn",
              phase: "Core Architecture",
              category: "Framework",
              status: "locked",
              estimatedHours: 32,
              difficulty: "Intermediate",
              prerequisites: ["node-1"],
              summary: "Handle missing values, encode high-cardinality categoricals, prevent data leakage, and train ensemble models (XGBoost/LightGBM).",
              whatToLearnAndWhy: "Most real-world enterprise ML problems are solved with gradient-boosted trees on tabular data rather than oversized neural networks.",
              actionable: {
                weekendProject: {
                  title: "Leakage-Free Credit Risk Scoring Pipeline",
                  description: "Construct a complete Scikit-Learn Pipeline with custom transformers, Target Encoding, stratified K-Fold cross-validation, and Optuna hyperparameter tuning.",
                  deliverable: "Model artifact with ROC-AUC curve report and SHAP interpretability plots."
                },
                recommendedRepos: [
                  { name: "scikit-learn/scikit-learn", url: "https://github.com/scikit-learn/scikit-learn", description: "Machine learning in Python." }
                ],
                interviewQuestions: [
                  {
                    question: "What is data leakage and how do Scikit-Learn Pipelines prevent it during feature scaling?",
                    idealAnswer: "Leakage occurs when test set signals leak into training. Pipelines fit transformers exclusively on training folds, applying transform only to evaluation folds."
                  }
                ],
                skillsLearned: ["XGBoost/LightGBM", "Data Leakage Prevention", "Optuna Tuning", "SHAP Values"],
                verifiedResources: [
                  {
                    name: "Scikit-Learn User Guide",
                    type: "Official Documentation",
                    url: "https://scikit-learn.org/stable/user_guide.html",
                    isVerified: true,
                    notes: "The definitive guide on statistical modeling and evaluation metrics."
                  }
                ]
              }
            },
            {
              id: "node-3",
              title: "Deep Learning Foundations & PyTorch Tensors",
              phase: "Core Architecture",
              category: "Framework",
              status: "locked",
              estimatedHours: 38,
              difficulty: "Intermediate",
              prerequisites: ["node-1"],
              summary: "Build custom neural network architectures in PyTorch, implement custom loss functions, and master backpropagation autograd graphs.",
              whatToLearnAndWhy: "Modern AI requires writing clean, debugging-ready PyTorch modules with GPU acceleration and gradient checkpointing.",
              actionable: {
                weekendProject: {
                  title: "Custom Multi-Head Self-Attention Transformer",
                  description: "Implement a decoder-only language model from scratch in PyTorch, verifying scaled dot-product attention math without high-level library shortcuts.",
                  deliverable: "PyTorch model repository with loss convergence graphs and inference notebook."
                },
                recommendedRepos: [
                  { name: "pytorch/pytorch", url: "https://github.com/pytorch/pytorch", description: "Tensors and Dynamic neural networks in Python." }
                ],
                interviewQuestions: [
                  {
                    question: "Why do we divide dot-product attention scores by the square root of the head dimension (sqrt(d_k))?",
                    idealAnswer: "To prevent dot products from growing excessively large for large dimensions, which would push the softmax function into regions with tiny gradients (gradient vanishing)."
                  }
                ],
                skillsLearned: ["PyTorch Autograd", "Self-Attention", "GPU Acceleration (CUDA)", "Loss Optimization"],
                verifiedResources: [
                  {
                    name: "Official PyTorch Tutorials & Specs",
                    type: "Official Documentation",
                    url: "https://pytorch.org/tutorials/",
                    isVerified: true,
                    notes: "Production deep learning workflows and distributed training documentation."
                  }
                ]
              }
            },
            {
              id: "node-4",
              title: "Vector Search, RAG & LLM Fine-Tuning",
              phase: "Specialization",
              category: "Architecture",
              status: "locked",
              estimatedHours: 35,
              difficulty: "Advanced",
              prerequisites: ["node-2", "node-3"],
              summary: "Build dense vector retrieval pipelines with Qdrant/Pinecone, implement cross-encoder re-ranking, and fine-tune models with LoRA/QLoRA.",
              whatToLearnAndWhy: "Enterprise AI revolves around grounding LLMs in proprietary domain data with hybrid semantic search and fine-tuned domain adapters.",
              actionable: {
                weekendProject: {
                  title: "Enterprise Regulatory Compliance RAG Engine",
                  description: "Construct a hybrid BM25 + dense embedding retrieval pipeline with Cohere re-ranking and hallucination evaluation benchmarks.",
                  deliverable: "Ragas evaluation benchmark score report with sub-300ms retrieval latency."
                },
                recommendedRepos: [
                  { name: "qdrant/qdrant", url: "https://github.com/qdrant/qdrant", description: "Vector Database for the next generation of AI." }
                ],
                interviewQuestions: [
                  {
                    question: "Explain the difference between Bi-Encoders and Cross-Encoders in semantic search.",
                    idealAnswer: "Bi-encoders encode queries and documents separately for fast vector indexing; cross-encoders process query and text jointly for high accuracy at higher compute cost."
                  }
                ],
                skillsLearned: ["Vector Databases", "Hybrid Search", "LoRA Fine-Tuning", "RAG Evals"],
                verifiedResources: [
                  {
                    name: "Hugging Face Transformers Documentation",
                    type: "Official Documentation",
                    url: "https://huggingface.co/docs/transformers/",
                    isVerified: true,
                    notes: "State-of-the-art machine learning model architectures and training recipes."
                  }
                ]
              }
            },
            {
              id: "node-5",
              title: "Production ML Inference API & MLflow Capstone",
              phase: "Capstone & Portfolio",
              category: "Project",
              status: "locked",
              estimatedHours: 42,
              difficulty: "Advanced",
              prerequisites: ["node-4"],
              summary: "Package trained models into high-throughput FastAPI inference microservices with ONNX runtime acceleration, Docker, and MLflow experiment tracking.",
              whatToLearnAndWhy: "The definitive interview-winning portfolio piece: a live deployed AI API with automated drift detection, model versioning, and sub-50ms inference times.",
              actionable: {
                weekendProject: {
                  title: "NeuroServe — Production Low-Latency ML Platform",
                  description: "Deploy an ONNX-optimized model behind FastAPI with Redis request batching, Prometheus telemetry, and automated CI model evaluations.",
                  deliverable: "Live deployed REST/gRPC API with load test benchmarks handling 500+ req/sec."
                },
                recommendedRepos: [
                  { name: "mlflow/mlflow", url: "https://github.com/mlflow/mlflow", description: "Open source platform for the machine learning lifecycle." }
                ],
                interviewQuestions: [
                  {
                    question: "How do you detect and mitigate data drift and concept drift in live production models?",
                    idealAnswer: "Monitor Kolmogorov-Smirnov test statistics on input feature distributions (data drift) and track ground-truth performance metrics over time (concept drift) to trigger automated retraining."
                  }
                ],
                skillsLearned: ["ONNX Runtime", "FastAPI Serving", "MLflow Registry", "Drift Detection"],
                verifiedResources: [
                  {
                    name: "Chip Huyen's Designing Machine Learning Systems",
                    type: "Course / Guide",
                    url: "https://chiphuyen.com/book-mlsys/",
                    isVerified: true,
                    notes: "Industry standard guide on production machine learning architecture."
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
      }

      // 6. Generic Parametric Synthesis (for any other custom role)
      const baseRole = targetRole.split(" ")[0] || "Software";
      const totalHours = 25 + 32 + 30 + 28 + 40;
      const estimatedWeeks = Math.ceil(totalHours / weeklyHours);

      return {
        metadata: {
          targetRole,
          domain: `${targetRole} Production Engineering`,
          weeklyCommitment: weeklyHours,
          totalEstimatedWeeks: estimatedWeeks,
          roleOverview: `Reverse-engineered stepping stones for ${targetRole}, calibrated for a ${experienceLevel} level candidate with hands-on deliverables.`,
          whyThisPath: `Tailored curriculum emphasizing actionable portfolio projects, system design trade-offs, and domain-specific tools over generic checklists.`,
        },
        nodes: [
          {
            id: "node-1",
            title: `Foundations & Core Paradigms of ${baseRole}`,
            phase: "Foundation",
            category: "Language",
            status: "unlocked",
            estimatedHours: 25,
            difficulty: "Beginner",
            prerequisites: [],
            summary: `Core foundational competencies, syntax idioms, and architectural mental models required for ${targetRole}.`,
            whatToLearnAndWhy: `Before touching complex enterprise distributed pipelines, you must master core language primitives, memory models, and async execution flows for ${targetRole}.`,
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
            title: `${baseRole} Data Pipelines & State Architecture`,
            phase: "Core Architecture",
            category: "Architecture",
            status: "locked",
            estimatedHours: 32,
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
            title: `${baseRole} Domain-Specific Tooling & Protocols`,
            phase: "Specialization",
            category: "Framework",
            status: "locked",
            estimatedHours: 30,
            difficulty: "Intermediate",
            prerequisites: ["node-1"],
            summary: `Specialized tools, protocols, and micro-credentials distinguishing candidates in ${targetRole}.`,
            whatToLearnAndWhy: `Generalist developers struggle because they don't know the exact domain libraries hiring managers test for in ${targetRole}.`,
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
            title: "Production Observability & Security Hardening",
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
    };

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is present and configured, call Gemini 1.5 Flash
    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
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
3. Provide realistic, non-generic advice: real architectures, concrete weekend projects, and actual interview questions specifically tailored to "${targetRole}".
4. SPECIALIZED ECOSYSTEM REQUIREMENTS:
   - For "Java Developer" / "Java Backend" / "Java Software Engineer": The roadmap MUST be a detailed, comprehensive beginning-to-end curriculum explicitly featuring Core Java (LTS), Spring Boot 3 Core, Spring Data JPA & Hibernate ORM, Spring Security 6 (JWT / OAuth2), Microservices (Spring Cloud), Apache Kafka event streaming, and an Enterprise Capstone! Do NOT return generic placeholders.
   - For "DevOps": Explicitly feature Linux, Docker, Terraform, Kubernetes, Helm, and GitOps.
   - For "Machine Learning": Explicitly feature NumPy, PyTorch, Transformers, Vector RAG, and FastAPI/MLflow serving.
5. Distinguish verified official documentation / resources with real URLs.

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
      "id": "node-1",
      "title": string,
      "phase": "Foundation" | "Core Architecture" | "Specialization" | "Capstone & Portfolio" | "Target Role",
      "category": "Language" | "Framework" | "Architecture" | "Project" | "Certification" | "Domain Knowledge",
      "status": "unlocked" | "locked",
      "estimatedHours": number,
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "prerequisites": string[],
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

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed: RoadmapGraph = JSON.parse(rawText);
            return NextResponse.json(applyKnownSkills(parsed, "gemini-live"));
          }
        }
      } catch (geminiError) {
        console.warn("Gemini live generation failed, seamlessly falling back to synthesized domain ontology:", geminiError);
      }
    }

    // Fallback mode: High-fidelity, demo-safe multi-domain synthesis
    const synthesizedGraph = getDomainFallback();
    return NextResponse.json(applyKnownSkills(synthesizedGraph, "synthesized-fallback"));

  } catch (error) {
    console.error("API error in /api/generate:", error);
    return NextResponse.json(sampleRoadmaps["cyber-security"]);
  }
}
