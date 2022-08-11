const { assert } = require('chai');
const dob = require('../lib/types/dob');
const timefreeze = require('timefreeze');
const date = require("../lib/types/date");

describe('DOB', function () {
  before(function () {
    timefreeze.freeze(new Date(2022,5,18));
  });
  after(function () {
    timefreeze.reset();
  });

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
      it('should return a date object', function () {
        const parsed = dob.parse(string);
        assert.instanceOf(parsed, Date);
        assert.equal(parsed.toISOString(), '2014-06-02T00:00:00.000Z')
      });

      it('should have string value', function () {
        const parsed = dob.parse(string);
        assert.equal(parsed.toString(), '2014-06-02');
        assert.equal(parsed.valueOf(), '2014-06-02');
      });

      it('should have age', function () {
        assert.equal(dob.parse(string).age, 8);
      });

      it('should have year', function () {
        assert.equal(dob.parse(string).year, 2014);
      });

      it('should have raw value', function () {
        assert.equal(dob.parse(string).raw, string);
      });

      it('should have masked flag', function () {
        assert.isFalse(dob.parse(string).masked);
      });

      it('should be valid', function () {
        assert.isTrue(dob.parse(string).valid);
      });
    });
  }

  for (const string of euroStrings) {
    describe(string, function () {
      it('should return a date object', function () {
        const parsed = dob.parse(string);
        assert.instanceOf(parsed, Date);
        assert.equal(parsed.toISOString(), '2014-07-18T00:00:00.000Z')
      });

      it('should have string value', function () {
        const parsed = dob.parse(string);
        assert.equal(parsed.toString(), '2014-07-18');
        assert.equal(parsed.valueOf(), '2014-07-18');
      });

      it('should have age', function () {
        console.log(Date())
        assert.equal(dob.parse(string).age, 7.9);
      });

      it('should have year', function () {
        assert.equal(dob.parse(string).year, 2014);
      });

      it('should have raw value', function () {
        assert.equal(dob.parse(string).raw, string);
      });

      it('should have masked flag', function () {
        assert.isFalse(dob.parse(string).masked);
      });

      it('should be valid', function () {
        assert.isTrue(dob.parse(string).valid);
      });
    });
  }

  it('should not parse garbage', function () {
    const parsed = dob.parse('garbage');
    assert.equal(parsed.toString(), 'garbage');
    assert.equal(parsed.valueOf(), 'garbage');
    assert.equal(parsed.raw, 'garbage');
    assert.isFalse(parsed.valid);
  });

  it('should handle parsing a parsed date', function () {
    const parsed = dob.parse(dob.parse('Mon Jun 02 2014'));
    assert.instanceOf(parsed, Date);
    assert.equal(parsed.toString(), '2014-06-02');
    assert.equal(parsed.valueOf(), '2014-06-02');
    assert.equal(parsed.raw, 'Mon Jun 02 2014');
    assert.equal(parsed.year, 2014);
    assert.equal(parsed.age, 8);
  });

  it('should have examples', function () {
    assert(dob.examples.length);
  });
});
