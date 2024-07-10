const parse = function (string) {
  let parsed;
  if (typeof string === 'string') {
    parsed = string;
  } else {
    parsed = new String(string);
    parsed.raw = string;
    parsed.valid = false;
  }
  return parsed;
};

const components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
];

module.exports = {
  parse,
  components,
  maskable: false,
  operators: [
    'is equal to',
    'is not equal to',
    'is blank',
    'is not blank',
    'is obscene',
    'is not obscene',
    'format is valid',
    'format is invalid',
    'matches pattern',
    'does not match pattern'
  ],
  examples: [
    'Jones',
    'Campbell',
    'Smith'
  ]
};
