/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const types = require('../lib');

const supportedOperators = [
  'does not include',
  'format is invalid',
  'format is valid',
  'includes',
  'is blank',
  'is equal to',
  'is false',
  'is format invalid',
  'is format valid',
  'is greater than or equal to',
  'is greater than',
  'is included in',
  'is less than or equal to',
  'is less than',
  'is not blank',
  'is not equal to',
  'is not included in',
  'is true',
  'is between',
  'is not between'
];

describe('Operators', () => Array.from(types.names).map((name) =>

  it(`${name} type should only allow valid operators`, () => Array.from(types[name].operators).map((op) =>
    assert(supportedOperators.indexOf(op) >= 0, `The ${op} operator is not supported by LeadConduit`)))));

  
