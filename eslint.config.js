import globals from "globals";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      semi: ["error", "always"],
      indent: ["error", 2],
    },
  },
  prettier,
];
