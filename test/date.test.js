const { assert } = require('chai');
const date = require('../lib/types/date');

describe('Date', function () {
  const strings = [
    'Mon Jun 02 2014',
    'Jun 02 2014',
    '06/02/2014',
    '6/2/2014',
    '6/2/14',
    '2014-06-02',
    '06-02-2014',
    '06022014',
    '20140602'
  ];

  const euroStrings = [
    'Fri 18 July 2014',
    '18 July 2014',
    '18/07/2014',
    '18/7/2014',
    '18/7/14',
    '2014-18-07',
    '18-07-2014',
    '18072014',
    '20141807'
  ];

  for (const string of strings) {
    describe(string, function () {
      it('should return a Date object', function () {
        const parsed = date.parse(string);
        assert.instanceOf(parsed, Date);
        assert.equal(parsed.toISOString(), '2014-06-02T00:00:00.000Z');
      });

      it('should have string value', function () {
        const parsed = date.parse(string);
        assert.equal(parsed.toString(), '2014-06-02');
        assert.equal(parsed.valueOf(), '2014-06-02');
      });

      it('should have raw value', function () {
        assert.equal(date.parse(string).raw, string);
      });

      it('should be valid', function () {
        assert.isTrue(date.parse(string).valid);
      });
    });
  }

  for (const string of euroStrings) {
    describe(string, function () {
      it('should return a Date object', function () {
        const parsed = date.parse(string);
        assert.instanceOf(parsed, Date);
        assert.equal(parsed.toISOString(), '2014-07-18T00:00:00.000Z');
      });

      it('should have string value', function () {
        const parsed = date.parse(string);
        assert.equal(parsed.toString(), '2014-07-18');
        assert.equal(parsed.valueOf(), '2014-07-18');
      });

      it('should have raw value', function () {
        assert.equal(date.parse(string).raw, string);
      });

      it('should be valid', function () {
        assert.isTrue(date.parse(string).valid);
      });
    });
  }

  it('should not parse garbage', function () {
    const parsed = date.parse('garbage');
    assert.equal(parsed.toString(), 'garbage');
    assert.equal(parsed.valueOf(), 'garbage');
    assert.equal(parsed.raw, 'garbage');
    assert.isFalse(parsed.valid);
  });

  it('should handle non-string garbage', function () {
    // see sc-39505
    const parsed = date.parse({ foo: 42 });
    let stringified;
    const invokeStringify = () => {
      stringified = JSON.stringify(parsed);
    };
    assert.doesNotThrow(invokeStringify);

    assert.equal(stringified, '"[object Object]"');
    assert.equal(parsed.toString(), '[object Object]');
    assert.equal(parsed.raw, '[object Object]');
    assert.equal(parsed.valueOf(), '[object Object]');
    assert.isFalse(parsed.valid);
  });

  it('should handle parsing a parsed date', function () {
    const parsed = date.parse(date.parse('Mon Jun 02 2014'));
    assert.instanceOf(parsed, Date);
    assert.equal(parsed.toString(), '2014-06-02');
    assert.equal(parsed.valueOf(), '2014-06-02');
    assert.equal(parsed.raw, 'Mon Jun 02 2014');
  });

  it('should have examples', function () {
    assert(date.examples.length);
  });
});
