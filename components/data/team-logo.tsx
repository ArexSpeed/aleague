import { cn } from "@/lib/utils";

type TeamLogoProps = {
  color: string;
  icon?: string;
  className?: string;
};

/** Round team badge. Swap the inside for a real logo image later. */
export function TeamLogo({ color, icon, className }: TeamLogoProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-base shadow-xs ring-1 ring-line sm:size-11 sm:text-xl",
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {icon}
    </span>
  );
}