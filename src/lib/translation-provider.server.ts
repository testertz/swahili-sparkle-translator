/**
 * Translation provider boundary.
 *
 * Everything provider-specific lives behind `runProvider`, so a different
 * translation backend can be swapped in later without touching the UI or the
 * server functions.
 */

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "openai/gpt-6-astra";

export class TranslationError extends Error {
  constructor(
    message: string,
    readonly kind: "rate_limit" | "unavailable" | "invalid" | "unknown" = "unknown",
  ) {
    super(message);
  }
}

const FRIENDLY: Record<string, string> = {
  rate_limit: "A lot of translations are happening right now. Please try again in a moment.",
  unavailable: "The translation service is unavailable right now. Please try again shortly.",
  invalid: "We couldn't read that text. Please adjust it and try again.",
  unknown: "We couldn't complete that translation. Please try again.",
};

export function friendlyMessage(kind: string) {
  return FRIENDLY[kind] ?? FRIENDLY["unknown"]!;
}

/** Very small in-memory guard so one visitor can't hammer the provider. */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 25;

export function checkRateLimit(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    throw new TranslationError("rate limited", "rate_limit");
  }
  recent.push(now);
  hits.set(key, recent);
}

/** Short-lived response cache for identical requests. */
const cache = new Map<string, { value: unknown; at: number }>();
const CACHE_TTL = 10 * 60_000;

export function cached<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.at > CACHE_TTL) {
    cache.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function putCache(key: string, value: unknown) {
  if (cache.size > 300) cache.clear();
  cache.set(key, { value, at: Date.now() });
}

const GEMINI_MODEL = "gemini-2.5-flash";

async function callGateway(system: string, user: string, attempt = 0): Promise<string> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new TranslationError("missing key", "unavailable");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    },
  );

  if (response.status === 429) throw new TranslationError("rate limited", "rate_limit");
  if (response.status === 401 || response.status === 403)
    throw new TranslationError("blocked", "unavailable");
  if (response.status >= 500) {
    if (attempt < 1) {
      await new Promise((r) => setTimeout(r, 800));
      return callGateway(system, user, attempt + 1);
    }
    throw new TranslationError("upstream", "unavailable");
  }
  if (!response.ok) {
    console.error("gemini error", response.status, await response.text().catch(() => ""));
    throw new TranslationError("bad request", "invalid");
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const content = payload.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("");
  if (!content) throw new TranslationError("empty", "unavailable");
  return content;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "");
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new TranslationError("unparsable", "unavailable");
  }
}

const MODE_GUIDE: Record<string, string> = {
  natural: "everyday natural register, the way a fluent speaker would actually say it",
  formal: "formal and respectful register",
  professional: "professional business register with correct terminology",
  simple: "very simple, plain wording that a beginner understands",
  conversational: "relaxed spoken conversation, contractions and idiom welcome",
  academic: "precise academic register with careful structure",
};

const BASE_RULES = `You are an expert English <-> Kiswahili translator with native fluency in both.
Rules:
- Translate meaning, not word for word. Output must read like it was written by a native speaker.
- Use correct noun classes, agreement, tense and sentence structure.
- Keep proper nouns, personal names, place names, product names, technical identifiers, URLs, email addresses and code unchanged.
- Localise numbers, dates and currency naturally without changing their value.
- Preserve line breaks and the overall formatting of the source.
- Never add commentary, notes, or content that was not in the source.
Respond with JSON only.`;

export type TranslateResult = {
  translation: string;
  alternatives: string[];
};

export async function runProvider(input: {
  text: string;
  from: "en" | "sw";
  to: "en" | "sw";
  mode: string;
}): Promise<TranslateResult> {
  const fromName = input.from === "en" ? "English" : "Kiswahili";
  const toName = input.to === "en" ? "English" : "Kiswahili";
  const tone = MODE_GUIDE[input.mode] ?? MODE_GUIDE["natural"]!;

  const system = `${BASE_RULES}
Translate from ${fromName} to ${toName} in a ${tone}.
JSON shape: {"translation": string, "alternatives": string[]}
"alternatives" holds 0-3 other genuinely natural phrasings of the same meaning. Omit alternatives that are near-identical to the main translation; use an empty array for very short or unambiguous input.`;

  const raw = await callGateway(system, input.text);
  const parsed = parseJson<{ translation?: unknown; alternatives?: unknown }>(raw);
  const translation = typeof parsed.translation === "string" ? parsed.translation.trim() : "";
  if (!translation) throw new TranslationError("no translation", "unavailable");
  const alternatives = Array.isArray(parsed.alternatives)
    ? parsed.alternatives
        .filter((a): a is string => typeof a === "string" && a.trim().length > 0)
        .map((a) => a.trim())
        .filter((a) => a !== translation)
        .slice(0, 4)
    : [];

  return { translation, alternatives };
}

export type ExplainResult = {
  meaning: string;
  keyWords: Array<{ word: string; note: string }>;
  context: string;
  grammar: string;
  why: string;
};

export async function runExplain(input: {
  source: string;
  translation: string;
  from: "en" | "sw";
  to: "en" | "sw";
}): Promise<ExplainResult> {
  const system = `You explain English <-> Kiswahili translations to learners in clear, short English.
JSON shape: {"meaning": string, "keyWords": [{"word": string, "note": string}], "context": string, "grammar": string, "why": string}
Keep every field to one or two short sentences. Include 2-5 key words with brief notes.`;
  const user = `Source (${input.from === "en" ? "English" : "Kiswahili"}): ${input.source}
Translation (${input.to === "en" ? "English" : "Kiswahili"}): ${input.translation}`;

  const raw = await callGateway(system, user);
  const parsed = parseJson<Partial<ExplainResult>>(raw);
  return {
    meaning: parsed.meaning ?? "",
    keyWords: Array.isArray(parsed.keyWords) ? parsed.keyWords.slice(0, 6) : [],
    context: parsed.context ?? "",
    grammar: parsed.grammar ?? "",
    why: parsed.why ?? "",
  };
}
