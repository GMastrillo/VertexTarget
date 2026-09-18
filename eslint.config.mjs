// Fast lint tier. Everything here runs without type information, which is
// what keeps it quick enough for a pre-commit hook. The rules that need the
// type checker live in eslint.typed.config.mjs and run on their own script.
//
// Adapted for this Next.js project:
// - application source lives under src/
// - Supabase clients are exported from src/lib/supabase*.ts
// - presentation layers are src/app/ and src/components/
// - there is no project logging adapter yet, so direct console usage is
//   measured instead of exempted.
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import tseslint from "typescript-eslint";
import quality from "./eslint-rules/index.cjs";

export default defineConfig([
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  nextPlugin.flatConfig.coreWebVitals,
  {
    files: ["src/**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    plugins: { quality },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-var": "error",
      "prefer-const": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      complexity: ["warn", 12],
      "max-depth": ["warn", 4],
      "max-statements": ["warn", 20],
      "max-params": ["warn", 4],
      "max-lines-per-function": [
        "warn",
        { max: 150, skipBlankLines: true, skipComments: true },
      ],
      "max-nested-callbacks": ["warn", 3],
      // Baseline offenders are explicitly listed rather than weakening the
      // gate. New source files over 350 lines fail lint.
      "quality/max-lines": [
        "error",
        {
          max: 350,
          ignore: [
            "src/app/cases/[slug]/CaseStudyClient.tsx",
            "src/components/cases/CasesSection.tsx",
            "src/lib/i18n-data.ts",
            "src/lib/case-studies.ts",
            "src/lib/i18n.ts",
          ],
        },
      ],
      // Baseline: 1 existing direct console violation in src/.
      "quality/no-direct-console": [
        "warn",
        { logger: "the project's logging adapter" },
      ],
      // Baseline: 9 existing direct Supabase client imports remain in route
      // handlers and the password page; refactoring is intentionally separate.
      "quality/no-direct-data-access": [
        "warn",
        {
          modules: ["@/lib/supabase", "@/lib/supabase-server"],
          bindings: [
            "createSupabaseBrowserClient",
            "createSupabaseServerClient",
            "createSupabaseAdminClient",
          ],
          layers: ["/src/app/", "/src/components/"],
          extensions: [".tsx"],
        },
      ],
    },
  },
  {
    // Existing findings from the project's pre-existing source and tooling
    // are baselines. They remain visible as warnings; this task installs the
    // gates and measures them without refactoring application code.
    files: ["src/**/*.{js,jsx,ts,tsx,mjs,cjs}", "scripts/**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    rules: {
      // Baseline: 1 triple-slash reference, 3 require imports, 1 unused
      // expression, 1 empty block, 9 unused variables, 3 non-null
      // assertions, 1 control-character regex, and 2 prefer-const findings.
      "@typescript-eslint/triple-slash-reference": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "no-empty": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "no-control-regex": "warn",
      "prefer-const": "warn",
    },
  },
  {
    // Project maintenance scripts are intentionally CommonJS; require() is
    // their module boundary, not an application import smell.
    files: ["scripts/**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    // eslint-rules is intentionally CommonJS so ESLint can load the copied
    // rule files without a build step.
    files: ["eslint-rules/**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { module: "readonly", require: "readonly" },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores([
    ".claude/**",
    ".github/agents/**",
    ".github/hooks/**",
    ".github/skills/**",
    "node_modules/**",
    ".next/**",
    "out/**",
    "dist/**",
    "build/**",
    "coverage/**",
    "**/*.tsbuildinfo",
    "next-env.d.ts",
    "package-lock.json",
    "src/generated/**",
  ]),
]);