const _ = require('lodash');
const normalize = require('../normalize');

const parse = function (string) {
  if (string == null) { return string; }

  let bool;
  if (_.isBoolean(string)) {
    bool = new Boolean(string.valueOf());
  } else if (_.isString(string)) {
    const sanitized = typeof string.replace === 'function'
      ? string.replace(/[^a-z0-9]/ig, '').toLowerCase()
      : undefined;
    bool = parseBoolean(sanitized);
  } else if (_.isNumber(string)) {
    bool = parseBoolean(string.toString());
  } else {
    bool = parseBoolean('NaB');
  }

  if (bool.valid == null) { bool.valid = true; }
  bool.raw = string.raw != null ? string.raw : string;
  return bool;
};

const parseBoolean = function (value) {
  switch (value) {
    case 'y': case 'yes': case 'true': case 't': case '1': return new Boolean(true);
    case 'n': case 'no': case 'false': case 'f': case '0': return new Boolean(false);
    default:
      const bool = new Boolean(false); // eslint-disable-line no-case-declarations
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
