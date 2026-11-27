/** Tabs of the club aside panel (?panel=...), shared by every competition that shows it. */
export const PANEL_TABS = ["stats", "games", "riders", "details"] as const;
export type PanelTab = (typeof PANEL_TABS)[number];