/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const url = require('../lib/types/url');


describe('URL', function() {

  it('should not parse null', () => assert.isNull(url.parse(null)));

  it('should not parse undefined', () => assert.isUndefined(url.parse()));

  it('should parse a parsed url', function() {
    const parsed = url.parse(url.parse('http://google.com/search?q=hi'));
    assert.equal(parsed.toString(), 'http://google.com/search?q=hi');
    assert.equal(parsed.raw, 'http://google.com/search?q=hi');
    assert.equal(parsed.host, 'google.com');
    assert.equal(parsed.path, '/search');
    assert.equal(parsed.query, 'q=hi');
    return assert.isTrue(parsed.valid);
  });

  it('should have examples', () => assert(url.examples.length));


  describe('valid values', function() {

    const strings = [
      'https://google.com/search?q=hi#results',
      '    HTTPS://Google.com/search?q=hi#results     '
    ];

    return Array.from(strings).map((string) =>
      ((string => describe(`'${string}'`, function() {

        beforeEach(function() {
          return this.parsed = url.parse(string);
        });

        it('should keep raw value', function() {
          return assert.equal(this.parsed.raw, string);
        });

        it('should have protocol', function() {
          return assert.equal(this.parsed.protocol, 'https');
        });

        it('should have host', function() {
          return assert.equal(this.parsed.host, 'google.com');
        });

        it('should have port', function() {
          return assert.isNull(this.parsed.port);
        });

        it('should have path', function() {
          return assert.equal(this.parsed.path, '/search');
        });

        it('should have query', function() {
          return assert.equal(this.parsed.query, 'q=hi');
        });

        it('should have query', function() {
          return assert.equal(this.parsed.hash, '#results');
        });

        it('should be normalized', function() {
          return assert.equal(this.parsed.valueOf(), 'https://google.com/search?q=hi#results');
        });

        return it('should be marked valid', function() {
          return assert.isTrue(this.parsed.valid);
        });
      })))(string));
  });


  describe('values that get coerced to valid', function() {

    const strings = [
      'centennialbulb.org',
      'whatever',
      '172.0.0.1',
      'http'
    ];

    return Array.from(strings).map((string) =>
      ((string => describe(`'${string}'`, function() {

        beforeEach(function() {
          return this.parsed = url.parse(string);
        });

        it('should keep raw value', function() {
          return assert.equal(this.parsed.raw, string);
        });

        return it('should be valid', function() {
          return assert.isTrue(this.parsed.valid);
        });
      })))(string));
  });


  return describe('invalid values', function() {

    const strings = [
      '',
      ' ',
      'https://',
      'donkey://google.com'
    ];

    return Array.from(strings).map((string) =>
      ((string => describe(`'${string}'`, function() {

        beforeEach(function() {
          return this.parsed = url.parse(string);
        });

        it('should keep raw value', function() {
          return assert.equal(this.parsed.raw, string);
        });

        it('should not be valid', function() {
          return assert.isFalse(this.parsed.valid);
        });

        return it('should be normalized', function() {
          return assert.equal(this.parsed.valueOf(), string);
        });
      })))(string));
  });
});
