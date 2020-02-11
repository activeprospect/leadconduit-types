const { assert } = require('chai');
const boolean = require('../lib/types/boolean');

describe('Boolean', function () {
  const trues = [
    true,
    'true',
    't',
    'yes',
    'y',
    '1',
    1
  ];

  for (const val of trues) {
    it(`should parse ${typeof val} ${val} as true`, function () {
      const parsed = boolean.parse(val);
      assert.equal(parsed.valueOf(), true);
      assert.equal(parsed.raw, val);
      assert.isTrue(parsed.valid);
    });
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

  for (const val of falses) {
    it(`should parse ${typeof val} ${val} as false`, function () {
      const parsed = boolean.parse(val);
      assert.equal(parsed.valueOf(), false);
      assert.equal(parsed.raw, val);
      assert.isTrue(parsed.valid);
    });
  }

  const invalids = [
    '50',
    'asdf',
    '   '
  ];

  for (const val of invalids) {
    it(`should parse ${val} as false and invalid`, function () {
      const parsed = boolean.parse(val);
      assert.equal(parsed.valueOf(), false);
      assert.equal(parsed.raw, val);
      assert.isFalse(parsed.valid);
    });
  }

  it('should ignore whitespace', function () {
    const parsed = boolean.parse('  true ');
    assert.equal(parsed.valueOf(), true);
    assert.equal(parsed.raw, '  true ');
    assert.isTrue(parsed.valid);
  });

  it('should ignore character case', function () {
    const parsed = boolean.parse('TRUE');
    assert.equal(parsed.valueOf(), true);
    assert.equal(parsed.raw, 'TRUE');
    assert.isTrue(parsed.valid);
  });

  it('should handle parsing a parsed boolean', function () {
    const parsed = boolean.parse(boolean.parse('f'));
    assert.isFalse(parsed.valueOf());
    assert.equal(parsed.raw, 'f');
    assert.isTrue(parsed.valid);
  });

  it('should have examples', function () {
    assert(boolean.examples.length);
  });
});
