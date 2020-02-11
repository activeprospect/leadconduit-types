/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const fs = require('fs');
const path = require('path');
const index = require('../lib');

describe('Index', function() {

  it('should list type names', function() {
    const files = fs.readdirSync(`${__dirname}/../lib/types`);

    const expectedTypeNames = files.map(f => path.basename(f, '.js'));

    expectedTypeNames.splice(expectedTypeNames.indexOf('index'), 1);

    return assert.deepEqual(index.names, expectedTypeNames);
  });

  it('should not try to parse an non-type (e.g., array)', function() {
    const parsed = index.parse('array', [1, 3, 5]);
    return assert.deepEqual(parsed, [1, 3, 5]);
});

  it('should not parse a value twice', function() {
    const parsed = index.parse('phone', '5127891111');
    return assert.equal(index.parse('phone', parsed), parsed);
  });

  it('should not parse an invalid value twice', function() {
    const parsed = index.parse('phone', 'dog');
    return assert.equal(index.parse('phone', parsed), parsed);
  });

  return it('should clone a value', function() {
    const obj = {
      phone: index.parse('phone', '5127891111'),
      ssn: index.parse('ssn', '123456789')
    };
    const objClone = index.clone(obj);
    return assert.deepEqual(objClone, obj);
  });
});
