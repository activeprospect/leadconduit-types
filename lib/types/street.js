const normalize = require('../normalize');
const ensureString = require('../ensureString');

const parseRegex = /^(\S+)\s+(.+)$/;

const parse = function (string) {
  let parsed;
  const raw = ensureString(string);
  const addr = raw.trim().match(parseRegex);

  if (addr) {
    parsed = new String(raw.trim());
    parsed.raw = raw;
    parsed.number = addr[1];
    parsed.name = addr[2];
    parsed.valid = true;
  } else {
    parsed = new String(string);
    parsed.raw = raw;
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
