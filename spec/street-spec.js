/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const street = require('../lib/types/street');


describe('Street', function() {

  it('should return a String object', () => assert.instanceOf(street.parse('4203 Guadalupe St'), String));

  it('should parse street number', () => assert.equal(street.parse('4203 Guadalupe St').number, '4203'));

  it('should parse street name', () => assert.equal(street.parse('4203 Guadalupe St').name, 'Guadalupe St'));

  it('should retain raw value', () => assert.equal(street.parse('4203 Guadalupe St').raw, '4203 Guadalupe St'));

  it('should be valid', () => assert.isTrue(street.parse('4203 Guadalupe St').valid));

  it('should handle invalid value', function() {
    const parsed = street.parse('Asdf');
    assert.instanceOf(parsed, String);
    assert.equal(parsed.raw, 'Asdf');
    assert.isUndefined(parsed.name);
    assert.isUndefined(parsed.number);
    return assert.isFalse(parsed.valid);
  });

  it('should strip whitespace', function() {
    const parsed = street.parse(' 4203 Guadalupe St ');
    assert.equal('4203 Guadalupe St', parsed.toString());
    return assert.equal(' 4203 Guadalupe St ', parsed.raw);
  });

  it('should handle parsing a parsed street', function() {
    const parsed = street.parse(street.parse('4203 Guadalupe St'));
    assert.instanceOf(parsed, String);
    assert.equal(parsed.toString(), '4203 Guadalupe St');
    return assert.equal(parsed.raw, '4203 Guadalupe St');
  });

  return it('should have examples', () => assert(street.examples.length));
});

