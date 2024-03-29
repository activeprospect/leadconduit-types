const { assert } = require('chai');
const timefreeze = require('timefreeze');

// these environment variables must be set before requiring the type
const secret = 'qy3Sjay3D/bXAAx7jMUvSoum54R5JEPs';
process.env.CERT_IDS_SECRET_KEY = secret;
process.env.TF_CONFIG_CERT_ID_SECRET = secret;

const url = require('../lib/types/trustedform_url');

describe('TrustedForm URL', function () {
  before(function () {
    timefreeze.freeze(new Date(2022, 3, 31));
  });
  after(function () {
    timefreeze.reset();
  });

  it('should not parse null', function () {
    assert.isNull(url.parse(null));
  });

  it('should not parse undefined', function () {
    assert.isUndefined(url.parse());
  });

  it('should have examples', function () {
    assert(url.examples.length);
  });

  it('should normalize case of 40 character ids', function () {
    const cert = url.parse('https://CERT.trustedform.com/EB9fC4DD9bED9AD451A5648946CF4BF09B5BB947');
    assert.equal(cert.toString(), 'https://cert.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947');
  });

  it('should handle staging URLs', function () {
    const tests = [
      'https://cert.staging.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
      'https://cert.trustedform-staging.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947'
    ];
    for (const test of tests) {
      const parsed = url.parse(test);
      assert.equal(parsed.raw, test);
      assert.isTrue(parsed.valid);
    }
  });

  it('should handle dev URLs', function () {
    const parsed = url.parse('https://cert.trustedform-dev.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947');
    assert.equal(parsed.raw, 'https://cert.trustedform-dev.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947');
    assert.isTrue(parsed.valid);
  });

  it('should handle local URLs', function () {
    const parsed = url.parse('https://cert.trustedform.localhost/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947');
    assert.equal(parsed.raw, 'https://cert.trustedform.localhost/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947');
    assert.isTrue(parsed.valid);
  });

  describe('environment', function () {
    beforeEach(function () {
      this.env = process.env.NODE_ENV;
    });

    afterEach(function () {
      process.env.NODE_ENV = this.env;
    });

    it('should not allow staging urls in production env', function () {
      process.env.NODE_ENV = 'production';
      const test = 'https://cert.staging.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947';
      const parsed = url.parse(test);
      assert.isFalse(parsed.valid);
    });

    it('should not allow dev urls in production env', function () {
      process.env.NODE_ENV = 'production';
      const test = 'https://cert.trustedform-dev.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947';
      const parsed = url.parse(test);
      assert.isFalse(parsed.valid);
    });
  });

  describe('invalid values', function () {
    it('should handle non-TF URLs', function () {
      const testUrl = 'https://activeprospect.com';
      const parsed = url.parse(testUrl);
      assert.equal(parsed.raw, testUrl);
      assert.isFalse(parsed.valid);
    });

    it('should handle look-alike URLs', function () {
      const lookAlikes = [
        'https://cert.trustedform.com/1234567890123456789012345678901234567890',
        'https://cert.trustedform.com/asdfasdfasdf'
      ];
      for (const testUrl of lookAlikes) {
        const parsed = url.parse(testUrl);
        assert.equal(parsed.raw, testUrl);
        assert.isFalse(parsed.valid);
      }
    });

    it('should handle http protocol', function () {
      const parsed = url.parse('http://cert.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947');
      assert.equal(parsed.raw, 'http://cert.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947');
      assert.isFalse(parsed.valid);
    });
  });

  describe('valid values', function () {
    timefreeze.freeze(new Date(2022, 3, 31));
    const tests = {
      web: {
        url: 'https://cert.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
        expected: {
          cert_id: 'eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
          is_web: true,
          is_mobile: false,
          is_facebook: false,
          is_masked: false,
          host: 'cert.trustedform.com',
          path: '/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
          valid: true
        }
      },
      facebook: {
        url: 'https://cert.trustedform.com/0.rpM21ddljS9BNNUOm6FZVVqb5C5JMk1cofI4nDGdwy5ezucyxjok9qLyUXMu9diW62Xac8xNMpomBf1B-XDpfbYvaFMr0YC-54TzHcLrni4.OHOMoMFXaX9YW9DoX_xeng.1vnf6DTWU7sJo6XAxlRP_w',
        expected: {
          cert_id: '0.rpM21ddljS9BNNUOm6FZVVqb5C5JMk1cofI4nDGdwy5ezucyxjok9qLyUXMu9diW62Xac8xNMpomBf1B-XDpfbYvaFMr0YC-54TzHcLrni4.OHOMoMFXaX9YW9DoX_xeng.1vnf6DTWU7sJo6XAxlRP_w',
          is_web: false,
          is_mobile: false,
          is_facebook: true,
          is_masked: false,
          host: 'cert.trustedform.com',
          path: '/0.rpM21ddljS9BNNUOm6FZVVqb5C5JMk1cofI4nDGdwy5ezucyxjok9qLyUXMu9diW62Xac8xNMpomBf1B-XDpfbYvaFMr0YC-54TzHcLrni4.OHOMoMFXaX9YW9DoX_xeng.1vnf6DTWU7sJo6XAxlRP_w',
          valid: true
        }
      },
      mobile: {
        url: 'https://cert.trustedform.com/11NgkzK_mroUbOD1-x66NigDliU1kdvbaCtLGvyja1K80vU1sKh9grlwP78vzKSp4ncwAfJAlNPNVY8f',
        expected: {
          cert_id: '11NgkzK_mroUbOD1-x66NigDliU1kdvbaCtLGvyja1K80vU1sKh9grlwP78vzKSp4ncwAfJAlNPNVY8f',
          is_web: false,
          is_mobile: true,
          is_facebook: false,
          is_masked: false,
          host: 'cert.trustedform.com',
          path: '/11NgkzK_mroUbOD1-x66NigDliU1kdvbaCtLGvyja1K80vU1sKh9grlwP78vzKSp4ncwAfJAlNPNVY8f',
          valid: true
        }
      },
      masked: {
        url: 'https://cert.trustedform.com/ff5e209f324c43e2cf57ce1a080e778fecbf8285',
        expected: {
          type: 'masked',
          host: 'cert.trustedform.com',
          path: '/ff5e209f324c43e2cf57ce1a080e778fecbf8285',
          valid: true
        }
      }
    };

    for (const type of Object.keys(tests)) {
      const test = tests[type];
      const certUrl = test.url;
      const parsed = url.parse(certUrl);
      describe(`${type} cert`, function () {
        beforeEach(function () {
          assert.ok(parsed);
          assert.isTrue(parsed.valid);
        });
        const expected = tests[type].expected;
        for (const property of Object.keys(expected)) {
          const expectedValue = expected[property];
          const prop = property;
          it(`should have ${property}`, function () {
            const value = parsed[prop];
            assert.equal(value, expectedValue);
          });
        }
      });
    }
    timefreeze.reset();
  });
});
