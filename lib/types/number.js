const _ = require('lodash');
const normalize = require('../normalize');

const parse = function (string) {
  if (string == null) { return string; }

  let number;
  if (_.isNumber(string)) {
    number = new Number(string);
  } else if (_.isString(string)) {
    const sanitized = typeof string.replace === 'function'
      ? string.replace(/[^-\d.]/g, '')
      : undefined;
    if (sanitized && sanitized.length) {
      number = new Number(sanitized);
    } else {
      number = new Number('NaN');
    }
  } else {
    number = new Number('NaN');
  }

  number.valid = !isNaN(number);
  number.raw = string.raw != null ? string.raw : string;
  return number;
};

module.exports = {
  parse,
  components: [],
  maskable: false,
  operators: [
    'is equal to',
    'is not equal to',
    'is less than',
    'is less than or equal to',
    'is greater than',
    'is greater than or equal to',
    'is blank',
    'is not blank',
    'format is valid',
    'format is invalid',
    'includes',
    'does not include',
    'is included in',
    'is not included in',
    'is between',
    'is not between'
  ],
  examples: [
    '100',
    '100.999',
    '$100.99',
    '1,000',
    '1,000.00'
  ].map(parse).map(normalize)
};
