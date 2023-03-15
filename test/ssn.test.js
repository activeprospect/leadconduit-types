const { assert } = require('chai');
const ssn = require('../lib/types/ssn');

describe('SSN', function () {
  it('should not parse null', function () {
    assert.isNull(ssn.parse(null));
  });

  it('should not parse undefined', function () {
    assert.isUndefined(ssn.parse());
  });

  it('should have examples', function () {
    assert(ssn.examples.length);
  });

  describe('Valid values', function () {
    const strings = [
      '123456789',
      '123-45-6789',
      '123 45 6789',
      '123.45.6789',
      ' 123-45-6789 ',
      'donkey 123456789'
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = ssn.parse(string);
        });

        it('should keep raw value', function () {
          assert.equal(this.parsed.raw, string);
        });

        it('should have first three', function () {
          assert.equal(this.parsed.first_three, '123');
        });

        it('should have second two', function () {
          assert.equal(this.parsed.middle_two, '45');
        });

        it('should have last four', function () {
          assert.equal(this.parsed.last_four, '6789');
        });

        it('should have masked flag', function () {
          assert.isFalse(this.parsed.masked);
        });

        it('should be marked valid', function () {
          assert.isTrue(this.parsed.valid);
        });
      });
    }
  });

  describe('Invalid values', function () {
    const strings = [
      'abcd',
      '',
      '   ',
      { foo: 42 }
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = ssn.parse(string);
        });
        it('should keep raw value', function () {
          assert.equal(this.parsed.raw, string);
        });

        it('should be stringifiable', function () {
          assert.equal(JSON.stringify(this.parsed), `"${string}"`);
        });

        it('should not have first three', function () {
          assert.isUndefined(this.parsed.first_three);
        });

        it('should not have second two', function () {
          assert.isUndefined(this.parsed.middle_two);
        });

        it('should not have last four', function () {
          assert.isUndefined(this.parsed.last_four);
        });

        it('should have masked flag', function () {
          assert.isFalse(this.parsed.masked);
        });

        it('should be marked invalid', function () {
          assert.isFalse(this.parsed.valid);
        });
      });
    }
  });

  it('should parse a parsed ssn', function () {
    const parsed = ssn.parse(ssn.parse('123-12-1234'));
    assert.equal(parsed.toString(), '123121234');
    assert.equal(parsed.raw, '123-12-1234');
    assert.isTrue(parsed.valid);
  });
});
