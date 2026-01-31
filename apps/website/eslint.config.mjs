import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["app/_components/**/*.{js,jsx}", "app/(routes)/**/*.{js,jsx}"],
    rules: {
      "no-console": "error",
      "no-restricted-imports": [
        "error",
        { patterns: ["**/supabase", "@supabase/supabase-js"] },
      ],
      "no-restricted-globals": ["error", "fetch"],
    },
  },
]);

export default eslintConfig;
