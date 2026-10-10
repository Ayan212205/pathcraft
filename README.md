# 🧭 PathCraft — Reverse-Engineered Career Roadmapper
> **Azisly.ai Hackathon 2026** | **Problem Statement #1** | Repository: [github.com/Ayan212205/pathcraft](https://github.com/Ayan212205/pathcraft)

---

## 1. What it does
PathCraft reverse-engineers a student's hyper-specific dream job (such as *"Full Stack Developer at a Climate Tech Startup"* or *"Autonomous AI Agent Engineer"*) into a gamified, interactive visual skill tree. Instead of generic text checklists, it generates dynamic dependency graphs with zoom/pan capabilities, concrete weekend portfolio projects, curated open-source repositories to study, targeted interview drills, and real-time path re-routing based on existing skills.

**Problem Statement Number:** 1 (Reverse-Engineered Career Roadmapper)

---

## 2. Done / Left / Plan
- **Done (Working Right Now)**:
  - Generative AI DAG engine generating structured skill trees with topological sorting.
  - Interactive skill tree canvas powered by React Flow v12 with zoom, pan, and minimap.
  - Automated hierarchical graph layout with Dagre (supports both Horizontal and Vertical views).
  - Gamified milestone node statuses: Mastered (green glow), Active (cyan ring), Locked (slate).
  - Actionable Milestone Inspector Drawer: custom weekend project prompts, open-source repos, and collapsible interview simulation questions with model answers.
  - Dynamic Re-routing Engine: marking a skill as mastered dynamically recalculates and unlocks downstream prerequisite nodes with celebratory confetti feedback.
  - Time-Budget Pace Calculator: dynamically recalibrates completion weeks based on a weekly hours slider.
  - Resume Delta Scanner: parses current developer skills and auto-fast-tracks known nodes to highlight the exact delta.
  - 1-Click High-Resolution PNG Canvas Export (`html-to-image`).
  - "Fork in the Road" Dual-Role Comparison Engine: side-by-side analysis of overlapping foundational skills vs diverging specializations.
  - Interactive Interview Readiness Scorecard: self-assessment tracking for technical drills.
  - 100% Roadmap Mastery Celebration: fireworks confetti burst, honors certification, and staff-level skill expansion.
  - AI ATS Resume Auditor & Role Alignment Engine: evaluates full resume uploads, calculates an ATS match score (0-100), detects matched vs missing keywords, rewrites weak bullet points, and maps missing skills directly to the visual skill tree.
  - Personalized Weekly Action Plan: custom schedules based on skill level (Beginner/Intermediate/Advanced), available hours, and target deadline with daily tasks and Sunday milestone deliverables.
  - Interactive Skill-Gap Analyzer: visual categorized breakdown of Mastered, In-Progress, and Missing skills with live bidirectional synchronization with the React Flow canvas.
  - Built-in resilient fallbacks ensuring zero crashes during live judging demos.

- **Left (Next 16 Hours)**:
  - Peer progress benchmarking (comparing a student's milestone pace against college cohort averages).
  - University Placement Coordinator export mode (batch progress analytics for campus placement cells).

- **Plan to finish**:
  - Add peer benchmark charts.
  - Polish mobile viewport drawer gestures.
  - Final live cloud deployment on Vercel.

---

## 3. Architecture and why
```
User Target Query / Resume Input
         │
         ▼
Next.js Serverless API Route (/api/generate)
         │
         ▼
Google Gemini 1.5 Flash (Structured JSON Mode)
         │
         ▼
Topological DAG Sorter & Dagre Auto-Layout Engine
         │
         ▼
Interactive React Flow v12 Canvas (<RoadmapCanvas />)
         │
         ▼
Dynamic Prerequisite Re-routing Engine (<NodeDetailDrawer />)
```

- **Frontend (`Next.js 16 + React Flow v12`)**: We chose React Flow because a list or basic accordion fails the brief; React Flow provides hardware-accelerated canvas panning, zooming, custom node DOM injection, and minimap support.
- **Layout Engine (`Dagre`)**: Graph node placement is inherently non-trivial. Dagre deterministically computes `(x, y)` coordinate ranks, guaranteeing a clean left-to-right progression without manual coordinate math or node overlaps.
- **AI Model (`Google Gemini 1.5 Flash`)**: We selected Gemini 1.5 Flash with native JSON mode (`response_mime_type: "application/json"`). It delivers sub-2-second generation latency, zero cost on the generous free tier, and adheres strictly to DAG constraints without cyclic hallucination.
- **State & Resilience**: Built with React state and deterministic prerequisite propagation. If internet access degrades at the venue, local parametric synthesis ensures the app never crashes during table evaluation.

---

## 4. What we added (Beyond the Brief)
1. **Resume Delta Scanner**: Rather than starting from scratch, students paste their resume or stack. The scanner detects existing competencies, marks matching nodes as mastered, and immediately highlights only the missing stepping stones.
2. **"Fork in the Road" Dual-Role Comparison**: Compare two target roles side-by-side to discover the 60%+ shared foundational overlap, reducing career pivot anxiety.
3. **Interactive Interview Readiness Scorecard**: Self-evaluation controls on technical interview drills to measure placement readiness in real time.
4. **1-Click High-Res Canvas Export**: Instant PNG snapshot download for offline review or portfolio sharing.
5. **Dynamic Time-Budget Slider**: Students set their weekly availability (4 to 40 hrs/week). The platform recalculates the exact week-by-week timeline and prioritizes high-ROI weekend projects.
6. **Dual Orientation Toggle**: Switch between Horizontal ("Left-to-Right progression tree") and Vertical ("Timeline mind-map") with one click.
7. **AI ATS Resume Auditor & Alignment Meter**: Upload a full resume document or text to receive an objective ATS compatibility score (0-100), detected vs missing keywords, bullet point rewrites, and 1-click mapping of missing skills directly onto the visual skill tree.
8. **100% Mastery Honors & Fireworks Experience**: Celebrates completed paths with fireworks confetti, verified portfolio badges, staff-level skill expansion, and pivot transfer insights.
9. **Personalized Weekly Action Plan Generator**: Turns abstract long-term goals into realistic weekly sprints with daily learning tasks and Sunday milestone deliverables based on current skill level and available hours.
10. **Interactive Skill-Gap Analyzer**: Categorizes all required competencies into Mastered, In-Progress, and Missing, with interactive checkboxes that live-sync with the React Flow canvas.

---

## 5. How to run it

### Prerequisites
- Node.js 18+ (tested on Node v22.14.0)
- npm 10+

### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/Ayan212205/pathcraft.git
cd pathcraft

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# (Optional: Add your free GEMINI_API_KEY from https://aistudio.google.com/)
# Even without a key, the app includes robust built-in synthesized roadmaps!

# 4. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Test Login:** No login required. The app is completely open and accessible immediately.

---

## 6. Tools and AI used
- **AI Models & APIs**: Google Gemini 1.5 Flash (via Google AI Studio).
- **Core Libraries**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `@xyflow/react` (React Flow v12), `dagre`, `html-to-image`, `framer-motion`, `lucide-react`, `canvas-confetti`.
- **AI Transparency**: Clear badge and disclaimer in the top banner: *"Generated by Gemini AI • Directed Acyclic Graph (DAG) Engine"*. Every generated node can be inspected, verified, or customized by the user.

---

## 7. Who it is for
- **Target Audience**: College students, pre-final and final-year placement candidates, and career pivoters preparing for modern, non-traditional tech roles (e.g. Climate Tech, AI Agent Infrastructure, Quant/Fintech UI).
- **Why they come back**: Traditional career sites give static advice that goes stale immediately. PathCraft acts as a living, personalized skill tree that tracks their ongoing mastery, recalibrates when they finish projects, and generates tailored interview drills for every milestone.