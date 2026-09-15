import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";

const OPTIONS: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="flex items-center gap-0.5 rounded-lg border border-border p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={`${label} theme`}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          className={`grid size-7 place-items-center rounded-md transition ${
            theme === value
              ? "bg-brand text-brand-foreground"
              : "text-muted-foreground hover:bg-foreground/5"
          }`}
        >
          <Icon className="size-3.5" aria-hidden />
        </button>
      ))}
    </div>
  );
}
