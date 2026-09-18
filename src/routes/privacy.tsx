import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Privacy Policy | Sauti English Swahili Translator";
const DESCRIPTION =
  "How Sauti handles translation requests: no accounts, no personal profiles, and history and favorites kept in your own browser.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 9 September 2026</p>

      <div className="mt-6 space-y-5 text-foreground/85">
        <section>
          <h2 className="font-display text-xl font-semibold">No accounts, no profiles</h2>
          <p className="mt-2">
            Sauti has no sign-up, no login and no user accounts. We do not build a profile of you and
            we do not ask for your name, email address or phone number to use the translator.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">How translation requests work</h2>
          <p className="mt-2">
            When you press Translate, the text you entered is sent over an encrypted connection to
            our server, which forwards it to the translation provider that generates the result. The
            translation is returned to your browser. We do not attach your identity to that request.
          </p>
          <p className="mt-2">
            A translation may be held briefly in a temporary cache so that an identical request can
            be answered faster, and basic technical logs (such as error counts) are kept to keep the
            service running. Please avoid pasting passwords, payment details, or sensitive personal
            information into any translation tool, including this one.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">History and favorites stay with you</h2>
          <p className="mt-2">
            Your recent translations and favorites are stored in your browser&rsquo;s local storage on
            your own device. They are never uploaded to us. Clearing your history, clearing your
            favorites, or clearing your browser data removes them permanently.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Voice and audio</h2>
          <p className="mt-2">
            Speaking and listening use the speech features built into your browser and operating
            system. Audio is handled on your device, and microphone access is only used while you are
            actively recording.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Children</h2>
          <p className="mt-2">
            The service is intended for general audiences and does not knowingly collect personal
            information from children.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Changes</h2>
          <p className="mt-2">
            If this policy changes, the updated date at the top of this page will change with it.
          </p>
        </section>
      </div>
    </div>
  );
}
