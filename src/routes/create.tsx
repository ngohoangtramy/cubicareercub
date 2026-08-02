import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  FileCode2,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { AdditionalEvidenceForms, ScorePair } from "@/components/cubi/AdditionalEvidenceForms";
import { DemoBadge, Notice, PageHeader } from "@/components/cubi/Common";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";
import { scoreRecommendation } from "@/lib/evidence-scoring";
import type { AdditionalEvidenceRecord } from "@/data/cubi-demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Additional Updates | Cubi" }] }),
  component: AdditionalUpdatesPage,
});

export function AdditionalUpdatesPage() {
  const { additionalEvidence, recommendations, skills, updateRecommendation } = useCubi();
  const [view, setView] = useState<"mine" | "recommended">("mine");

  const recommendationScores = useMemo(
    () => recommendations.map((item) => ({ item, ...scoreRecommendation(item.skills, skills) })),
    [recommendations, skills],
  );

  return (
    <CubiShell>
      <div className="space-y-7">
        <PageHeader
          eyebrow="Learning beyond university"
          title="Additional Updates"
          description="Track projects, self-study and suggested activities."
          action={<DemoBadge />}
        />

        <Notice>
          Scores are estimates. Relevance measures alignment with your target role; skill improvement measures likely evidence strength and mastery gain.
        </Notice>

        <div className="inline-flex rounded-2xl border border-border bg-card p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setView("mine")}
            className={cn("rounded-xl px-4 py-2 text-sm font-bold", view === "mine" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
          >
            My updates
          </button>
          <button
            type="button"
            onClick={() => setView("recommended")}
            className={cn("rounded-xl px-4 py-2 text-sm font-bold", view === "recommended" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
          >
            System suggestions
          </button>
        </div>

        {view === "mine" ? (
          <>
            <AdditionalEvidenceForms />

            <section>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Evidence timeline</p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold">Your additional learning</h2>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{additionalEvidence.length} updates</span>
              </div>

              {additionalEvidence.length ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {additionalEvidence.map((record) => <EvidenceCard key={record.id} record={record} />)}
                </div>
              ) : (
                <div className="panel border-dashed p-10 text-center">
                  <Sparkles className="mx-auto size-8 text-primary" />
                  <h3 className="mt-3 font-display text-lg font-bold">No additional evidence yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Upload a project or add a course you studied independently.</p>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Recommended by Cubi</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold">High-value next activities</h2>
              <p className="mt-1 text-sm text-muted-foreground">Suggestions are ranked by your current gaps and target-career demand.</p>
            </div>
            {recommendationScores
              .sort((a, b) => b.relevance + b.impact - (a.relevance + a.impact))
              .map(({ item, relevance, impact }) => (
                <article key={item.id} className="panel p-5">
                  <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{item.type}</span>
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{item.priority} priority</span>
                      </div>
                      <h3 className="mt-3 font-display text-xl font-extrabold">{item.title}</h3>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{item.reason}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.skills.map((skill) => <span key={skill} className="rounded-full bg-secondary px-2.5 py-1 text-xs">{skill}</span>)}
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <ScorePair relevance={relevance} impact={impact} />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={item.status === "in-progress" ? "default" : "secondary"}
                          onClick={() => updateRecommendation(item.id, "in-progress")}
                        >
                          <Target className="size-4" />Start
                        </Button>
                        <Button
                          size="sm"
                          variant={item.status === "completed" ? "default" : "secondary"}
                          onClick={() => updateRecommendation(item.id, "completed")}
                        >
                          <CheckCircle2 className="size-4" />Done
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </section>
        )}
      </div>
    </CubiShell>
  );
}

function EvidenceCard({ record }: { record: AdditionalEvidenceRecord }) {
  const Icon = record.kind === "project" ? FileCode2 : BookOpenCheck;
  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
        <ScorePair relevance={record.relevanceScore} impact={record.impactScore} />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">{record.kind === "project" ? "Project" : record.learningType ?? "Self-study"}</p>
      <h3 className="mt-1 font-display text-xl font-extrabold">{record.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{record.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {record.skillImpacts.map((impact) => (
          <span key={impact.skillId} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
            {impact.skillName} · +{impact.levelGain}
          </span>
        ))}
      </div>
      <div className="mt-4 grid gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:grid-cols-3">
        <span><strong className="text-foreground">Progress:</strong> {record.progress.replace("-", " ")}</span>
        <span><strong className="text-foreground">Mastery:</strong> {record.masteryLevel}/5</span>
        <span><strong className="text-foreground">Added:</strong> {new Date(record.addedAt).toLocaleDateString()}</span>
      </div>
      {record.files.length > 0 && (
        <div className="mt-3 rounded-xl bg-secondary/45 p-3 text-xs text-muted-foreground" data-no-translate>
          {record.files.slice(0, 4).join(" · ")}{record.files.length > 4 ? ` · +${record.files.length - 4}` : ""}
        </div>
      )}
      {record.url && (
        <a href={record.url} target="_blank" rel="noreferrer noopener" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <Lightbulb className="size-4" />Open learning resource
        </a>
      )}
    </article>
  );
}
