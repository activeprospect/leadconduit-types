/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash');
const moment = require('moment');
const chrono = require('chrono-node');
const normalize = require('../normalize');

const parse = function(string) {
  let left, parsed;
  const raw = (left = __guard__(string != null ? string.raw : undefined, x => x.toString())) != null ? left : string;
  const results = chrono.parse(string.toString());
  if (results.length) {
    parsed = new Date(results[0].start.date());
    parsed.raw = raw;
    parsed.valid = true;
    parsed.valueOf = function() {
      return this.toString();
    };
    parsed.toString = function() {
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

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}