# CyberPath — AI-Driven Cybersecurity Career & Learning Pathway Engine

**Project code:** BSCDS26-CIPL-01

CyberPath assesses a learner's current skills and interests, recommends a personalized cybersecurity career track, and generates a structured, milestone-based learning roadmap with curated resources — enriched by a real LLM so the rationale and next steps are genuinely AI-driven, not static rules.

---

## Problem Statement

Cybersecurity has dozens of specializations (SOC analyst, pentester, GRC, cloud security, digital forensics, AppSec). Learners struggle to know which path fits their background and what to learn next. CyberPath turns a 10-question assessment into a ranked, explainable recommendation plus a phased roadmap with curated, real resources.

## Features

- **Skill & Interest Assessment** — 10-question weighted quiz across Background, Interest, Work Style, and Experience.
- **Recommendation Engine** — per-track scores normalized to 0–100%, ranked match, with a short rationale.
- **AI Enrichment** — a Supabase Edge Function calls a real LLM to generate a personalized rationale and 4 tailored next steps grounded in the learner's answers. Graceful rule-based fallback if no API key / upstream failure (demo never breaks).
- **Personalized Learning Roadmap** — 5 phases per track (Foundations → Core skills → Tools & practice → Certifications → Portfolio & job-readiness), each with concrete topics, durations, and curated resources.
- **Progress Tracker** — per-topic checkboxes, per-phase and overall % completion, persisted to `localStorage`.
- **Dashboard** — recommended track, match %, overall progress, retake, and explore other tracks without retaking.
- **In-app "How it works"** — transparent explanation of the scoring + LLM logic for judges.

## Tech Stack

- **Frontend:** React (Vite) + TypeScript + Tailwind CSS, lucide-react icons.
- **AI layer:** Supabase Edge Function (Deno) calling an OpenAI-compatible LLM endpoint.
- **Persistence:** `localStorage` for the demo (answers, per-track progress, AI rationale cache).

## Architecture

```
Browser (React SPA)
  │
  ├── QuizFlow ──► scoring.ts (weighted scoring engine, client-side)
  │                      │
  │                      ▼
  ├── ResultsDashboard ──► ai.ts ──► POST /functions/v1/cyberpath-ai
  │                                          │
  │                                          ▼
  │                                   Supabase Edge Function (Deno)
  │                                          │
  │                                   ┌──────┴───────┐
  │                                   ▼              ▼
  │                                LLM API      fallback engine
  │                                   │              │
  │                                   └──────┬───────┘
  │                                          ▼
  │                                   { rationale, nextSteps, source }
  │
  ├── RoadmapView ──► roadmaps.ts (curated dataset, 6 tracks × 5 phases)
  │                  storage.ts (localStorage progress)
  │
  └── Dashboard ──► summary + explore other tracks
```

Data is cleanly separated:
- `src/data/tracks.ts` — the 6 career tracks.
- `src/data/quiz.ts` — quiz questions + per-option weights.
- `src/data/roadmaps.ts` — the curated 5-phase roadmap per track.

## Setup & Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
```

Supabase env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are pre-populated in `.env`.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | yes | Supabase project URL (frontend → edge function) |
| `VITE_SUPABASE_ANON_KEY` | yes | Supabase anon key (auth for the edge function call) |
| `OPENAI_API_KEY` | optional | Enables live AI. If absent, the edge function returns a rule-based fallback. |
| `OPENAI_BASE_URL` | optional | Defaults to `https://api.openai.com/v1`. Point at any OpenAI-compatible endpoint. |
| `OPENAI_MODEL` | optional | Defaults to `gpt-4o-mini`. |

> The edge function is already deployed at `/functions/v1/cyberpath-ai`. Without `OPENAI_API_KEY` configured as a Supabase secret, it transparently returns the rule-based fallback — the UI shows a `fallback engine` badge so judges can see which path produced the text.

## Deploy

**Frontend (Vercel or Netlify):**
- Build command: `npm run build`
- Output directory: `dist`
- Add the `VITE_SUPABASE_*` env vars.

**Edge function:** already deployed via Supabase. To redeploy, the `supabase/functions/cyberpath-ai/index.ts` source is included in this repo.

## How the AI layer works (for judges)

1. The client computes weighted scores locally (instant, explainable).
2. For the top track, the client POSTs the learner's answers + ranked scores to the edge function.
3. The edge function builds a prompt that includes the learner's actual answers, the match %, and the track's roadmap phase titles, then calls the LLM with `response_format: json_object` and a strict system prompt.
4. The function validates the returned JSON shape. Any failure (no key, upstream error, malformed JSON) falls back to a deterministic rule-based rationale + next steps — so the demo never breaks.
5. The UI badges the response `live AI` or `fallback engine` for full transparency.

## Future Scope

- Multi-user accounts (Supabase Auth) with cross-device progress sync.
- Real certifications API (e.g., CompTIA / OffSec course catalogs) for live resource links.
- Mentor matching — connect learners with practitioners in their recommended track.
- Adaptive re-assessment — re-score based on completed roadmap milestones.
- Exportable roadmap (PDF / calendar) and integration with learning platforms.

## Demo Script (60–90 seconds)

1. **Landing** — click **Start the assessment**. Note the cyber-themed dark UI and the 6 tracks previewed.
2. **Quiz** — answer 3–4 questions out loud (pick offensive/programming answers to steer toward Pentest). Point at the progress bar ("Question 3 of 10").
3. **Results** — show the top match card with the match %, then the **AI mentor rationale** and the `live AI` / `fallback engine` badge. Scroll to the ranked list of all 6 tracks.
4. **Roadmap** — click **View your roadmap**. Walk through the 5 phases (Foundations → Portfolio), check one topic box to show the progress bar moving, and call out the curated resources (TryHackMe, PortSwigger, OSCP, etc.).
5. **Dashboard** — click the logo to return to the dashboard; show overall % and **Explore other tracks** to demonstrate switching without retaking.
6. **How it works** — open the modal from the header to show the transparent scoring + LLM explanation. Close with the Future Scope slide.
