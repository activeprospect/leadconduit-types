const _ = require('lodash');
const chrono = require('chrono-node');
const normalize = require('../normalize');

const parse = function (string) {
  const raw = _.result(string, 'raw.toString', string.toString());
  const results = chrono.parse(string.toString());

  let parsed;
  if (results.length) {
    parsed = new Date(results[0].start.date());
    parsed.raw = raw;
    parsed.valid = true;
    parsed.valueOf = function () {
      return this.toString();
    };
    parsed.toString = function () {
      return this.toISOString();
    };
  } else {
    parsed = new String(raw);
    parsed.raw = raw;
    parsed.valid = false;
    parsed.valueOf = () => raw;
    parsed.toString = () => raw;
  }
  return parsed;
};

const components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
];

module.exports = {
  parse,
  components,
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
    'is between',
    'is not between'
  ],
  examples: [
    'Sat Jun 14 2015 13:27:33 GMT-0500 (CDT)',
    '06/14/2015 6:27:33 PM',
    '2015-06-14T18:27:33Z',
    '2015-06-14T18:27:33.000Z'
  ].map(parse).map(normalize)
};
