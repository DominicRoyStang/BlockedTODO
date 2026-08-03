module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest": true,
        "node": true,
        "commonjs": true
    },
    "extends": "eslint:recommended",
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "sourceType": "module",
        "requireConfigFile": false,
    },
    "rules": {
        "strict": 0,
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-trailing-spaces": [
            "error"
        ],
        "no-unused-vars": [
            "error",
            {
                "varsIgnorePattern": "^_",
                "argsIgnorePattern": "^_",
                "args": "none"
            }
        ],
        "max-len": [
            "error",
            {
                "code": 128
            }
        ],
        "no-console": [
            "off"
        ],
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 1
            }
        ],
        "prefer-const": [
            "error",
            {
                "destructuring": "all"
            }
        ],
        "no-var": [
            "error"
        ],
        "object-curly-spacing": [
            "error",
            "never"
        ],
        "array-bracket-spacing": [
            "error",
            "never"
        ],
        "arrow-parens": [
            "error"
        ],
        "arrow-spacing": [
            "error"
        ],
        "space-infix-ops": [
            "error"
        ],
        "no-multi-spaces": [
            "error",
            {
                "ignoreEOLComments": true
            }
        ],
        "keyword-spacing": [
            "error"
        ],
        "space-unary-ops": [
            "error"
        ],
        "brace-style": [
            "error",
            "1tbs",
            {
                "allowSingleLine": true
            }
        ],
        "comma-dangle": [
            "error",
            "only-multiline"
        ]
    }
}