const { assert } = require('chai');
const ip = require('../lib/types/ip');

describe('IP', function () {
  it('should not parse null', function () {
    assert.isNull(ip.parse(null));
  });

  it('should not parse undefined', function () {
    assert.isUndefined(ip.parse());
  });

  it('should parse a parsed ipv4', function () {
    const randomIpv4 = '198.51.90.161';
    const parsed = ip.parse(ip.parse(randomIpv4));
    assert.equal(parsed.toString(), randomIpv4);
    assert.equal(parsed.raw, randomIpv4);
    assert.equal(parsed.ipv6_format, 'ffff::c633:5aa1');
    assert.isTrue(parsed.valid);
    assert.isTrue(parsed.is_ipv4);
  });

  it('should parse a parsed ipv6', function () {
    const randomIpv6 = '8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9';
    const parsed = ip.parse(ip.parse(randomIpv6));
    assert.equal(parsed.toString(), randomIpv6);
    assert.equal(parsed.raw, randomIpv6);
    assert.equal(parsed.ipv6_format, randomIpv6);
    assert.isTrue(parsed.valid);
    assert.isFalse(parsed.is_ipv4);
  });

  it('should have examples', function () {
    assert(ip.examples.length > 0);
  });

  describe('valid ipv4', function () {
    const strings = [
      '198.51.90.161',
      '198.51.90.161/32', // cidr notation
      'http://198.51.90.161:32', // url with port
      'http://198.51.90.161',
      '    198. 51. 90. 161     ', // whitespace
      '    http://198.51.90.161     '
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = ip.parse(string);
        });

        it('should keep raw value', function () {
          assert.equal(this.parsed.raw, string);
        });

        it('should have ipv6_format', function () {
          assert.equal(this.parsed.ipv6_format, 'ffff::c633:5aa1');
        });

        it('should be normalized', function () {
          assert.equal(this.parsed.valueOf(), '198.51.90.161');
        });

        it('should be marked valid', function () {
          assert.isTrue(this.parsed.valid);
        });

        it('should be marked ipv4', function () {
          assert.isTrue(this.parsed.is_ipv4);
        });
      });
    }
  });

  describe('valid ipv6', function () {
    const strings = [
      '[8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9]',
      '8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9',
      '    [8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9]     ', // whitespace
      '    http://[8faa:    230d:52ab:98f3:a2ea:    7735:a7b8:72e9]     ',
      'http://[8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9]:32', // <- url with port
      '8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9/64' // <- CIDR notation
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = ip.parse(string);
        });

        it('should keep raw value', function () {
          assert.equal(this.parsed.raw, string);
        });

        it('should have ipv6_format', function () {
          assert.equal(this.parsed.ipv6_format, '8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9');
        });

        it('should be normalized', function () {
          assert.equal(this.parsed.valueOf(), '8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9');
        });

        it('should be marked valid', function () {
          assert.isTrue(this.parsed.valid);
        });

        it('should be marked ipv4', function () {
          assert.isFalse(this.parsed.is_ipv4);
        });
      });
    }
  });

  describe('irregular ipv6', function () {
    it('should parse ipv6 with leading zeros', function () {
      const string = '[0000:0000:0000:0000:0000:0000:0000:0001]';
      const parsed = ip.parse(string);
      assert.equal(parsed.valueOf(), '::1');
      assert.isTrue(parsed.valid);
    });

    it('should parse ipv6 with ipv4 tail', function () {
      const string = '[ffff::186.25.192.233]';
      const parsed = ip.parse(string);
      assert.equal(parsed.valueOf(), 'ffff::ba19:c0e9');
      assert.isTrue(parsed.valid);
    });

    it('should parse ipv6 with ipv4 tail (alternate form)', function () {
      const string = '[::ffff:186.25.192.233]';
      const parsed = ip.parse(string);
      assert.equal(parsed.valueOf(), '::ffff:ba19:c0e9');
      assert.isTrue(parsed.valid);
    });
  });

  describe('values that get coerced to valid', function () {
    const strings = [
      'http://8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9', // <- leads with protocol without brackets around ipv6
      '8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9:32', // <- ends with port without brackets
      '198.51.90.161/extra_path',
      '198.51.90.161/33', // <- max cidr is 32 for ipv4
      '8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9/129', // <- max cidr is 128 for ipv6
      'http://8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9',
      'http://8faa:230d:52ab:98f3:a2ea:7735:a7b8:72e9/extra_path'
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = ip.parse(string);
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
      'https://google.com',
      'https://',
      'donkey://google.com',
      { foo: 42 },
      'fe80:2030:31:24', // <- colons need to separate 2 byte segements for a total of 16-bytes
      '256.4.5.6', // <- ipv4 with invalid octet (256)
      '56FE::2159:5BBC::6594', // <- two sets of double colons
      '::GG' // <- invalid hex character (G)
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = ip.parse(string);
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
