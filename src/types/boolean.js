/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash');
const number = require('./number');
const normalize = require('../normalize');

const parse = function(string) {
  if (string == null) { return string; }
  const bool =
    (() => {
    if (_.isBoolean(string)) {
      return new Boolean(string.valueOf());
    } else if (_.isString(string)) {
      const sanitized = typeof string.replace === 'function' ? string.replace(/[^a-z0-9]/ig, '').toLowerCase() : undefined;
      return parseBoolean(sanitized);
    } else if (_.isNumber(string)) {
      return parseBoolean(string.toString());
    } else {
      return parseBoolean('NaB');
    }
  })();
  if (bool.valid == null) { bool.valid = true; }
  bool.raw = string.raw != null ? string.raw : string;
  return bool;
};

var parseBoolean = function(value) {
  switch (value) {
    case 'y': case 'yes': case 'true': case 't': case '1': return new Boolean(true);
    case 'n': case 'no': case 'false': case 'f': case '0': return new Boolean(false);
    default:
      var bool = new Boolean(false);
      bool.valid = false;
      return bool;
  }
};

module.exports = {
  parse,
  components: [],
  maskable: false,
  operators: [
    'is true',
    'is not true',
    'is false',
    'is not false',
    'is blank',
    'is not blank',
    'format is valid',
    'format is invalid'
  ],
  examples: [
    'yes',
    'no',
    'Y',
    'N',
    'true',
    'false',
    'T',
    'F',
    '1',
    '0'
  ].map(parse).map(normalize)
};
