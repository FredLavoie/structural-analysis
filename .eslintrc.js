module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "jquery": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2018
  },
  "rules": {
    "no-console": "off",
    "semi": ["error", "always"],
    "indent": ["error", "space"],
    "indent": ["error", 2],
    "no-trailing-spaces": ["error", { "ignoreComments": true }],
    "space-before-blocks": ["error", "always"],
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "prefer-const": "error",
    "prefer-arrow-callback": "error",
    "arrow-parens": ["error", "always"],
    "quotes": [2, "single", "avoid-escape"],
  }
};