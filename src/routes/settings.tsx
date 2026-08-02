import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Database, Download, Eye, FileArchive, KeyRound, RefreshCcw, ShieldCheck, Trash2 } from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { DemoBadge, Notice, PageHeader } from "@/components/cubi/Common";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings | Cubi" }] }),
  component: SettingsPage,
});

export function SettingsPage() {
  const cubi = useCubi();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function exportData() {
    const payload = { profile: cubi.profile, courses: cubi.courses, skills: cubi.skills, vacancies: cubi.vacancies, recommendations: cubi.recommendations, careerNodes: cubi.careerNodes, activity: cubi.activity, exportedAt: new Date().toISOString(), mode: "demonstration" };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "cubi-career-roadmap-demo.json"; anchor.click(); URL.revokeObjectURL(url);
    setMessage("Your demonstration skill profile and roadmap were exported.");
  }

  return (
    <CubiShell>
      <div className="space-y-7">
        <PageHeader eyebrow="Privacy and control" title="Settings" description="Manage your data and preferences." action={<DemoBadge />} />
        {message && <Notice tone="success">{message}</Notice>}

        <section className="grid gap-5 lg:grid-cols-2">
          <SettingsCard icon={<ShieldCheck className="size-5" />} title="Privacy" description="Review what Cubi uses.">
            <div className="space-y-3 text-sm leading-6 text-muted-foreground"><p>• Education profile and target occupation guide the analysis.</p><p>• Public catalogue and job-market sources should be processed by backend services.</p><p>• Every extracted record retains a source URL and retrieval date.</p><p>• AI-generated classifications remain editable and should show confidence.</p><p>• External university or employment-platform passwords must never be collected.</p></div>
          </SettingsCard>

          <SettingsCard icon={<Database className="size-5" />} title="Data source" description="The app currently uses demo data.">
            <div className="grid gap-3 text-sm sm:grid-cols-2"><ArchitectureItem icon={<Eye className="size-4" />} title="Frontend" text="Interface and review controls" /><ArchitectureItem icon={<KeyRound className="size-4" />} title="Backend" text="Retrieval and authorised API access" /><ArchitectureItem icon={<FileArchive className="size-4" />} title="Database" text="Profiles, evidence and progress" /><ArchitectureItem icon={<RefreshCcw className="size-4" />} title="Background jobs" text="Long-running analysis and caching" /></div>
          </SettingsCard>

          <SettingsCard icon={<Download className="size-5" />} title="Export your data" description="Download your Cubi data as JSON."><Button onClick={exportData}><Download className="size-4" />Export career roadmap</Button></SettingsCard>

          <SettingsCard icon={<Trash2 className="size-5" />} title="Reset demo data" description="Clear local demo results.">
            {!confirmDelete ? <Button variant="destructive" onClick={() => setConfirmDelete(true)}><Trash2 className="size-4" />Delete demo data</Button> : <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4"><p className="text-sm">This resets the local Cubi demonstration workspace. It cannot be undone.</p><div className="mt-3 flex gap-2"><Button variant="destructive" onClick={() => { cubi.resetDemo(); void navigate({ to: "/" }); }}>Confirm deletion</Button><Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button></div></div>}
          </SettingsCard>
        </section>

        <Notice>Live account deletion must also remove server data.</Notice>
      </div>
    </CubiShell>
  );
}

function SettingsCard({ icon, title, description, children }: { icon: ReactNode; title: string; description: string; children: ReactNode }) { return <section className="panel p-5"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">{icon}</span><div><h2 className="font-display text-xl font-extrabold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div></div><div className="mt-5">{children}</div></section>; }
function ArchitectureItem({ icon, title, text }: { icon: ReactNode; title: string; text: string }) { return <div className="rounded-2xl bg-secondary/55 p-3"><span className="text-primary">{icon}</span><p className="mt-2 font-bold">{title}</p><p className="mt-1 text-xs text-muted-foreground">{text}</p></div>; }
