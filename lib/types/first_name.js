const parse = function (data) {
  let parsed;
  if (typeof data === 'string') {
    parsed = data;
    parsed.raw = data;
    parsed.valid = true;
  } else {
    parsed = new String(data);
    parsed.raw = data;
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
    'format is valid',
    'format is invalid',
    'matches pattern',
    'does not match pattern'
  ],
  examples: [
    'Mike',
    'Robert',
    'Janet'
  ]
};
