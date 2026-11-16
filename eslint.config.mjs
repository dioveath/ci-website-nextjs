// eslint-config-next v16 ships a native flat config array, so it is spread
// directly. Do not wrap it in FlatCompat -- that routes a flat config through
// the legacy validator and throws "Converting circular structure to JSON".
//
// Pinned to ESLint 9: eslint-config-next 16.3.3 bundles @typescript-eslint 8,
// whose ScopeManager is not compatible with ESLint 10 (scopeManager.addGlobals
// is not a function).
import next from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", "out/**", "node_modules/**", "studio/**"] },
  ...next
];

export default config;
