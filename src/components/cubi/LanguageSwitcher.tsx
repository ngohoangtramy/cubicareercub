import { Languages } from "lucide-react";
import { languageLabels, useI18n, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const languages: Language[] = ["en", "vi", "nl"];

export function LanguageSwitcher({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { language, setLanguage } = useI18n();

  return (
    <div
      data-no-translate
      className={cn(
        "inline-flex items-center rounded-xl border border-border bg-card p-1 shadow-sm",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {!compact && <Languages className="mx-1.5 size-4 text-muted-foreground" aria-hidden="true" />}
      {languages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold transition",
            language === item
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
          aria-pressed={language === item}
          title={languageLabels[item].full}
        >
          {compact ? languageLabels[item].short : languageLabels[item].full}
        </button>
      ))}
    </div>
  );
}
