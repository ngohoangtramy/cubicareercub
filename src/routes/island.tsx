import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { BriefcaseBusiness, GraduationCap, MapPin, Pencil, Save, UserRound } from "lucide-react";
import { CubiShell } from "@/components/cubi/CubiShell";
import { CubiMascot } from "@/components/cubi/CubiMascot";
import { DemoBadge, Notice, PageHeader } from "@/components/cubi/Common";
import { Button } from "@/components/ui/button";
import { useCubi } from "@/lib/cubi";
import type { EducationProfile } from "@/data/cubi-demo";

export const Route = createFileRoute("/island")({
  head: () => ({ meta: [{ title: "Profile | Cubi" }] }),
  component: ProfilePage,
});

export function ProfilePage() {
  const { profile, saveProfile } = useCubi();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EducationProfile>(profile);
  const update = (key: keyof EducationProfile, value: string | string[]) => setForm((current) => ({ ...current, [key]: value }));
  function submit(event: FormEvent) { event.preventDefault(); saveProfile(form); setEditing(false); }

  return (
    <CubiShell>
      <div className="space-y-7">
        <PageHeader eyebrow="Personal information" title="Profile" description="Update your education and career goal." action={<DemoBadge />} />
        <section className="grid gap-5 xl:grid-cols-[330px_1fr]">
          <div className="panel flex flex-col items-center p-6 text-center">
            <CubiMascot size={210} mood="happy" />
            <h2 className="mt-3 font-display text-2xl font-extrabold">Career explorer</h2>
            <p className="mt-1 text-sm text-primary">{profile.targetOccupation}</p>
            <div className="mt-5 w-full space-y-3 text-left text-sm"><ProfileLine icon={<GraduationCap className="size-4" />} label={profile.degreeProgramme} /><ProfileLine icon={<MapPin className="size-4" />} label={`${profile.institution}, ${profile.country}`} /><ProfileLine icon={<BriefcaseBusiness className="size-4" />} label={`${profile.region} · ${profile.workMode}`} /></div>
          </div>

          <form onSubmit={submit} className="panel p-5 sm:p-6">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Education and career</p><h2 className="mt-1 font-display text-2xl font-extrabold">Analysis profile</h2></div><Button type="button" variant="secondary" onClick={() => setEditing((value) => !value)}><Pencil className="size-4" />{editing ? "Cancel" : "Edit profile"}</Button></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ProfileField label="Education level" value={form.educationLevel} disabled={!editing} onChange={(value) => update("educationLevel", value)} />
              <ProfileField label="Country" value={form.country} disabled={!editing} onChange={(value) => update("country", value)} />
              <ProfileField label="Institution" value={form.institution} disabled={!editing} onChange={(value) => update("institution", value)} />
              <div className="sm:col-span-2"><ProfileField label="Degree programme" value={form.degreeProgramme} disabled={!editing} onChange={(value) => update("degreeProgramme", value)} /></div>
              <ProfileField label="Current study year" value={form.currentYear} disabled={!editing} onChange={(value) => update("currentYear", value)} />
              <ProfileField label="Expected graduation" value={form.graduationYear} disabled={!editing} onChange={(value) => update("graduationYear", value)} />
              <div className="sm:col-span-2"><ProfileField label="Target occupation" value={form.targetOccupation} disabled={!editing} onChange={(value) => update("targetOccupation", value)} /></div>
              <ProfileField label="Preferred region" value={form.region} disabled={!editing} onChange={(value) => update("region", value)} />
              <ProfileField label="Work mode" value={form.workMode} disabled={!editing} onChange={(value) => update("workMode", value)} />
              <ProfileField label="Experience level" value={form.experienceLevel} disabled={!editing} onChange={(value) => update("experienceLevel", value)} />
              <ProfileField label="Industries" value={form.industries.join(", ")} disabled={!editing} onChange={(value) => update("industries", value.split(",").map((item) => item.trim()).filter(Boolean))} />
            </div>
            {editing && <Button type="submit" className="mt-6"><Save className="size-4" />Save profile</Button>}
          </form>
        </section>
        <Notice><UserRound className="mr-1 inline size-4" /><strong className="text-foreground">You control these details.</strong> Re-run the analysis after major changes.</Notice>
      </div>
    </CubiShell>
  );
}

function ProfileLine({ icon, label }: { icon: ReactNode; label: string }) { return <div className="flex items-start gap-3 rounded-2xl bg-secondary/55 p-3"><span className="mt-0.5 text-primary">{icon}</span><span className="leading-5">{label}</span></div>; }
function ProfileField({ label, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (value: string) => void }) { return <label className="space-y-2 text-sm font-semibold">{label}<input className="cubi-input disabled:cursor-not-allowed disabled:opacity-70" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} /></label>; }
