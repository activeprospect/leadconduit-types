/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash');
const normalize = require('../normalize');


const parseRegex = /^(\S+)\s+(.+)$/;

const parse = function(string) {

  let parsed;
  const addr = string.trim().match(parseRegex);

  if (addr != null) {
    parsed = new String(string.trim());
    parsed.raw = string.raw != null ? string.raw : string;
    parsed.number = addr[1];
    parsed.name = addr[2];
    parsed.valid = true;
  } else {
    parsed = new String(string);
    parsed.raw = string.raw != null ? string.raw : string;
    parsed.valid = false;
  }

  return parsed;
};


module.exports = {
  parse,
  components: [
    { name: 'raw', type: 'string', description: 'Unmodified value' },
    { name: 'number', type: 'string', description: 'Street Number' },
    { name: 'name', type: 'string', description: 'Street Name' }
  ],
  maskable: false,
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
    'is not included in',
    'matches pattern',
    'does not match pattern'
  ],
  examples: [
    '4203 Guadalupe St',
    '00283 Ondricka Street',
    '0746 Monahan Islands',
    '73398 Tomas Club'
  ].map(parse).map(normalize)
};
