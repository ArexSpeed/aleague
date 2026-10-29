import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

/** Keep in sync with sports/registry.ts. */
const SPORTS = ["speedway"];

const sportBoundaries = SPORTS.map((sport) => ({
  files: [`sports/${sport}/**/*.{ts,tsx}`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@/app/**",
              "@/sports/registry",
              ...SPORTS.filter((other) => other !== sport).map((other) => `@/sports/${other}/**`),
            ],
            message: "A sport may only import shared code (components, lib) and its own files.",
          },
        ],
      },
    ],
  },
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Shared building blocks know nothing about concrete sports or routes.
  {
    files: ["components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/sports/**", "@/app/**"],
              message: "Shared components/lib must not depend on sports or app routes.",
            },
          ],
        },
      ],
    },
  },
  ...sportBoundaries,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
