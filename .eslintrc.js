module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  plugins: ["react", "prettier", "simple-import-sort"],
  extends: [
    "prettier",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "simple-import-sort/sort": "error",
  },
};
