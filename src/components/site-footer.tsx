import { Link } from "@tanstack/react-router";

const LINKS = [
  { to: "/about", label: "About" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-footer">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground md:flex-row">
        <p className="flex items-center gap-2">
          <span className="font-display grid size-7 place-items-center rounded-lg bg-brand text-brand-foreground">
            S
          </span>
          <span className="font-display font-semibold text-foreground">Sauti.</span>
          <span className="text-muted-foreground">English &#8646; Kiswahili</span>
        </p>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-5">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="transition hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">No accounts. Your data stays in your browser.</p>
      </div>
    </footer>
  );
}
