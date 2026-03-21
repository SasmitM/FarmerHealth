import OpenAI from 'openai';
import type { FarmType } from '../types/profile';
import type { ChatMessage } from '../types/symptoms';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function ensureCompleteSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (/[.!?]$/.test(trimmed)) return trimmed;

  const lastEnd = Math.max(
    trimmed.lastIndexOf('.'),
    trimmed.lastIndexOf('!'),
    trimmed.lastIndexOf('?')
  );

  if (lastEnd >= 0) {
    const result = trimmed.slice(0, lastEnd + 1).trim();
    if (result.length >= 50) return result;
  }

  return trimmed;
}

function sanitizeSummary(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // **bold** -> bold
    .replace(/\n-{2,}\n/g, '\n') // --- blocks -> single newline
    .replace(/^\*+\s+/gm, '') // * bullets at line start -> remove
    .replace(/\n{2,}/g, '\n\n') // Max 2 consecutive newlines
    .trim();
}

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

Write 1-2 paragraph summary of the most serious long-term risk this farmer faces overall, and why catching it early matters.

Use plain language. No jargon. Always COMPLETE YOUR SENTENCES - never cut off mid-thought.`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: RISK_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 2048,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('No text in OpenAI response');
  }

  return ensureCompleteSentence(sanitizeSummary(text));
}

const SYMPTOM_SYSTEM_PROMPT = `You are a symptom checker for rural farmers. You understand farm work: pesticides, livestock, machinery, dust, chemicals, zoonotic diseases.

Rules:
- Ask follow-up questions about recent farm activities (spraying, animal contact, machinery use, chemical exposure).
- Use plain language. No medical jargon.
- When you have enough context, give: (1) a likely cause, (2) a clear action level.
- Action levels: "monitor" (watch at home), "urgent_care", "er", "call_911".
- For pesticide exposure, breathing trouble, severe injury, chest pain, or loss of consciousness → escalate appropriately.
- Never diagnose. Always say "see a doctor" when unsure.
- Keep responses concise (2-4 sentences) unless explaining an action.
- If you give an action level, end your response with: [ACTION_LEVEL: monitor] or [ACTION_LEVEL: urgent_care] or [ACTION_LEVEL: er] or [ACTION_LEVEL: call_911]`;

export async function symptomChat(messages: ChatMessage[]): Promise<string> {
  if (messages.length === 0) {
    throw new Error('At least one message required');
  }

  const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYMPTOM_SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: openaiMessages,
    max_tokens: 1024,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('No text in OpenAI response');
  }

  return text;
}

export function parseActionLevel(text: string): string | undefined {
  const match = text.match(/\[ACTION_LEVEL:\s*(monitor|urgent_care|er|call_911)\]/i);
  return match ? match[1].toLowerCase() : undefined;
}

export function stripActionLevelTag(text: string): string {
  return text.replace(/\s*\[ACTION_LEVEL:\s*(monitor|urgent_care|er|call_911)\]\s*/gi, '').trim();
}
