const { assert } = require('chai');
const dob = require('../lib/types/dob');
const timefreeze = require('timefreeze');
const moment = require('moment-timezone');

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

  it('should be full age on DOB', function () {
    for (let i = 121; i--;) {
      const dateOfBirth = moment.utc().startOf('day').subtract(i, 'years').format('YYYY-MM-DD');
      assert.equal(dob.parse(dateOfBirth).age, i);
    }
  });

  it('should get decimal right before birthday', function () {
    for (let i = 1; i < 121; i++) {
      const dateOfBirth = moment.utc().startOf('day').add(1, 'day').subtract(i, 'years').format('YYYY-MM-DD');
      assert.equal(dob.parse(dateOfBirth).age, i - 0.1);
    }
  });

  it('should get the decimal right for after birthday', function () {
    for (let i = 121; i--;) {
      const dateOfBirth = moment.utc().startOf('day').subtract(40, 'day').subtract(i, 'years').format('YYYY-MM-DD');
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
