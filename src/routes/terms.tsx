import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Terms of Service | Sauti English Swahili Translator";
const DESCRIPTION =
  "The terms that apply when you use Sauti, the free English to Swahili and Swahili to English translator.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 9 September 2026</p>

      <div className="mt-6 space-y-5 text-foreground/85">
        <section>
          <h2 className="font-display text-xl font-semibold">Using Sauti</h2>
          <p className="mt-2">
            Sauti is offered free of charge for personal and professional translation between English
            and Kiswahili. No account is required. By using the service you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Acceptable use</h2>
          <p className="mt-2">
            Please do not use the service to break the law, to send unlawful or abusive content, or
            to overload or disrupt it through automated bulk requests. We apply rate limits to keep
            the translator fast and available for everyone.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Accuracy</h2>
          <p className="mt-2">
            Translations are produced automatically. They are usually good, but they are not
            guaranteed to be perfect. For legal, medical, financial, safety-critical or official
            documents, have a qualified human translator review the result before relying on it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Your content</h2>
          <p className="mt-2">
            You keep all rights to the text you enter and to the translation you receive. We claim no
            ownership over either.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Availability and liability</h2>
          <p className="mt-2">
            The service is provided &ldquo;as is&rdquo;, without warranties of any kind, and may be
            interrupted or changed at any time. To the fullest extent permitted by law, we are not
            liable for any loss arising from the use of, or inability to use, the service.
          </p>
        </section>
      </div>
    </div>
  );
}
