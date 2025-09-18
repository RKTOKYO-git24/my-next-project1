// /home/ryotaro/dev/mnp-dw-20250821/eslint.config.mjs

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "payload/**",   // Vercel ビルドでは Payload配下を無視
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^(_|ignore)",
        },
      ],
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      // v2 ライブラリは基本禁止
      "no-restricted-imports": [
        "error",
        {
          "patterns": ["@physna-v2/*"]
        }
      ],
    },
  },
  {
    // 例外: v2 ページと API は許可
    files: ["app/physna/**", "app/api/physna/**"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];

export default eslintConfig;