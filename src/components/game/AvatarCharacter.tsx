import type { AvatarConfig } from "@/data/types";
import { cn } from "@/lib/utils";

export const hairStyles = ["wave", "bun", "long", "curls", "fade", "short"] as const;
export const eyeStyles = ["happy", "focused", "sparkle", "sleepy"] as const;
export const faceStyles = ["smile", "grin", "smirk", "neutral"] as const;
export const outfits = [
  { id: "hoodie", name: "Hoodie", color: "#5eead4" },
  { id: "jacket", name: "Bomber Jacket", color: "#fb7185" },
  { id: "labcoat", name: "Lab Coat", color: "#e8eefc" },
  { id: "blazer", name: "Blazer", color: "#8b9dff" },
  { id: "champion", name: "Champion Jacket", color: "#fbbf24" },
  { id: "tee", name: "Starter Tee", color: "#94a3b8" },
];
export const shoeStyles = [
  { id: "sneakers", name: "Sneakers", color: "#f8fafc" },
  { id: "golden", name: "Golden Sneakers", color: "#fbbf24" },
  { id: "boots", name: "Boots", color: "#7c5c3e" },
  { id: "sliders", name: "Sliders", color: "#5eead4" },
];
export const backpacks = [
  { id: "classic", name: "Classic Pack", color: "#64748b" },
  { id: "cloud", name: "Cloud Backpack", color: "#7dd3fc" },
  { id: "rocket", name: "Rocket Pack", color: "#fb7185" },
  { id: "none", name: "No Backpack", color: "transparent" },
];
export const accessories = [
  { id: "none", name: "None", emoji: "" },
  { id: "glasses", name: "Scientist Glasses", emoji: "🥽" },
  { id: "headphones", name: "Headphones", emoji: "🎧" },
  { id: "cap", name: "Cap", emoji: "🧢" },
  { id: "cape", name: "Developer Cape", emoji: "🦸" },
  { id: "earrings", name: "Earrings", emoji: "✨" },
];
export const skinTones = ["#f7d9c4", "#e6b98f", "#c98d5f", "#a9714b", "#6b4630", "#3f2a1d"];
export const hairColors = ["#2b2b3a", "#4a2b1a", "#7a3b1f", "#d9a441", "#e6e6f0", "#5eead4", "#fb7185"];
export const petEmojis: Record<string, string> = {
  fox: "🦊", owl: "🦉", dragon: "🐉", cat: "🐱", robot: "🤖", axolotl: "🦎", slime: "🫧", penguin: "🐧",
};

function Hair({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "bun":
      return (
        <>
          <circle cx="100" cy="46" r="12" fill={color} />
          <path d="M66 78c0-22 15-36 34-36s34 14 34 36c-8-12-20-16-34-16s-26 4-34 16z" fill={color} />
        </>
      );
    case "long":
      return (
        <>
          <path d="M62 84c0-28 16-44 38-44s38 16 38 44v46c-8-6-10-24-10-38-10 8-46 8-56 0 0 14-2 32-10 38V84z" fill={color} />
        </>
      );
    case "curls":
      return (
        <>
          {[74, 88, 100, 112, 126].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 52 : 58} r="14" fill={color} />
          ))}
        </>
      );
    case "fade":
      return <path d="M68 74c2-20 16-32 32-32s30 12 32 32c-10-8-54-8-64 0z" fill={color} />;
    case "short":
      return <path d="M66 80c0-24 15-38 34-38s34 14 34 38c-10-14-58-14-68 0z" fill={color} />;
    default:
      return (
        <path
          d="M64 82c0-26 16-42 36-42s36 16 36 42c-6-10-14-14-14-14s-8 8-22 8-22-8-22-8-8 4-14 14z"
          fill={color}
        />
      );
  }
}

function Eyes({ style }: { style: string }) {
  if (style === "happy")
    return (
      <>
        <path d="M82 96q6-7 12 0" stroke="#1e1b2e" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M106 96q6-7 12 0" stroke="#1e1b2e" strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    );
  if (style === "sleepy")
    return (
      <>
        <path d="M82 98h12" stroke="#1e1b2e" strokeWidth="4" strokeLinecap="round" />
        <path d="M106 98h12" stroke="#1e1b2e" strokeWidth="4" strokeLinecap="round" />
      </>
    );
  if (style === "sparkle")
    return (
      <>
        <circle cx="88" cy="97" r="6" fill="#1e1b2e" />
        <circle cx="112" cy="97" r="6" fill="#1e1b2e" />
        <circle cx="90.5" cy="94.5" r="2.2" fill="#fff" />
        <circle cx="114.5" cy="94.5" r="2.2" fill="#fff" />
      </>
    );
  return (
    <>
      <ellipse cx="88" cy="97" rx="4" ry="6" fill="#1e1b2e" />
      <ellipse cx="112" cy="97" rx="4" ry="6" fill="#1e1b2e" />
    </>
  );
}

function Mouth({ style }: { style: string }) {
  if (style === "grin") return <path d="M88 112q12 12 24 0q-12 6-24 0z" fill="#1e1b2e" />;
  if (style === "smirk") return <path d="M92 112q10 6 16-2" stroke="#1e1b2e" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
  if (style === "neutral") return <path d="M92 113h16" stroke="#1e1b2e" strokeWidth="3.5" strokeLinecap="round" />;
  return <path d="M90 110q10 10 20 0" stroke="#1e1b2e" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
}

interface Props {
  config: AvatarConfig;
  size?: number;
  idle?: boolean;
  aura?: boolean;
  className?: string;
}

export function AvatarCharacter({ config, size = 220, idle = true, aura = false, className }: Props) {
  const outfit = outfits.find((o) => o.id === config.outfit) ?? outfits[0];
  const shoes = shoeStyles.find((s) => s.id === config.shoes) ?? shoeStyles[0];
  const pack = backpacks.find((b) => b.id === config.backpack) ?? backpacks[0];
  const accessory = accessories.find((a) => a.id === config.accessory);

  return (
    <div className={cn("relative select-none", className)} style={{ width: size, height: size }}>
      {aura && (
        <div className="absolute inset-0 rounded-full bg-gold/25 blur-2xl animate-pulse" aria-hidden />
      )}
      <svg viewBox="0 0 200 220" className={cn("relative h-full w-full", idle && "animate-bob")}>
        <ellipse cx="100" cy="208" rx="46" ry="8" fill="oklch(0 0 0 / 30%)" />
        {pack.id !== "none" && <rect x="52" y="126" width="26" height="44" rx="12" fill={pack.color} />}
        <rect x="70" y="126" width="60" height="62" rx="22" fill={outfit.color} />
        <rect x="60" y="132" width="16" height="44" rx="8" fill={outfit.color} />
        <rect x="124" y="132" width="16" height="44" rx="8" fill={outfit.color} />
        <circle cx="68" cy="178" r="8" fill={config.skin} />
        <circle cx="132" cy="178" r="8" fill={config.skin} />
        <rect x="78" y="186" width="18" height="12" rx="6" fill={shoes.color} />
        <rect x="104" y="186" width="18" height="12" rx="6" fill={shoes.color} />
        <rect x="90" y="116" width="20" height="16" rx="8" fill={config.skin} />
        <ellipse cx="100" cy="96" rx="36" ry="38" fill={config.skin} />
        <Hair style={config.hair} color={config.hairColor} />
        <Eyes style={config.eyes} />
        <Mouth style={config.face} />
        <ellipse cx="76" cy="108" rx="6" ry="4" fill="#fb7185" opacity="0.4" />
        <ellipse cx="124" cy="108" rx="6" ry="4" fill="#fb7185" opacity="0.4" />
      </svg>
      {accessory && accessory.emoji && (
        <span className="absolute left-1/2 top-[18%] -translate-x-1/2 text-2xl" style={{ fontSize: size * 0.14 }}>
          {accessory.emoji}
        </span>
      )}
      {config.pet && petEmojis[config.pet] && (
        <span
          className="absolute bottom-2 right-0 animate-float"
          style={{ fontSize: size * 0.18 }}
          aria-label="companion pet"
        >
          {petEmojis[config.pet]}
        </span>
      )}
    </div>
  );
}