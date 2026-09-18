import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const TITLE = "Contact | Sauti English Swahili Translator";
const DESCRIPTION =
  "Report a wrong translation, suggest a word for the dictionary, or send feedback about Sauti.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const EMAIL = "hello@sauti.app";

function ContactPage() {
  const [topic, setTopic] = useState("Wrong translation");
  const [message, setMessage] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Contact</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Found a translation that reads wrong, or a Kiswahili word we should add? Tell us — corrections
        from real speakers are how this gets better.
      </p>

      <form
        className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          if (!message.trim()) {
            toast.error("Please write a short message first.");
            return;
          }
          const href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Sauti: ${topic}`)}&body=${encodeURIComponent(message)}`;
          window.location.href = href;
          toast.success("Opening your email app…");
        }}
      >
        <div>
          <label htmlFor="topic" className="mb-1.5 block text-sm font-medium">
            Topic
          </label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option>Wrong translation</option>
            <option>Dictionary suggestion</option>
            <option>Phrase suggestion</option>
            <option>Something is broken</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what happened, and what the Kiswahili should have been."
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-deep"
        >
          <Mail className="size-4" aria-hidden /> Send message
        </button>
        <p className="text-xs text-muted-foreground">
          This opens your own email app — nothing is stored here. You can also write directly to{" "}
          <a href={`mailto:${EMAIL}`} className="font-medium text-brand hover:underline">
            {EMAIL}
          </a>
          .
        </p>
      </form>
    </div>
  );
}
