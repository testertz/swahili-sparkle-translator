import { useState } from "react";
import { Trash2 } from "lucide-react";
import { CopyButton, iconButton, SpeakButton } from "@/components/actions";
import { useFavorites, useHistory } from "@/lib/local-store";

function timeAgo(ts: number) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(ts).toLocaleDateString();
}

export function HistoryAndFavorites({ onReuse }: { onReuse?: (text: string) => void }) {
  const { history, removeHistory, clearHistory } = useHistory();
  const { favorites, removeFavorite } = useFavorites();
  const [query, setQuery] = useState("");

  const filtered = favorites.filter((f) =>
    `${f.source} ${f.target}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft" aria-label="Recent translations">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Recent translations</h2>
          {history.length ? (
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              Clear history
            </button>
          ) : null}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Translations you make appear here, saved only on this device.
          </p>
        ) : (
          <ul className="space-y-2">
            {history.slice(0, 8).map((item) => (
              <li key={item.id} className="rounded-lg bg-sand px-3 py-2.5">
                <p className="truncate text-sm text-foreground/85">{item.source}</p>
                <p className="truncate text-sm text-muted-foreground">{item.target}</p>
                <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{timeAgo(item.createdAt)}</span>
                  <span className="flex items-center gap-2">
                    {onReuse ? (
                      <button
                        type="button"
                        className="font-medium text-foreground/70 transition hover:text-foreground"
                        onClick={() => onReuse(item.source)}
                      >
                        Reuse
                      </button>
                    ) : null}
                    <CopyButton text={item.target} className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-foreground/5" />
                    <button
                      type="button"
                      aria-label="Delete this item"
                      className="grid size-6 place-items-center rounded text-muted-foreground transition hover:text-destructive"
                      onClick={() => removeHistory(item.id)}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft" aria-label="Favorites">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold">Favorites</h2>
          <label className="sr-only" htmlFor="favorite-search">
            Search favorites
          </label>
          <input
            id="favorite-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search favorites"
            className="w-36 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none"
          />
        </div>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Star a translation, word, or phrase to keep it here on this device.
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.slice(0, 8).map((item) => (
              <li key={item.id} className="flex items-center gap-3 rounded-lg bg-sand px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground/90">{item.source}</p>
                  <p className="truncate text-sm text-muted-foreground">{item.target}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <SpeakButton text={item.target} lang={item.kind === "word" ? "sw" : "sw"} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-foreground/5" />
                  <CopyButton text={item.target} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-foreground/5" />
                  <button
                    type="button"
                    aria-label="Remove favorite"
                    className={iconButton}
                    onClick={() => removeFavorite(item.id)}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
