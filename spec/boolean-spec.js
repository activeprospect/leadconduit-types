/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const boolean = require('../lib/types/boolean');

describe('Boolean', function() {

  let val;
  const trues = [
    true,
    'true',
    't',
    'yes',
    'y',
    '1',
    1
  ];

  for (val of Array.from(trues)) {
    ((val => it(`should parse ${typeof val} ${val} as true`, function() {
      const parsed = boolean.parse(val);
      assert.equal(parsed.valueOf(), true);
      assert.equal(parsed.raw, val);
      return assert.isTrue(parsed.valid);
    })))(val);
  }


  const falses = [
    false,
    'false',
    'f',
    'no',
    'n',
    '0',
    0
  ];

  for (val of Array.from(falses)) {
    ((val => it(`should parse ${typeof val} ${val} as false`, function() {
      const parsed = boolean.parse(val);
      assert.equal(parsed.valueOf(), false);
      assert.equal(parsed.raw, val);
      return assert.isTrue(parsed.valid);
    })))(val);
  }


  const invalids = [
    '50',
    'asdf',
    '   '
  ];

  for (val of Array.from(invalids)) {
    ((val => it(`should parse ${val} as false and invalid`, function() {
      const parsed = boolean.parse(val);
      assert.equal(parsed.valueOf(), false);
      assert.equal(parsed.raw, val);
      return assert.isFalse(parsed.valid);
    })))(val);
  }

  it('should ignore whitespace', function() {
    const parsed = boolean.parse('  true ');
    assert.equal(parsed.valueOf(), true);
    assert.equal(parsed.raw, '  true ');
    return assert.isTrue(parsed.valid);
  });

  it('should ignore character case', function() {
    const parsed = boolean.parse('TRUE');
    assert.equal(parsed.valueOf(), true);
    assert.equal(parsed.raw, 'TRUE');
    return assert.isTrue(parsed.valid);
  });

  it('should handle parsing a parsed boolean', function() {
    const parsed = boolean.parse(boolean.parse('f'));
    assert.isFalse(parsed.valueOf());
    assert.equal(parsed.raw, 'f');
    return assert.isTrue(parsed.valid);
  });

  return it('should have examples', () => assert(boolean.examples.length));
});

