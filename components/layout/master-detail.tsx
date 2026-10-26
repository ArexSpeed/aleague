import Link from "next/link";
import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MasterDetailProps = {
  /** Left part: tabs, filters, tables. */
  master: ReactNode;
  /** Right part. Rendered always on lg+, as a drawer on mobile. */
  detail: ReactNode | null;
  /**
   * Mobile only: is the drawer open? (e.g. "a team is selected in the URL").
   * On lg+ the panel is visible regardless of this flag.
   */
  detailOpen: boolean;
  /** Close button / backdrop target (URL without the selection param). */
  closeHref: string;
  /** true (default): the whole master part scrolls. false: the page scrolls its own list. */
  scrollMaster?: boolean;
};

/**
 * Two-part content of <main>.
 * - lg and up: master | detail side by side, detail is always visible.
 * - below lg: detail is a drawer sliding in from the right, only when `detailOpen`.
 *
 * No JS and no state here: visibility is pure CSS (breakpoints) + the `detailOpen`
 * flag derived from the URL, so resizing the window can never leave it inconsistent.
 */
export function MasterDetail({
  master,
  detail,
  detailOpen,
  closeHref,
  scrollMaster = true,
}: MasterDetailProps) {
  return (
    <div className="flex h-full min-h-0">
      <section
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col p-3 sm:p-4",
          scrollMaster ? "overflow-y-auto" : "overflow-hidden",
        )}
      >
        {master}
      </section>

      {detail ? (
        <>
          {/* Mobile backdrop: tap to close */}
          {detailOpen ? (
            <Link
              href={closeHref}
              scroll={false}
              aria-label="Close panel"
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
          ) : null}

          <aside
            aria-label="Details"
            className={cn(
              "flex-col overflow-hidden bg-shell-surface text-shell-foreground shadow-2xl",
              // mobile: right drawer, shown only when open
              detailOpen ? "flex" : "hidden",
              "fixed inset-y-0 right-0 z-50 w-[min(100%,420px)] rounded-l-3xl max-lg:animate-drawer-in motion-reduce:animate-none",
              // desktop: static card, always shown
              "lg:static lg:z-auto lg:m-3 lg:ml-0 lg:flex lg:w-100 lg:shrink-0 lg:rounded-3xl lg:shadow-none xl:w-110",
            )}
          >
            <Link
              href={closeHref}
              scroll={false}
              aria-label="Close panel"
              className="absolute top-4 right-4 z-10 rounded-lg p-1 text-shell-muted transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X className="size-5" aria-hidden />
            </Link>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">{detail}</div>
          </aside>
        </>
      ) : null}
    </div>
  );
}