import js from "@eslint/js";
import tseslint from "typescript-eslint";
export default tseslint.config(
  // Leading **/ matters: "dist/**" only ever matched a dist folder at the repo
  // root, so a nested build output (packages/*/dist, ticker/dist) was linted as
  // if it were source and buried the real findings under hundreds of errors
  // about generated code.
  { ignores: ["**/dist/**", "**/build/**", "**/node_modules/**", "**/*.cjs"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // scripts/bundle-server.mjs is a build script, and tsconfig.json's
        // "include" only lists .ts/.tsx/.js - not .mjs. Without this the
        // project service refuses to parse it at all, which reports as a lint
        // error about a file that has nothing wrong with it. Only .mjs is
        // listed: anything tsconfig.json already covers must NOT appear here,
        // or the service rejects it for being in both places.
        projectService: {
          allowDefaultProject: ["*.mjs", "scripts/*.mjs"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
);
