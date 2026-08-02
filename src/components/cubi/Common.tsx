import type { ReactNode } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillStatus } from "@/data/cubi-demo";
import { skillStatusLabel } from "@/data/cubi-demo";

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-bold text-primary", className)}>
      <Sparkles className="size-3.5" /> Demo data
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={cn("panel group min-h-32 p-5", accent && "border-primary/40 bg-primary/[0.08]")}>
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid size-10 place-items-center rounded-2xl bg-secondary text-muted-foreground", accent && "bg-primary/15 text-primary")}>{icon}</span>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

const statusClass: Record<SkillStatus, string> = {
  acquired: "border-emerald-300 bg-emerald-50 text-emerald-800",
  partial: "border-amber-300 bg-amber-50 text-amber-800",
  developing: "border-sky-300 bg-sky-50 text-sky-800",
  missing: "border-rose-300 bg-rose-50 text-rose-800",
  optional: "border-violet-300 bg-violet-50 text-violet-800",
  verify: "border-primary/30 bg-primary/10 text-primary",
};

export function StatusBadge({ status }: { status: SkillStatus }) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold", statusClass[status])}>{skillStatusLabel[status]}</span>;
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "success" | "warning" }) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "warning" ? AlertCircle : Info;
  return (
    <div className={cn("flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6", tone === "warning" ? "border-amber-300 bg-amber-50" : tone === "success" ? "border-emerald-300 bg-emerald-50" : "border-primary/25 bg-primary/[0.06]")}>
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
      <div>{children}</div>
    </div>
  );
}

export function LevelDots({ current, target }: { current: number; target: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Current level ${current} of target ${target}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-2 flex-1 rounded-full bg-secondary",
            index < current && "bg-primary",
            index >= current && index < target && "border border-primary/35 bg-transparent",
          )}
        />
      ))}
    </div>
  );
}
