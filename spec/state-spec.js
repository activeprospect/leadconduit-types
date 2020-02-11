/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash');
const {
  assert
} = require('chai');
const state = require('../lib/types/state');


describe('State', function() {

  it('should not parse null', () => assert.isNull(state.parse(null)));

  it('should not parse undefined', () => assert.isUndefined(state.parse()));

  it('should parse a parsed state', function() {
    const parsed = state.parse(state.parse('TX'));
    assert.equal(parsed.toString(), 'TX');
    assert.equal(parsed.raw, 'TX');
    assert.equal(parsed.name, 'Texas');
    return assert.isTrue(parsed.valid);
  });

  it('should parse a parsed province', function() {
    const parsed = state.parse(state.parse('ON'));
    assert.equal(parsed.toString(), 'ON');
    assert.equal(parsed.raw, 'ON');
    assert.equal(parsed.name, 'Ontario');
    return assert.isTrue(parsed.valid);
  });

  it('should have examples', () => assert(state.examples.length));


  describe('valid values', function() {

    const strings = [
      'TX',
      'Texas',
      'tx',
      'texas'
    ];

    return Array.from(strings).map((string) =>
      ((string => describe(`'${string}'`, function() {

        beforeEach(function() {
          return this.parsed = state.parse(string);
        });

        it('should keep raw value', function() {
          return assert.equal(this.parsed.raw, string);
        });

        it('should have name', function() {
          return assert.equal(this.parsed.name, 'Texas');
        });

        it('should have abbr', function() {
          return assert.equal(this.parsed.valueOf(), 'TX');
        });

        return it('should be marked valid', function() {
          return assert.isTrue(this.parsed.valid);
        });
      })))(string));
  });


  return describe('unknown states', function() {

    const strings = [
      'DX',
      '',
      '  ',
      'Dexus',
      'DEXUS NEXUS'
    ];

    return Array.from(strings).map((string) =>
      ((string => describe(`'${string}'`, function() {

        beforeEach(function() {
          return this.parsed = state.parse(string);
        });

        it('should keep raw value', function() {
          return assert.equal(this.parsed.raw, string);
        });

        it('should have normalized name', function() {
          return assert.equal(this.parsed.name, string);
        });

        return it('should be marked valid', function() {
          // There's no such thing as an invalid state right now because we really only provide
          // extra metadata for the 50 united states
          return assert.isTrue(this.parsed.valid);
        });
      })))(string));
  });
});

