import eslint from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default [
  eslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  perfectionist.configs["recommended-natural"],
  {
    rules: {
      "unicorn/prevent-abbreviations": ["error", { replacements: { env: false } }],
    },
  },
];
