const { assert } = require('chai');
const url = require('../lib/types/url');

describe('URL', function () {
  it('should not parse null', function () {
    assert.isNull(url.parse(null));
  });

  it('should not parse undefined', function () {
    assert.isUndefined(url.parse());
  });

  it('should parse a parsed url', function () {
    const parsed = url.parse(url.parse('http://google.com/search?q=hi'));
    assert.equal(parsed.toString(), 'http://google.com/search?q=hi');
    assert.equal(parsed.raw, 'http://google.com/search?q=hi');
    assert.equal(parsed.host, 'google.com');
    assert.equal(parsed.path, '/search');
    assert.equal(parsed.query, 'q=hi');
    assert.isTrue(parsed.valid);
  });

  it('should have examples', function () {
    assert(url.examples.length);
  });

  describe('valid values', function () {
    const strings = [
      'https://google.com/search?q=hi#results',
      '    HTTPS://Google.com/search?q=hi#results     '
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = url.parse(string);
        });

        it('should keep raw value', function () {
          assert.equal(this.parsed.raw, string);
        });

        it('should have protocol', function () {
          assert.equal(this.parsed.protocol, 'https');
        });

        it('should have host', function () {
          assert.equal(this.parsed.host, 'google.com');
        });

        it('should have port', function () {
          assert.isNull(this.parsed.port);
        });

        it('should have path', function () {
          assert.equal(this.parsed.path, '/search');
        });

        it('should have query', function () {
          assert.equal(this.parsed.query, 'q=hi');
        });

        it('should have query', function () {
          assert.equal(this.parsed.hash, '#results');
        });

        it('should be normalized', function () {
          assert.equal(this.parsed.valueOf(), 'https://google.com/search?q=hi#results');
        });

        it('should be marked valid', function () {
          assert.isTrue(this.parsed.valid);
        });
      });
    }
  });

  describe('values that get coerced to valid', function () {
    const strings = [
      'centennialbulb.org',
      'whatever',
      '172.0.0.1',
      'http'
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = url.parse(string);
        });

        it('should keep raw value', function () {
          assert.equal(this.parsed.raw, string);
        });

        it('should be valid', function () {
          assert.isTrue(this.parsed.valid);
        });
      });
    }
  });

  describe('invalid values', function () {
    const strings = [
      '',
      ' ',
      'https://',
      'donkey://google.com',
      { foo: 42 }
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = url.parse(string);
        });

        it('should keep raw value', function () {
          assert.equal(this.parsed.raw, string);
        });

        it('should not be valid', function () {
          assert.isFalse(this.parsed.valid);
        });

        it('should be normalized', function () {
          assert.equal(this.parsed.valueOf(), string);
        });
      });
    }
  });
});
