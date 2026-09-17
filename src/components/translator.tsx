import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeftRight,
  ClipboardPaste,
  Download,
  Loader2,
  Mic,
  RefreshCw,
  Share2,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CopyButton, iconButton, SpeakButton } from "@/components/actions";
import { explainTranslation, translateText } from "@/lib/translate.functions";
import { useFavorites, useHistory } from "@/lib/local-store";
import { getRecognition, speak, speechSupported, stopSpeaking } from "@/lib/speech";

type Lang = "en" | "sw";
type Mode = "natural" | "formal" | "professional" | "simple" | "conversational" | "academic";
type Explanation = {
  meaning: string;
  keyWords: Array<{ word: string; note: string }>;
  context: string;
  grammar: string;
  why: string;
};

const MODES: Array<{ id: Mode; label: string }> = [
  { id: "natural", label: "Natural" },
  { id: "formal", label: "Formal" },
  { id: "professional", label: "Professional" },
  { id: "simple", label: "Simple" },
  { id: "conversational", label: "Conversational" },
  { id: "academic", label: "Academic" },
];

const FEEDBACK_REASONS = [
  "Incorrect meaning",
  "Grammar problem",
  "Wrong word",
  "Too formal",
  "Too informal",
  "Other",
];

const NAME: Record<Lang, string> = { en: "English", sw: "Kiswahili" };
const MAX_CHARS = 5000;

export function Translator({ initialText }: { initialText?: string }) {
  const translate = useServerFn(translateText);
  const explain = useServerFn(explainTranslation);

  const [from, setFrom] = useState<Lang>("en");
  const [text, setText] = useState(initialText ?? "");
  const [mode, setMode] = useState<Mode>("natural");
  const [result, setResult] = useState<{ translation: string; alternatives: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [explaining, setExplaining] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [recording, setRecording] = useState(false);
  const [rate, setRate] = useState(1);
  const recognitionRef = useRef<ReturnType<typeof getRecognition>>(null);
  const to: Lang = from === "en" ? "sw" : "en";

  const { addHistory } = useHistory();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => () => stopSpeaking(), []);

  const runTranslation = useCallback(
    async (regenerate = false) => {
      const value = text.trim();
      if (!value) {
        setError("Type or paste some text first.");
        return;
      }
      setLoading(true);
      setError(null);
      setExplanation(null);
      setFeedback(null);
      try {
        const response = await translate({
          data: {
            text: value.slice(0, MAX_CHARS),
            from,
            to,
            mode,
            ...(regenerate ? { nonce: Date.now() } : {}),
          },
        });
        if (!response.ok) {
          setError(response.error);
          setResult(null);
          return;
        }
        setResult({ translation: response.translation, alternatives: response.alternatives });
        addHistory({ source: value, target: response.translation, from, to, mode });
      } catch {
        setError("We couldn't reach the translation service. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    },
    [addHistory, from, mode, text, to, translate],
  );

  const onExplain = useCallback(async () => {
    if (!result) return;
    setExplaining(true);
    try {
      const response = await explain({
        data: { source: text.trim(), translation: result.translation, from, to },
      });
      if (!response.ok) {
        toast.error(response.error);
        return;
      }
      setExplanation(response.explanation);
    } catch {
      toast.error("We couldn't load an explanation. Please try again.");
    } finally {
      setExplaining(false);
    }
  }, [explain, from, result, text, to]);

  const swap = () => {
    stopSpeaking();
    const nextText = result?.translation ?? "";
    setFrom(to);
    setText(nextText);
    setResult(null);
    setExplanation(null);
    setFeedback(null);
  };

  const startRecording = () => {
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = getRecognition(from);
    if (!recognition) {
      toast.error("Voice input isn't supported in this browser.");
      return;
    }
    recognitionRef.current = recognition;
    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length })
        .map((_, i) => event.results[i]?.[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (transcript) setText(transcript);
    };
    recognition.onerror = (event) => {
      setRecording(false);
      toast.error(
        event.error === "not-allowed"
          ? "Microphone access was blocked. Allow it in your browser settings to speak."
          : "We couldn't hear that. Please try again.",
      );
    };
    recognition.onend = () => setRecording(false);
    try {
      recognition.start();
      setRecording(true);
    } catch {
      toast.error("We couldn't start the microphone.");
    }
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob(
      [`${NAME[from]}:\n${text.trim()}\n\n${NAME[to]}:\n${result.translation}\n`],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sauti-translation.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    if (!result) return;
    const shareData = { title: "Sauti translation", text: `${text.trim()}\n\n${result.translation}` };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        toast.success("Copied — ready to paste anywhere.");
      }
    } catch {
      /* the visitor dismissed the share sheet */
    }
  };

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const favorited = result ? isFavorite("translation", text.trim()) : false;

  return (
    <section id="translator" aria-label="Translator">
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tone
        </span>
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              mode === m.id
                ? "bg-brand text-brand-foreground"
                : "border border-border text-foreground/70 hover:bg-foreground/5"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-8 max-w-5xl">
        <button
          type="button"
          aria-label={`Swap to ${NAME[to]} to ${NAME[from]}`}
          onClick={swap}
          className="absolute left-1/2 top-1/2 z-10 hidden size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-background text-brand shadow-soft transition hover:bg-card md:grid"
        >
          <ArrowLeftRight className="size-4" aria-hidden />
        </button>

        <div className="grid gap-4 md:grid-cols-2 md:gap-0">
          {/* Input */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft md:rounded-r-none">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-border bg-foreground/[0.03] px-3 py-1.5 text-sm font-medium">
                  {NAME[from]}
                </span>
                <span className="text-xs text-muted-foreground" aria-hidden>
                  &rarr;
                </span>
                <button
                  type="button"
                  onClick={swap}
                  className="rounded-md px-2 py-1 text-xs font-medium text-brand transition hover:bg-foreground/5 md:hidden"
                >
                  Swap
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Paste from clipboard"
                  className={iconButton}
                  onClick={async () => {
                    try {
                      setText(await navigator.clipboard.readText());
                    } catch {
                      toast.error("Your browser blocked pasting. Use Ctrl/Cmd + V instead.");
                    }
                  }}
                >
                  <ClipboardPaste className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={recording ? "Stop recording" : "Speak instead of typing"}
                  aria-pressed={recording}
                  className={`${iconButton} relative ${recording ? "text-brand" : ""}`}
                  onClick={startRecording}
                >
                  {recording ? (
                    <span className="absolute inset-0 animate-ping rounded-md bg-brand/25" aria-hidden />
                  ) : null}
                  <Mic className="relative size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Clear text"
                  className={iconButton}
                  onClick={() => {
                    setText("");
                    setResult(null);
                    setExplanation(null);
                    setError(null);
                  }}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </div>

            <label htmlFor="source-text" className="sr-only">
              {NAME[from]} text
            </label>
            <textarea
              id="source-text"
              rows={6}
              value={text}
              maxLength={MAX_CHARS}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                from === "en" ? "Type or paste English text here..." : "Andika au bandika maandishi ya Kiswahili hapa..."
              }
              className="w-full flex-1 resize-none bg-transparent text-base leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>{chars} characters</span>
                <span>{words} words</span>
              </div>
              <button
                type="button"
                onClick={() => runTranslation()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-deep disabled:opacity-60"
              >
                {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                Translate
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col rounded-2xl border border-border bg-sand p-5 shadow-soft md:rounded-l-none">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-lg border border-border bg-foreground/[0.03] px-3 py-1.5 text-sm font-medium">
                {NAME[to]}
              </span>
              <div className="flex items-center gap-1">
                <SpeakButton text={result?.translation ?? ""} lang={to} />
                <CopyButton text={result?.translation ?? ""} />
                <button type="button" aria-label="Download translation" className={iconButton} onClick={download} disabled={!result}>
                  <Download className="size-4" aria-hidden />
                </button>
                <button type="button" aria-label="Share translation" className={iconButton} onClick={share} disabled={!result}>
                  <Share2 className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Regenerate translation"
                  className={iconButton}
                  onClick={() => runTranslation(true)}
                  disabled={!result || loading}
                >
                  <RefreshCw className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
                  className={iconButton}
                  disabled={!result}
                  onClick={() =>
                    result &&
                    toggleFavorite({
                      kind: "translation",
                      source: text.trim(),
                      target: result.translation,
                    })
                  }
                >
                  <Star className={`size-4 ${favorited ? "fill-gold text-gold" : ""}`} aria-hidden />
                </button>
              </div>
            </div>

            <div aria-live="polite" className="min-h-[6rem] flex-1">
              {loading ? (
                <div className="space-y-2" aria-label="Translating">
                  <div className="h-4 w-full animate-pulse rounded bg-foreground/10" />
                  <div className="h-4 w-11/12 animate-pulse rounded bg-foreground/10" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-foreground/10" />
                </div>
              ) : error ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-foreground">
                  {error}
                </p>
              ) : result ? (
                <p className="text-base leading-relaxed text-foreground">{result.translation}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your {NAME[to]} translation will appear here.
                </p>
              )}
            </div>

            {result && speechSupported() ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Speed</span>
                <input
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.25}
                  value={rate}
                  aria-label="Playback speed"
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="h-1 w-24 accent-[var(--brand)]"
                />
                <span>{rate}x</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-foreground/70 transition hover:bg-foreground/5"
                  onClick={() => speak(result.translation, to, rate)}
                >
                  <Volume2 className="size-3.5" aria-hidden /> Replay
                </button>
                <button
                  type="button"
                  className="rounded-md px-2 py-1 font-medium text-foreground/70 transition hover:bg-foreground/5"
                  onClick={stopSpeaking}
                >
                  Stop
                </button>
              </div>
            ) : null}

            {result && result.alternatives.length > 0 ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Alternatives
                </p>
                {result.alternatives.map((alt) => (
                  <div
                    key={alt}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card/70 px-3 py-2"
                  >
                    <span className="text-sm text-foreground/85">{alt}</span>
                    <div className="flex shrink-0 items-center gap-1">
                      <SpeakButton text={alt} lang={to} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-foreground/5" />
                      <CopyButton text={alt} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-foreground/5" />
                      <button
                        type="button"
                        className="rounded bg-foreground/[0.05] px-2 py-1 text-xs font-medium text-foreground/70 transition hover:bg-foreground/10"
                        onClick={() =>
                          setResult({
                            translation: alt,
                            alternatives: [
                              result.translation,
                              ...result.alternatives.filter((a) => a !== alt),
                            ],
                          })
                        }
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <button
                type="button"
                onClick={onExplain}
                disabled={!result || explaining}
                className="flex items-center gap-1.5 text-xs font-medium text-foreground/70 transition hover:text-foreground disabled:opacity-50"
              >
                {explaining ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="size-3.5" aria-hidden />
                )}
                Explain translation
              </button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Helpful?</span>
                <button
                  type="button"
                  aria-label="Yes, this translation is helpful"
                  aria-pressed={feedback === "up"}
                  disabled={!result}
                  onClick={() => {
                    setFeedback("up");
                    toast.success("Thanks for the feedback.");
                  }}
                  className={`grid size-7 place-items-center rounded-md border border-border bg-card transition hover:border-brand/40 ${
                    feedback === "up" ? "border-brand text-brand" : ""
                  }`}
                >
                  <ThumbsUp className="size-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="No, this translation is not helpful"
                  aria-pressed={feedback === "down"}
                  disabled={!result}
                  onClick={() => setFeedback("down")}
                  className={`grid size-7 place-items-center rounded-md border border-border bg-card transition hover:border-brand/40 ${
                    feedback === "down" ? "border-brand text-brand" : ""
                  }`}
                >
                  <ThumbsDown className="size-3.5" aria-hidden />
                </button>
              </div>
            </div>

            {feedback === "down" ? (
              <div className="mt-3 rounded-lg border border-border bg-card/70 p-3">
                <p className="mb-2 text-xs font-medium text-foreground/80">What went wrong?</p>
                <div className="flex flex-wrap gap-1.5">
                  {FEEDBACK_REASONS.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => {
                        setFeedback(null);
                        toast.success("Thanks — that helps us improve.");
                      }}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground/70 transition hover:bg-foreground/5"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {explanation ? (
          <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-display text-lg font-semibold">About this translation</h2>
            <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              {[
                ["Meaning", explanation.meaning],
                ["Context", explanation.context],
                ["Grammar", explanation.grammar],
                ["Why it is phrased this way", explanation.why],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-1 text-foreground/85">{value}</dd>
                  </div>
                ))}
            </dl>
            {explanation.keyWords.length ? (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Important words
                </p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {explanation.keyWords.map((kw) => (
                    <li key={kw.word} className="rounded-lg bg-sand px-3 py-2 text-sm">
                      <span className="font-semibold">{kw.word}</span>{" "}
                      <span className="text-foreground/70">{kw.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="mx-auto mt-4 max-w-5xl text-center text-xs text-muted-foreground">
        Your history and favorites stay on this device. Nothing is uploaded without your action.
      </p>
    </section>
  );
}
