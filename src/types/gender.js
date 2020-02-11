/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const normalize = require('../normalize');

const parse = function(string) {
  if (string == null) { return string; }
  const raw = string.raw != null ? string.raw : string;
  const normalized = raw.toString().toLowerCase().trim();
  const gender =
    (() => { switch (normalized) {
      case 'm': case 'male': return new String("male");
      case 'f': case 'female': return new String("female");
      case 'o': case 'other': return new String("other");
      default:
        var invalid = new String(raw);
        invalid.valid = false;
        return invalid;
    } })();
  gender.raw = raw;
  if (gender.valid == null) { gender.valid = true; }
  gender.abbr =
    (() => { switch (gender.valueOf()) {
      case 'male': return 'M';
      case 'female': return 'F';
      case 'other': return 'O';
      default: return null;
    } })();
  return gender;
};

const components = [
  { name: 'raw', type: 'string', description: 'Unmodified value'},
  { name: 'abbr', type: 'string', description: 'Abbreviated name of gender'}
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
