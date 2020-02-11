/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const gender = require('../lib/types/gender');

describe('Gender', function() {

  let val;
  const males = [
    'male',
    'm',
    'M',
    'Male',
    'MALE',
    '   m'
  ];

  for (val of Array.from(males)) {
    ((val => it(`should parse ${val} as male`, function() {
      const parsed = gender.parse(val);
      assert.equal(parsed.valueOf(), 'male');
      assert.equal(parsed.raw, val);
      assert.isTrue(parsed.valid);
      return assert.equal(parsed.abbr, 'M');
    })))(val);
  }


  const females = [
    'female',
    'f',
    'F',
    'Female',
    'FEMALE',
    '    f'
  ];

  for (val of Array.from(females)) {
    ((val => it(`should parse ${val} as female`, function() {
      const parsed = gender.parse(val);
      assert.equal(parsed.valueOf(), 'female');
      assert.equal(parsed.raw, val);
      assert.isTrue(parsed.valid);
      return assert.equal(parsed.abbr, 'F');
    })))(val);
  }


  const others = [
    'other',
    'o',
    'O',
    'Other',
    'OTHER',
    '    o'
  ];

  for (val of Array.from(others)) {
    ((val => it(`should parse ${val} as other`, function() {
      const parsed = gender.parse(val);
      assert.equal(parsed.valueOf(), 'other');
      assert.equal(parsed.raw, val);
      assert.isTrue(parsed.valid);
      return assert.equal(parsed.abbr, 'O');
    })))(val);
  }


  const invalids = [
    '50',
    'asdf',
    '   ',
    5,
    true
  ];

  for (val of Array.from(invalids)) {
    ((val => it(`should parse ${val} as invalid`, function() {
      const parsed = gender.parse(val);
      assert.equal(parsed.valueOf(), val.toString());
      assert.equal(parsed.raw, val);
      assert.isFalse(parsed.valid);
      return assert.isNull(parsed.abbr);
    })))(val);
  }


  it('should handle parsing a parsed gender', function() {
    const parsed = gender.parse(gender.parse('f'));
    assert.equal(parsed.valueOf(), 'female');
    assert.equal(parsed.raw, 'f');
    assert.isTrue(parsed.valid);
    return assert.equal(parsed.abbr, 'F');
  });

  return it('should have examples', () => assert(gender.examples.length));
});
