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
    "ecmaVersion": 2018
  },
  "rules": {
    "no-console": "off",
    "semi": ["error", "always"],
    "indent": ["error", "space"],
    "indent": ["error", 2]
  }
};