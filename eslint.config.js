// eslint.config.js
// @ts-check
import js from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // arquivos/paths a ignorar completamente
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "dist/**",
      "tests/**/*.test.js"
    ]
  },

  // regras recomendadas do ESLint
  js.configs.recommended,

  // opções gerais do projeto
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Node
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        // Testes
        jest: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-undef": "error"
    }
  },

  // ajustes específicos para testes (caso queira manter regras específicas para outros testes)
  {
    files: ["tests/**/*.test.js"],
    rules: {
      "no-console": "off"
    }
  }
];