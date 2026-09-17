import { createFileRoute } from "@tanstack/react-router";
import { lessons } from "@/data/learn";
import { SpeakButton } from "@/components/actions";

const TITLE = "Learn Swahili: Greetings, Numbers, Grammar and Pronunciation | Sauti";
const DESCRIPTION =
  "Start learning Swahili with basic greetings, numbers, days and months, common vocabulary, simple grammar, pronunciation and everyday expressions.";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/learn" },
    ],
    links: [{ rel: "canonical", href: "/learn" }],
  }),
  component: LearnPage,
});

function LearnPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Learn Swahili</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A short, practical start in Kiswahili. Each section stands on its own, so you can dip in
        whenever you have a minute.
      </p>

      <div className="mt-8 space-y-6">
        {lessons.map((lesson) => (
          <section
            key={lesson.id}
            aria-labelledby={`lesson-${lesson.id}`}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <h2 id={`lesson-${lesson.id}`} className="font-display text-xl font-semibold">
              {lesson.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{lesson.summary}</p>

            {lesson.pairs ? (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {lesson.pairs.map((pair) => (
                  <li
                    key={`${lesson.id}-${pair.en}`}
                    className="flex items-center justify-between gap-2 rounded-lg bg-sand px-3 py-2"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{pair.sw}</span>
                      <span className="block truncate text-xs text-muted-foreground">{pair.en}</span>
                    </span>
                    <SpeakButton text={pair.sw} lang="sw" />
                  </li>
                ))}
              </ul>
            ) : null}

            {lesson.notes ? (
              <ul className="mt-4 space-y-2">
                {lesson.notes.map((note) => (
                  <li key={note} className="rounded-lg bg-sand px-3 py-2 text-sm text-foreground/85">
                    {note}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
