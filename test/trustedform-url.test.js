const {assert} = require('chai');
const moment = require('moment');

// these environment variables must be set before requiring the type
const secret = 'qy3Sjay3D/bXAAx7jMUvSoum54R5JEPs';
process.env.CERT_IDS_SECRET_KEY = secret;
process.env.TF_CONFIG_CERT_ID_SECRET = secret;

const url = require('../lib/types/trustedform_url');
const regularUrl = require('../lib/types/url');
const certId = require('@activeprospect/trustedform-cert-id');

describe('TrustedForm URL', function () {
  it('should not parse null', function () {
    assert.isNull(url.parse(null));
  });

  it('should not parse undefined', function () {
    assert.isUndefined(url.parse());
  });

  it('should have examples', function () {
    assert(url.examples.length);
  });

  it('should normalize case of 40 character ids', function() {
    const cert = url.parse('https://CERT.trustedform.com/EB9fC4DD9bED9AD451A5648946CF4BF09B5BB947');
    assert.equal(cert.toString(), 'https://cert.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947');
  });

  it('should not normalize case of zero-dot IDs', function() {
    const pingUrl = 'HTTPS://PING.trustedform.com/0.vzhYBmGsqsu4ob7u4rWDOX6Gg4OT5SAza1r%2FTYNMJ81Kx%2FFGh2SZGtlZ7KiEg7lEdxi7xLcq.15GK4f1R9Te6Rjd4J85Xng.Bdz5CUNsDpelrvmW0L9sQg';
    const cert = url.parse(pingUrl);
    assert.equal(cert.toString(), 'https://ping.trustedform.com/0.vzhYBmGsqsu4ob7u4rWDOX6Gg4OT5SAza1r%2FTYNMJ81Kx%2FFGh2SZGtlZ7KiEg7lEdxi7xLcq.15GK4f1R9Te6Rjd4J85Xng.Bdz5CUNsDpelrvmW0L9sQg');
  });

  it('should parse ping URL with url encoded parts', function() {
    // this ping URL has %2F in it, which is the / character URL encoded
    const pingUrl = 'https://ping.trustedform.com/0.vzhYBmGsqsu4ob7u4rWDOX6Gg4OT5SAza1r%2FTYNMJ81Kx%2FFGh2SZGtlZ7KiEg7lEdxi7xLcq.15GK4f1R9Te6Rjd4J85Xng.Bdz5CUNsDpelrvmW0L9sQg';
    const parsed = url.parse(pingUrl);
    assert.equal(parsed.cert_id, '0.vzhYBmGsqsu4ob7u4rWDOX6Gg4OT5SAza1r%2FTYNMJ81Kx%2FFGh2SZGtlZ7KiEg7lEdxi7xLcq.15GK4f1R9Te6Rjd4J85Xng.Bdz5CUNsDpelrvmW0L9sQg');
  });

  it('should handle staging URLs', function() {
    const tests = [
      'https://cert.staging.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
      'https://cert.trustedform-staging.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
      'https://ping.staging.trustedform.com/0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ',
      'https://ping.trustedform-staging.com/0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ'
    ]
    for(test of tests) {
      const parsed = url.parse(test);
      assert.equal(parsed.raw, test);
      assert.isTrue(parsed.valid);
    }
  });

  it('should handle dev URLs', function() {
    const tests = [
      'https://cert.trustedform-dev.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
      'https://ping.trustedform-dev.com/0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ'
    ]
    for(test of tests) {
      const parsed = url.parse(test);
      assert.equal(parsed.raw, test);
      assert.isTrue(parsed.valid);
    }
  });

  it('should handle local URLs', function() {
    const tests = [
      'https://cert.trustedform.localhost/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
      'https://ping.trustedform.localhost/0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ'
    ]
    for(test of tests) {
      const parsed = url.parse(test);
      assert.equal(parsed.raw, test);
      assert.isTrue(parsed.valid);
    }
  });

  describe('environment', function () {
    beforeEach(function() {
      this.env = process.env.NODE_ENV;
    });

    afterEach(function() {
      process.env.NODE_ENV = this.env;
    });

    it('should not allow staging urls in production env', function() {
      process.env.NODE_ENV = 'production';
      const test = 'https://cert.staging.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947';
      const parsed = url.parse(test);
      assert.isFalse(parsed.valid);
    });

    it('should not allow dev urls in production env', function() {
      process.env.NODE_ENV = 'production';
      const test = 'https://cert.trustedform-dev.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947';
      const parsed = url.parse(test);
      assert.isFalse(parsed.valid);
    });
  });

  describe('invalid values', function () {
    it('should handle non-TF URLs', function() {
      const testUrl = 'https://activeprospect.com';
      const parsed = url.parse(testUrl);
      assert.equal(parsed.raw, testUrl);
      assert.isFalse(parsed.valid);
    });

    it('should handle look-alike URLs', function() {
      const lookAlikes = [
        'https://cert.trustedform.com/1234567890123456789012345678901234567890',
        'https://cert.trustedform.com/asdfasdfasdf',
        'https://ping.trustedform.com/1234567890123456789012345678901234567890',
        'https://ping.trustedform.com/asdfasdfasdf'
      ];
      for(testUrl of lookAlikes) {
        const parsed = url.parse(testUrl);
        assert.equal(parsed.raw, testUrl);
        assert.isFalse(parsed.valid);
      }
    });

    it('should handle http protocol', function() {
      const tests = [
        'http://cert.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
        'http://ping.trustedform.com/0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ'
      ]
      for(test of tests) {
        const parsed = url.parse(test);
        assert.equal(parsed.raw, test);
        assert.isFalse(parsed.valid);
      }
    })
  })

  it('should provide ping url', function() {
    const certUrl = 'https://cert.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947';
    const parsed = url.parse(certUrl);
    const pingUrl = parsed.ping_url;
    const parsedPingUrl = regularUrl.parse(pingUrl);
    assert.equal(parsedPingUrl.protocol, 'https');
    assert.equal(parsedPingUrl.host, 'ping.trustedform.com');

    // parse the ping URL's cert ID
    const pingCertId = parsedPingUrl.path.replace(/^\//, '');
    const parsedCert = certId.decrypt(pingCertId);
    assert.equal(parsedCert.type, 'web');
    assert.typeOf(parsedCert.createdAt, 'Date');
    assert.isTrue(parsedCert.isPing);
  });

  describe('valid values', function () {
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
      ping: {
        url: 'https://ping.trustedform.com/0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ',
        expected: {
          cert_id: '0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ',
          is_web: true,
          is_mobile: false,
          is_facebook: false,
          is_masked: false,
          ping_url: 'https://ping.trustedform.com/0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ',
          host: 'ping.trustedform.com',
          path: '/0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ',
          valid: true
        }
      },
      masked: {
        url: 'https://cert.trustedform.com/0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33',
        expected: {
          type: 'masked',
          host: 'cert.trustedform.com',
          path: '/0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33',
          valid: true
        }
      }
    };

    for (type of Object.keys(tests)) {
      const test = tests[type];
      const certUrl = test.url;
      const parsed = url.parse(certUrl);
      describe(`${type} cert`, function() {
        beforeEach(function() {
          assert.ok(parsed);
          assert.isTrue(parsed.valid);
        })
        const expected = tests[type].expected;
        for(property of Object.keys(expected)) {
          const expectedValue = expected[property];
          const prop = property;
          it(`should have ${property}`, function() {
            const value = parsed[prop];
            assert.equal(value, expectedValue);
          })
        }
      })
    }
  });
});


