import { Clock, Gauge, TrendingUp, Check } from "lucide-react";
import type { Quest } from "@/data/types";
import { skillName } from "@/data/catalog";
import { useGame } from "@/lib/game";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const kindStyles: Record<string, string> = {
  main: "border-gold/50 bg-gold/10 text-gold",
  epic: "border-violet/50 bg-violet/10 text-violet",
  project: "border-primary/50 bg-primary/10 text-primary",
  certification: "border-coral/50 bg-coral/10 text-coral",
  community: "border-chart-5/50 bg-chart-5/10 text-chart-5",
  side: "border-border bg-secondary text-muted-foreground",
  daily: "border-primary/40 bg-primary/10 text-primary",
  weekly: "border-gold/40 bg-gold/10 text-gold",
};

export function QuestCard({ quest }: { quest: Quest }) {
  const { player, completeQuest } = useGame();
  const done = player.completedQuests.includes(quest.id);
  const blocked = quest.dependencies.some((d) => !player.completedQuests.includes(d));

  return (
    <div
      className={cn(
        "panel hover-lift flex h-full flex-col gap-3 p-5",
        done && "border-primary/40 bg-primary/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", kindStyles[quest.kind])}>
            {quest.kind} quest
          </span>
          <h3 className="mt-2 font-display text-lg font-bold leading-tight">{quest.title}</h3>
        </div>
        <span className="shrink-0 rounded-xl bg-secondary px-2.5 py-1 font-display text-sm font-bold text-gold">
          +{quest.xp} XP
        </span>
      </div>

      <p className="text-sm text-muted-foreground">{quest.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {quest.skills.map((s) => (
          <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
            {skillName(s)}
          </span>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="size-3.5" />{quest.hours}h</span>
        <span className="flex items-center gap-1"><Gauge className="size-3.5" />{quest.difficulty}</span>
        <span className="flex items-center gap-1"><TrendingUp className="size-3.5" />+{quest.resumeImpact} CV</span>
      </div>

      {quest.reward && (
        <p className="rounded-xl border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold">
          Reward: {quest.reward}
        </p>
      )}

      <Button
        variant={done ? "secondary" : "default"}
        disabled={blocked && !done}
        onClick={() => completeQuest(quest.id, quest.xp, quest.title)}
      >
        {done ? (<><Check className="size-4" /> Completed</>) : blocked ? "Locked by dependencies" : "Mark complete"}
      </Button>
    </div>
  );
}