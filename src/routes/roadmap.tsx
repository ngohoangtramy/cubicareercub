import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenCheck, FileCode2, Plus } from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { CareerTree } from "@/components/cubi/CareerTree";
import { ScorePair } from "@/components/cubi/AdditionalEvidenceForms";
import { DemoBadge, Notice, PageHeader } from "@/components/cubi/Common";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";

export const Route = createFileRoute("/roadmap")({
  head: () => ({ meta: [{ title: "Career Path | Cubi" }] }),
  component: CareerTreePage,
});

export function CareerTreePage() {
  const { careerNodes, profile, additionalEvidence } = useCubi();
  return (
    <CubiShell>
      <div className="space-y-7">
        <PageHeader eyebrow="Interactive routes" title="Career Path" description={`${profile.degreeProgramme} → ${profile.targetOccupation}`} action={<DemoBadge />} />
        <Notice>Open a step to see recommended courses and video links. Your confirmed projects and self-study can update step progress.</Notice>

        <section className="panel p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Evidence connected to this path</p>
              <h2 className="mt-1 font-display text-xl font-extrabold">Projects and self-study</h2>
              <p className="mt-1 text-sm text-muted-foreground">Confirmed evidence improves skills and can move related career steps forward.</p>
            </div>
            <Button asChild variant="secondary"><Link to="/create"><Plus className="size-4" />Add update</Link></Button>
          </div>
          {additionalEvidence.length ? (
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {additionalEvidence.slice(0, 4).map((record) => {
                const Icon = record.kind === "project" ? FileCode2 : BookOpenCheck;
                return (
                  <article key={record.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4" /></span>
                        <div className="min-w-0">
                          <p className="truncate font-display font-bold">{record.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{record.skillImpacts.map((item) => item.skillName).join(" · ") || "Needs skill confirmation"}</p>
                        </div>
                      </div>
                      <ScorePair relevance={record.relevanceScore} impact={record.impactScore} />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No extra evidence has been connected yet.</div>
          )}
        </section>

        <CareerTree nodes={careerNodes} />
        <div className="panel grid gap-3 p-4 text-xs sm:grid-cols-3 lg:grid-cols-6">
          {[["Completed", "bg-emerald-400/20"], ["In progress", "bg-sky-400/20"], ["Recommended next", "bg-primary/20"], ["Locked", "bg-secondary"], ["Optional", "bg-violet-400/20"], ["Needs verification", "bg-amber-400/20"]].map(([label, style]) => <div key={label} className="flex items-center gap-2"><span className={`size-3 rounded-full ${style}`} />{label}</div>)}
        </div>
      </div>
    </CubiShell>
  );
}
