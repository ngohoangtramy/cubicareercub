import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  ClipboardCheck,
  Compass,
  Menu,
  Network,
  Sparkles,
  Settings,
  UserRound,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCubi } from "@/lib/cubi";
import { CubiMascot } from "./CubiMascot";
import { CubiLogo } from "./CubiLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

const nav = [
  { to: "/home", label: "Home", icon: BarChart3 },
  { to: "/skills", label: "My Skills", icon: ClipboardCheck },
  { to: "/create", label: "Additional Updates", icon: Sparkles },
  { to: "/roadmap", label: "Career Path", icon: Network },
  { to: "/quests", label: "Goals", icon: Compass },
  { to: "/island", label: "Profile", icon: UserRound },
] as const;

const secondaryNav = [
  { to: "/collection", label: "Courses", icon: BookOpen },
  { to: "/explore", label: "Careers", icon: BriefcaseBusiness },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function CubiShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const { profile, readiness } = useCubi();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/home" className="flex items-center gap-2 font-display text-lg font-extrabold">
            <CubiLogo size={38} className="rounded-xl" />
            Cubi
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <button
              className="rounded-xl border border-border bg-card p-2"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
        {open && (
          <nav className="grid grid-cols-2 gap-2 border-t border-border p-3">
            {[...nav, ...secondaryNav].map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground",
                    active && "bg-primary/10 text-primary",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground lg:flex">
        <Link to="/home" className="flex items-center gap-3 px-2 font-display text-xl font-extrabold">
          <CubiLogo size={46} className="rounded-2xl" />
          <span>
            <span className="block">Cubi</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/65">
              Your Career Cub
            </span>
          </span>
        </Link>

        <LanguageSwitcher compact className="mt-4 w-full justify-center" />

        <div className="mt-4 rounded-3xl border border-sidebar-border bg-sidebar-accent p-4">
          <div className="flex items-center gap-3">
            <CubiMascot size={58} />
            <div className="min-w-0">
              <p className="truncate font-display font-bold">{profile.targetOccupation}</p>
              <p className="truncate text-xs text-sidebar-foreground/65">{profile.institution}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-sidebar-foreground/70">Career match</span>
            <strong className="text-sidebar-primary">{readiness}%</strong>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-sidebar/70">
            <div className="h-full rounded-full bg-sidebar-primary" style={{ width: `${readiness}%` }} />
          </div>
        </div>

        <nav className="mt-5 flex-1 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-sidebar-foreground/72 transition hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  active && "bg-sidebar-accent text-sidebar-primary",
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border pt-3">
          <div className="grid grid-cols-3 gap-1">
            {secondaryNav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={cn(
                    "grid place-items-center gap-1 rounded-xl p-2 text-[10px] font-semibold text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    active && "bg-sidebar-accent text-sidebar-primary",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[10px] text-sidebar-foreground/55">Demo data</p>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
