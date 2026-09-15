import { useCallback, useEffect, useState } from "react";

export type HistoryItem = {
  id: string;
  source: string;
  target: string;
  from: "en" | "sw";
  to: "en" | "sw";
  mode: string;
  createdAt: number;
};

export type FavoriteItem = {
  id: string;
  kind: "translation" | "word" | "phrase";
  source: string;
  target: string;
  note?: string;
  createdAt: number;
};

const HISTORY_KEY = "sauti-history";
const FAVORITES_KEY = "sauti-favorites";
const MAX_HISTORY = 50;

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("sauti-store", { detail: key }));
  } catch {
    /* storage full or blocked — local features simply stay empty */
  }
}

function useLocalList<T extends { id: string }>(key: string) {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    setItems(read<T>(key));
    const sync = () => setItems(read<T>(key));
    window.addEventListener("sauti-store", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sauti-store", sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const save = useCallback(
    (next: T[]) => {
      write(key, next);
      setItems(next);
    },
    [key],
  );

  const remove = useCallback((id: string) => save(read<T>(key).filter((i) => i.id !== id)), [key, save]);
  const clear = useCallback(() => save([]), [save]);

  return { items, save, remove, clear };
}

export function useHistory() {
  const { items, save, remove, clear } = useLocalList<HistoryItem>(HISTORY_KEY);
  const add = useCallback(
    (item: Omit<HistoryItem, "id" | "createdAt">) => {
      const next = [
        { ...item, id: crypto.randomUUID(), createdAt: Date.now() },
        ...read<HistoryItem>(HISTORY_KEY),
      ].slice(0, MAX_HISTORY);
      save(next);
    },
    [save],
  );
  return { history: items, addHistory: add, removeHistory: remove, clearHistory: clear };
}

export function useFavorites() {
  const { items, save, remove, clear } = useLocalList<FavoriteItem>(FAVORITES_KEY);
  const toggle = useCallback(
    (item: Omit<FavoriteItem, "id" | "createdAt">) => {
      const current = read<FavoriteItem>(FAVORITES_KEY);
      const existing = current.find((i) => i.kind === item.kind && i.source === item.source);
      if (existing) {
        save(current.filter((i) => i.id !== existing.id));
        return false;
      }
      save([{ ...item, id: crypto.randomUUID(), createdAt: Date.now() }, ...current]);
      return true;
    },
    [save],
  );
  const isFavorite = useCallback(
    (kind: FavoriteItem["kind"], source: string) =>
      items.some((i) => i.kind === kind && i.source === source),
    [items],
  );
  return { favorites: items, toggleFavorite: toggle, isFavorite, removeFavorite: remove, clearFavorites: clear };
}
