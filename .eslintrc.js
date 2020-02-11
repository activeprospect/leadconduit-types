module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "extends": "standard",
    "rules": {
      "semi": [2, "always"],
      "no-extra-semi": 2,
      "no-useless-return": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "no-new-wrappers": 0  
    }
}
