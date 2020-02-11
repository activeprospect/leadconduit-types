const { assert } = require('chai');
const state = require('../lib/types/state');

describe('State', function () {
  it('should not parse null', function () {
    assert.isNull(state.parse(null));
  });

  it('should not parse undefined', function () {
    assert.isUndefined(state.parse());
  });

  it('should parse a parsed state', function () {
    const parsed = state.parse(state.parse('TX'));
    assert.equal(parsed.toString(), 'TX');
    assert.equal(parsed.raw, 'TX');
    assert.equal(parsed.name, 'Texas');
    assert.isTrue(parsed.valid);
  });

  it('should parse a parsed province', function () {
    const parsed = state.parse(state.parse('ON'));
    assert.equal(parsed.toString(), 'ON');
    assert.equal(parsed.raw, 'ON');
    assert.equal(parsed.name, 'Ontario');
    assert.isTrue(parsed.valid);
  });

  it('should have examples', function () {
    assert(state.examples.length);
  });

  describe('valid values', function () {
    const strings = [
      'TX',
      'Texas',
      'tx',
      'texas'
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = state.parse(string);
        });

        it('should keep raw value', function () {
          assert.equal(this.parsed.raw, string);
        });

        it('should have name', function () {
          assert.equal(this.parsed.name, 'Texas');
        });

        it('should have abbr', function () {
          assert.equal(this.parsed.valueOf(), 'TX');
        });

        it('should be marked valid', function () {
          assert.isTrue(this.parsed.valid);
        });
      });
    }
  });

  describe('unknown states', function () {
    const strings = [
      'DX',
      '',
      '  ',
      'Dexus',
      'DEXUS NEXUS'
    ];

    for (const string of strings) {
      describe(`'${string}'`, function () {
        beforeEach(function () {
          this.parsed = state.parse(string);
        });

        it('should keep raw value', function () {
          assert.equal(this.parsed.raw, string);
        });

        it('should have normalized name', function () {
          assert.equal(this.parsed.name, string);
        });

        it('should be marked valid', function () {
          // There's no such thing as an invalid state right now because we really only provide
          // extra metadata for the 50 united states
          assert.isTrue(this.parsed.valid);
        });
      });
    }
  });
});
