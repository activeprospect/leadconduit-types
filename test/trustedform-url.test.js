const {assert} = require('chai');
const moment = require('moment');

// these environment variables must be set before requiring the type
const secret = 'qy3Sjay3D/bXAAx7jMUvSoum54R5JEPs';
process.env.CERT_IDS_SECRET_KEY = secret;
process.env.TF_CONFIG_CERT_ID_SECRET = secret;

const url = require('../lib/types/trustedform_url');


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

  describe('valid values', function () {
    const tests = {
      web: {
        url: 'https://cert.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
        expected: {
          cert_id: 'eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947',
          is_expired: moment(new Date()).diff(new Date(1646770816000), 'days') > 90,
          is_web: true,
          is_mobile: false,
          is_facebook: false,
          is_masked: false,
          age_in_days: moment(new Date()).diff(new Date(1646770816000), 'days')
        }
      },
      facebook: {
        url: 'https://cert.trustedform.com/0.rpM21ddljS9BNNUOm6FZVVqb5C5JMk1cofI4nDGdwy5ezucyxjok9qLyUXMu9diW62Xac8xNMpomBf1B-XDpfbYvaFMr0YC-54TzHcLrni4.OHOMoMFXaX9YW9DoX_xeng.1vnf6DTWU7sJo6XAxlRP_w',
        expected: {
          cert_id: '0.rpM21ddljS9BNNUOm6FZVVqb5C5JMk1cofI4nDGdwy5ezucyxjok9qLyUXMu9diW62Xac8xNMpomBf1B-XDpfbYvaFMr0YC-54TzHcLrni4.OHOMoMFXaX9YW9DoX_xeng.1vnf6DTWU7sJo6XAxlRP_w',
          is_expired: moment(new Date()).diff(new Date(1646776988000), 'days') > 90,
          is_web: false,
          is_mobile: false,
          is_facebook: true,
          is_masked: false,
          age_in_days: moment(new Date()).diff(new Date(1646776988000), 'days')
        }
      },
      mobile: {
        url: 'https://cert.trustedform.com/11NgkzK_mroUbOD1-x66NigDliU1kdvbaCtLGvyja1K80vU1sKh9grlwP78vzKSp4ncwAfJAlNPNVY8f',
        expected: {
          cert_id: '11NgkzK_mroUbOD1-x66NigDliU1kdvbaCtLGvyja1K80vU1sKh9grlwP78vzKSp4ncwAfJAlNPNVY8f',
          is_expired: moment(new Date()).diff(new Date(1646779346000), 'days') > 90,
          is_web: false,
          is_mobile: true,
          is_facebook: false,
          is_masked: false,
          age_in_days: moment(new Date()).diff(new Date(1646779346000), 'days')
        }
      },
      ping: {
        url: 'https://ping.trustedform.com/0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ',
        expected: {
          cert_id: '0.1JT7QUPI1sOFZxpr72ZK45K0ck75kEBO9H3jNJuX8NkqMTv4UF-zrapBUlsefTP3lkXWh6qM.fF0DNrov0zNUNVRCqDV5dw.E2eYOJ5-dnAgiX02-96FNQ',
          is_expired: moment(new Date()).diff(new Date(1646778749000), 'days') > 90,
          is_web: true,
          is_mobile: false,
          is_facebook: false,
          is_masked: false,
          age_in_days: moment(new Date()).diff(new Date(1646778749000), 'days')
        }
      },
      masked: {
        url: 'https://cert.trustedform.com/0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33',
        expected: {
          type: 'masked'
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
