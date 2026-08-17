import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

// eslint-config-next ships native flat configs as of v15+. Loading them through
// FlatCompat routes them via the legacy eslintrc loader, whose schema expects
// `plugins` to be an array of strings rather than an object of plugin instances.
// That mismatch fails validation, and the validator then crashes trying to
// JSON.stringify the (circular) plugin graph to build its error message —
// surfacing as "Converting circular structure to JSON" and disabling all
// linting. Import the flat configs directly instead.
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
