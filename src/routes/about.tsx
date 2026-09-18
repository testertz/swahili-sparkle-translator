import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE = "About Sauti — English Swahili Translation | Sauti";
const DESCRIPTION =
  "Sauti is a free English to Swahili and Swahili to English translator focused on natural, accurate Kiswahili. No accounts, no tracking of your text.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">About Sauti</h1>
      <div className="mt-6 space-y-5 text-foreground/85">
        <p>
          Sauti is a translator for English and Kiswahili built around one belief: a translation is
          only good if a native speaker would actually say it that way. Instead of swapping words one
          by one, it translates meaning — keeping noun classes, agreement and tone intact.
        </p>
        <p>
          You can choose the register you need, from relaxed conversation to formal and academic
          writing, hear the result read aloud, ask for alternative phrasings, and see a short
          explanation of why a sentence was worded the way it was.
        </p>
        <p>
          Alongside the translator there is a growing English &#8646; Swahili dictionary, a set of
          practical phrases for travel, work and daily life, and a short learning section covering
          greetings, numbers, grammar and pronunciation.
        </p>
        <h2 className="font-display pt-2 text-xl font-semibold">No accounts, by design</h2>
        <p>
          There is nothing to sign up for. Your recent translations and favorites are stored in your
          own browser, not on our servers, and you can clear them at any time. Read more in the{" "}
          <Link to="/privacy" className="font-medium text-brand hover:underline">
            privacy policy
          </Link>
          .
        </p>
        <h2 className="font-display pt-2 text-xl font-semibold">What comes next</h2>
        <p>
          This is the first release. Image and document translation, live conversation mode, more
          African languages and a developer API are all on the roadmap. If something reads wrong,
          the thumbs-down button on every translation is the fastest way to tell us.
        </p>
      </div>
    </div>
  );
}
