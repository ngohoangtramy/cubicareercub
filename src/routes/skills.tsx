import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, Plus, Search, X } from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { DemoBadge, LevelDots, PageHeader, StatusBadge } from "@/components/cubi/Common";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";
import type { SkillRecord, SkillStatus } from "@/data/cubi-demo";

export const Route = createFileRoute("/skills")({
  head: () => ({ meta: [{ title: "My Skills | Cubi" }] }),
  component: SkillsPage,
});

export function SkillsPage() {
  const { skills, updateSkillStatus, addEvidence } = useCubi();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<SkillRecord | null>(null);
  const categories = ["All", ...Array.from(new Set(skills.map((skill) => skill.category)))];
  const filtered = useMemo(() => skills.filter((skill) =>
    (category === "All" || skill.category === category) &&
    (status === "All" || skill.status === status) &&
    skill.name.toLowerCase().includes(query.toLowerCase()),
  ), [skills, category, status, query]);

  return (
    <CubiShell>
      <div className="space-y-7">
        <PageHeader eyebrow="Evidence review" title="My Skills" description="Review your skills and evidence." action={<DemoBadge />} />

        <div className="panel grid gap-3 p-4 sm:grid-cols-[1fr_220px_220px]">
          <label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input className="cubi-input pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills" aria-label="Search skills" /></label>
          <label className="relative"><Filter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><select className="cubi-input pl-10" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <select className="cubi-input" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option>All</option><option value="acquired">Acquired</option><option value="partial">Partially developed</option><option value="developing">In progress</option><option value="missing">Missing</option><option value="optional">Optional</option><option value="verify">Needs verification</option></select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((skill) => (
            <button key={skill.id} onClick={() => setSelected(skill)} className="panel group p-5 text-left transition hover:-translate-y-1 hover:border-primary/40">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{skill.category}</p><h2 className="mt-1 font-display text-xl font-bold">{skill.name}</h2></div><StatusBadge status={skill.status} /></div>
              <div className="mt-5"><LevelDots current={skill.currentLevel} target={skill.targetLevel} /><div className="mt-2 flex justify-between text-[11px] text-muted-foreground"><span>Current {skill.currentLevel}/5</span><span>Target {skill.targetLevel}/5</span></div></div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><Metric label="Demand" value={`${skill.vacancyFrequency}%`} /><Metric label="Confidence" value={`${skill.confidence}%`} /><Metric label="Priority" value={skill.importance} /></div>
              <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{skill.evidence[0]}</p>
            </button>
          ))}
        </div>
        {!filtered.length && <div className="panel border-dashed p-10 text-center text-muted-foreground">No skills match these filters.</div>}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/45 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-border bg-background p-6" onClick={(event) => event.stopPropagation()}>
            <button className="ml-auto grid size-9 place-items-center rounded-xl bg-secondary" onClick={() => setSelected(null)} aria-label="Close"><X className="size-4" /></button>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">{selected.category}</p><h2 className="mt-1 font-display text-3xl font-extrabold">{selected.name}</h2><div className="mt-3"><StatusBadge status={selected.status} /></div>
            <section className="mt-7"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Why this status</p><p className="mt-2 text-sm leading-6">Course evidence suggests the current level. Demo job data sets the target. Confidence: {selected.confidence}%.</p></section>
            <section className="mt-7"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evidence</p><div className="mt-3 space-y-2">{selected.evidence.map((item) => <div key={item} className="rounded-2xl bg-card p-4 text-sm leading-6">{item}</div>)}</div><EvidenceForm onAdd={(evidence) => { addEvidence(selected.id, evidence); setSelected({ ...selected, evidence: [...selected.evidence, evidence], confidence: Math.min(99, selected.confidence + 5) }); }} /></section>
            <section className="mt-7"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Correct status</p><div className="mt-3 grid grid-cols-2 gap-2">{(["acquired", "partial", "developing", "missing", "optional", "verify"] as SkillStatus[]).map((item) => <Button key={item} variant={selected.status === item ? "default" : "secondary"} onClick={() => { updateSkillStatus(selected.id, item); setSelected({ ...selected, status: item }); }} className="capitalize">{item.replace("partial", "partially developed").replace("verify", "needs verification")}</Button>)}</div></section>
            <section className="mt-7 rounded-2xl border border-primary/25 bg-primary/[0.07] p-4"><p className="text-xs font-bold uppercase tracking-wider text-primary">Recommended next action</p><p className="mt-2 text-sm leading-6">{selected.nextAction}</p><p className="mt-2 text-xs text-muted-foreground">Estimated time: {selected.timeRequired}</p></section>
          </aside>
        </div>
      )}
    </CubiShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-secondary/60 p-2"><strong className="block">{value}</strong><span className="text-[10px] text-muted-foreground">{label}</span></div>; }

function EvidenceForm({ onAdd }: { onAdd: (value: string) => void }) {
  const [value, setValue] = useState("");
  return <div className="mt-3 flex gap-2"><input className="cubi-input" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Add certificate, project or supervisor evidence" /><Button onClick={() => { if (value.trim()) { onAdd(value.trim()); setValue(""); } }} aria-label="Add evidence"><Plus className="size-4" /></Button></div>;
}
