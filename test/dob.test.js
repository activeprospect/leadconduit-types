const { assert } = require('chai');
const dob = require('../lib/types/dob');
const timefreeze = require('timefreeze');
const moment = require('moment');
const MAX_HUMAN_LIFE_SPAN_YEARS = 121;

describe('DOB', function () {
  before(function () {
    // June 2, 2022
    timefreeze.freeze(new Date(2022,5,2));
  });
  after(function () {
    timefreeze.reset();
  });

  it('should return a date object', function () {
    const parsed = dob.parse('06/02/2014');
    assert.instanceOf(parsed, Date);
    assert.equal(parsed.toISOString(), '2014-06-02T00:00:00.000Z')
  });

  it('should have string value', function () {
    const parsed = dob.parse('06/02/2014');
    assert.equal(parsed.toString(), '2014-06-02');
    assert.equal(parsed.valueOf(), '2014-06-02');
  });

  it('should get decimal right on birthday', function () {
    for (let i = MAX_HUMAN_LIFE_SPAN_YEARS; i--;) {
      const dateOfBirth = moment.utc().subtract(i, 'years').format('YYYY-MM-DD');
      assert.equal(dob.parse(dateOfBirth).age, i);
    }
  });

  it('should get decimal right day before birthday', function () {
    // to prevent selecting a negative birthday start at 1.
    for (let i = 1; i < MAX_HUMAN_LIFE_SPAN_YEARS; i++) {
      const dateOfBirth = moment.utc().add(1, 'day').subtract(i, 'years').format('YYYY-MM-DD');
      assert.equal(dob.parse(dateOfBirth).age, i - 0.1);
    }
  });

  it('should get the decimal right for date after birthday', function () {
    const ONE_TENTH_YEAR_IN_DAYS = 37;
    for (let i = MAX_HUMAN_LIFE_SPAN_YEARS; i--;) {
      const dateOfBirth = moment.utc().subtract(ONE_TENTH_YEAR_IN_DAYS, 'day').subtract(i, 'years').format('YYYY-MM-DD');
      assert.equal(dob.parse(dateOfBirth).age, i + 0.1);
    }
  });

  it('should have year', function () {
    assert.equal(dob.parse('06/02/2014').year, 2014);
  });

  it('should have raw value', function () {
    assert.equal(dob.parse('06/02/2014').raw, '06/02/2014');
  });

  it('should be valid', function () {
    assert.isTrue(dob.parse('06/02/2014').valid);
  });

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
