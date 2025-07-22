module.exports = {
  env: {
    node: true,
    es2021: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  plugins: [
    "@typescript-eslint",
    "prettier",
    "import-helpers",
    "unused-imports"
  ],
  rules: {
    "prettier/prettier": "error", // Enforce Prettier formatting as ESLint errors
    "no-console": "warn", // Warn if using console.log, but allow it
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
    ], // Ignore unused variables prefixed with _
    "unused-imports/no-unused-imports": "error", // Remove unused imports
    "unused-imports/no-unused-vars": [
      "warn",
      { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }
    ],
    "import-helpers/order-imports": [
      "warn",
      {
        newlinesBetween: "always",
        groups: ["module", "/^@shared/", ["parent", "sibling", "index"]],
        alphabetize: { order: "asc", ignoreCase: true }
      }
    ]
  }
};
