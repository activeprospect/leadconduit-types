/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash');
const normalize = require('../normalize');

const parse = function(string) {
  if (string == null) { return string; }

  const number =
    (() => {
    if (_.isNumber(string)) {
      return new Number(string);
    } else if (_.isString(string)) {
      const sanitized = typeof string.replace === 'function' ? string.replace(/[^-\d.]/g, '') : undefined;
      if ((sanitized != null ? sanitized.length : undefined)) {
        return new Number(sanitized);
      } else {
        return new Number('NaN');
      }
    } else {
      return new Number('NaN');
    }
  })();

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
