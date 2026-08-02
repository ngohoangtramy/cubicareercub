import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, Check, FileText, Link2, ListPlus, Upload } from "lucide-react";
import { CubiMascot } from "@/components/cubi/CubiMascot";
import { CubiLogo } from "@/components/cubi/CubiLogo";
import { Button } from "@/components/ui/button";
import { DemoBadge, Notice } from "@/components/cubi/Common";
import { LanguageSwitcher } from "@/components/cubi/LanguageSwitcher";
import { useCubi } from "@/lib/cubi";

export const Route = createFileRoute("/analysis")({
  head: () => ({ meta: [{ title: "Analysing your profile | Cubi" }] }),
  component: AnalysisPage,
});

const stages = [
  ["Finding your programme", "Checking your selection."],
  ["Reading course data", "Collecting course descriptions."],
  ["Finding course skills", "Reading learning outcomes."],
  ["Building your skill map", "Grouping the evidence."],
  ["Checking your target career", "Finding common requirements."],
  ["Reading demo jobs", "Comparing job requirements."],
  ["Finding skill gaps", "Comparing current and target skills."],
  ["Building your career path", "Creating your next steps."],
] as const;

export function AnalysisPage() {
  const [stage, setStage] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();
  const { completeAnalysis } = useCubi();
  const percentage = Math.min(100, Math.round(((stage + 1) / stages.length) * 100));

  useEffect(() => {
    if (stage >= stages.length - 1) {
      const finish = window.setTimeout(() => {
        completeAnalysis();
        void navigate({ to: "/home" });
      }, 1300);
      return () => window.clearTimeout(finish);
    }
    const timer = window.setTimeout(() => setStage((value) => value + 1), 620);
    return () => window.clearTimeout(timer);
  }, [stage, completeAnalysis, navigate]);

  const status = useMemo(() => {
    if (stage < 2) return "6 demo courses found.";
    if (stage < 4) return "9 skill areas found.";
    if (stage < 6) return "Comparing 22 demo job records.";
    return "Your career map is almost ready.";
  }, [stage]);

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3 font-display text-xl font-extrabold"><CubiLogo size={42} className="rounded-xl" /><span>Cubi <span className="hidden text-sm font-semibold text-primary sm:inline">Your Career Cub</span></span></div><div className="flex items-center gap-2"><LanguageSwitcher compact /><DemoBadge /></div></div>
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[320px_1fr]">
          <div className="panel flex flex-col items-center p-7 text-center">
            <CubiMascot size={230} mood={stage >= 6 ? "celebrate" : "thinking"} animated />
            <p className="mt-2 text-sm font-bold text-primary">Building your map</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Using demo course and job data.</p>
          </div>
          <div>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Building your career map</h1>
            <p className="mt-3 text-muted-foreground">Connecting your education to your target career.</p>
            <div className="mt-7 flex items-center gap-4"><div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${percentage}%` }} /></div><strong className="w-12 text-right text-primary">{percentage}%</strong></div>
            <p className="mt-3 text-sm text-muted-foreground">{status}</p>
            <div className="mt-8 space-y-2">
              {stages.map(([title, detail], index) => {
                const done = index < stage;
                const active = index === stage;
                return (
                  <div key={title} className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition ${active ? "border-primary/50 bg-primary/10" : "border-transparent bg-card/35"}`}>
                    <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${done ? "bg-emerald-100 text-emerald-800" : active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{done ? <Check className="size-3.5" /> : index + 1}</span>
                    <div><p className={`text-sm font-bold ${!active && !done ? "text-muted-foreground" : ""}`}>{title}</p>{active && <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button onClick={() => setShowHelp((value) => !value)} className="flex items-center gap-2 text-sm font-bold text-primary"><AlertTriangle className="size-4" />Trouble finding the catalogue?</button>
          {showHelp && (
            <div className="mt-4 panel p-5">
              <Notice tone="warning"><strong className="text-foreground">Try another source.</strong> Cubi should never invent missing course data.</Notice>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Recovery icon={<Link2 className="size-5" />} title="Paste catalogue URL" />
                <Recovery icon={<Upload className="size-5" />} title="Upload catalogue" />
                <Recovery icon={<ListPlus className="size-5" />} title="Enter courses manually" />
                <Recovery icon={<FileText className="size-5" />} title="Continue with demo" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Recovery({ icon, title }: { icon: ReactNode; title: string }) {
  return <Button variant="secondary" className="h-auto justify-start py-4">{icon}<span className="text-left">{title}</span></Button>;
}
