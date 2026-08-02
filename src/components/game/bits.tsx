import { cn } from "@/lib/utils";
import type { Rarity } from "@/data/types";
import type { ReactNode } from "react";

export function XpBar({ percent, className }: { percent: number; className?: string }) {
  return (
    <div className={cn("h-3 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className="xp-fill h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${Math.max(3, Math.min(100, percent))}%` }}
      />
    </div>
  );
}

export const rarityStyles: Record<Rarity, string> = {
  common: "border-border text-muted-foreground",
  rare: "border-primary/50 text-primary",
  epic: "border-violet/60 text-violet",
  legendary: "border-gold/70 text-gold",
};

export function RarityTag({ rarity }: { rarity: Rarity }) {
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", rarityStyles[rarity])}>
      {rarity}
    </span>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("panel p-5", className)}>{children}</div>;
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      )}
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
    </div>
  );
}

export function StatPill({ icon, label, value, accent }: { icon: ReactNode; label: string; value: string; accent?: "gold" | "coral" | "primary" }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/60 px-3 py-2">
      <span
        className={cn(
          "grid size-9 place-items-center rounded-xl bg-secondary text-base",
          accent === "gold" && "bg-gold/15 text-gold",
          accent === "coral" && "bg-coral/15 text-coral",
          accent === "primary" && "bg-primary/15 text-primary",
        )}
      >
        {icon}
      </span>
      <div className="leading-tight">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-base font-bold">{value}</p>
      </div>
    </div>
  );
}

export function ProgressRing({ value, size = 120, label }: { value: number; size?: number; label?: string }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth="10" className="stroke-secondary" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          className="stroke-primary transition-[stroke-dashoffset] duration-1000"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, value)) / 100}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-2xl font-extrabold">{value}%</p>
        {label && <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>}
      </div>
    </div>
  );
}