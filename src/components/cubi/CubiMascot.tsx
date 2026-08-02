import { cn } from "@/lib/utils";

export function CubiMascot({
  size = 180,
  mood = "happy",
  animated = false,
  className,
}: {
  size?: number;
  mood?: "happy" | "thinking" | "celebrate";
  animated?: boolean;
  className?: string;
}) {
  const mouth = mood === "thinking" ? "M78 105 Q90 100 102 105" : "M76 102 Q90 116 104 102";
  return (
    <div
      className={cn("relative inline-grid place-items-center", animated && "animate-bob", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Cubi mascot, ${mood}`}
    >
      <svg viewBox="0 0 180 180" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="cubi-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D99B7F" />
            <stop offset="1" stopColor="#A56F63" />
          </linearGradient>
          <linearGradient id="cubi-hair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#173B4B" />
            <stop offset="1" stopColor="#0F3040" />
          </linearGradient>
          <filter id="cubi-shadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#071F2B" floodOpacity="0.35" />
          </filter>
        </defs>

        <ellipse cx="90" cy="159" rx="51" ry="10" fill="#071F2B" opacity="0.26" />
        <g filter="url(#cubi-shadow)">
          <rect x="42" y="39" width="96" height="112" rx="39" fill="url(#cubi-body)" stroke="#F4C3A8" strokeWidth="3" />
          <path
            d="M45 78 C43 47 61 25 89 25 C119 25 137 47 136 76 C124 67 115 63 102 61 C94 60 87 57 81 52 C72 64 61 73 45 78Z"
            fill="url(#cubi-hair)"
          />
          <path d="M48 70 C52 47 68 34 89 34 C108 34 125 46 132 67" fill="none" stroke="#315363" strokeWidth="5" strokeLinecap="round" opacity="0.72" />
          <path d="M54 46 C66 32 80 27 96 29" fill="none" stroke="#466879" strokeWidth="4" strokeLinecap="round" opacity="0.52" />

          <path d="M46 76 C33 77 27 88 30 102" fill="none" stroke="#464858" strokeWidth="8" strokeLinecap="round" />
          <path d="M134 76 C147 77 153 88 150 102" fill="none" stroke="#464858" strokeWidth="8" strokeLinecap="round" />
          <rect x="26" y="92" width="14" height="30" rx="7" fill="#0F3040" stroke="#D99B7F" strokeWidth="3" />
          <rect x="140" y="92" width="14" height="30" rx="7" fill="#0F3040" stroke="#D99B7F" strokeWidth="3" />
          <path d="M35 117 C35 142 52 151 67 151" fill="none" stroke="#464858" strokeWidth="5" strokeLinecap="round" />
          <circle cx="69" cy="151" r="5" fill="#D99B7F" />

          <ellipse cx="69" cy="89" rx="6" ry="8" fill="#0F3040" />
          <ellipse cx="111" cy="89" rx="6" ry="8" fill="#0F3040" />
          <circle cx="71" cy="86" r="2" fill="#FFF8F2" />
          <circle cx="113" cy="86" r="2" fill="#FFF8F2" />
          <path d={mouth} fill="none" stroke="#0F3040" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="59" cy="104" rx="9" ry="4" fill="#F5B6A5" opacity="0.65" />
          <ellipse cx="121" cy="104" rx="9" ry="4" fill="#F5B6A5" opacity="0.65" />

          <path d="M62 129 Q90 143 118 129 L115 151 L65 151Z" fill="#0F3040" opacity="0.92" />
          <path d="M74 131 L90 142 L106 131" fill="none" stroke="#D99B7F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {mood === "celebrate" && (
          <g className={animated ? "animate-pulse" : undefined}>
            <path d="M24 42 L29 53 L41 55 L31 63 L34 75 L24 69 L14 75 L17 63 L7 55 L19 53Z" fill="#D99B7F" />
            <path d="M151 31 L155 39 L164 40 L158 47 L159 56 L151 52 L143 56 L144 47 L138 40 L147 39Z" fill="#F4C3A8" />
          </g>
        )}
      </svg>
    </div>
  );
}
