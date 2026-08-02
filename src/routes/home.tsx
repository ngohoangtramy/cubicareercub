import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, CircleGauge, ClipboardCheck, Flag, RefreshCcw, Target, X } from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { CubiMascot } from "@/components/cubi/CubiMascot";
import { DemoBadge, LevelDots, MetricCard, PageHeader, StatusBadge } from "@/components/cubi/Common";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";
import type { SkillRecord } from "@/data/cubi-demo";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home | Cubi" }, { name: "description", content: "Your Cubi career dashboard." }] }),
  component: DashboardPage,
});

export function DashboardPage() {
  const { profile, readiness, skills, recommendations, completeAnalysis } = useCubi();
  const [selectedSkill, setSelectedSkill] = useState<SkillRecord | null>(null);
  const strong = skills.filter((skill) => skill.status === "acquired");
  const developing = skills.filter((skill) => ["partial", "developing", "verify"].includes(skill.status));
  const missing = skills.filter((skill) => skill.status === "missing");
  const activeGoals = recommendations.filter((item) => item.status !== "completed");
  const nextAction = activeGoals[0] ?? recommendations[0];
  const statusColumns = useMemo(
    () => [
      { title: "Strong", skills: strong, tone: "text-emerald-800" },
      { title: "Developing", skills: developing, tone: "text-amber-800" },
      { title: "Missing", skills: missing, tone: "text-rose-800" },
    ],
    [strong, developing, missing],
  );

  return (
    <CubiShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Home"
          title={profile.targetOccupation}
          description={`${profile.degreeProgramme} · ${profile.institution}`}
          action={
            <div className="flex flex-wrap gap-2">
              <DemoBadge />
              <Button variant="secondary" onClick={completeAnalysis}>
                <RefreshCcw className="size-4" /> Refresh
              </Button>
            </div>
          }
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Skills found" value={strong.length + developing.length} detail={`${skills.length} skills tracked`} icon={<ClipboardCheck className="size-5" />} />
          <MetricCard label="Skills missing" value={missing.length} detail="Focus on high-impact gaps" icon={<Target className="size-5" />} />
          <MetricCard label="Career match" value={`${readiness}%`} detail="Based on demo evidence" icon={<CircleGauge className="size-5" />} accent />
          <MetricCard label="Active goals" value={activeGoals.length} detail="Actions in your plan" icon={<Flag className="size-5" />} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="panel p-6">
            <div className="grid items-center gap-6 md:grid-cols-[1fr_190px]">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Your profile</p>
                <h2 className="mt-2 font-display text-3xl font-extrabold">{profile.targetOccupation}</h2>
                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <Summary label="Education" value={profile.educationLevel} />
                  <Summary label="Graduation" value={profile.graduationYear} />
                  <Summary label="Region" value={profile.region} />
                  <Summary label="Work style" value={profile.workMode} />
                </div>
                <Button asChild className="mt-5">
                  <Link to="/roadmap">
                    View career path <ChevronRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="relative grid size-36 place-items-center rounded-full"
                  style={{ background: `conic-gradient(#176B4D ${readiness * 3.6}deg, #DCE5DF 0)` }}
                >
                  <div className="grid size-28 place-items-center rounded-full bg-card text-center shadow-sm">
                    <div>
                      <strong className="font-display text-4xl text-primary">{readiness}%</strong>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">match</span>
                    </div>
                  </div>
                </div>
                <CubiMascot size={78} mood="happy" className="-mt-3" />
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Next goal</p>
                <h2 className="mt-2 font-display text-2xl font-extrabold">{nextAction.title}</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{nextAction.priority}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{nextAction.reason}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Summary label="Time" value={nextAction.time} />
              <Summary label="Status" value={nextAction.status.replace("-", " ")} />
            </div>
            <Button asChild variant="secondary" className="mt-5 w-full">
              <Link to="/quests">Open goals</Link>
            </Button>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Skill map</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold">Where you stand</h2>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link to="/skills">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {statusColumns.map((column) => (
              <div key={column.title} className="panel p-4">
                <div className="flex items-center justify-between">
                  <h3 className={`font-display text-lg font-bold ${column.tone}`}>{column.title}</h3>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">{column.skills.length}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {column.skills.length ? (
                    column.skills.slice(0, 4).map((skill) => (
                      <button
                        key={skill.id}
                        onClick={() => setSelectedSkill(skill)}
                        className="w-full rounded-2xl border border-border bg-card p-3 text-left transition hover:border-primary/50 hover:bg-secondary/45"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold">{skill.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{skill.courseIds.length ? `Used in ${skill.courseIds.length} course${skill.courseIds.length === 1 ? "" : "s"}` : "No course evidence"}</p>
                          </div>
                          <StatusBadge status={skill.status} />
                        </div>
                        <div className="mt-3">
                          <LevelDots current={skill.currentLevel} target={skill.targetLevel} />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">No skills here.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedSkill && <SkillPanel skill={selectedSkill} onClose={() => setSelectedSkill(null)} />}
    </CubiShell>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/65 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold capitalize">{value}</p>
    </div>
  );
}

function SkillPanel({ skill, onClose }: { skill: SkillRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/35 backdrop-blur-sm" onClick={onClose}>
      <aside className="h-full w-full max-w-lg overflow-y-auto border-l border-border bg-background p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button className="ml-auto grid size-9 place-items-center rounded-xl bg-secondary" onClick={onClose} aria-label="Close skill details">
          <X className="size-4" />
        </button>
        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">{skill.category}</p>
        <h2 className="mt-1 font-display text-3xl font-extrabold">{skill.name}</h2>
        <div className="mt-3">
          <StatusBadge status={skill.status} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Summary label="Current" value={`${skill.currentLevel}/5`} />
          <Summary label="Target" value={`${skill.targetLevel}/5`} />
          <Summary label="Job demand" value={`${skill.vacancyFrequency}%`} />
          <Summary label="Confidence" value={`${skill.confidence}%`} />
        </div>
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evidence</p>
          <ul className="mt-2 space-y-2">
            {skill.evidence.map((item) => (
              <li key={item} className="rounded-2xl border border-border bg-card p-3 text-sm leading-6">{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/[0.06] p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Next step</p>
          <p className="mt-2 text-sm leading-6">{skill.nextAction}</p>
          <p className="mt-2 text-xs text-muted-foreground">{skill.timeRequired}</p>
        </div>
      </aside>
    </div>
  );
}
