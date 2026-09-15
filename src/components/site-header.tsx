import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { to: "/", label: "Translator" },
  { to: "/dictionary", label: "Dictionary" },
  { to: "/phrases", label: "Common Phrases" },
  { to: "/learn", label: "Learn Swahili" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Sauti home">
          <span className="font-display grid size-9 place-items-center rounded-xl bg-brand text-brand-foreground">
            S
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Sauti<span className="text-brand">.</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 text-sm font-medium text-foreground/70 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-brand" }}
              className="transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg border border-border text-foreground/70 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="border-t border-border bg-background px-5 py-3 md:hidden">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-brand" }}
                  className="block py-2.5 text-sm font-medium text-foreground/80"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
