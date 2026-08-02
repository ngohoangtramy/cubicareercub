import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Clock3,
  ExternalLink,
  Flag,
  Lightbulb,
  Link2,
  ListChecks,
  PlayCircle,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { DemoBadge, PageHeader } from "@/components/cubi/Common";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useCubi } from "@/lib/cubi";
import type {
  ActionOpportunity,
  ActionResource,
  ActionStep,
  Recommendation,
  StepStatus,
} from "@/data/guided-actions";

export const Route = createFileRoute("/quests")({
  head: () => ({ meta: [{ title: "Goals | Cubi" }] }),
  component: ActionPlanPage,
});

const statusLabel: Record<Recommendation["status"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
};

export function ActionPlanPage() {
  const {
    profile,
    recommendations,
    updateRecommendation,
    updateRecommendationStep,
    addRecommendationEvidence,
  } = useCubi();
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => recommendations.filter((item) => filter === "all" || item.status === filter),
    [recommendations, filter],
  );
  const selected = recommendations.find((item) => item.id === selectedId) ?? null;
  const completedActions = recommendations.filter((item) => item.status === "completed").length;
  const allSteps = recommendations.flatMap((item) => item.steps);
  const completedSteps = allSteps.filter((step) => step.status === "completed").length;
  const evidenceCount = recommendations.reduce((sum, item) => sum + item.evidence.length, 0);
  const overallProgress = allSteps.length ? Math.round((completedSteps / allSteps.length) * 100) : 0;

  const nextSteps = recommendations
    .flatMap((recommendation) =>
      recommendation.steps
        .filter((step) => step.status !== "completed")
        .map((step) => ({ recommendation, step })),
    )
    .sort((a, b) => {
      const priority = { High: 0, Medium: 1, Low: 2 } as const;
      const active = (item: Recommendation) => (item.status === "in-progress" ? -1 : priority[item.priority]);
      return active(a.recommendation) - active(b.recommendation);
    })
    .slice(0, 3);

  const openAction = (item: Recommendation) => {
    if (item.status === "not-started") updateRecommendation(item.id, "in-progress");
    setSelectedId(item.id);
  };

  return (
    <CubiShell>
      <div className="space-y-7">
        <PageHeader
          eyebrow="Guided action plan"
          title="Goals"
          description={`Cubi turns the route to ${profile.targetOccupation} into concrete actions, resources and proof of progress.`}
          action={<DemoBadge />}
        />

        <section className="panel overflow-hidden">
          <div className="grid gap-6 p-5 lg:grid-cols-[1.15fr_0.85fr] lg:p-7">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-extrabold text-primary">
                  {profile.targetOccupation} pathway
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
                  Progress is saved locally
                </span>
              </div>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight">
                You do not need to know the whole path. Start with the next visible step.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Every goal now includes exact checklists, credible learning resources, a portfolio deliverable, evidence prompts and places to meet people doing similar work.
              </p>
              <div className="mt-6 max-w-xl">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-bold">Overall guided-plan progress</span>
                  <span className="font-extrabold text-primary">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {completedSteps} of {allSteps.length} detailed steps completed
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SummaryMetric icon={<Flag />} value={`${completedActions}/${recommendations.length}`} label="Goals completed" />
              <SummaryMetric icon={<ListChecks />} value={`${completedSteps}/${allSteps.length}`} label="Steps completed" />
              <SummaryMetric icon={<Link2 />} value={evidenceCount} label="Evidence saved" />
              <SummaryMetric icon={<Target />} value={nextSteps.length ? nextSteps[0].recommendation.priority : "Done"} label="Next priority" />
            </div>
          </div>
        </section>

        <section className="panel p-5 lg:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Cubi’s suggested focus</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold">Your next three steps</h2>
              <p className="mt-1 text-sm text-muted-foreground">A manageable queue selected from active and high-priority goals.</p>
            </div>
            {nextSteps[0] && (
              <Button onClick={() => openAction(nextSteps[0].recommendation)}>
                <PlayCircle /> Continue first step
              </Button>
            )}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {nextSteps.map(({ recommendation, step }, index) => (
              <button
                key={step.id}
                onClick={() => openAction(recommendation)}
                className="rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-8 place-items-center rounded-xl bg-primary/12 text-xs font-extrabold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">{step.duration}</span>
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-primary">{recommendation.title}</p>
                <h3 className="mt-1 font-display text-lg font-extrabold">{step.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">{step.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-primary">
                  Open guidance <ArrowUpRight className="size-3.5" />
                </span>
              </button>
            ))}
            {!nextSteps.length && (
              <div className="col-span-full rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center text-emerald-900">
                <CheckCircle2 className="mx-auto size-8" />
                <h3 className="mt-2 font-display text-xl font-extrabold">Every guided step is complete</h3>
                <p className="mt-1 text-sm">Review your evidence and use it in your portfolio or applications.</p>
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold">Full action plan</h2>
            <p className="mt-1 text-sm text-muted-foreground">Open any goal to see the exact sequence Cubi recommends.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "not-started", "in-progress", "completed"].map((item) => (
              <Button
                key={item}
                size="sm"
                variant={filter === item ? "default" : "secondary"}
                onClick={() => setFilter(item)}
                className="capitalize"
              >
                {item.replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((item, index) => (
            <ActionCard
              key={item.id}
              item={item}
              rank={index + 1}
              onOpen={() => openAction(item)}
              onComplete={() => updateRecommendation(item.id, "completed")}
            />
          ))}
          {!filtered.length && <div className="panel border-dashed p-10 text-center text-muted-foreground">No goals match this filter.</div>}
        </div>

        <section className="panel p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary/15 text-primary"><Sparkles className="size-5" /></span>
              <div>
                <h2 className="font-display text-lg font-bold">Two rich demo pathways are included</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Data Engineer and Tissue Engineer receive fully curated plans. Other careers generate a reusable guided foundation, community and application plan.
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setSelectedId(recommendations[0]?.id ?? null)} disabled={!recommendations.length}>
              Preview guidance
            </Button>
          </div>
        </section>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        {selected && (
          <ActionWorkspace
            item={selected}
            onStatus={(status) => updateRecommendation(selected.id, status)}
            onStepStatus={(stepId, status) => updateRecommendationStep(selected.id, stepId, status)}
            onAddEvidence={(evidence) => addRecommendationEvidence(selected.id, evidence)}
          />
        )}
      </Dialog>
    </CubiShell>
  );
}

function SummaryMetric({ icon, value, label }: { icon: ReactNode; value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/75 p-4">
      <span className="grid size-9 place-items-center rounded-xl bg-primary/12 text-primary [&_svg]:size-4">{icon}</span>
      <p className="mt-4 font-display text-2xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs font-bold text-muted-foreground">{label}</p>
    </div>
  );
}

function ActionCard({
  item,
  rank,
  onOpen,
  onComplete,
}: {
  item: Recommendation;
  rank: number;
  onOpen: () => void;
  onComplete: () => void;
}) {
  const completed = item.steps.filter((step) => step.status === "completed").length;
  const progress = item.steps.length ? Math.round((completed / item.steps.length) * 100) : 0;
  const Icon = item.status === "completed" ? CheckCircle2 : item.status === "in-progress" ? PlayCircle : Circle;

  return (
    <article className="panel p-5">
      <div className="grid gap-5 lg:grid-cols-[64px_1fr_280px] lg:items-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-primary/15 font-display text-xl font-extrabold text-primary">{rank}</div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{item.type}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.priority === "High" ? "bg-rose-50 text-rose-800" : "bg-amber-50 text-amber-800"}`}>
              {item.priority} priority
            </span>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted-foreground">
              {statusLabel[item.status]}
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-extrabold">{item.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.reason}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.skills.map((skill) => <span key={skill} className="rounded-full bg-secondary px-3 py-1 text-xs">{skill}</span>)}
          </div>
        </div>
        <div className="rounded-2xl bg-card/65 p-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>{completed}/{item.steps.length} steps</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-2" />
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold"><Clock3 className="size-4 text-primary" />{item.time}</p>
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Award className="size-4" />{item.outcome}</p>
          <div className="mt-4 grid gap-2">
            <Button variant={item.status === "in-progress" ? "default" : "secondary"} onClick={onOpen}>
              <PlayCircle />{item.status === "not-started" ? "Start action" : "Open guided steps"}
            </Button>
            <Button variant={item.status === "completed" ? "default" : "outline"} onClick={onComplete}>
              <Icon />Mark goal completed
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionWorkspace({
  item,
  onStatus,
  onStepStatus,
  onAddEvidence,
}: {
  item: Recommendation;
  onStatus: (status: Recommendation["status"]) => void;
  onStepStatus: (stepId: string, status: StepStatus) => void;
  onAddEvidence: (evidence: string) => void;
}) {
  const [evidence, setEvidence] = useState("");
  const completed = item.steps.filter((step) => step.status === "completed").length;
  const progress = item.steps.length ? Math.round((completed / item.steps.length) * 100) : 0;
  const nextStep = item.steps.find((step) => step.status !== "completed");

  const saveEvidence = () => {
    const clean = evidence.trim();
    if (!clean) return;
    onAddEvidence(clean);
    setEvidence("");
  };

  return (
    <DialogContent className="max-h-[92vh] max-w-6xl overflow-hidden p-0">
      <div className="max-h-[92vh] overflow-y-auto">
        <div className="border-b border-border bg-primary/[0.06] p-6 lg:p-8">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-2 pr-8">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground">{item.priority} priority</span>
              <span className="rounded-full bg-card px-3 py-1 text-xs font-bold">{item.type}</span>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold">{statusLabel[item.status]}</span>
            </div>
            <DialogTitle className="mt-3 font-display text-3xl font-extrabold leading-tight">{item.title}</DialogTitle>
            <DialogDescription className="max-w-4xl text-sm leading-6">{item.reason}</DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px] lg:items-center">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>{completed} of {item.steps.length} steps completed</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => onStatus("in-progress")} disabled={item.status === "completed"}>
                <PlayCircle /> Keep active
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => onStatus("completed")}>
                <CheckCircle2 /> Complete goal
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_310px] lg:p-8">
          <div>
            {nextStep && (
              <section className="mb-6 rounded-2xl border border-primary/30 bg-primary/[0.06] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Do this next</p>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-xl font-extrabold">{nextStep.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{nextStep.description}</p>
                  </div>
                  <Button onClick={() => onStepStatus(nextStep.id, "in-progress")}>
                    <PlayCircle /> Start this step
                  </Button>
                </div>
              </section>
            )}

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Guided sequence</p>
                <h3 className="mt-1 font-display text-2xl font-extrabold">Exact action steps</h3>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{item.time} total</span>
            </div>

            <Accordion type="multiple" defaultValue={nextStep ? [nextStep.id] : item.steps[0] ? [item.steps[0].id] : []} className="mt-4 space-y-3">
              {item.steps.map((step, index) => (
                <StepPanel key={step.id} step={step} index={index} onStatus={(status) => onStepStatus(step.id, status)} />
              ))}
            </Accordion>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-card p-5">
              <span className="grid size-10 place-items-center rounded-2xl bg-amber-100 text-amber-800"><Lightbulb className="size-5" /></span>
              <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Cubi mentor tip</p>
              <p className="mt-2 text-sm leading-6">{item.mentorTip}</p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <span className="grid size-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><Trophy className="size-5" /></span>
              <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Finish line</p>
              <p className="mt-2 text-sm leading-6">{item.outcome}</p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="size-5 text-primary" />
                <h3 className="font-display text-lg font-extrabold">Save evidence</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Paste a project link, event takeaway, certificate, application result or short note.</p>
              <Textarea
                value={evidence}
                onChange={(event) => setEvidence(event.target.value)}
                placeholder="Example: GitHub repository link and what I completed"
                className="mt-3 min-h-24"
              />
              <Button className="mt-3 w-full" onClick={saveEvidence} disabled={!evidence.trim()}>
                <Link2 /> Save to progress
              </Button>
              {item.evidence.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Saved evidence</p>
                  {item.evidence.map((entry, index) => (
                    <div key={`${entry}-${index}`} className="rounded-xl bg-secondary p-3 text-xs leading-5">{entry}</div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </DialogContent>
  );
}

function StepPanel({
  step,
  index,
  onStatus,
}: {
  step: ActionStep;
  index: number;
  onStatus: (status: StepStatus) => void;
}) {
  const statusIcon = step.status === "completed" ? <CheckCircle2 className="size-5 text-emerald-600" /> : step.status === "in-progress" ? <PlayCircle className="size-5 text-primary" /> : <Circle className="size-5 text-muted-foreground" />;

  return (
    <AccordionItem value={step.id} className="overflow-hidden rounded-2xl border border-border bg-card px-4">
      <AccordionTrigger className="gap-4 py-4 hover:no-underline">
        <div className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary font-display text-sm font-extrabold">{index + 1}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-base font-extrabold">{step.title}</span>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-muted-foreground">{step.duration}</span>
            </div>
            <p className="mt-1 line-clamp-1 text-xs font-normal text-muted-foreground">{step.description}</p>
          </div>
          <span className="ml-auto mr-2 shrink-0">{statusIcon}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="border-t border-border pt-4">
          <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary"><ListChecks className="size-4" />Checklist</p>
              <div className="mt-3 space-y-2">
                {step.checklist.map((task) => (
                  <div key={task} className="flex items-start gap-2 rounded-xl bg-secondary/70 p-3 text-sm leading-5">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Deliverable</p>
                <p className="mt-2 text-sm leading-6">{step.deliverable}</p>
              </div>
              <div className="rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
                <p className="text-xs font-extrabold uppercase tracking-wider text-primary">Evidence prompt</p>
                <p className="mt-2 text-sm leading-6">{step.evidencePrompt}</p>
              </div>
            </div>
          </div>

          {step.resources.length > 0 && (
            <div className="mt-6">
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary"><BookOpen className="size-4" />Recommended resources</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {step.resources.map((item) => <ResourceCard key={item.id} item={item} />)}
              </div>
            </div>
          )}

          {step.opportunities && step.opportunities.length > 0 && (
            <div className="mt-6">
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary"><Users className="size-4" />Communities, events and challenges</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {step.opportunities.map((item) => <OpportunityCard key={item.id} item={item} />)}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
            <Button variant={step.status === "in-progress" ? "default" : "secondary"} onClick={() => onStatus("in-progress")}>
              <PlayCircle /> Start step
            </Button>
            <Button variant={step.status === "completed" ? "default" : "outline"} onClick={() => onStatus("completed")}>
              <CheckCircle2 /> Mark step completed
            </Button>
            {step.status !== "not-started" && (
              <Button variant="ghost" onClick={() => onStatus("not-started")}>
                Reset step
              </Button>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function ResourceCard({ item }: { item: ActionResource }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group rounded-2xl border border-border bg-card p-4 transition hover:border-primary/45 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-extrabold text-primary">{item.kind}</span>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold">{item.cost}</span>
          </div>
          <h4 className="mt-3 font-display text-base font-extrabold">{item.title}</h4>
          <p className="mt-1 text-xs font-bold text-muted-foreground">{item.provider} · {item.duration}</p>
        </div>
        <ExternalLink className="size-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{item.why}</p>
      <p className="mt-3 text-[11px] font-bold text-primary">{item.level}</p>
    </a>
  );
}

function OpportunityCard({ item }: { item: ActionOpportunity }) {
  const Icon = item.kind === "Hackathon" || item.kind === "Competition" ? Trophy : item.kind === "Internship board" ? BriefcaseBusiness : CalendarDays;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group rounded-2xl border border-border bg-card p-4 transition hover:border-primary/45 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-800"><Icon className="size-4" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">{item.kind}</p>
              <h4 className="mt-1 font-display text-base font-extrabold">{item.title}</h4>
            </div>
            <ExternalLink className="size-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
          </div>
          <p className="mt-1 text-xs font-bold text-muted-foreground">{item.organiser} · {item.location}</p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">{item.fit}</p>
          <p className="mt-3 rounded-xl bg-secondary p-3 text-xs leading-5"><strong>How to use it:</strong> {item.preparation}</p>
          <p className="mt-3 text-[11px] font-bold text-violet-700">{item.timing}</p>
        </div>
      </div>
    </a>
  );
}
