import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BriefcaseBusiness, Check, MapPin, Search, TrendingUp } from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { DemoBadge, PageHeader } from "@/components/cubi/Common";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";
import { careerCategories, careerPositions } from "@/data/career-positions";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Careers | Cubi" }] }),
  component: CareersPage,
});

const demand = [
  ["Python", 68],
  ["Signal processing", 55],
  ["Machine learning", 50],
  ["Experimental design", 41],
] as const;

export function CareersPage() {
  const { profile, vacancies, saveProfile } = useCubi();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState("All");

  const roles = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    return careerPositions
      .filter((role) => category === "All" || role.category === category)
      .filter((role) => !normalised || `${role.title} ${role.category}`.toLowerCase().includes(normalised))
      .slice(0, 12);
  }, [query, category]);

  const filteredVacancies = useMemo(
    () => vacancies.filter((vacancy) => mode === "All" || vacancy.mode === mode),
    [vacancies, mode],
  );

  return (
    <CubiShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Careers"
          title="Explore positions"
          description={`${careerPositions.length} demo roles across Europe.`}
          action={<DemoBadge />}
        />

        <section className="panel p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_260px]">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="cubi-input pl-10"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search careers"
              />
            </label>
            <select className="cubi-input" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>All</option>
              {careerCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {roles.map((role) => {
              const selected = role.title === profile.targetOccupation;
              return (
                <article key={role.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-primary">{role.category}</p>
                      <h2 className="mt-1 font-display text-lg font-extrabold">{role.title}</h2>
                    </div>
                    {selected && <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" /></span>}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {role.requiredSkills.slice(0, 3).map((skill) => <span key={skill} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold">{skill}</span>)}
                  </div>
                  <Button
                    variant={selected ? "secondary" : "default"}
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => saveProfile({ ...profile, targetOccupation: role.title, industries: [role.category] })}
                  >
                    {selected ? "Selected" : "Choose career"}
                  </Button>
                </article>
              );
            })}
          </div>
          {!roles.length && <p className="py-10 text-center text-sm text-muted-foreground">No careers found.</p>}
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
          <div className="panel p-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              <h2 className="font-display text-xl font-extrabold">Common skills</h2>
            </div>
            <div className="mt-5 space-y-4">
              {demand.map(([name, value]) => (
                <div key={name}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="font-semibold">{name}</span>
                    <span className="text-muted-foreground">{value}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Sample jobs</p>
                <h2 className="mt-1 font-display text-xl font-extrabold">{profile.targetOccupation}</h2>
              </div>
              <select className="cubi-input w-auto min-w-36" value={mode} onChange={(event) => setMode(event.target.value)}>
                {['All', 'Remote', 'Hybrid', 'On-site'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="mt-4 space-y-3">
              {filteredVacancies.map((vacancy) => (
                <article key={vacancy.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold">{vacancy.title}</h3>
                      <p className="text-sm font-semibold text-primary">{vacancy.employer}</p>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{vacancy.level}</span>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" /> {vacancy.location} · {vacancy.mode}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {vacancy.requiredSkills.slice(0, 4).map((skill) => <span key={skill} className="rounded-full bg-secondary px-2.5 py-1 text-[11px]">{skill}</span>)}
                  </div>
                </article>
              ))}
              {!filteredVacancies.length && (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  <BriefcaseBusiness className="mx-auto mb-3 size-7" /> No sample jobs match this filter.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </CubiShell>
  );
}
