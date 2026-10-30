"use client";

import { ArrowUp } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Scrolling container with a "back to top" button.
 * Everything inside scrolls together; whatever sits outside (e.g. tabs) stays put.
 */
export function ScrollArea({
  children,
  threshold = 240,
}: {
  children: ReactNode;
  /** How far (px) you have to scroll before the button appears. */
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={ref}
        onScroll={(e) => setShowTop(e.currentTarget.scrollTop > threshold)}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto"
      >
        <div className="flex min-h-full flex-col">{children}</div>
      </div>

      <button
        type="button"
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        onClick={() => ref.current?.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-brand text-brand-foreground shadow-lg transition-all duration-200",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <ArrowUp className="size-5" aria-hidden />
      </button>
    </div>
  );
}