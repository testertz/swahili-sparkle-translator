import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { phraseCategories } from "@/data/phrases";
import { CopyButton, FavoriteButton, SpeakButton } from "@/components/actions";
import { useFavorites } from "@/lib/local-store";

const TITLE = "Common Swahili Phrases with English Translations | Sauti";
const DESCRIPTION =
  "Useful Swahili phrases for greetings, travel, business, shopping, restaurants, directions, school and work, each with the English translation and audio.";

export const Route = createFileRoute("/phrases")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/phrases" },
    ],
    links: [{ rel: "canonical", href: "/phrases" }],
  }),
  component: PhrasesPage,
});

function PhrasesPage() {
  const [active, setActive] = useState(phraseCategories[0]!.id);
  const { toggleFavorite, isFavorite } = useFavorites();
  const category = phraseCategories.find((c) => c.id === active) ?? phraseCategories[0]!;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Common Swahili Phrases</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Phrases you will actually use, grouped by situation. Listen, copy, or save any of them to
        your device.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Phrase categories">
        {phraseCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === active}
            onClick={() => setActive(c.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              c.id === active
                ? "bg-brand text-brand-foreground"
                : "border border-border text-foreground/70 hover:bg-foreground/5"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {category.phrases.map((p) => (
          <li
            key={p.en}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{p.en}</p>
              <p className="text-sm text-muted-foreground">{p.sw}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <SpeakButton text={p.sw} lang="sw" />
              <CopyButton text={p.sw} />
              <FavoriteButton
                active={isFavorite("phrase", p.en)}
                onToggle={() => toggleFavorite({ kind: "phrase", source: p.en, target: p.sw })}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
