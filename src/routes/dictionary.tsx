import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { dictionary } from "@/data/dictionary";
import { FavoriteButton, SpeakButton } from "@/components/actions";
import { useFavorites } from "@/lib/local-store";

const TITLE = "English Swahili Dictionary | Sauti";
const DESCRIPTION =
  "Search an English Swahili dictionary with meanings, parts of speech, example sentences, related words and pronunciation.";

export const Route = createFileRoute("/dictionary")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/dictionary" },
    ],
    links: [{ rel: "canonical", href: "/dictionary" }],
  }),
  component: DictionaryPage,
});

function DictionaryPage() {
  const [query, setQuery] = useState("");
  const { toggleFavorite, isFavorite } = useFavorites();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dictionary;
    return dictionary.filter((e) =>
      `${e.en} ${e.sw} ${e.definition} ${e.related.join(" ")}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
        English &#8646; Swahili Dictionary
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Look up a word in either language to see its meaning, part of speech, an example sentence and
        related words.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-soft">
        <Search className="size-4 text-muted-foreground" aria-hidden />
        <label className="sr-only" htmlFor="dictionary-search">
          Search the dictionary
        </label>
        <input
          id="dictionary-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search in English or Kiswahili…"
          className="w-full bg-transparent text-base focus:outline-none"
        />
      </div>

      {results.length === 0 ? (
        <p className="mt-10 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No entry matches &ldquo;{query}&rdquo; yet. Try the translator for full sentences.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {results.map((entry) => (
            <li key={entry.sw} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold">{entry.sw}</h2>
                  <p className="text-sm text-muted-foreground">
                    {entry.en} &middot; <span className="italic">{entry.pos}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <SpeakButton text={entry.sw} lang="sw" />
                  <FavoriteButton
                    active={isFavorite("word", entry.en)}
                    onToggle={() =>
                      toggleFavorite({ kind: "word", source: entry.en, target: entry.sw })
                    }
                  />
                </div>
              </div>
              <p className="mt-2 text-sm text-foreground/80">{entry.definition}</p>
              <p className="mt-3 rounded-lg bg-sand px-3 py-2 text-sm italic text-foreground/75">
                &ldquo;{entry.example.sw}&rdquo; &mdash; {entry.example.en}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Related: {entry.related.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
