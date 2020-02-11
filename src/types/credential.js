/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const normalize = require('../normalize');

const parse = function(string) {
  if (string == null) { return string; }
  const parsed = new String(string);
  parsed.masked = false;
  parsed.valid = true;
  return parsed;
};

module.exports = {
  parse,
  components: [],
  maskable: true,
  operators: [
    'is equal to',
    'is not equal to',
    'is blank',
    'is not blank',
    'includes',
    'does not include',
    'is included in',
    'is not included in'
  ],
  examples: [
    'sekret-pazzward',
    'befa4e7379d81173dfe8d1a53deaf591',
    '483571ec0724b4c3243bdf142c8e75c99cae90ac'
  ].map(parse).map(normalize)
};
