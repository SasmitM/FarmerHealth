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

  const userPrompt = `Generate a plain-language summary of the main health risks for a farmer who does ${context}. 

Cover:
- Specific hazards (e.g., pesticide exposure, dust, animal injuries, zoonotic diseases, machinery, chemicals)
- Who is most at risk and when
- Practical takeaway or reminder

Use simple language. No medical jargon.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${RISK_PROMPT}\n\n${userPrompt}`,
    config: {
      maxOutputTokens: 1024,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('No text in Gemini response');
  }

  return text;
}
