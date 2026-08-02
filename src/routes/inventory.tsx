import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { AlertCircle, ArrowDownUp, Clock3, Filter, Search } from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { DemoBadge, LevelDots, Notice, PageHeader, StatusBadge } from "@/components/cubi/Common";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Skill Gaps | Cubi" }] }),
  component: SkillGapsPage,
});

export function SkillGapsPage() {
  const { skills } = useCubi();
  const [importance, setImportance] = useState("All");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState("importance");
  const categories = ["All", ...Array.from(new Set(skills.map((skill) => skill.category)))];
  const filtered = useMemo(() => {
    const result = skills.filter((skill) =>
      ["missing", "partial", "developing", "verify", "optional"].includes(skill.status) &&
      (importance === "All" || skill.importance === importance) &&
      (category === "All" || skill.category === category) &&
      (difficulty === "All" || skill.difficulty === difficulty),
    );
    return [...result].sort((a, b) => sort === "frequency" ? b.vacancyFrequency - a.vacancyFrequency : sort === "gap" ? (b.targetLevel - b.currentLevel) - (a.targetLevel - a.currentLevel) : rankImportance(a.importance) - rankImportance(b.importance));
  }, [skills, importance, category, difficulty, sort]);

  return (
    <CubiShell>
      <div className="space-y-7">
        <PageHeader eyebrow="Transparent comparison" title="Skill Gaps" description="See which skills to build first." action={<DemoBadge />} />
        <Notice tone="warning"><strong className="text-foreground">Missing may mean no evidence was found.</strong> Review it before deciding.</Notice>

        <div className="panel grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <Select icon={<Filter className="size-4" />} value={importance} onChange={setImportance} options={["All", "High", "Medium", "Low"]} label="Importance" />
          <Select icon={<Search className="size-4" />} value={category} onChange={setCategory} options={categories} label="Category" />
          <Select icon={<Clock3 className="size-4" />} value={difficulty} onChange={setDifficulty} options={["All", "Beginner", "Intermediate", "Advanced"]} label="Difficulty" />
          <Select icon={<ArrowDownUp className="size-4" />} value={sort} onChange={setSort} options={["importance", "frequency", "gap"]} label="Sort" />
        </div>

        <div className="space-y-4">
          {filtered.map((skill) => {
            const gap = Math.max(0, skill.targetLevel - skill.currentLevel);
            return (
              <article key={skill.id} className="panel p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_210px_220px] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><StatusBadge status={skill.status} /><span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold">{skill.importance} importance</span><span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold">{skill.category}</span></div>
                    <h2 className="mt-3 font-display text-2xl font-extrabold">{skill.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{explanation(skill.name, skill.status, skill.courseIds.length, skill.vacancyFrequency)}</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground"><span>Current {skill.currentLevel}</span><span>Target {skill.targetLevel}</span></div>
                    <div className="mt-2"><LevelDots current={skill.currentLevel} target={skill.targetLevel} /></div>
                    <p className="mt-2 text-xs text-muted-foreground">Gap size: {gap} level{gap === 1 ? "" : "s"} · Confidence {skill.confidence}%</p>
                  </div>
                  <div className="rounded-2xl border border-primary/25 bg-primary/[0.07] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Recommended action</p>
                    <p className="mt-2 text-sm leading-6">{skill.nextAction}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{skill.timeRequired} · {skill.difficulty}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 border-t border-border pt-4 text-xs sm:grid-cols-3">
                  <Info label="Vacancy frequency" value={`${skill.vacancyFrequency}% of demo sample`} />
                  <Info label="Course evidence" value={skill.courseIds.length ? `${skill.courseIds.length} related course${skill.courseIds.length === 1 ? "" : "s"}` : "No direct course evidence"} />
                  <Info label="Source" value={skill.source} />
                </div>
              </article>
            );
          })}
        </div>
        {!filtered.length && <div className="panel border-dashed p-10 text-center"><AlertCircle className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 text-muted-foreground">No skill gaps match the selected filters.</p><Button variant="secondary" className="mt-4" onClick={() => { setImportance("All"); setCategory("All"); setDifficulty("All"); }}>Clear filters</Button></div>}
      </div>
    </CubiShell>
  );
}

function rankImportance(value: string) { return value === "High" ? 0 : value === "Medium" ? 1 : 2; }
function explanation(name: string, status: string, courseCount: number, frequency: number) { return `${name}: ${status.replace("partial", "developing").replace("verify", "needs review")}. ${courseCount ? `${courseCount} course source${courseCount === 1 ? "" : "s"}` : "No course evidence"} · ${frequency}% job demand.`; }
function Info({ label, value }: { label: string; value: string }) { return <div><p className="font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-foreground">{value}</p></div>; }
function Select({ icon, value, onChange, options, label }: { icon: ReactNode; value: string; onChange: (value: string) => void; options: string[]; label: string }) { return <label><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span><select className="cubi-input pl-10 capitalize" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></div></label>; }
