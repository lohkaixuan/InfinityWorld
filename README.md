# Infinity World — Location Analysis App

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com/)
[![Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=fff)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=000)](https://react.dev/)
[![OpenAI](https://img.shields.io/badge/AI-OpenAI-412991?logo=openai&logoColor=fff)](https://platform.openai.com/)

Find the best place to launch your business, fast.  
Type a location, pick your business type & scale, and get instant insights: rent ranges, market trends, nearby properties, and an AI assistant to reason about trade-offs.

> ⚡ Built with **Vite + React + Tailwind**, **Google Maps APIs**, **Chart.js/Recharts**, and **OpenAI** (via Vercel Serverless Functions). Deployed on **Vercel**.  
> 🛰 **Backend (Satellite Change Detection):** Dragonfly — <https://github.com/frenzy2004/dragonfly>

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Environment Variables](#-environment-variables)
- [Serverless: OpenAI on Vercel](#-serverless-openai-on-vercel)
- [Local Development](#-local-development)
- [Deploy to Vercel](#-deploy-to-vercel)
- [Backend — Satellite Change Detection (Dragonfly)](#-backend--satellite-change-detection-dragonfly)
- [Quick Rent Calculator (How it works)](#-quick-rent-calculator-how-it-works)
- [Product Pitch (Hackathon-ready)](#-product-pitch-hackathon-ready)
- [Privacy Notes](#-privacy-notes)
- [Scripts](#-scripts)
- [License](#-license)

---

## ✨ Features

- **Smart Location Input:** Autocomplete & map context (Google Places + Maps).  
- **Market Overview:** Avg rent, price range, YoY trend, quick visuals.  
- **Quick Rent Calculator:** Live RM/month from size × RM/sq ft.  
- **Nearby Properties:** Curated sample data with pricing, size, rating, amenities.  
- **AI Assistant:** Ask “KLCC vs Bukit Bintang for F&B?” → get structured reasoning.  
- **Export to PDF:** One-click downloadable report (html2canvas + jsPDF).  
- **Clean UI:** Tailwind components, mobile-friendly layout.

> ✅ **No AWS / Bedrock** used. **OpenAI only.**

---

## 🧱 Tech Stack

**Frontend:** Vite, React, TypeScript, Tailwind CSS  
**Maps & Charts:** `@googlemaps/js-api-loader`, Chart.js, `react-chartjs-2`, Recharts  
**AI:** OpenAI API (via Vercel Serverless Function `/api/chat`)  
**Utilities:** date-fns, html2canvas, jsPDF, lucide-react  
**Deploy:** Vercel (Static frontend + serverless API)

---

## 📦 Folder Structure

```
.
├─ public/                # static assets (e.g., logo.png)
├─ src/
│  ├─ components/
│  │  ├─ charts/
│  │  ├─ ndvi/
│  │  ├─ AIAssistant.tsx
│  │  ├─ BusinessCard.tsx
│  │  ├─ BusinessDetail.tsx
│  │  ├─ GoogleMap.tsx
│  │  ├─ KPICards.tsx
│  │  ├─ RentLocationContent.tsx
│  │  └─ TabNavigation.tsx
│  ├─ data/
│  ├─ hooks/
│  │  ├─ useGemini.ts      # (optional/legacy) not used in final; we use OpenAI
│  │  └─ useGoogleMaps.ts
│  ├─ pages/
│  │  ├─ LocationAnalysis.tsx
│  │  └─ LocationRequest.tsx
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ api/
│  └─ chat.ts             # Vercel Edge/Serverless function for OpenAI
├─ vite.config.(ts|mts|js)
├─ package.json
└─ README.md
```

---

## 🔑 Environment Variables

Create a `.env` for local dev and set these in **Vercel → Project Settings → Environment Variables**:

```bash
# OpenAI (server-side only; DO NOT expose to Vite directly)
OPENAI_API_KEY=sk-...

# Google Maps (safe to expose with Vite prefix)
VITE_GOOGLE_MAPS_API_KEY=AIza...

# optional: base URL for client fetch calls
VITE_API_BASE=/api
```

> **Important:** Never put `OPENAI_API_KEY` in `VITE_...` variables (those go to the client). We call OpenAI only from the serverless function.

---

## 🤖 Serverless: OpenAI on Vercel

Create `api/chat.ts` at the repo root:

```ts
// api/chat.ts
import OpenAI from "openai";

export const config = {
  runtime: "edge", // or omit to use Node serverless
};

export default async function handler(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body as {
      messages: { role: "system" | "user" | "assistant"; content: string }[];
    };

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
    });

    return new Response(JSON.stringify(completion.choices[0].message), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? "Error" }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}
```

**Client call example**
```ts
// AIAssistant.tsx (client side)
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [
      { role: "system", content: "You are a helpful location analyst for SMEs in Malaysia." },
      { role: "user", content: "Compare KLCC vs Bukit Bintang for a 900 sq ft cafe." },
    ],
  }),
});
const message = await res.json();
// message.content => string
```

---

## 🛠 Local Development

**Prerequisites**
- Node.js 18+ (or 20+ recommended)
- npm / pnpm / yarn

**Install & Run**
```bash
npm install
npm run dev
# http://localhost:5173
```

**Build & Preview**
```bash
npm run build
npm run preview
# http://localhost:4173
```

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub/GitLab.  
2. On **Vercel**, click **New Project → Import** your repo.  
3. **Framework Preset:** _Vite_  
4. **Build Command:** `npm run build`  
5. **Output Directory:** `dist`  
6. Add environment variables:
   - `OPENAI_API_KEY` (Server)
   - `VITE_GOOGLE_MAPS_API_KEY` (Client)  
7. Deploy. Vercel will ship the static frontend from `dist/` and your serverless function(s) in `api/*`.

---

## 🛰 Backend — Satellite Change Detection (Dragonfly)

This frontend can connect to an external backend for **satellite change detection** (before/after imagery, NDVI, masks, simple metrics).

- **Repo:** <https://github.com/frenzy2004/dragonfly>  
- **Host anywhere:** Render, Railway, VPS (independent of Vercel)  
- **Enable CORS** for your Vercel domain

**Quick start (backend)**
```bash
git clone https://github.com/frenzy2004/dragonfly.git
cd dragonfly
python -m venv .venv
# Windows: .venv\Scripts\activate     # macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt

# run server (adjust to repo’s entry point)
# FastAPI example:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**CORS (FastAPI example)**
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],  # or restrict to your Vercel domain
  allow_methods=["*"],
  allow_headers=["*"],
)
```

**Example API (adjust to repo)**
- `POST /detect-change` — multipart form with two images or URLs

_Request (form-data):_
- `before` (file)
- `after`  (file)
- `band` (optional) – e.g., NDVI/NDBI
- `threshold` (optional) – float 0–1

_Response (JSON):_
```json
{
  "change_score": 0.37,
  "changed_area_pct": 12.4,
  "mask_url": "https://backend.example.com/results/abc123_mask.png",
  "bboxes": [
    { "x": 123, "y": 88, "w": 42, "h": 39, "score": 0.91 }
  ]
}
```

**Frontend integration**
```bash
# .env in this app
VITE_DRAGONFLY_API=https://your-dragonfly-host.example.com
```

```ts
// src/utils/changeDetection.ts
export async function detectChange(beforeFile: File, afterFile: File, band?: string, threshold?: number) {
  const base = import.meta.env.VITE_DRAGONFLY_API;
  const form = new FormData();
  form.append("before", beforeFile);
  form.append("after", afterFile);
  if (band) form.append("band", band);
  if (threshold != null) form.append("threshold", String(threshold));

  const res = await fetch(`${base}/detect-change`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Change detection failed: ${res.status}`);
  return res.json();
}
```

```tsx
{/* Display the mask */}
{result?.mask_url && (
  <div className="mt-4">
    <div className="text-sm text-gray-600">Detected change mask</div>
    <img src={result.mask_url} alt="Change mask" className="rounded-lg border" />
  </div>
)}
```

---

## 🧮 Quick Rent Calculator (How it works)

- **Inputs:** Space Size (sq ft) × Rent per sq ft (RM)  
- **Output:** `RM (size × rate) / month`  
- Live-updates on change, with `en-MY` currency formatting.

---

## 🧭 Product Pitch 

- **Problem:** Picking a storefront is risky—rents are high, foot traffic varies, and “market knowledge” is opaque.  
- **Solution:** A fast, AI-assisted dashboard that blends map context, market signals, comparable properties, and a transparent cost calculator.  
- **Why Now:** Post-pandemic retail recovery + SME digitization → better, faster decisions needed.  
- **Secret Sauce:** Lightweight client, instant charts, and an explainable AI layer that adapts to business type/scale.  
- **Stretch Goals:** Real listings integration, crowdsourced foot-traffic, Supabase session save, ROI simulation (CAPEX/OPEX), and neighborhood safety/POI layers.

---

## 🔒 Privacy Notes

- OpenAI calls are made **server-side only** via Vercel Functions.  
- No API keys are exposed to the browser.  
- Do not store PII without explicit user consent.

---

## 🧪 Scripts

```jsonc
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "deploy": "vercel --prod"
}
```

---

## 📝 License

MIT — feel free to use and remix for your hackathon.
