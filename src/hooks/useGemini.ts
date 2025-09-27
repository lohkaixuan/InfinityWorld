import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

const genAI = new GoogleGenerativeAI("AIzaSyDrcso9y-Mtqr33Bkc7CiE10cVg2ykJSG0");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// pull the first {...} JSON object out of a text blob
function extractJson(text: string) {
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s === -1 || e === -1 || e <= s) throw new Error("No JSON object found");
  return text.slice(s, e + 1);
}

// POST /api/gemini-transform  { raw: <any JSON> }
router.post("/api/gemini-transform", async (req, res) => {
  try {
    const raw = req.body?.raw ?? {};

    const schemaPrompt = `
You are a strict data transformer.
Convert RAW JSON into EXACTLY this schema and return ONLY a single JSON object:

{
  "location": { "lat": number, "lng": number, "address": string },
  "businessType": string,
  "seasonalDemand": [ { "month": string, "demand": number, "change": number } ],
  "demographics": { "office": number, "residents": number },
  "competitors": [ { "name": string, "size": number, "rating": number, "distance": number } ],
  "locationProfile": { "age": number, "income": number, "familySize": number, "daytimePop": number, "accessibility": number },
  "competitionDensity": [ { "radius": "1km" | "3km" | "5km", "category": string, "density": number } ],
  "successScore": number,
  "kpis": { "avgRating": number, "monthlyDemand": number, "rentSensitivity": number, "competitorCount": number, "revenuePotential": number }
}

Rules:
- Months are "Jan".."Dec".
- Distances in km; numbers must be numeric, not strings.
- If something is missing, estimate reasonably from RAW.
- Do NOT include code fences or explanations. JSON only.
`;

    const result = await model.generateContent([
      { role: "user", parts: [{ text: schemaPrompt }] },
      { role: "user", parts: [{ text: JSON.stringify(raw) }] },
    ]);

    const text = result.response.text();
    const json = extractJson(text);
    const out = JSON.parse(json);

    res.json(out);
  } catch (err: any) {
    console.error("[/api/gemini-transform] error:", err?.message || err);
    res.status(500).json({ error: "Gemini transform failed" });
  }
});

export default router;
