const normalize = require('../normalize');

const parse = function (string) {
  if (string == null) { return string; }
  const raw = string.raw != null ? string.raw : string;
  const normalized = raw.toString().toLowerCase().trim();

  let gender;
  switch (normalized) {
    case 'm': case 'male':
      gender = new String('male');
      break;
    case 'f': case 'female':
      gender = new String('female');
      break;
    case 'o': case 'other':
      gender = new String('other');
      break;
    default:
      gender = new String(raw); // eslint-disable-line no-case-declarations
      gender.valid = false;
  }

  gender.raw = raw;
  if (gender.valid == null) { gender.valid = true; }

  switch (gender.valueOf()) {
    case 'male':
      gender.abbr = 'M';
      break;
    case 'female':
      gender.abbr = 'F';
      break;
    case 'other':
      gender.abbr = 'O';
      break;
    default:
      gender.abbr = null;
  }

  return gender;
};

const components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' },
  { name: 'abbr', type: 'string', description: 'Abbreviated name of gender' }
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
    'format is invalid'
  ],
  examples: [
    'male',
    'female',
    'other',
    'M',
    'F',
    'O'
  ].map(parse).map(normalize)
};
