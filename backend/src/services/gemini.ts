import { GoogleGenAI } from '@google/genai';
import type { FarmType } from '../types/profile';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RISK_PROMPT = `You are a health educator for rural farmers. Use plain language that a farmer with limited medical knowledge can understand. Be specific about occupational hazards tied to farm work. Keep the summary to 2-3 short paragraphs.`;

export async function getRiskSummary(farmType: FarmType): Promise<string> {
  const farmContext: Record<string, string> = {
    crop: 'crop farming (grains, vegetables, row crops)',
    livestock: 'livestock farming (cattle, sheep, pigs, goats)',
    mixed: 'mixed farming (both crops and livestock)',
    poultry: 'poultry farming (chickens, turkeys, ducks)',
    dairy: 'dairy farming (cattle for milk)',
    aquaculture: 'aquaculture (fish, shellfish farming)',
    greenhouse: 'greenhouse or nursery work',
    orchard: 'orchard or vineyard work',
  };

  const context = farmContext[farmType] || farmType;

  const userPrompt = `You are a rural health specialist writing for farmers with no medical background.

A farmer regularly does: ${context}

Write a detailed but plain-language health risk summary. For each hazard relevant to this type of farming, go beyond surface-level warnings — explain the biological chain of harm: what enters or damages the body, how it accumulates or injures over time, and what long-term conditions or disabilities this can lead to if ignored.

Structure your response as follows:

**Hazard name**
- How exposure happens in this type of farming
- What it does to the body over weeks, months, and years (not just immediate symptoms)
- The chronic conditions, diseases, or permanent injuries it can cause (e.g., COPD, neuropathy, hearing loss, organ damage, cancer risk)
- Who is most vulnerable and when (age, season, task, duration)
- One practical action the farmer can take to reduce long-term harm

End with a 2–3 sentence summary of the most serious long-term risk this farmer faces overall, and why catching it early matters.

Use plain language. No jargon. Always have complete sentences - never cut off mid-thought.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${RISK_PROMPT}\n\n${userPrompt}`,
    config: {
      maxOutputTokens: 1536,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('No text in Gemini response');
  }

  return text;
}
