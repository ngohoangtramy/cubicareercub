import { useState } from "react";
import { Lock, Check, Sparkles, BookOpen, Award, Hammer } from "lucide-react";
import { careerById } from "@/data/careers";
import { skillById } from "@/data/catalog";
import { useGame } from "@/lib/game";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const COL = 190;
const ROW = 150;

export function SkillTree({ careerId }: { careerId: string }) {
  const career = careerById(careerId);
  const { player, unlockNode } = useGame();
  const [openId, setOpenId] = useState<string | null>(null);

  const lanes = Math.max(...career.tree.map((n) => n.lane)) + 1;
  const tiers = Math.max(...career.tree.map((n) => n.tier)) + 1;
  const width = lanes * COL + 80;
  const height = tiers * ROW + 80;
  const pos = (lane: number, tier: number) => ({ x: 60 + lane * COL, y: 60 + tier * ROW });

  const isUnlocked = (id: string) => player.unlockedNodes.includes(id);
  const isAvailable = (id: string) => {
    const node = career.tree.find((n) => n.id === id)!;
    return !isUnlocked(id) && node.requires.every(isUnlocked);
  };

  const open = openId ? career.tree.find((n) => n.id === openId) : null;
  const openSkill = open ? skillById(open.skillId) : null;

  return (
    <>
      <div className="no-scrollbar overflow-x-auto rounded-3xl border border-border bg-surface/40 p-2">
        <svg width={width} height={height} className="min-w-full">
          <defs>
            <linearGradient id="edgeOn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.743 0.084 45.2)" />
              <stop offset="100%" stopColor="oklch(0.595 0.072 33.0)" />
            </linearGradient>
          </defs>
          {career.tree.flatMap((node) =>
            node.requires.map((reqId) => {
              const from = career.tree.find((n) => n.id === reqId);
              if (!from) return null;
              const a = pos(from.lane, from.tier);
              const b = pos(node.lane, node.tier);
              const on = isUnlocked(node.id);
              return (
                <path
                  key={`${reqId}-${node.id}`}
                  d={`M${a.x} ${a.y + 34} C ${a.x} ${a.y + 90}, ${b.x} ${b.y - 90}, ${b.x} ${b.y - 34}`}
                  fill="none"
                  strokeWidth={on ? 4 : 2.5}
                  stroke={on ? "url(#edgeOn)" : "oklch(0.743 0.084 45.2 / 24%)"}
                  strokeDasharray={on ? undefined : "6 8"}
                />
              );
            }),
          )}
          {career.tree.map((node) => {
            const p = pos(node.lane, node.tier);
            const unlocked = isUnlocked(node.id);
            const available = isAvailable(node.id);
            const skill = skillById(node.skillId);
            return (
              <g
                key={node.id}
                transform={`translate(${p.x},${p.y})`}
                onClick={() => setOpenId(node.id)}
                className="cursor-pointer"
              >
                <circle
                  r="34"
                  className={cn(
                    "transition-all",
                    unlocked ? "fill-primary/20" : available ? "fill-gold/15" : "fill-secondary",
                  )}
                  stroke={unlocked ? "oklch(0.743 0.084 45.2)" : available ? "oklch(0.595 0.072 33.0)" : "oklch(0.743 0.084 45.2 / 30%)"}
                  strokeWidth="3"
                />
                {unlocked && <circle r="42" fill="none" stroke="oklch(0.743 0.084 45.2 / 28%)" strokeWidth="6" />}
                <text textAnchor="middle" y="6" fontSize="22">
                  {unlocked ? "✅" : available ? "✨" : "🔒"}
                </text>
                <text
                  textAnchor="middle"
                  y="58"
                  className={cn("text-[12px] font-semibold", unlocked ? "fill-foreground" : "fill-muted-foreground")}
                  fill="currentColor"
                >
                  {skill?.name ?? node.skillId}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {open && openSkill && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  {isUnlocked(open.id) ? <Check className="size-5 text-primary" /> : <Lock className="size-5 text-muted-foreground" />}
                  {openSkill.name}
                </DialogTitle>
                <DialogDescription>{openSkill.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <NodeList icon={<Hammer className="size-4" />} title="Projects" items={open.projects} />
                <NodeList icon={<BookOpen className="size-4" />} title="Learning resources" items={open.resources} />
                {open.certifications.length > 0 && (
                  <NodeList icon={<Award className="size-4" />} title="Certifications" items={open.certifications} />
                )}
                <NodeList icon={<Sparkles className="size-4" />} title="Required quests" items={open.quests} />
                <div className="flex items-center justify-between rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3">
                  <span className="font-semibold text-gold">Reward</span>
                  <span className="font-display text-lg font-bold text-gold">+{open.xp} XP</span>
                </div>
                {isUnlocked(open.id) ? (
                  <p className="text-center text-sm text-primary">Node unlocked. Nice work.</p>
                ) : isAvailable(open.id) ? (
                  <Button
                    className="w-full"
                    onClick={() => {
                      unlockNode(open.id, open.xp, openSkill.name);
                      setOpenId(null);
                    }}
                  >
                    Unlock node
                  </Button>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Locked — first unlock: {open.requires.map((r) => skillById(r)?.name).join(", ")}
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function NodeList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon} {title}
      </p>
      <ul className="space-y-1">
        {items.map((i) => (
          <li key={i} className="rounded-xl bg-secondary/60 px-3 py-2">{i}</li>
        ))}
      </ul>
    </div>
  );
}