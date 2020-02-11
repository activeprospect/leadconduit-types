const { assert } = require('chai');
const gender = require('../lib/types/gender');

describe('Gender', function () {
  const males = [
    'male',
    'm',
    'M',
    'Male',
    'MALE',
    '   m'
  ];

  for (const val of males) {
    it(`should parse ${val} as male`, function () {
      const parsed = gender.parse(val);
      assert.equal(parsed.valueOf(), 'male');
      assert.equal(parsed.raw, val);
      assert.isTrue(parsed.valid);
      assert.equal(parsed.abbr, 'M');
    });
  }

  const females = [
    'female',
    'f',
    'F',
    'Female',
    'FEMALE',
    '    f'
  ];

  for (const val of females) {
    it(`should parse ${val} as female`, function () {
      const parsed = gender.parse(val);
      assert.equal(parsed.valueOf(), 'female');
      assert.equal(parsed.raw, val);
      assert.isTrue(parsed.valid);
      assert.equal(parsed.abbr, 'F');
    });
  }

  const others = [
    'other',
    'o',
    'O',
    'Other',
    'OTHER',
    '    o'
  ];

  for (const val of others) {
    it(`should parse ${val} as other`, function () {
      const parsed = gender.parse(val);
      assert.equal(parsed.valueOf(), 'other');
      assert.equal(parsed.raw, val);
      assert.isTrue(parsed.valid);
      assert.equal(parsed.abbr, 'O');
    });
  }

  const invalids = [
    '50',
    'asdf',
    '   ',
    5,
    true
  ];

  for (const val of invalids) {
    it(`should parse ${val} as invalid`, function () {
      const parsed = gender.parse(val);
      assert.equal(parsed.valueOf(), val.toString());
      assert.equal(parsed.raw, val);
      assert.isFalse(parsed.valid);
      assert.isNull(parsed.abbr);
    });
  }

  it('should handle parsing a parsed gender', function () {
    const parsed = gender.parse(gender.parse('f'));
    assert.equal(parsed.valueOf(), 'female');
    assert.equal(parsed.raw, 'f');
    assert.isTrue(parsed.valid);
    assert.equal(parsed.abbr, 'F');
  });

  it('should have examples', function () {
    assert(gender.examples.length);
  });
});
