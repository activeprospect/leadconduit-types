/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const number = require('../lib/types/number');

describe('Number', function() {

  it('should parse string integer', function() {
    const parsed = number.parse('11');
    assert.equal(parsed.valueOf(), 11);
    assert.equal(parsed.raw, '11');
    return assert.isTrue(parsed.valid);
  });

  it('should parse integer', function() {
    const parsed = number.parse(11);
    assert.equal(parsed.valueOf(), 11);
    assert.equal(parsed.raw, 11);
    return assert.isTrue(parsed.valid);
  });

  it('should parse string decimal', function() {
    const parsed = number.parse('1.111');
    assert.equal(parsed.valueOf(), 1.111);
    assert.equal(parsed.raw, '1.111');
    return assert.isTrue(parsed.valid);
  });

  it('should parse decimal', function() {
    const parsed = number.parse(1.111);
    assert.equal(parsed.valueOf(), 1.111);
    assert.equal(parsed.raw, 1.111);
    return assert.isTrue(parsed.valid);
  });

  it('should ignore commas', function() {
    const parsed = number.parse('1,100');
    assert.equal(parsed.valueOf(), 1100);
    assert.equal(parsed.raw, '1,100');
    return assert.isTrue(parsed.valid);
  });

  it('should ignore currency', function() {
    const parsed = number.parse('$1100');
    assert.equal(parsed.valueOf(), 1100);
    assert.equal(parsed.raw, '$1100');
    return assert.isTrue(parsed.valid);
  });

  it('should ignore extraneous text', function() {
    const parsed = number.parse('$1100 per month');
    assert.equal(parsed.valueOf(), 1100);
    assert.equal(parsed.raw, '$1100 per month');
    return assert.isTrue(parsed.valid);
  });

  it('should ignore whitespace', function() {
    const parsed = number.parse('  1100 ');
    assert.equal(parsed.valueOf(), 1100);
    assert.equal(parsed.raw, '  1100 ');
    return assert.isTrue(parsed.valid);
  });

  it('should handle null', () => assert.isNull(number.parse(null)));

  it('should handle undefined', () => assert.isUndefined(number.parse()));

  it('should handle all whitespace', function() {
    const parsed = number.parse('  ');
    assert(isNaN(parsed.valueOf()));
    assert.equal(parsed.raw, '  ');
    return assert.isFalse(parsed.valid);
  });

  it('should handle boolean', function() {
    const parsed = number.parse(true);
    assert(isNaN(parsed.valueOf()));
    assert.equal(parsed.raw, true);
    return assert.isFalse(parsed.valid);
  });

  it('should handle array', function() {
    const parsed = number.parse([1]);
    assert(isNaN(parsed.valueOf()));
    assert.deepEqual(parsed.raw, [1]);
    return assert.isFalse(parsed.valid);
  });

  it('should handle object', function() {
    const parsed = number.parse({foo: 'bar'});
    assert(isNaN(parsed.valueOf()));
    assert.deepEqual(parsed.raw, {foo: 'bar'});
    return assert.isFalse(parsed.valid);
  });

  it('should handle non-number string', function() {
    const parsed = number.parse('derp');
    assert(isNaN(parsed.valueOf()));
    assert.equal(parsed.raw, 'derp');
    return assert.isFalse(parsed.valid);
  });

  it('should parse a parsed number', function() {
    const parsed = number.parse(number.parse('11'));
    assert.equal(parsed.valueOf(), 11);
    assert.equal(parsed.raw, '11');
    return assert.isTrue(parsed.valid);
  });

  it('should parse empty string', function() {
    const parsed = number.parse(number.parse(''));
    assert(isNaN(parsed.valueOf()));
    assert.equal(parsed.raw, '');
    return assert.isFalse(parsed.valid);
  });

  it('should parse NaN', function() {
    const parsed = number.parse(parseInt('sports'));
    assert(isNaN(parsed.valueOf()));
    assert(isNaN(parsed.raw));
    return assert.isFalse(parsed.valid);
  });

  it('should have examples', () => assert(number.examples.length));


  return describe('Negatives', function() {

    it('should parse string integer', function() {
      const parsed = number.parse('-11');
      assert.equal(parsed.valueOf(), -11);
      assert.equal(parsed.raw, '-11');
      return assert.isTrue(parsed.valid);
    });

    it('should parse integer', function() {
      const parsed = number.parse(-11);
      assert.equal(parsed.valueOf(), -11);
      assert.equal(parsed.raw, -11);
      return assert.isTrue(parsed.valid);
    });

    it('should parse string decimal', function() {
      const parsed = number.parse('-1.111');
      assert.equal(parsed.valueOf(), -1.111);
      assert.equal(parsed.raw, '-1.111');
      return assert.isTrue(parsed.valid);
    });

    it('should parse decimal', function() {
      const parsed = number.parse(-1.111);
      assert.equal(parsed.valueOf(), -1.111);
      assert.equal(parsed.raw, -1.111);
      return assert.isTrue(parsed.valid);
    });

    it('should ignore commas', function() {
      const parsed = number.parse('-1,100');
      assert.equal(parsed.valueOf(), -1100);
      assert.equal(parsed.raw, '-1,100');
      return assert.isTrue(parsed.valid);
    });

    return it('should ignore currency', function() {
      const parsed = number.parse('-$1100');
      assert.equal(parsed.valueOf(), -1100);
      assert.equal(parsed.raw, '-$1100');
      return assert.isTrue(parsed.valid);
    });
  });
});
