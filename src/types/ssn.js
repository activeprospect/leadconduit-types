/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash');
const normalize = require('../normalize');

const parse = function(string) {
  let parsed;
  if (string == null) { return string; }
  const raw = string.raw != null ? string.raw : string;
  const cleanedStr = string.replace(/[^0-9]/g, '');
  if (cleanedStr.length === 9) {
    parsed = new String(cleanedStr);
    parsed.raw = raw;
    parsed.first_three = cleanedStr.slice(0, 3);
    parsed.middle_two = cleanedStr.slice(3, 5);
    parsed.last_four = cleanedStr.slice(-4);
    parsed.masked = false;
    parsed.valid = true;
    return parsed;
  } else {
    parsed = new String(string);
    parsed.raw = raw;
    parsed.masked = false;
    parsed.valid = false;
    return parsed;
  }
};


const components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' },
  { name: 'first_three', type: 'string', description: 'First three digits of SSN' },
  { name: 'middle_two', type: 'string', description: 'Middle two digits of SSN' },
  { name: 'last_four', type: 'number', description: 'Last four digits of SSN' }
];


module.exports = {
  parse,
  components,
  maskable: true,
  operators: [
    'is equal to',
    'is not equal to',
    'is blank',
    'is not blank',
    'format is valid',
    'format is invalid',
    'includes',
    'does not include',
    'is included in',
    'is not included in'
  ],
  examples: [
    '123-45-6789',
    '123 45 6789',
    '123456789'
  ].map(parse).map(normalize)
};

