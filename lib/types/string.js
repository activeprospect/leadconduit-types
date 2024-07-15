module.exports = {
  parse: (value) => {
    if (value == null) { return value; }
    return value.toString();
  },
  components: [],
  maskable: false,
  operators: [
    'is equal to',
    'is not equal to',
    'is blank',
    'is not blank',
    'is obscene',
    'is not obscene',
    'includes',
    'does not include',
    'is included in',
    'is not included in',
    'matches pattern',
    'does not match pattern'
  ],
  examples: [
    'any text'
  ]
};
