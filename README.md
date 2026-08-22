# Gambia Career AI (Gambia Career Compass)

> **Empowering young Gambians, students, and professionals with AI-driven career navigation, personalized skill gap intelligence, localized job insights, and structured 90-day learning roadmaps.**

---

## 🌟 Overview & Mission

**Gambia Career AI** is a comprehensive career acceleration and workforce intelligence platform specifically engineered for the Gambian economic and technological landscape.

Many ambitious Gambian graduates (from the **University of The Gambia (UTG)**, **GTTI**, **MDI**, **AIUWA**, and vocational institutes) face information asymmetry between their academic preparation and the actual demands of local tech employers, regional African startups, remote global firms, and the public sector.

Gambia Career AI closes this gap by combining **Google Gemini AI** models with curated Gambian labor-market data to provide:
1. **Accurate Market Alignment:** Matching skills against actual roles in Banjul, Kanifing Municipality (KMC), West Coast Region, and remote opportunities.
2. **Actionable Skill Gap Audits:** Identifying critical missing proficiencies and low-bandwidth learning paths.
3. **Structured 90-Day Execution Roadmaps:** Breaking down career transitions into concrete weekly milestones and capstone projects.
4. **ATS-Ready Gambian CV Builder:** Crafting tailored, high-impact resumes tailored to West African and international hiring standards.
5. **Context-Aware Career Mentorship:** 24/7 localized guidance via the AI career mentor.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Localized Onboarding** | Captures educational background (UTG, GTTI, MDI, etc.), region, verified technical & soft skills, and ambition. |
| **AI Career Recommendations** | Analyzes candidate profile with Gemini to generate matching roles with salary benchmarks in Gambian Dalasi (GMD) and USD. |
| **Intelligent Skill Gap Engine** | Pinpoints exact gaps in languages, frameworks, domain tools, and methodologies with priority weighting. |
| **90-Day Execution Roadmap** | Generates 3-phase curriculum (Foundation, Advanced/Projects, Portfolio/Job Hunt) with curated free & localized resources. |
| **AI CV & Resume Builder** | Live editor generating executive summaries, formatted bullet points, project highlights, and one-click PDF export. |
| **Interactive Gambia Job Map** | Directory of active tech hubs, telecom giants (Africell, QCell), FinTech (Wave, QMoney), banks, and remote-friendly employers in The Gambia. |
| **Kemo – The AI Career Mentor** | Contextual chatbot offering tailored advice on local internships, remote work setups, salary negotiation, and portfolio building. |
| **Profile & Settings Management** | Full CRUD capabilities for user profiles, education levels, verified skills, and secure authentication. |

---

## 🔄 End-to-End System Workflow

```
       [ 1. User Onboarding / Registration ]
                         │
                         ▼
       [ 2. Profile & Skills Extraction ]
   (Degree, Institution, Region, Current Skills)
                         │
                         ▼
     [ 3. Server-Side AI Intelligence Engine ]
    (Google Gemini API + Gambian Market Datasets)
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 [ Career Matches ] [ Skill Gaps ] [ 90-Day Roadmap ]
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
            [ 4. Interactive Dashboard ]
  (Visual Progress Tracker, Salary Insights, Employer Map)
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 [ AI CV Builder ] [ Mentor Chat ] [ Career Report ]
  (ATS Resume)      ("Kemo" AI)     (Print / PDF)
```

### Detailed Workflow Steps:
1. **Authentication & Profile Setup:**
   - User signs up or signs in using secure JWT + Bcrypt authentication.
   - Completes the guided multi-step onboarding wizard or customizes profile in Account Settings.
2. **Career Intelligence Processing:**
   - Backend triggers the Gemini integration layer (`@google/genai`) to cross-reference candidate profile with local demand (Software Engineering, FinTech, Data Science, Telecom, Cloud Infrastructure).
   - Generates personalized match scores, realistic salary bands, and market growth forecasts.
3. **Gap Analysis & Roadmap Generation:**
   - The engine categorizes competencies into *Mastered*, *In Progress*, and *Missing Critical Skills*.
   - Constructs a 12-week roadmap structured with weekly objectives, suggested project deliverables, and low-data/offline-friendly study resources.
4. **Application Readiness:**
   - Candidate leverages the AI CV Builder to draft an ATS-compliant resume tuned to their target role.
   - Uses the interactive Gambian Job Directory to explore active hiring companies in Banjul, Senegambia, Fajara, and Kairaba Avenue.
   - Consults "Kemo" (AI Career Mentor) for mock interview practice and salary negotiation tips.

---

## 🗺️ Project Roadmap

```
Phase 1: Foundations (Completed)
├── Core React 19 + Tailwind CSS architecture
├── Server-side Gemini API proxy with graceful offline fallbacks
├── Complete Gambian tech market dataset & employer index
├── Authentication system (JWT, password hashing, persistent storage)
└── Full-featured AI CV Builder & Export Engine

Phase 2: Current Release (Active)
├── Real-time profile state synchronization across navigation and dashboard
├── Interactive Gambia Career Map & Employer filter directory
├── Printable and downloadable Career Audit PDF reports
└── Anti-AI styling compliance with high-contrast accessibility

Phase 3: Upcoming Enhancements (Next 3–6 Months)
├── Direct Gambian Job Board Integration (Live API scrapers for GamJobs & local vacancies)
├── WhatsApp & Telegram Career Alert Bot for low-bandwidth job alerts
├── Peer-to-Peer Gambian Tech Mentorship matching with Diaspora Gambians
└── Offline-first PWA mode for low-connectivity environments upriver
```

---

## 🛠️ Technology Stack

- **Frontend:**
  - **Framework:** React 19 (TypeScript)
  - **Build Tool:** Vite 6
  - **Styling:** Tailwind CSS 4 with custom dark mode aesthetic
  - **Icons:** Lucide React
  - **Animations & Effects:** Motion, Canvas-Confetti

- **Backend & APIs:**
  - **Server:** Express.js (Node.js runtime via `tsx`)
  - **AI Model:** Google Gemini API (`@google/genai`)
  - **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
  - **Storage:** File-based persistent JSON database (`data_storage/`)

---

## 📦 Getting Started & Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License & Credits

Built for the Gambian tech ecosystem and aspiring youth across Banjul, Kanifing, Brikama, and the diaspora.
