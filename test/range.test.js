const { assert } = require('chai');
const range = require('../lib/types/range');
const number = require('../lib/types/number');
const date = require('../lib/types/date');
const time = require('../lib/types/time');

describe('Range', function () {
  it('should support dash separator', function () {
    const r = range.parse('1 - 10');
    assert.equal(r.toString(), '1-10');
    assert.equal(r.raw, '1 - 10');
    assert.equal(r.min, 1);
    assert.equal(r.max, 10);
    assert.equal(r.avg, 5.5);
    assert.equal(r.mid, 5);
    assert.isTrue(r.valid);
  });

  it('should support "to" separator', function () {
    const r = range.parse('1 to 10');
    assert.equal(r.toString(), '1-10');
    assert.equal(r.raw, '1 to 10');
    assert.equal(r.min, 1);
    assert.equal(r.max, 10);
    assert.equal(r.avg, 5.5);
    assert.equal(r.mid, 5);
    assert.isTrue(r.valid);
  });

  it('should support arbitrary spaces in separator', function () {
    const r = range.parse('1     to      10');
    assert.equal(r.toString(), '1-10');
    assert.equal(r.raw, '1     to      10');
    assert.equal(r.min, 1);
    assert.equal(r.max, 10);
    assert.equal(r.avg, 5.5);
    assert.equal(r.mid, 5);
    assert.isTrue(r.valid);
  });

  it('should support greater than range', function () {
    const r = range.parse('10+');
    assert.equal(r.toString(), '10+');
    assert.equal(r.raw, '10+');
    assert.equal(r.min, 10);
    assert.isNull(r.max);
    assert.isNull(r.avg);
    assert.isNull(r.mid);
    assert.isTrue(r.valid);
  });

  it('should support greater than range with decimal', function () {
    const r = range.parse('10.5+');
    assert.equal(r.toString(), '10.5+');
    assert.equal(r.raw, '10.5+');
    assert.equal(r.min, 10.5);
    assert.isNull(r.max);
    assert.isNull(r.avg);
    assert.isNull(r.mid);
    assert.isTrue(r.valid);
  });

  it('should support single integer string', function () {
    const r = range.parse('10');
    assert.equal(r.toString(), '10');
    assert.equal(r.raw, '10');
    assert.equal(r.min, 10);
    assert.equal(r.max, 10);
    assert.equal(r.avg, 10);
    assert.equal(r.mid, 10);
    assert.isTrue(r.valid);
  });

  it('should support single integer', function () {
    const r = range.parse(10);
    assert.equal(r.toString(), '10');
    assert.equal(r.raw, '10');
    assert.equal(r.min, 10);
    assert.equal(r.max, 10);
    assert.equal(r.avg, 10);
    assert.equal(r.mid, 10);
    assert.isTrue(r.valid);
  });

  it('should support single decimal strings', function () {
    const r = range.parse('5.5');
    assert.equal(r.toString(), '5.5');
    assert.equal(r.raw, '5.5');
    assert.equal(r.min, 5.5);
    assert.equal(r.max, 5.5);
    assert.equal(r.avg, 5.5);
    assert.equal(r.mid, 5.5);
    assert.isTrue(r.valid);
  });

  it('should support single decimal numbers', function () {
    const r = range.parse(5.5);
    assert.equal(r.toString(), '5.5');
    assert.equal(r.raw, '5.5');
    assert.equal(r.min, 5.5);
    assert.equal(r.max, 5.5);
    assert.equal(r.avg, 5.5);
    assert.equal(r.mid, 5.5);
    assert.isTrue(r.valid);
  });

  it('should support arbitrary leading space', function () {
    const r = range.parse('      1 to 10');
    assert.equal(r.toString(), '1-10');
    assert.equal(r.raw, '      1 to 10');
    assert.equal(r.min, 1);
    assert.equal(r.max, 10);
    assert.equal(r.avg, 5.5);
    assert.equal(r.mid, 5);
    assert.isTrue(r.valid);
  });

  it('should support missing delimiter', function () {
    const r = range.parse('1 10');
    assert.equal(r.toString(), '1-10');
    assert.equal(r.raw, '1 10');
    assert.equal(r.min, 1);
    assert.equal(r.max, 10);
    assert.equal(r.avg, 5.5);
    assert.equal(r.mid, 5);
    assert.isTrue(r.valid);
  });

  it('should support arbitrary trailing space', function () {
    const r = range.parse('1 to 10     ');
    assert.equal(r.toString(), '1-10');
    assert.equal(r.raw, '1 to 10     ');
    assert.equal(r.min, 1);
    assert.equal(r.max, 10);
    assert.equal(r.avg, 5.5);
    assert.equal(r.mid, 5);
    assert.isTrue(r.valid);
  });

  it('should ignore currency characters', function () {
    const r = range.parse('$1 to $10');
    assert.equal(r.toString(), '1-10');
    assert.equal(r.raw, '$1 to $10');
    assert.equal(r.min, 1);
    assert.equal(r.max, 10);
    assert.equal(r.avg, 5.5);
    assert.equal(r.mid, 5);
    assert.isTrue(r.valid);
  });

  it('should ignore commas in numbers', function () {
    const r = range.parse('$1,000 to $10,000');
    assert.equal(r.toString(), '1000-10000');
    assert.equal(r.raw, '$1,000 to $10,000');
    assert.equal(r.min, 1000);
    assert.equal(r.max, 10000);
    assert.equal(r.avg, 5500);
    assert.equal(r.mid, 5500);
    assert.isTrue(r.valid);
  });

  it('should support ranges with decimals', function () {
    const r = range.parse('999.95 to 10000.95');
    assert.equal(r.toString(), '999.95-10000.95');
    assert.equal(r.raw, '999.95 to 10000.95');
    assert.equal(r.min, 999.95);
    assert.equal(r.max, 10000.95);
    assert.equal(r.avg, 5500.45);
    assert.equal(r.mid, 5500);
    assert.isTrue(r.valid);
  });

  it('should handle invalid string', function () {
    const r = range.parse('asdf');
    assert.equal(r.toString(), 'asdf');
    assert.equal(r.raw, 'asdf');
    assert.isNull(r.min);
    assert.isNull(r.max);
    assert.isNull(r.avg);
    assert.isNull(r.mid);
    assert.isFalse(r.valid);
  });

  it('should parse 0 as min and max', function () {
    const r = range.parse('0');
    assert.equal(r.toString(), '0');
    assert.equal(r.raw, '0');
    assert.equal(r.min, 0);
    assert.equal(r.max, 0);
    assert.equal(r.avg, 0);
    assert.equal(r.mid, 0);
    assert.isTrue(r.valid);
  });

  it('should parse a parsed range', function () {
    const r = range.parse(range.parse('1 - 10'));
    assert.equal(r.toString(), '1-10');
    assert.equal(r.raw, '1 - 10');
    assert.equal(r.min, 1);
    assert.equal(r.max, 10);
    assert.equal(r.avg, 5.5);
    assert.equal(r.mid, 5);
    assert.isTrue(r.valid);
  });

  it('should parse a parsed number', function () {
    const r = range.parse(number.parse('4'));
    assert.equal(r.toString(), '4');
    assert.equal(r.raw, '4');
    assert.equal(r.min, 4);
    assert.equal(r.max, 4);
    assert.equal(r.avg, 4);
    assert.equal(r.mid, 4);
    assert.isTrue(r.valid);
  });

  it('should parse a date string', function () {
    const r = range.parse('2015-07-25');
    assert.equal(r.toString(), '1437782400000');
    assert.equal(r.raw, '2015-07-25');
    assert.equal(r.min, 1437782400000);
    assert.equal(r.max, 1437782400000);
    assert.equal(r.avg, 1437782400000);
    assert.equal(r.mid, 1437782400000);
    assert.isTrue(r.valid);
  });

  it('should parse a parsed date', function () {
    const r = range.parse(date.parse('2015-07-25'));
    assert.equal(r.toString(), '1437782400000');
    assert.equal(r.raw, '2015-07-25');
    assert.equal(r.min, 1437782400000);
    assert.equal(r.max, 1437782400000);
    assert.equal(r.avg, 1437782400000);
    assert.equal(r.mid, 1437782400000);
    assert.isTrue(r.valid);
  });

  it('should parse a parsed date prior to 1970', function () {
    const r = range.parse(date.parse('1969-07-25'));
    assert.equal(r.toString(), '-13824000000');
    assert.equal(r.raw, '1969-07-25');
    assert.equal(r.min, -13824000000);
    assert.equal(r.max, -13824000000);
    assert.equal(r.avg, -13824000000);
    assert.equal(r.mid, -13824000000);
    assert.isTrue(r.valid);
  });

  it('should parse a time string', function () {
    const r = range.parse('2015-07-25T01:59:32.021Z');
    assert.equal(r.toString(), '1437789572021');
    assert.equal(r.raw, '2015-07-25T01:59:32.021Z');
    assert.equal(r.min, 1437789572021);
    assert.equal(r.max, 1437789572021);
    assert.equal(r.avg, 1437789572021);
    assert.equal(r.mid, 1437789572021);
    assert.isTrue(r.valid);
  });

  it('should parse a parsed time', function () {
    const r = range.parse(time.parse('2015-07-25T01:59:32.021Z'));
    assert.equal(r.toString(), '1437789572021');
    assert.equal(r.raw, '2015-07-25T01:59:32.021Z');
    assert.equal(r.min, 1437789572021);
    assert.equal(r.max, 1437789572021);
    assert.equal(r.avg, 1437789572021);
    assert.isTrue(r.valid);
  });

  it('should parse a date range string', function () {
    const r = range.parse('2015-07-01 - 2015-07-25');
    assert.equal(r.toString(), '1435708800000-1437782400000');
    assert.equal(r.raw, '2015-07-01 - 2015-07-25');
    assert.equal(r.min, 1435708800000);
    assert.equal(r.max, 1437782400000);
    assert.equal(r.avg, 1436745600000);
    assert.equal(r.mid, 1436745600000);
    assert.isTrue(r.valid);
  });

  it('should parse the first two matches of a date range string', function () {
    const r = range.parse('2015-07-01 - 2015-07-25 - 2015-07-30');
    assert.equal(r.toString(), '1435708800000-1437782400000');
    assert.equal(r.min, 1435708800000);
    assert.equal(r.max, 1437782400000);
    assert.equal(r.avg, 1436745600000);
    assert.isTrue(r.valid);
  });

  it('should parse a time range string', function () {
    const r = range.parse('2015-07-01T01:59:32.022Z - 2015-07-25T01:59:32:021Z');
    assert.equal(r.toString(), '1435715972022-1437782400000');
    assert.equal(r.raw, '2015-07-01T01:59:32.022Z - 2015-07-25T01:59:32:021Z');
    assert.equal(r.min, 1435715972022);
    assert.equal(r.max, 1437782400000);
    assert.equal(r.avg, 1436749186011);
    assert.equal(r.mid, 1436749186011);
    assert.isTrue(r.valid);
  });

  it('should parse the first two matches of a time range string', function () {
    const r = range.parse('2015-07-01T01:59:32.022Z - 2015-07-25T01:59:32:021Z - 2015-07-30T01:59:32:021Z');
    assert.equal(r.toString(), '1435715972022-1437782400000');
    assert.equal(r.min, 1435715972022);
    assert.equal(r.max, 1437782400000);
    assert.equal(r.avg, 1436749186011);
    assert.equal(r.mid, 1436749186011);
    assert.isTrue(r.valid);
  });

  it('should have examples', function () {
    assert(range.examples.length);
  });

  describe('With a negative minimum', function () {
    it('should support number with greater than range', function () {
      const r = range.parse('-10+');
      assert.equal(r.toString(), '-10+');
      assert.equal(r.raw, '-10+');
      assert.equal(r.min, -10);
      assert.isNull(r.max);
      assert.isNull(r.avg);
      assert.isNull(r.mid);
      assert.isTrue(r.valid);
    });

    it('should support single integer string', function () {
      const r = range.parse('-10');
      assert.equal(r.toString(), '-10');
      assert.equal(r.raw, '-10');
      assert.equal(r.min, -10);
      assert.equal(r.max, -10);
      assert.equal(r.avg, -10);
      assert.equal(r.mid, -10);
      assert.isTrue(r.valid);
    });

    it('should support single integer', function () {
      const r = range.parse(-10);
      assert.equal(r.toString(), '-10');
      assert.equal(r.raw, '-10');
      assert.equal(r.min, -10);
      assert.equal(r.max, -10);
      assert.equal(r.avg, -10);
      assert.equal(r.mid, -10);
      assert.isTrue(r.valid);
    });

    it('should support single decimal strings', function () {
      const r = range.parse('-5.5');
      assert.equal(r.toString(), '-5.5');
      assert.equal(r.raw, '-5.5');
      assert.equal(r.min, -5.5);
      assert.equal(r.max, -5.5);
      assert.equal(r.avg, -5.5);
      assert.equal(r.mid, -5.5);
      assert.isTrue(r.valid);
    });

    it('should parse a date range string prior to 1970', function () {
      const r = range.parse('1969-07-01 - 2015-07-25');
      assert.equal(r.toString(), '-15897600000-1437782400000');
      assert.equal(r.raw, '1969-07-01 - 2015-07-25');
      assert.equal(r.min, -15897600000);
      assert.equal(r.max, 1437782400000);
      assert.equal(r.avg, 710942400000);
      assert.equal(r.mid, 710942400000);
      assert.isTrue(r.valid);
    });
  });
});
