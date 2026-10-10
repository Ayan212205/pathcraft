# 🧭 PathCraft — Reverse-Engineered Career Roadmapper
> **Azisly.ai Hackathon 2026** | **Problem Statement #1** | Repository: [github.com/Ayan212205/pathcraft](https://github.com/Ayan212205/pathcraft)  
> **Final Submission State**: Completed, Tested & Production-Ready for 5:00 PM College Deadline.

---

## 1. What It Does
**PathCraft** reverse-engineers a student's hyper-specific dream job (such as *"Cyber Security Engineer"*, *"Full Stack Developer at a Climate Tech Startup"*, or *"Autonomous AI Agent Engineer"*) into a gamified, interactive visual skill tree.

Instead of static, generic text checklists like traditional career advice sites, PathCraft generates **dynamic Directed Acyclic Graphs (DAG)** with hardware-accelerated zoom/pan capabilities, concrete weekend portfolio deliverables, curated open-source repositories to inspect, interactive interview drills with evaluation rubrics, proof-of-mastery verification gates, and real-time prerequisite re-routing.

**Problem Statement Number:** 1 (Reverse-Engineered Career Roadmapper)

---

## 2. Submission Status: 100% Completed & Verified
As of the final submission deadline:
- **All Core Features**: Shipped, tested, and verified with zero compilation or TypeScript errors.
- **Mobile & Responsive Polish**: Verified across mobile viewports, tablets, and touch-screen devices.
- **Multi-Device & Network Verification**: Verified live on both `localhost:3000` and over local network Wi-Fi (`http://10.28.247.23:3000`) for seamless table judging.
- **Resilient AI Fallback Architecture**: Verified with both live Gemini 1.5 Flash API calls and high-fidelity offline synthesized domain ontologies to guarantee 100% judging uptime without rate limits.

---

## 3. Key Features & Innovations

### 1. Interactive Interview Simulation Sandbox
- **Interactive Practice Drills**: Clicking any milestone reveals real, high-frequency technical interview questions.
- **Candidate Practice Sandbox**: Students can draft their answer in an interactive response sandbox before revealing the model strategy.
- **Reveal Model Answer & Rubric Evaluation**: Instant model answers paired with interviewer evaluation rubrics (checking architectural trade-offs, edge-case handling, and structural reasoning).
- **Self-Assessment Scoring**: Students track their readiness with *"Needs More Practice"* or *"✓ Mastered & Articulated"* ratings.

### 2. Proof-of-Mastery Verification Gate
- **Gated Milestone Completion**: Prevents superficial progression by requiring students to certify at least one verification criterion:
  1. *Project Deliverable Built* (verifies completion of the concrete weekend project deliverable)
  2. *Interview Drill Articulated* (verifies tackling the milestone interview drill)
  3. *Prior Hands-on Mastery* (verifies prior academic or production experience)
- **Fast Bypass**: Allows candidates who already possess proven skills to fast-track directly and unlock downstream prerequisites.

### 3. Dynamic DAG Re-routing & Prerequisite Unlocking
- Marking any milestone as mastered dynamically recalculates the dependency graph in real time.
- Dependent downstream milestones automatically transition from **Locked** (slate) to **Active** (cyan ring), accompanied by celebratory confetti animations.
- The completion pace and target calendar date automatically recalculate to reflect saved hours.

### 4. Multi-Domain Role Differentiation
- Roadmaps are genuinely customized for distinct engineering disciplines, avoiding one-size-fits-all checklists:
  - **Cyber Security**: Scapy packet sniffers, OWASP remediation, Wazuh/ELK SIEM, Zero-Trust mTLS.
  - **DevOps & Cloud Platform**: Linux cgroups, multi-stage Docker builds, Terraform VPCs, Kubernetes Helm charts, ArgoCD GitOps.
  - **Machine Learning & AI**: Vectorized NumPy, Scikit-Learn pipelines, PyTorch Transformers, Vector RAG, FastAPI/MLflow serving.
  - **Climate Tech Full-Stack**: TimescaleDB hypertables, Mapbox/Deck.gl GPU maps, GHG Protocol Scope 1/2/3 APIs.
  - **Autonomous AI Agents**: LangGraph cyclic state machines, tool-calling sandboxes, multi-agent PR review bots.
  - **Mobile & Custom Disciplines**: Dynamically synthesized parametric DAGs calibrated for the candidate's exact query.

### 5. Transparent AI Fallback System (100% Demo Uptime)
- **Visual Status Badges**: The UI clearly identifies the active generation pipeline:
  - `🟢 Live Gemini AI Generation` (when connected to Google Gemini 1.5 Flash)
  - `⚡ Resilient Synthesized Mode (Offline Verified)` (when in fallback mode or evaluated without an external API key)
- **Zero-Crash Table Judging**: Guarantees fast, responsive generation even under degraded college Wi-Fi or API rate limits.

### 6. AI ATS Resume Auditor & Role Alignment Meter
- Upload full resumes (.pdf, .docx, .txt) or paste raw text.
- Computes an objective **ATS Compatibility Score (0-100)**, extracts detected matching keywords, highlights critical missing skills, and runs an interactive **Bullet Point Rewrite Lab** to transform passive descriptions into impact-driven metrics.
- **1-Click Roadmap Mapping**: Missing keywords can be mapped directly onto the visual skill tree to highlight immediate learning priorities.

### 7. Personalized Weekly Action Plan Generator
- Converts long-term career goals into realistic weekly sprints.
- Calibrated by candidate experience level (Student, Self-Taught, Junior Engineer, Career Switcher), weekly hours, and target deadline.
- Generates structured day-by-day learning tasks and Sunday milestone portfolio deliverables.

### 8. Interactive Skill-Gap Analyzer
- Categorizes all role competencies into **Mastered**, **In-Progress**, and **Missing**.
- Interactive checkboxes provide bidirectional synchronization with the React Flow canvas.

### 9. "Fork in the Road" Dual-Role Comparison
- Side-by-side analysis of two target roles, discovering the 60%+ shared foundational overlap to eliminate career pivot anxiety.

### 10. 1-Click High-Res PNG Export & 100% Mastery Honors
- Instant high-resolution canvas snapshot export (`html-to-image`) for resumes and portfolios.
- 100% roadmap completion triggers full-screen fireworks confetti, honors certification, and staff-level skill expansion suggestions.

---

## 4. Architecture & Technical Stack

```
User Dream Job / Resume Input
         │
         ▼
Next.js 16 App Router (/api/generate & /api/resume-ats)
         │
         ├───► [Primary] Google Gemini 1.5 Flash (Structured JSON DAG)
         │
         └───► [Fallback] Resilient Domain Synthesizer (Zero-Crash Guarantee)
         │
         ▼
Topological DAG Sorter & Dagre Auto-Layout Engine
         │
         ▼
Interactive React Flow v12 Canvas (<RoadmapCanvas />)
         │
         ▼
Dynamic Prerequisite Re-routing & Mastery Gate (<NodeDetailDrawer />)
```

- **Framework**: Next.js 16.4 (App Router with Turbopack), React 19, TypeScript.
- **Canvas Engine**: `@xyflow/react` (React Flow v12) with hardware-accelerated zoom, pan, and minimap.
- **Graph Layout**: `dagre` (hierarchical DAG layout supporting both Horizontal and Vertical views).
- **Styling**: Tailwind CSS v4 with custom dark-mode glassmorphic aesthetics.
- **Export & Feedback**: `html-to-image`, `canvas-confetti`, `lucide-react`.

---

## 5. How to Run & Verify

### Prerequisites
- Node.js 18+ (tested on Node v22.14.0)
- npm 10+

### Local Setup
```bash
# 1. Clone repository
git clone https://github.com/Ayan212205/pathcraft.git
cd pathcraft

# 2. Install dependencies
npm install

# 3. Configure environment (Optional)
cp .env.example .env.local
# Add your free GEMINI_API_KEY from https://aistudio.google.com/
# NOTE: The app runs 100% offline with full domain synthesis if no key is provided!

# 4. Start development server
npm run dev
```

### Accessing the App
- **Local Machine**: Open [http://localhost:3000](http://localhost:3000)
- **Multi-Device / Teammate / Judge Access (Same Wi-Fi)**:
  Open `http://<your-local-ip>:3000` (e.g. `http://10.28.247.23:3000`) from any smartphone, tablet, or evaluator laptop on the network.
- **Test Login**: No credentials required. The entire suite is accessible instantly.

---

## 6. How Judges Can Test & Verify Key Behaviors

1. **Verify Role Recalculation**:
   - Search for `Cyber Security Engineer` ➔ Observe the Scapy, OWASP, and SIEM nodes.
   - Search for `DevOps Engineer` ➔ Observe the Linux namespaces, Docker, Terraform, and Kubernetes nodes.
   - Search for `Machine Learning Engineer` ➔ Observe NumPy vectorization, PyTorch self-attention, and RAG nodes.
2. **Verify AI Generation Mode Badge**:
   - Check the top banner and domain insight card to view the active pipeline indicator (`🟢 Live Gemini AI` vs `⚡ Resilient Synthesized Mode`).
3. **Verify Interactive Interview Drills**:
   - Click any milestone ➔ Open Section 3 (Interview Drills).
   - Type a response into the candidate practice sandbox.
   - Click *"Reveal Model Answer & Evaluate"* ➔ Inspect the model strategy and interviewer rubric.
4. **Verify Proof-of-Mastery Gate**:
   - Check the *Proof of Mastery Verification* card at the bottom of the drawer.
   - Certify a criterion or click *"Fast Bypass"* to watch downstream milestones unlock dynamically.
5. **Verify Timeline Pace Calculator**:
   - Drag the *Weekly Pace* slider from 12 hrs/week to 6 hrs/week ➔ Observe the estimated weeks and target completion date update instantly.
6. **Verify ATS Resume Auditor**:
   - Click *"ATS Auditor"* ➔ Upload or paste a resume to receive the 0-100 score, missing keywords, and bullet point rewrites.
7. **Verify Weekly Action Plan**:
   - Click *"Weekly Plan"* ➔ Review the customized sprint calendar tailored to the student's pace.
8. **Verify Canvas PNG Export**:
   - Click *"Save Image"* in the canvas control bar to download a high-resolution PNG snapshot.