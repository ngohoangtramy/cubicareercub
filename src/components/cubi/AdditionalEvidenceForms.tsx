import { useMemo, useRef, useState, type DragEvent } from "react";
import {
  BookOpenCheck,
  Check,
  FileCode2,
  FolderUp,
  Link2,
  LoaderCircle,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";
import { rescoreProjectEvidence, scanProjectEvidence, scoreManualLearning } from "@/lib/evidence-scoring";
import type { AdditionalEvidenceRecord, EvidenceProgress } from "@/data/cubi-demo";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const learningTypes: NonNullable<AdditionalEvidenceRecord["learningType"]>[] = [
  "Course",
  "Video",
  "Book",
  "Bootcamp",
  "Workshop",
  "Self-study",
];

const progressOptions: EvidenceProgress[] = ["planned", "in-progress", "completed"];

export function AdditionalEvidenceForms({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("grid gap-4", compact ? "xl:grid-cols-2" : "lg:grid-cols-2")}>
      <ProjectEvidenceForm />
      <ManualLearningForm />
    </div>
  );
}

function ProjectEvidenceForm() {
  const { skills, addAdditionalEvidence } = useCubi();
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AdditionalEvidenceRecord | null>(null);
  const [selectedImpactIds, setSelectedImpactIds] = useState<string[]>([]);
  const [error, setError] = useState("");

  function addFiles(next: File[]) {
    const merged = [...files, ...next].filter(
      (file, index, all) => all.findIndex((item) => item.name === file.name && item.size === file.size) === index,
    );
    setFiles(merged.slice(0, 30));
    setResult(null);
    setError("");
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  async function scan() {
    if (!files.length) {
      setError("Add at least one project file.");
      return;
    }
    setScanning(true);
    setError("");
    try {
      const record = await scanProjectEvidence({ files, title, description, skills });
      setResult(record);
      setSelectedImpactIds(record.skillImpacts.map((impact) => impact.skillId));
    } catch {
      setError("The project could not be scanned. Add a short description and try again.");
    } finally {
      setScanning(false);
    }
  }

  function confirm() {
    if (!result) return;
    const selected = result.skillImpacts.filter((impact) => selectedImpactIds.includes(impact.skillId));
    if (!selected.length) return;
    addAdditionalEvidence(rescoreProjectEvidence(result, selected, skills));
    setFiles([]);
    setTitle("");
    setDescription("");
    setResult(null);
    setSelectedImpactIds([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <FolderUp className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-lg font-extrabold">Scan a project</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Add files and Cubi will suggest skills for you to confirm.</p>
        </div>
      </div>

      <div
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "mt-4 cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition",
          dragging ? "border-primary bg-primary/[0.07]" : "border-border bg-secondary/35 hover:border-primary/45",
        )}
      >
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          multiple
          accept=".txt,.md,.csv,.json,.js,.jsx,.ts,.tsx,.py,.r,.sql,.html,.css,.scss,.yaml,.yml,.xml,.toml,.ipynb,.pdf,.doc,.docx,.zip"
          onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
        />
        <FileCode2 className="mx-auto size-7 text-primary" />
        <p className="mt-2 text-sm font-bold">Drop project files here</p>
        <p className="mt-1 text-xs text-muted-foreground">or click to browse · up to 30 files</p>
        <p className="mt-1 text-[10px] text-muted-foreground">ZIP, PDF and DOCX files use their file name plus your project description in this demo.</p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" data-no-translate>
          {files.map((file) => (
            <span key={`${file.name}-${file.size}`} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs">
              {file.name}
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => setFiles((current) => current.filter((item) => item !== file))}
                className="rounded-full p-0.5 hover:bg-background"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-3">
        <label className="space-y-1.5 text-sm font-semibold">
          Project name
          <input className="cubi-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Customer analytics pipeline" />
        </label>
        <label className="space-y-1.5 text-sm font-semibold">
          What did you build?
          <textarea
            className="cubi-input min-h-24 resize-y py-3"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("Example: Built a Python and SQL pipeline, tested the data, and published a dashboard.")}
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={scan} disabled={scanning || !files.length}>
          {scanning ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {scanning ? "Scanning…" : "Scan project"}
        </Button>
        <p className="self-center text-xs text-muted-foreground">Readable code and text stay in this browser.</p>
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}

      {result && (
        <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/[0.05] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Suggested evidence</p>
              <h4 className="mt-1 font-display font-bold">{result.title}</h4>
            </div>
            <ScorePair relevance={result.relevanceScore} impact={result.impactScore} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.skillImpacts.length ? result.skillImpacts.map((impact) => {
              const selected = selectedImpactIds.includes(impact.skillId);
              return (
                <button
                  type="button"
                  key={impact.skillId}
                  onClick={() => setSelectedImpactIds((current) => current.includes(impact.skillId) ? current.filter((id) => id !== impact.skillId) : [...current, impact.skillId])}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition",
                    selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground line-through",
                  )}
                >
                  {selected && <Check className="mr-1 inline size-3" />}{impact.skillName} · +{impact.levelGain}
                </button>
              );
            }) : <span className="text-sm text-muted-foreground">No clear target skills were detected. Add more detail before confirming.</span>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" onClick={confirm} disabled={!selectedImpactIds.length}><Check className="size-4" />Confirm and add</Button>
            <Button type="button" variant="secondary" onClick={() => setResult(null)}>Edit details</Button>
          </div>
        </div>
      )}
    </section>
  );
}

function ManualLearningForm() {
  const { skills, addAdditionalEvidence } = useCubi();
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [learningType, setLearningType] = useState<NonNullable<AdditionalEvidenceRecord["learningType"]>>("Course");
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState<EvidenceProgress>("completed");
  const [hours, setHours] = useState(20);
  const [masteryLevel, setMasteryLevel] = useState(3);
  const [assessmentScore, setAssessmentScore] = useState("");
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [preview, setPreview] = useState<AdditionalEvidenceRecord | null>(null);
  const [saved, setSaved] = useState(false);

  const sortedSkills = useMemo(
    () => [...skills].sort((a, b) => {
      const rank = { High: 0, Medium: 1, Low: 2 } as const;
      return rank[a.importance] - rank[b.importance] || b.vacancyFrequency - a.vacancyFrequency;
    }),
    [skills],
  );

  function toggleSkill(id: string) {
    setSkillIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setPreview(null);
    setSaved(false);
  }

  function buildRecord() {
    if (!title.trim() || !skillIds.length) return null;
    return scoreManualLearning({
      title,
      provider,
      learningType,
      url,
      progress,
      hours,
      masteryLevel,
      assessmentScore: assessmentScore.trim() ? Math.max(0, Math.min(100, Number(assessmentScore))) : undefined,
      skillIds,
      skills,
    });
  }

  function calculate() {
    setPreview(buildRecord());
    setSaved(false);
  }

  function save() {
    const record = preview ?? buildRecord();
    if (!record) return;
    addAdditionalEvidence(record);
    setSaved(true);
    setPreview(record);
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
          <BookOpenCheck className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-lg font-extrabold">Add self-study</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Tell Cubi what you learned and how well you mastered it.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-semibold sm:col-span-2">
          Course or learning activity
          <input className="cubi-input" value={title} onChange={(event) => { setTitle(event.target.value); setPreview(null); }} placeholder="Data Engineering Zoomcamp" />
        </label>
        <label className="space-y-1.5 text-sm font-semibold">
          Provider
          <input className="cubi-input" value={provider} onChange={(event) => setProvider(event.target.value)} placeholder="DataTalks.Club" />
        </label>
        <label className="space-y-1.5 text-sm font-semibold">
          Type
          <select className="cubi-input" value={learningType} onChange={(event) => setLearningType(event.target.value as NonNullable<AdditionalEvidenceRecord["learningType"]>)}>
            {learningTypes.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-semibold sm:col-span-2">
          Link (optional)
          <span className="relative block">
            <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input className="cubi-input pl-10" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://…" inputMode="url" />
          </span>
        </label>
        <label className="space-y-1.5 text-sm font-semibold">
          Progress
          <select className="cubi-input capitalize" value={progress} onChange={(event) => { setProgress(event.target.value as EvidenceProgress); setPreview(null); }}>
            {progressOptions.map((item) => <option key={item} value={item}>{item.replace("-", " ")}</option>)}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-semibold">
          Time spent (hours)
          <input className="cubi-input" type="number" min="0" max="1000" value={hours} onChange={(event) => { setHours(Number(event.target.value)); setPreview(null); }} />
        </label>
        <label className="space-y-1.5 text-sm font-semibold">
          Mastery
          <select className="cubi-input" value={masteryLevel} onChange={(event) => { setMasteryLevel(Number(event.target.value)); setPreview(null); }}>
            <option value={1}>1 — Just started</option>
            <option value={2}>2 — Basic</option>
            <option value={3}>3 — Can apply</option>
            <option value={4}>4 — Strong</option>
            <option value={5}>5 — Can teach</option>
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-semibold">
          Assessment score (optional)
          <input className="cubi-input" type="number" min="0" max="100" value={assessmentScore} onChange={(event) => { setAssessmentScore(event.target.value); setPreview(null); }} placeholder="85" />
        </label>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold">Skills practised</p>
        <div className="mt-2 flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-border bg-secondary/25 p-3">
          {sortedSkills.map((skill) => {
            const selected = skillIds.includes(skill.id);
            return (
              <button
                type="button"
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/45",
                )}
              >
                {selected && <Check className="mr-1 inline size-3" />}{skill.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={calculate} disabled={!title.trim() || !skillIds.length} variant="secondary">
          <Sparkles className="size-4" />Calculate score
        </Button>
        <Button type="button" onClick={save} disabled={!title.trim() || !skillIds.length || saved}>
          <Plus className="size-4" />{saved ? "Added" : "Add to my progress"}
        </Button>
      </div>

      {preview && (
        <div className="mt-4 rounded-2xl border border-border bg-secondary/35 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated contribution</p>
              <p className="mt-1 text-sm font-semibold">Based on target demand, completion, time and your mastery rating.</p>
            </div>
            <ScorePair relevance={preview.relevanceScore} impact={preview.impactScore} />
          </div>
        </div>
      )}
    </section>
  );
}

export function ScorePair({ relevance, impact }: { relevance: number; impact: number }) {
  return (
    <div className="flex gap-2 text-center">
      <Score label="Relevance" value={relevance} />
      <Score label="Skill improvement" value={impact} />
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20 rounded-xl border border-border bg-card px-2.5 py-2 shadow-sm">
      <strong className="block text-lg text-primary">{value}%</strong>
      <span className="block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}
