import { cn } from "@/lib/utils";

export function CubiLogo({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src="/cubi-logo.png"
      width={size}
      height={size}
      alt="Cubi logo"
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
