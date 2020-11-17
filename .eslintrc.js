module.exports = {
  settings: {
    "import/resolver": {
      alias: {
        map: [["src", "./packages/dashboard/src"]],
        extensions: [".ts", ".js", ".jsx", ".json"],
      },
    },
  },
  extends: ["airbnb", "prettier", "prettier/react"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      impliedStrict: true,
      classes: true,
    },
  },
  env: {
    browser: true,
    node: true,
    jquery: true,
    jest: true,
    mocha: true,
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
    chrome: true,
  },
  rules: {
    // spent 2 hours to fix a bug because of rewriting & to &&
    // needed a bitwise operator & not && in some case
    "no-bitwise": 0,
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    // we have multiple "for with async await" and functions cases
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "no-loop-func": "off",
    "no-continue": "off",

    // only required for some testing
    "no-unused-expressions": 0,

    // some algorithm uses this
    "no-plusplus": 0,

    // TODO: Ignoring this until we find a way to ignore devDepencies for "tests"
    "import/no-extraneous-dependencies": 0,

    // we have multiple methods without 'this'
    // but will obviously fail with static
    "class-methods-use-this": 1,
    "consistent-return": 1,
    "no-return-assign": 1,
    "react/require-default-props": 1,
    "import/prefer-default-export": 1,
    "jsx-a11y/no-autofocus": 0,
    "react/jsx-props-no-spreading": 0,
    "react/prop-types": 1,
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"],
      },
    ],

    // these are simple formatting, like space, quotes etc.
    quotes: [
      2,
      "double",
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        singleQuote: false,
        printWidth: 80,
      },
    ],

    // TODO: probably should use a debugging tool instead
    "no-console": ["off", { allow: ["warn", "error", "debug"] }],

    "func-names": ["off"],
    // NOTE: I have no idea why this gives me warning although express-jwt is installed. so, I have to turn it off
    "import/no-unresolved": "off",
    // NOTE: these two rules must not be removed if we are using hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  plugins: ["html", "prettier", "react-hooks"],
};
