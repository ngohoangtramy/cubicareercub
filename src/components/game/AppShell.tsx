import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Network, Swords, Map, Trophy, Backpack, Compass, Users, Castle, Flame, Coins, Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useGame } from "@/lib/game";
import { XpBar } from "./bits";

const nav = [
  { to: "/home", label: "Home Base", icon: Home },
  { to: "/skills", label: "Skill Tree", icon: Network },
  { to: "/quests", label: "Quests", icon: Swords },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/island", label: "Career Island", icon: Castle },
  { to: "/collection", label: "Collection", icon: Trophy },
  { to: "/inventory", label: "Inventory", icon: Backpack },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/social", label: "Social", icon: Users },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { player, progress, title, ready } = useGame();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen hero-bg">
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
              <Sparkles className="size-5" />
            </span>
            <span className="hidden sm:inline">Cubi</span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden min-w-40 flex-col gap-1 sm:flex">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">Lv {progress.level} · {title}</span>
                <span>{ready ? `${progress.into}/${progress.needed}` : "—"}</span>
              </div>
              <XpBar percent={progress.percent} className="h-2" />
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-coral/40 bg-coral/10 px-3 py-1.5 text-sm font-semibold text-coral">
              <Flame className="size-4" /> {player.streak}
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-sm font-semibold text-gold">
              <Coins className="size-4" /> {player.coins}
            </div>
          </div>
        </div>

        <nav className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto border-t border-border px-3 py-2">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  active && "bg-primary/15 text-primary",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>

      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-4 text-xs text-muted-foreground">
        Cubi — Your Career Cub · demo build running on local mock data. No accounts, no backend, no purchases — everything is earned.
      </footer>
    </div>
  );
}