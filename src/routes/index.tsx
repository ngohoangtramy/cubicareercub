import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CubiMascot } from "@/components/cubi/CubiMascot";
import { CubiLogo } from "@/components/cubi/CubiLogo";
import { DemoBadge } from "@/components/cubi/Common";
import { LanguageSwitcher } from "@/components/cubi/LanguageSwitcher";
import { AdditionalEvidenceForms } from "@/components/cubi/AdditionalEvidenceForms";
import { useCubi } from "@/lib/cubi";
import { useI18n } from "@/lib/i18n";
import type { EducationProfile } from "@/data/cubi-demo";
import {
  europeanCountries,
  europeanProgrammes,
  europeanUniversities,
  programmesForUniversity,
  universityByName,
} from "@/data/european-catalog";
import { careerCategories, careerPositionByTitle, careerPositions } from "@/data/career-positions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cubi — Your Career Cub" },
      { name: "description", content: "Map your education to a target career." },
    ],
  }),
  component: OnboardingPage,
});

const educationLevels = [
  "Secondary school",
  "Bachelor’s student",
  "Bachelor’s graduate",
  "Master’s student",
  "Master’s graduate",
  "PhD student",
  "PhD graduate",
  "Other",
];

const steps = ["Education", "Extra learning", "Career", "Review"];

export function OnboardingPage() {
  const { profile, saveProfile, additionalEvidence } = useCubi();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"signin" | "create">("create");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<EducationProfile>(profile);
  const [email, setEmail] = useState("student@example.com");
  const [password, setPassword] = useState("demo-password");
  const [consent, setConsent] = useState(true);
  const [careerCategory, setCareerCategory] = useState(
    careerPositionByTitle(profile.targetOccupation)?.category ?? "Biotechnology & life sciences",
  );

  const universities = useMemo(
    () => europeanUniversities.filter((item) => !form.country || item.country === form.country),
    [form.country],
  );
  const programmes = useMemo(() => programmesForUniversity(form.institution), [form.institution]);
  const roles = useMemo(
    () => careerPositions.filter((item) => item.category === careerCategory),
    [careerCategory],
  );

  const update = <K extends keyof EducationProfile>(key: K, value: EducationProfile[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const selectedUniversity = universityByName(form.institution);
  const selectedProgramme = europeanProgrammes.find(
    (item) => item.universityId === selectedUniversity?.id && item.name === form.degreeProgramme,
  );
  const selectedCareer = careerPositionByTitle(form.targetOccupation);

  const canContinue =
    step === 1
      ? Boolean(form.educationLevel && form.country && selectedUniversity && selectedProgramme && form.graduationYear)
      : step === 2
        ? true
        : step === 3
          ? Boolean(selectedCareer)
          : consent;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (step < 4) {
      if (canContinue) setStep((current) => current + 1);
      return;
    }
    if (!consent) return;
    saveProfile(form);
    void navigate({ to: "/analysis" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[0.75fr_1.25fr]">
        <section className="relative hidden overflow-hidden bg-sidebar px-10 py-10 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-20 top-28 size-72 rounded-full bg-sidebar-primary/10 blur-3xl" />
          <div className="relative flex items-center gap-3 font-display text-2xl font-extrabold">
            <CubiLogo size={48} className="rounded-2xl" />
            <span>
              Cubi
              <small className="block text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/70">
                Your Career Cub
              </small>
            </span>
          </div>

          <div className="relative flex flex-col items-center text-center">
            <CubiMascot size={250} mood="happy" animated />
            <h1 className="mt-4 max-w-md font-display text-4xl font-extrabold leading-tight">
              Find the skills between you and your goal.
            </h1>
            <p className="mt-3 text-sm text-sidebar-foreground/75">Education → skills → career path</p>
          </div>

          <div className="relative grid grid-cols-3 gap-2 text-center text-xs">
            <Stat value={europeanUniversities.length} label="Universities" />
            <Stat value={europeanProgrammes.length} label="Programmes" />
            <Stat value={careerPositions.length} label="Careers" />
          </div>
        </section>

        <section className="px-4 py-5 sm:px-8 lg:px-12 lg:py-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-display text-lg font-extrabold lg:hidden">
                <CubiLogo size={34} className="rounded-xl" /> Cubi
              </div>
              <div className="ml-auto flex items-center gap-2"><LanguageSwitcher compact /><DemoBadge /></div>
            </div>

            <div className="mb-5">
              <h2 className="font-display text-3xl font-extrabold">Build your career map</h2>
              <p className="mt-1 text-sm text-muted-foreground">Add your education, then choose a career.</p>
            </div>

            <div className="mb-5 rounded-2xl border border-border bg-card p-3 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-[150px_1fr_1fr]">
                <div className="grid grid-cols-2 rounded-xl bg-secondary p-1">
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className={`rounded-lg px-2 py-2 text-xs font-bold transition ${mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("create")}
                    className={`rounded-lg px-2 py-2 text-xs font-bold transition ${mode === "create" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    Create
                  </button>
                </div>
                <CompactInput icon={<Mail className="size-4" />}>
                  <input
                    aria-label="Email address"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="cubi-input pl-10"
                    placeholder="Email"
                  />
                </CompactInput>
                <CompactInput icon={<LockKeyhole className="size-4" />}>
                  <input
                    aria-label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="cubi-input px-10"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </CompactInput>
              </div>
            </div>

            <StepBar current={step} />

            <form onSubmit={submit} className="mt-5">
              <div className="panel p-5 sm:p-6">
                {step === 1 && (
                  <div className="space-y-5">
                    <SectionTitle icon={<GraduationCap className="size-5" />} title="Your education" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SimpleSelect
                        label="Education level"
                        value={form.educationLevel}
                        onChange={(value) => update("educationLevel", value)}
                        options={educationLevels}
                      />
                      <SimpleSelect
                        label="Country"
                        value={form.country}
                        onChange={(value) => {
                          update("country", value);
                          update("institution", "");
                          update("degreeProgramme", "");
                        }}
                        options={europeanCountries}
                      />
                      <SearchCombobox
                        label="University"
                        value={form.institution}
                        onChange={(value) => {
                          update("institution", value);
                          update("degreeProgramme", "");
                        }}
                        options={universities.map((item) => ({ value: item.name, meta: item.city }))}
                        placeholder="Search university"
                      />
                      <SearchCombobox
                        label="Programme"
                        value={form.degreeProgramme}
                        onChange={(value) => update("degreeProgramme", value)}
                        options={programmes.map((item) => ({ value: item.name, meta: `${item.degreeLevel} · ${item.field}` }))}
                        placeholder={form.institution ? "Search programme" : "Choose a university first"}
                        disabled={!form.institution}
                      />
                      <label className="space-y-2 text-sm font-semibold">
                        Graduation year
                        <input
                          value={form.graduationYear}
                          onChange={(event) => update("graduationYear", event.target.value)}
                          className="cubi-input"
                          inputMode="numeric"
                          placeholder="2027"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <SectionTitle icon={<Sparkles className="size-5" />} title="Projects & self-study" />
                    <p className="text-sm leading-6 text-muted-foreground">Optional: add learning outside university so Cubi can include it in your skill score and career path.</p>
                    <AdditionalEvidenceForms compact />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <SectionTitle icon={<BriefcaseBusiness className="size-5" />} title="Your target career" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SimpleSelect
                        label="Career category"
                        value={careerCategory}
                        onChange={(value) => {
                          setCareerCategory(value);
                          update("targetOccupation", "");
                          update("industries", [value]);
                        }}
                        options={careerCategories}
                      />
                      <SearchCombobox
                        label="Target position"
                        value={form.targetOccupation}
                        onChange={(value) => update("targetOccupation", value)}
                        options={roles.map((item) => ({ value: item.title, meta: item.category }))}
                        placeholder="Search position"
                      />
                      <label className="space-y-2 text-sm font-semibold">
                        Preferred region
                        <input
                          value={form.region}
                          onChange={(event) => update("region", event.target.value)}
                          className="cubi-input"
                          placeholder="Europe"
                        />
                      </label>
                      <SimpleSelect
                        label="Work style"
                        value={form.workMode}
                        onChange={(value) => update("workMode", value)}
                        options={["Remote", "Hybrid", "On-site", "No preference"]}
                      />
                      <SimpleSelect
                        label="Role level"
                        value={form.experienceLevel}
                        onChange={(value) => update("experienceLevel", value)}
                        options={["Internship", "Graduate / entry-level", "Experienced"]}
                      />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <SectionTitle icon={<Check className="size-5" />} title="Review" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <ReviewCard label="Education" value={form.degreeProgramme} detail={`${form.institution}, ${form.country}`} />
                      <ReviewCard label="Additional learning" value={`${additionalEvidence.length} update${additionalEvidence.length === 1 ? "" : "s"}`} detail="Projects and self-study" />
                      <ReviewCard label="Target career" value={form.targetOccupation} detail={`${form.region} · ${form.workMode}`} />
                    </div>
                    <div className="rounded-2xl border border-border bg-secondary/55 p-4">
                      <p className="text-sm font-bold">What Cubi will show</p>
                      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                        <CheckItem text="Skills found" />
                        <CheckItem text="Missing skills" />
                        <CheckItem text="Next steps" />
                      </div>
                    </div>
                    <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-1 size-4 accent-primary"
                      />
                      I understand this version uses demo data that I can review and correct.
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep((current) => Math.max(1, current - 1))}
                  disabled={step === 1}
                >
                  <ArrowLeft className="size-4" /> Back
                </Button>
                <Button type="submit" size="lg" disabled={!canContinue}>
                  {step === 4 ? "Build my map" : step === 2 ? "Skip or continue" : "Continue"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                <ShieldCheck className="size-4" /> Demo details stay in this browser.
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent p-3">
      <strong className="block text-xl text-sidebar-foreground">{value}+</strong>
      <span className="text-sidebar-foreground/70">{label}</span>
    </div>
  );
}

function StepBar({ current }: { current: number }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label={`Step ${current} of 4`}>
      {steps.map((label, index) => {
        const number = index + 1;
        const active = number === current;
        const done = number < current;
        return (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : done
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="grid size-5 place-items-center rounded-full bg-black/10">{done ? <Check className="size-3" /> : number}</span>
            {label}
          </div>
        );
      })}
    </div>
  );
}

function CompactInput({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">{icon}</span>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">{icon}</span>
      <h3 className="font-display text-xl font-extrabold">{title}</h3>
    </div>
  );
}

function SimpleSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="space-y-2 text-sm font-semibold">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="cubi-input">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SearchCombobox({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; meta?: string }>;
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [queryText, setQueryText] = useState("");
  const { t } = useI18n();
  const query = (open ? queryText : value).trim().toLowerCase();
  const filtered = options
    .filter((option) =>
      !query ||
      `${option.value} ${t(option.value)} ${option.meta ?? ""} ${option.meta ? t(option.meta) : ""}`
        .toLowerCase()
        .includes(query),
    )
    .slice(0, 8);

  return (
    <label className="relative space-y-2 text-sm font-semibold">
      {label}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={open ? queryText : t(value)}
          onChange={(event) => {
            setQueryText(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQueryText("");
            setOpen(true);
          }}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          className="cubi-input pl-10"
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
        />
        {open && !disabled && (
          <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-popover p-1.5 shadow-xl">
            {filtered.length ? (
              filtered.map((option) => (
                <button
                  type="button"
                  key={`${option.value}-${option.meta ?? ""}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(option.value);
                    setQueryText("");
                    setOpen(false);
                  }}
                  className="w-full rounded-xl px-3 py-2.5 text-left transition hover:bg-secondary"
                >
                  <span className="block text-sm font-semibold">{t(option.value)}</span>
                  {option.meta && <span className="mt-0.5 block text-xs text-muted-foreground">{t(option.meta)}</span>}
                </button>
              ))
            ) : (
              <p className="px-3 py-5 text-center text-sm text-muted-foreground">No results. Try another search.</p>
            )}
          </div>
        )}
      </div>
    </label>
  );
}

function ReviewCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-lg font-extrabold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-3" />
      </span>
      {text}
    </span>
  );
}
