import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Translator } from "@/components/translator";
import { HistoryAndFavorites } from "@/components/history-favorites";
import { phraseCategories } from "@/data/phrases";
import { dictionary } from "@/data/dictionary";
import { lessons } from "@/data/learn";
import { SpeakButton } from "@/components/actions";

const TITLE = "English to Swahili Translator | Sauti";
const DESCRIPTION =
  "Translate English and Kiswahili naturally, accurately and instantly. Free English to Swahili translator with pronunciation, dictionary and common phrases.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "English to Swahili translator, Swahili to English translator, English Swahili translation, Swahili dictionary, Swahili phrases, learn Swahili, Swahili pronunciation",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Sauti",
          applicationCategory: "UtilitiesApplication",
          description: DESCRIPTION,
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [seed, setSeed] = useState("");
  const phrases = phraseCategories[0]?.phrases.slice(0, 3) ?? [];
  const word = dictionary[0]!;
  const numbers = lessons.find((l) => l.id === "numbers")?.pairs?.slice(0, 6) ?? [];

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-8 md:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            English &#8646; Kiswahili
          </p>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            English to <span className="text-brand">Swahili</span> Translator
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Translate English and Kiswahili naturally, accurately, and instantly.
          </p>
        </div>

        <Translator key={seed} initialText={seed} />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-4">
        <HistoryAndFavorites onReuse={setSeed} />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-display mb-4 text-base font-semibold">Dictionary</h2>
            <p className="text-sm">
              <span className="font-semibold">{word.sw}</span>{" "}
              <span className="text-xs italic text-muted-foreground">{word.pos}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{word.definition}</p>
            <p className="mt-3 rounded-lg bg-sand px-3 py-2 text-sm italic text-foreground/70">
              &ldquo;{word.example.sw}&rdquo; &mdash; {word.example.en}
            </p>
            <Link to="/dictionary" className="mt-4 block text-center text-xs font-medium text-brand hover:underline">
              Search the dictionary &rarr;
            </Link>
          </article>

          <article className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-display mb-4 text-base font-semibold">Common Phrases</h2>
            <div className="space-y-2.5">
              {phrases.map((p) => (
                <div key={p.en} className="flex items-center justify-between gap-2 rounded-lg bg-sand px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.en}</p>
                    <p className="truncate text-sm text-muted-foreground">{p.sw}</p>
                  </div>
                  <SpeakButton text={p.sw} lang="sw" />
                </div>
              ))}
            </div>
            <Link to="/phrases" className="mt-4 block text-center text-xs font-medium text-brand hover:underline">
              Browse all phrases &rarr;
            </Link>
          </article>

          <article className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-display mb-4 text-base font-semibold">Learn Swahili</h2>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Numbers
            </p>
            <div className="grid grid-cols-3 gap-2">
              {numbers.map((n) => (
                <div key={n.en} className="rounded-lg bg-sand px-2 py-2 text-center">
                  <p className="text-sm font-semibold">{n.sw}</p>
                  <p className="text-xs text-muted-foreground">{n.en}</p>
                </div>
              ))}
            </div>
            <Link to="/learn" className="mt-4 block text-center text-xs font-medium text-brand hover:underline">
              Continue learning &rarr;
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
