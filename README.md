# AfriPath AI • Pan-African Career Intelligence Platform

> **Empowering young Africans, students, and professionals across 54 nations with AI-driven career navigation, personalized skill gap intelligence, pan-African opportunity discovery, multilingual localization, and structured 90-day learning roadmaps.**

---

## 🌟 Overview & Mission

**AfriPath AI** is a comprehensive career acceleration and workforce intelligence platform engineered for Africa's economic and technological landscape.

Across Africa, ambitious graduates and professionals (from institutions like the **University of The Gambia**, **University of Lagos**, **University of Nairobi**, **KNUST Ghana**, **UCAD Senegal**, **University of Cape Town**, **ALU Rwanda**, and technical colleges) face information asymmetry between their academic preparation and the evolving demands of tech employers, regional startups, remote international firms, and government initiatives.

AfriPath AI bridges this gap by combining **Google Gemini AI** models with curated Pan-African labor-market data to provide:
1. **Accurate Market Alignment:** Matching skills against actual roles across 54 African nations (The Gambia, Nigeria, Kenya, Ghana, Senegal, South Africa, Rwanda, Egypt, and beyond) and remote global opportunities.
2. **Actionable Skill Gap Audits:** Identifying critical missing proficiencies and localized, low-bandwidth learning pathways.
3. **Structured 90-Day Execution Roadmaps:** Breaking career transformations into weekly milestones, project deliverables, and verified resource recommendations.
4. **ATS-Ready Multilingual CV Builder:** Generating tailored resumes matching African and international hiring standards with one-click export.
5. **Context-Aware AI Career Advisor:** Providing 24/7 localized mentorship, salary benchmarks, and interview preparation.
6. **Pan-African Multilingual Experience:** Native localization in **English**, **French (Français)**, **Wolof**, and **Arabic (العربية)** with automatic bidirectional (RTL) support and a built-in Translation Management Studio.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Pan-African Onboarding** | Captures educational background, region, verified technical & soft skills, country focus, and career ambitions. |
| **AI Career Recommendations** | Analyzes candidate profiles with Gemini to generate matching roles with salary benchmarks in regional currencies (GMD, NGN, KES, GHS, XOF, ZAR, EGP, RWF, USD). |
| **Intelligent Skill Gap Engine** | Pinpoints exact gaps in languages, frameworks, cloud tools, and soft skills with priority weighting and learning curves. |
| **90-Day Execution Roadmap** | Generates 3-phase curriculum (Foundation, Advanced/Projects, Portfolio/Job Hunt) with curated free & low-bandwidth resources. |
| **AI CV & Resume Builder** | Live editor generating executive summaries, formatted bullet points, project highlights, and one-click export. |
| **Pan-African Opportunities Hub** | Interactive directory and filters for tech hubs, telecom leaders, FinTech pioneers, innovation centers, and remote employers across Africa. |
| **AI Career Advisor** | Contextual chatbot offering tailored advice on local internships, remote work setups, salary negotiation, and portfolio building. |
| **Multilingual i18n & Translation Studio** | Fully localized interface across English, French, Wolof, and Arabic with RTL layout support and an admin translation inspection studio. |
| **Profile & Settings Management** | Full CRUD capabilities for user profiles, education levels, verified skills, and secure authentication. |

---

## 🔄 End-to-End System Workflow

```
       [ 1. User Onboarding / Registration ]
                         │
                         ▼
       [ 2. Profile & Skills Extraction ]
   (Country, Institution, Degree, Current Skills)
                         │
                         ▼
     [ 3. Server-Side AI Intelligence Engine ]
    (Google Gemini API + Pan-African Labor Datasets)
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 [ Career Matches ] [ Skill Gaps ] [ 90-Day Roadmap ]
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
            [ 4. Interactive Dashboard ]
  (Visual Progress Tracker, Salary Insights, Opportunity Hub)
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 [ AI CV Builder ] [ AI Advisor ] [ Multilingual Studio ]
  (ATS Resume)      (Chatbot)      (EN / FR / WO / AR)
```

---

## 🌍 Multilingual Support (i18n)

AfriPath AI is built from the ground up to support diverse linguistic communities across the African continent:

- **🇬🇧 English (`en`)**: Pan-African English standard.
- **🇫🇷 Français (`fr`)**: Full coverage for Francophone West and Central Africa (Senegal, Côte d'Ivoire, Cameroon, DRC, etc.).
- **🇸🇳 Wolof (`wo`)**: Indigenous West African language spoken widely in Senegal, The Gambia, and Mauritania.
- **🇪🇬 العربية (`ar`)**: North and East African standard with dynamic **Right-to-Left (RTL)** document and layout flow.

Includes a **Translation Management Studio Modal** allowing real-time audit, search, and JSON export across all 14 localization namespaces.

---

## 🛠️ Technology Stack

- **Frontend:**
  - **Framework:** React 19 (TypeScript)
  - **Build Tool:** Vite 6
  - **Styling:** Tailwind CSS 4 with high-contrast accessibility
  - **Icons:** Lucide React
  - **Animations & Effects:** Motion (`motion/react`), Canvas-Confetti
  - **Internationalization:** `i18next` & `react-i18next`

- **Backend & APIs:**
  - **Server:** Express.js (Node.js runtime via `tsx`)
  - **AI Model:** Google Gemini API (`@google/genai`)
  - **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
  - **Storage:** Persistent JSON database (`data_storage/`)

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
   Configure your Gemini API key:
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

4. **Type Check & Lint:**
   ```bash
   npm run lint
   ```

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License & Vision

Built to empower youth, graduates, and professionals across the 54 nations of Africa and the global African diaspora.
