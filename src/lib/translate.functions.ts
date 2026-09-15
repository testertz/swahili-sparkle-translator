import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const langSchema = z.enum(["en", "sw"]);

const translateSchema = z.object({
  text: z.string().trim().min(1).max(5000),
  from: langSchema,
  to: langSchema,
  mode: z.enum(["natural", "formal", "professional", "simple", "conversational", "academic"]),
  nonce: z.number().optional(),
});

const explainSchema = z.object({
  source: z.string().trim().min(1).max(5000),
  translation: z.string().trim().min(1).max(5000),
  from: langSchema,
  to: langSchema,
});

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => translateSchema.parse(data))
  .handler(async ({ data }) => {
    const {
      runProvider,
      checkRateLimit,
      cached,
      putCache,
      TranslationError,
      friendlyMessage,
    } = await import("./translation-provider.server");

    const cacheKey = `t:${data.from}:${data.to}:${data.mode}:${data.text}`;
    try {
      checkRateLimit("global");
      if (data.nonce === undefined) {
        const hit = cached<{ translation: string; alternatives: string[] }>(cacheKey);
        if (hit) return { ok: true as const, ...hit };
      }
      const result = await runProvider(data);
      putCache(cacheKey, result);
      return { ok: true as const, ...result };
    } catch (error) {
      const kind = error instanceof TranslationError ? error.kind : "unknown";
      if (kind === "unknown") console.error(error);
      return { ok: false as const, error: friendlyMessage(kind), kind };
    }
  });

export const explainTranslation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => explainSchema.parse(data))
  .handler(async ({ data }) => {
    const { runExplain, checkRateLimit, cached, putCache, TranslationError, friendlyMessage } =
      await import("./translation-provider.server");

    const cacheKey = `e:${data.from}:${data.to}:${data.source}:${data.translation}`;
    try {
      checkRateLimit("global");
      const hit = cached<Awaited<ReturnType<typeof runExplain>>>(cacheKey);
      if (hit) return { ok: true as const, explanation: hit };
      const explanation = await runExplain(data);
      putCache(cacheKey, explanation);
      return { ok: true as const, explanation };
    } catch (error) {
      const kind = error instanceof TranslationError ? error.kind : "unknown";
      if (kind === "unknown") console.error(error);
      return { ok: false as const, error: friendlyMessage(kind), kind };
    }
  });
