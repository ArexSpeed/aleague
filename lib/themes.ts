/**
 * Single list of themes. Each id needs a matching block in
 * app/styles/themes/<id>.css  ([data-theme="<id>"] { ... }).
 * Adding a theme = new CSS file + one line here.
 */
export const THEMES = [
  { id: "light", label: "Jasny" },
  { id: "dark", label: "Ciemny" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "light";
