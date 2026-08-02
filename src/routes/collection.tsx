import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, ExternalLink, FileUp, Pencil, Search, XCircle } from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { DemoBadge, Notice, PageHeader } from "@/components/cubi/Common";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";
import type { CourseRecord } from "@/data/cubi-demo";

export const Route = createFileRoute("/collection")({
  head: () => ({ meta: [{ title: "Courses | Cubi" }] }),
  component: CoursesPage,
});

export function CoursesPage() {
  const { courses, skills, toggleCourseVerified, updateCourse } = useCubi();
  const [query, setQuery] = useState("");
  const [onlyUnverified, setOnlyUnverified] = useState(false);
  const [editing, setEditing] = useState<CourseRecord | null>(null);
  const filtered = useMemo(() => courses.filter((course) =>
    (!onlyUnverified || !course.verified) && `${course.name} ${course.code}`.toLowerCase().includes(query.toLowerCase()),
  ), [courses, onlyUnverified, query]);

  return (
    <CubiShell>
      <div className="space-y-7">
        <PageHeader eyebrow="University evidence" title="Courses" description="Review the courses behind your skill map." action={<DemoBadge />} />
        <Notice>Demo course data. Verify details with the university.</Notice>
        <div className="panel flex flex-col gap-3 p-4 sm:flex-row">
          <label className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input className="cubi-input pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search course or code" /></label>
          <Button variant={onlyUnverified ? "default" : "secondary"} onClick={() => setOnlyUnverified((value) => !value)}>{onlyUnverified ? <XCircle className="size-4" /> : <CheckCircle2 className="size-4" />}Show unverified only</Button>
          <Button variant="secondary"><FileUp className="size-4" />Upload catalogue</Button>
        </div>

        <div className="space-y-4">
          {filtered.map((course) => {
            const related = skills.filter((skill) => skill.courseIds.includes(course.id));
            return (
              <article key={course.id} className="panel overflow-hidden p-0">
                <div className="grid gap-5 p-5 lg:grid-cols-[1fr_260px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">{course.code}</span><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{course.credits} ECTS</span><span className={`rounded-full border px-3 py-1 text-xs font-bold ${course.verified ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-amber-300 bg-amber-50 text-amber-800"}`}>{course.verified ? "Reviewed" : "Needs review"}</span></div>
                    <h2 className="mt-3 font-display text-2xl font-extrabold">{course.name}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.description}</p>
                    <div className="mt-4"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Learning outcomes</p><ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">{course.learningOutcomes.map((outcome) => <li key={outcome} className="rounded-xl bg-secondary/55 px-3 py-2">• {outcome}</li>)}</ul></div>
                  </div>
                  <div className="space-y-3 rounded-2xl bg-card/55 p-4 text-sm">
                    <CourseInfo label="Academic level" value={course.academicLevel} />
                    <CourseInfo label="Prerequisites" value={course.prerequisites} />
                    <CourseInfo label="Assessment" value={course.assessment} />
                    <CourseInfo label="Retrieved" value={course.retrievedAt} />
                    <a href={course.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-primary">View source <ExternalLink className="size-3.5" /></a>
                  </div>
                </div>
                <div className="border-t border-border bg-background/30 px-5 py-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Extracted skills</p><div className="mt-2 flex flex-wrap gap-2">{related.length ? related.map((skill) => <span key={skill.id} className="rounded-full bg-secondary px-3 py-1 text-xs">{skill.name} · {skill.confidence}%</span>) : <span className="text-sm text-muted-foreground">No skills linked yet.</span>}</div></div><div className="flex gap-2"><Button variant="secondary" onClick={() => setEditing(course)}><Pencil className="size-4" />Correct</Button><Button variant={course.verified ? "secondary" : "default"} onClick={() => toggleCourseVerified(course.id)}>{course.verified ? "Mark for review" : "Confirm course"}</Button></div></div>
                </div>
              </article>
            );
          })}
        </div>
        {!filtered.length && <div className="panel border-dashed p-10 text-center"><BookOpen className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 text-muted-foreground">No courses match the current filters.</p></div>}
      </div>
      {editing && <CourseEditor course={editing} onClose={() => setEditing(null)} onSave={(changes) => { updateCourse(editing.id, changes); setEditing(null); }} />}
    </CubiShell>
  );
}

function CourseInfo({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 leading-5">{value}</p></div>; }

function CourseEditor({ course, onClose, onSave }: { course: CourseRecord; onClose: () => void; onSave: (changes: Partial<CourseRecord>) => void }) {
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description);
  const [credits, setCredits] = useState(String(course.credits));
  return <div className="fixed inset-0 z-[70] flex justify-end bg-black/45 backdrop-blur-sm" onClick={onClose}><aside className="h-full w-full max-w-xl overflow-y-auto border-l border-border bg-background p-6" onClick={(event) => event.stopPropagation()}><button className="ml-auto grid size-9 place-items-center rounded-xl bg-secondary" onClick={onClose} aria-label="Close editor"><XCircle className="size-4" /></button><p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">User correction</p><h2 className="mt-1 font-display text-3xl font-extrabold">Correct course record</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Your correction is saved as reviewed demo data.</p><div className="mt-6 space-y-4"><label className="space-y-2 text-sm font-semibold">Course name<input className="cubi-input" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="space-y-2 text-sm font-semibold">Course description<textarea className="cubi-input min-h-40 resize-y" value={description} onChange={(event) => setDescription(event.target.value)} /></label><label className="space-y-2 text-sm font-semibold">ECTS / credits<input className="cubi-input" type="number" min="0" value={credits} onChange={(event) => setCredits(event.target.value)} /></label></div><div className="mt-6 flex gap-2"><Button onClick={() => onSave({ name: name.trim() || course.name, description: description.trim() || course.description, credits: Number(credits) || course.credits })}>Save correction</Button><Button variant="secondary" onClick={onClose}>Cancel</Button></div></aside></div>;
}
