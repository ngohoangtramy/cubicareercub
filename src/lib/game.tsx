import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import type { AvatarConfig, PlayerState } from "@/data/types";
import { careerById } from "@/data/careers";
import { currentSkillProfile } from "@/data/catalog";
import { achievementById, buildings } from "@/data/collectibles";

const STORAGE_KEY = "cubi.player.v1";
const LEGACY_STORAGE_KEY = "careerquest.player.v1";

export const defaultAvatar: AvatarConfig = {
  name: "New Explorer",
  hair: "wave",
  hairColor: "#2b2b3a",
  eyes: "happy",
  skin: "#e6b98f",
  face: "smile",
  outfit: "hoodie",
  shoes: "sneakers",
  backpack: "classic",
  accessory: "none",
  pet: "fox",
  mentor: "fox",
};

export const emptyPlayer: PlayerState = {
  created: false,
  avatar: defaultAvatar,
  university: "University of Amsterdam",
  degreeId: "business-analytics",
  year: 2,
  careerId: "machine-learning-engineer",
  xp: 0,
  coins: 250,
  streak: 1,
  freezeTokens: 1,
  completedQuests: [],
  unlockedNodes: [],
  achievements: [],
  inventory: ["outfit-starter-tee"],
  savedOpportunities: [],
  dailyDone: [],
  lastUnlock: "Starter Tee",
};

export const levelFromXp = (xp: number) => Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
export const xpForLevel = (level: number) => 100 * (level - 1) ** 2;

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const start = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return {
    level,
    start,
    next,
    into: xp - start,
    needed: next - start,
    percent: Math.round(((xp - start) / (next - start)) * 100),
  };
}

export const titleForLevel = (level: number) => {
  if (level >= 45) return "Career Master";
  if (level >= 35) return "Industry Vanguard";
  if (level >= 25) return "Senior Adventurer";
  if (level >= 18) return "Field Specialist";
  if (level >= 12) return "Journeyman";
  if (level >= 7) return "Apprentice";
  if (level >= 4) return "Pathfinder";
  return "Explorer";
};

interface GameContextValue {
  player: PlayerState;
  ready: boolean;
  level: number;
  progress: ReturnType<typeof levelProgress>;
  title: string;
  resumeScore: number;
  update: (patch: Partial<PlayerState>) => void;
  reset: () => void;
  addXp: (amount: number, label?: string) => void;
  completeQuest: (id: string, xp: number, title: string) => void;
  toggleDaily: (id: string, xp: number, title: string) => void;
  unlockNode: (id: string, xp: number, name: string) => void;
  toggleSaved: (id: string) => void;
  currentBuilding: (typeof buildings)[number];
}

const GameContext = createContext<GameContextValue | null>(null);

export function celebrate(intensity: "small" | "big" = "small") {
  if (typeof window === "undefined") return;
  const colors = ["#176B4D", "#295F8A", "#E4A11B", "#B63A3A"];
  confetti({
    particleCount: intensity === "big" ? 160 : 70,
    spread: intensity === "big" ? 110 : 70,
    startVelocity: intensity === "big" ? 55 : 40,
    origin: { y: 0.6 },
    colors,
    scalar: 0.9,
  });
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerState>(emptyPlayer);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const current = window.localStorage.getItem(STORAGE_KEY);
      const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      const raw = current ?? legacy;
      if (raw) {
        setPlayer({ ...emptyPlayer, ...(JSON.parse(raw) as PlayerState) });
        if (!current && legacy) {
          window.localStorage.setItem(STORAGE_KEY, legacy);
          window.localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      }
    } catch {
      /* ignore corrupt state */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }, [player, ready]);

  const update = useCallback((patch: Partial<PlayerState>) => {
    setPlayer((p) => ({ ...p, ...patch }));
  }, []);

  const reset = useCallback(() => setPlayer(emptyPlayer), []);

  const addXp = useCallback((amount: number, label?: string) => {
    setPlayer((p) => {
      const next = { ...p, xp: p.xp + amount, coins: p.coins + Math.round(amount / 4) };
      if (levelFromXp(next.xp) > levelFromXp(p.xp)) {
        celebrate("big");
        toast.success(`Level ${levelFromXp(next.xp)} reached!`, {
          description: `You are now a ${titleForLevel(levelFromXp(next.xp))}.`,
        });
      } else if (label) {
        toast.success(label, { description: `+${amount} XP · +${Math.round(amount / 4)} coins` });
      }
      return next;
    });
  }, []);

  const completeQuest = useCallback(
    (id: string, xp: number, title: string) => {
      setPlayer((p) => {
        if (p.completedQuests.includes(id)) {
          return { ...p, completedQuests: p.completedQuests.filter((q) => q !== id), xp: Math.max(0, p.xp - xp) };
        }
        celebrate("small");
        toast.success(`Quest complete: ${title}`, { description: `+${xp} XP` });
        return {
          ...p,
          completedQuests: [...p.completedQuests, id],
          xp: p.xp + xp,
          coins: p.coins + Math.round(xp / 4),
          lastUnlock: title,
        };
      });
    },
    [],
  );

  const toggleDaily = useCallback((id: string, xp: number, title: string) => {
    setPlayer((p) => {
      if (p.dailyDone.includes(id)) {
        return { ...p, dailyDone: p.dailyDone.filter((d) => d !== id), xp: Math.max(0, p.xp - xp) };
      }
      celebrate("small");
      toast.success(title, { description: `+${xp} XP · streak protected` });
      return { ...p, dailyDone: [...p.dailyDone, id], xp: p.xp + xp };
    });
  }, []);

  const unlockNode = useCallback((id: string, xp: number, name: string) => {
    setPlayer((p) => {
      if (p.unlockedNodes.includes(id)) return p;
      celebrate("big");
      toast.success(`${name} unlocked!`, { description: `+${xp} XP · skill tree expanded` });
      return { ...p, unlockedNodes: [...p.unlockedNodes, id], xp: p.xp + xp, lastUnlock: name };
    });
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setPlayer((p) => ({
      ...p,
      savedOpportunities: p.savedOpportunities.includes(id)
        ? p.savedOpportunities.filter((o) => o !== id)
        : [...p.savedOpportunities, id],
    }));
  }, []);

  const value = useMemo<GameContextValue>(() => {
    const progress = levelProgress(player.xp);
    const career = careerById(player.careerId);
    const owned = new Set([...currentSkillProfile(player.degreeId, player.year).map((s) => s.id), ...player.unlockedNodes]);
    const covered = career.requiredSkills.filter((s) => owned.has(s)).length;
    const resumeScore = Math.min(
      99,
      Math.round(
        (covered / career.requiredSkills.length) * 55 +
          Math.min(25, player.completedQuests.length * 3) +
          Math.min(12, player.achievements.length) +
          Math.min(8, player.streak / 12),
      ),
    );
    const currentBuilding =
      [...buildings].reverse().find((b) => b.levelRequired <= progress.level) ?? buildings[0];
    return {
      player,
      ready,
      level: progress.level,
      progress,
      title: titleForLevel(progress.level),
      resumeScore,
      update,
      reset,
      addXp,
      completeQuest,
      toggleDaily,
      unlockNode,
      toggleSaved,
      currentBuilding,
    };
  }, [player, ready, update, reset, addXp, completeQuest, toggleDaily, unlockNode, toggleSaved]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

export { achievementById };