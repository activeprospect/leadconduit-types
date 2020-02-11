/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const ssn = require('../lib/types/ssn');


describe('SSN', function() {


  it('should not parse null', () => assert.isNull(ssn.parse(null)));


  it('should not parse undefined', () => assert.isUndefined(ssn.parse()));


  it('should have examples', () => assert(ssn.examples.length));


  describe('Valid values', function() {

    const strings = [
      '123456789',
      '123-45-6789',
      '123 45 6789',
      '123.45.6789',
      ' 123-45-6789 ',
      'donkey 123456789'
    ];

    return Array.from(strings).map((string) =>
      ((string => describe(`'${string}'`, function() {

        beforeEach(function() {
          return this.parsed = ssn.parse(string);
        });

        it('should keep raw value', function() {
          return assert.equal(this.parsed.raw, string);
        });

        it('should have first three', function() {
          return assert.equal(this.parsed.first_three, '123');
        });

        it('should have second two', function() {
          return assert.equal(this.parsed.middle_two, '45');
        });

        it('should have last four', function() {
          return assert.equal(this.parsed.last_four, '6789');
        });

        it('should have masked flag', function() {
          return assert.isFalse(this.parsed.masked);
        });

        return it('should be marked valid', function() {
          return assert.isTrue(this.parsed.valid);
        });
      })))(string));
  });


  describe('Invalid values', function() {

    const strings = [
      'abcd',
      '',
      '   '
    ];

    return Array.from(strings).map((string) =>
      ((string => describe(`'${string}'`, function() {

        beforeEach(function() {
          return this.parsed = ssn.parse(string);
        });

        it('should keep raw value', function() {
          return assert.equal(this.parsed.raw, string);
        });

        it('should not have first three', function() {
          return assert.isUndefined(this.parsed.first_three);
        });

        it('should not have second two', function() {
          return assert.isUndefined(this.parsed.middle_two);
        });

        it('should not have last four', function() {
          return assert.isUndefined(this.parsed.last_four);
        });

        it('should have masked flag', function() {
          return assert.isFalse(this.parsed.masked);
        });

        return it('should be marked invalid', function() {
          return assert.isFalse(this.parsed.valid);
        });
      })))(string));
  });


  return it('should parse a parsed ssn', function() {
    const parsed = ssn.parse(ssn.parse('123-12-1234'));
    assert.equal(parsed.toString(), '123121234');
    assert.equal(parsed.raw, '123-12-1234');
    return assert.isTrue(parsed.valid);
  });
});


