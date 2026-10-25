import Link from "next/link";
import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MasterDetailProps = {
  /** Left part: tabs, filters, tables. */
  master: ReactNode;
  /** Right part. Pass null to hide the panel. */
  detail: ReactNode | null;
  /** Where the close button and the mobile backdrop navigate (URL without the detail param). */
  closeHref: string;
  /**
   * true (default): the whole master part scrolls.
   * false: the master part is a flex column that does not scroll; the page keeps
   * tabs/filters fixed and scrolls only its own list (flex-1 min-h-0 overflow-y-auto).
   */
  scrollMaster?: boolean;
};

/**
 * Two-part content of <main>.
 * - lg and up: master | detail side by side (detail is a dark aside card).
 * - below lg: detail becomes a bottom sheet over the page, with a backdrop.
 *
 * Open/closed state lives in the URL (e.g. ?team=wolves), so the browser back
 * button closes the panel and the view is shareable. The page decides what to
 * pass as `detail`; this component has no state.
 */
export function MasterDetail({
  master,
  detail,
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
          <Link
            href={closeHref}
            scroll={false}
            aria-label="Close panel"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />

          <aside
            aria-label="Details"
            className="fixed inset-x-0 bottom-0 top-14 z-50 flex flex-col overflow-hidden rounded-t-3xl bg-shell-surface text-shell-foreground shadow-2xl lg:static lg:inset-auto lg:z-auto lg:m-3 lg:ml-0 lg:w-[400px] lg:shrink-0 lg:rounded-3xl lg:shadow-none xl:w-[440px]"
          >
            <Link
              href={closeHref}
              scroll={false}
              aria-label="Close panel"
              className="absolute top-4 right-4 z-10 rounded-lg p-1 text-shell-muted transition-colors hover:bg-white/10 hover:text-white"
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
