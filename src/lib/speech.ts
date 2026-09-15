/**
 * Thin wrappers over the browser speech APIs so components stay tidy.
 * Everything runs on-device — no audio leaves the browser.
 */

export type Lang = "en" | "sw";

const LOCALES: Record<Lang, string[]> = {
  en: ["en-US", "en-GB", "en"],
  sw: ["sw-TZ", "sw-KE", "sw"],
};

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(lang: Lang) {
  const voices = window.speechSynthesis.getVoices();
  for (const locale of LOCALES[lang]) {
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(locale.toLowerCase()));
    if (match) return match;
  }
  return undefined;
}

export function speak(text: string, lang: Lang, rate = 1) {
  if (!speechSupported() || !text.trim()) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LOCALES[lang][0] ?? lang;
  utterance.rate = rate;
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

export function getRecognition(lang: Lang) {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.lang = LOCALES[lang][0] ?? lang;
  recognition.interimResults = true;
  recognition.continuous = false;
  return recognition;
}
