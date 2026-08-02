import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Award, CalendarCheck, CheckCircle2, FileUp, Flag, NotebookPen, Plus, TrendingUp } from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { CubiMascot } from "@/components/cubi/CubiMascot";
import { DemoBadge, PageHeader } from "@/components/cubi/Common";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";

export const Route = createFileRoute("/social")({
  head: () => ({ meta: [{ title: "Progress | Cubi" }] }),
  component: ProgressPage,
});

export function ProgressPage() {
  const { activity, skills, recommendations } = useCubi();
  const [evidenceName, setEvidenceName] = useState<string | null>(null);
  const completed = recommendations.filter((item) => item.status === "completed").length;
  const inProgress = recommendations.filter((item) => item.status === "in-progress").length;
  const acquired = skills.filter((skill) => skill.status === "acquired").length;
  const weekly = useMemo(() => [
    { label: "Actions completed", value: completed, target: 2 },
    { label: "Actions in progress", value: inProgress, target: 2 },
    { label: "Skills verified", value: acquired, target: 4 },
  ], [completed, inProgress, acquired]);

  return (
    <CubiShell>
      <div className="space-y-7">
        <PageHeader eyebrow="Evidence and milestones" title="Progress" description="Track your completed goals and evidence." action={<DemoBadge />} />

        <section className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="panel flex flex-col items-center p-6 text-center">
            <CubiMascot size={190} mood="celebrate" animated />
            <h2 className="mt-2 font-display text-2xl font-extrabold">Keep the evidence moving</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Progress updates automatically when you complete an action, change a skill status or add evidence.</p>
            <label className="mt-5 w-full cursor-pointer"><input type="file" className="sr-only" onChange={(event) => setEvidenceName(event.target.files?.[0]?.name ?? null)} /><span className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"><FileUp className="size-4" />Upload evidence</span></label>
            {evidenceName && <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground">Selected locally: {evidenceName}</p>}
          </div>

          <div className="panel p-5">
            <div className="flex items-center gap-2"><TrendingUp className="size-5 text-primary" /><h2 className="font-display text-xl font-extrabold">Weekly progress summary</h2></div>
            <div className="mt-5 space-y-5">
              {weekly.map((item) => {
                const percent = Math.min(100, Math.round((item.value / item.target) * 100));
                return <div key={item.label}><div className="flex items-center justify-between text-sm"><span className="font-semibold">{item.label}</span><span className="text-muted-foreground">{item.value}/{item.target}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /></div></div>;
              })}
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3"><ProgressMetric icon={<CheckCircle2 className="size-5" />} value={completed} label="Completed actions" /><ProgressMetric icon={<Award className="size-5" />} value={acquired} label="Acquired skills" /><ProgressMetric icon={<CalendarCheck className="size-5" />} value="2" label="Active milestones" /></div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="panel p-5">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">History</p><h2 className="mt-1 font-display text-xl font-extrabold">Activity timeline</h2></div><Button variant="secondary" size="sm"><NotebookPen className="size-4" />Add note</Button></div>
            <div className="mt-5 space-y-0">
              {activity.map((entry, index) => (
                <div key={entry.id} className="relative flex gap-4 pb-6 last:pb-0"><div className="relative z-10 mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary"><ActivityIcon type={entry.type} /></div>{index < activity.length - 1 && <span className="absolute bottom-0 left-[17px] top-9 w-px bg-border" />}<div><p className="text-xs font-bold text-primary">{entry.date}</p><h3 className="mt-1 font-display font-bold">{entry.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.detail}</p></div></div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Planning</p><h2 className="mt-1 font-display text-xl font-extrabold">Milestones</h2></div><Button size="sm"><Plus className="size-4" />Add</Button></div>
            <div className="mt-5 space-y-3">
              <Milestone title="Publish neural-data portfolio project" date="30 Sep 2026" progress={45} skills="Python · signal processing" />
              <Milestone title="Complete embedded-systems foundation" date="15 Nov 2026" progress={10} skills="C++ · microcontrollers" />
              <Milestone title="Prepare internship application set" date="01 Dec 2026" progress={0} skills="CV · technical communication" />
            </div>
          </div>
        </section>
      </div>
    </CubiShell>
  );
}

function ProgressMetric({ icon, value, label }: { icon: ReactNode; value: number | string; label: string }) { return <div className="rounded-2xl bg-secondary/55 p-4 text-center"><span className="mx-auto grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">{icon}</span><strong className="mt-2 block font-display text-2xl">{value}</strong><span className="text-xs text-muted-foreground">{label}</span></div>; }
function ActivityIcon({ type }: { type: string }) { return type === "evidence" ? <FileUp className="size-4" /> : type === "action" ? <Flag className="size-4" /> : type === "skill" ? <Award className="size-4" /> : <TrendingUp className="size-4" />; }
function Milestone({ title, date, progress, skills }: { title: string; date: string; progress: number; skills: string }) { return <div className="rounded-2xl border border-border bg-card/55 p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-display font-bold">{title}</h3><span className="text-xs font-bold text-primary">{progress}%</span></div><p className="mt-2 text-xs text-muted-foreground">{date} · {skills}</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div></div>; }
