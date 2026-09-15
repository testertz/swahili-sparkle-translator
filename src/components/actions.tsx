import { useState } from "react";
import { Check, Copy, Star, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { speak, speechSupported, type Lang } from "@/lib/speech";

export const iconButton =
  "grid size-8 place-items-center rounded-md text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground disabled:opacity-40";

export function SpeakButton({
  text,
  lang,
  className,
  label = "Listen",
}: {
  text: string;
  lang: Lang;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={className ?? iconButton}
      onClick={() => {
        if (!speechSupported() || !speak(text, lang)) {
          toast.error("Audio isn't available in this browser.");
        }
      }}
    >
      <Volume2 className="size-4" aria-hidden />
    </button>
  );
}

export function CopyButton({
  text,
  className,
  label = "Copy",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={className ?? iconButton}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success("Copied");
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Your browser blocked copying.");
        }
      }}
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
    </button>
  );
}

export function FavoriteButton({
  active,
  onToggle,
  className,
}: {
  active: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      title={active ? "Remove from favorites" : "Add to favorites"}
      className={className ?? iconButton}
      onClick={onToggle}
    >
      <Star className={`size-4 ${active ? "fill-gold text-gold" : ""}`} aria-hidden />
    </button>
  );
}
