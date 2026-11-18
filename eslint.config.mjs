// eslint-config-next v16 ships a native flat config array, so it is spread
// directly. Do not wrap it in FlatCompat -- that routes a flat config through
// the legacy validator and throws "Converting circular structure to JSON".
//
// Pinned to ESLint 9: eslint-config-next 16.3.3 bundles @typescript-eslint 8,
// whose ScopeManager is not compatible with ESLint 10 (scopeManager.addGlobals
// is not a function).
import next from "eslint-config-next/core-web-vitals";
import { plugin as shadcn } from "@shadcn/lint";
import tsParser from "@typescript-eslint/parser";

// @shadcn/lint resolves every class against the project's own Tailwind theme,
// so `themeImports` has to point at the stylesheet that owns the tokens.
// Without it the rules have nothing to validate against and `no-raw-colors`
// cannot tell a declared token from a typo.
const designSystem = {
  settings: {
    shadcn: {
      themeImports: ["styles/globals.css"],
      ui: "components/ui",
      mergeFunctions: ["cn"],
      variantFunctions: ["cva"]
    }
  },
  languageOptions: {
    parser: tsParser,
    parserOptions: { ecmaFeatures: { jsx: true } }
  },
  plugins: { shadcn }
};

const config = [
  { ignores: [".next/**", "out/**", "node_modules/**", "studio/**", "scripts/**"] },
  ...next,

  // The design system is enforced where the design system lives. `containers/`
  // is the logged-in admin area; it joins in phase 4.
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    ...designSystem,
    rules: {
      // Colour may only come from a declared token. Catches `bg-gray-100`,
      // `text-red-600`, `color="#39A1FF"` and `bg-highlightt` alike.
      "shadcn/no-raw-colors": "error",
      // No `text-[38px]` / `w-[350px]`: sizes come from the scale.
      "shadcn/no-arbitrary-values": "error",
      // No `style={{ height: "40px" }}` spacer divs.
      "shadcn/no-inline-styles": "error",
      // Classes Tailwind cannot generate, e.g. `border-full`, `hover:text-red`.
      // `not-prose` is real -- @tailwindcss/typography adds it -- but the rule
      // reads the theme, not the plugin's utilities, so it has to be allowed.
      "shadcn/no-unknown-classes": ["error", { allow: ["not-prose"] }],
      // A `className` Tailwind can statically read, so the above can be checked.
      "shadcn/require-static-classes": "error",
      // Primitives own their styling; callers pass props, not overrides.
      "shadcn/no-restyle": "error"
    }
  },

  // The shadcn primitives are the one place that is allowed to define styling
  // for a component, which is what `no-restyle` otherwise forbids.
  {
    files: ["components/ui/**/*.{ts,tsx}"],
    rules: { "shadcn/no-restyle": "off" }
  }
];

export default config;
