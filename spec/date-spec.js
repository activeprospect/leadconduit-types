/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const date = require('../lib/types/date');

describe('Date', function() {

  let string;
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

  for (string of Array.from(strings)) {

    ((string => describe(string, function() {

      it('should return a Date object', function() {
        const parsed = date.parse(string);
        assert.instanceOf(parsed, Date);
        return assert.equal(parsed.toISOString(), '2014-06-02T00:00:00.000Z');
      });

      it('should have string value', function() {
        const parsed = date.parse(string);
        assert.equal(parsed.toString(), '2014-06-02');
        return assert.equal(parsed.valueOf(), '2014-06-02');
      });

      it('should have raw value', () => assert.equal(date.parse(string).raw, string));

      return it('should be valid', () => assert.isTrue(date.parse(string).valid));
    })))(string);
  }

  for (string of Array.from(euroStrings)) {

    ((string => describe(string, function() {

      it('should return a Date object', function() {
        const parsed = date.parse(string);
        assert.instanceOf(parsed, Date);
        return assert.equal(parsed.toISOString(), '2014-07-18T00:00:00.000Z');
      });

      it('should have string value', function() {
        const parsed = date.parse(string);
        assert.equal(parsed.toString(), '2014-07-18');
        return assert.equal(parsed.valueOf(), '2014-07-18');
      });

      it('should have raw value', () => assert.equal(date.parse(string).raw, string));

      return it('should be valid', () => assert.isTrue(date.parse(string).valid));
    })))(string);
  }

  it('should not parse garbage', function() {
    const parsed = date.parse('garbage');
    assert.equal(parsed.toString(), 'garbage');
    assert.equal(parsed.valueOf(), 'garbage');
    assert.equal(parsed.raw, 'garbage');
    return assert.isFalse(parsed.valid);
  });

  it('should handle parsing a parsed date', function() {
    const parsed = date.parse(date.parse('Mon Jun 02 2014'));
    assert.instanceOf(parsed, Date);
    assert.equal(parsed.toString(), '2014-06-02');
    assert.equal(parsed.valueOf(), '2014-06-02');
    return assert.equal(parsed.raw, 'Mon Jun 02 2014');
  });

  return it('should have examples', () => assert(date.examples.length));
});
