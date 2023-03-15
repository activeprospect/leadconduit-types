const { assert } = require('chai');
const street = require('../lib/types/street');

describe('Street', function () {
  it('should return a String object', function () {
    assert.instanceOf(street.parse('4203 Guadalupe St'), String);
  });

  it('should parse street number', function () {
    assert.equal(street.parse('4203 Guadalupe St').number, '4203');
  });

  it('should parse street name', function () {
    assert.equal(street.parse('4203 Guadalupe St').name, 'Guadalupe St');
  });

  it('should retain raw value', function () {
    assert.equal(street.parse('4203 Guadalupe St').raw, '4203 Guadalupe St');
  });

  it('should be valid', function () {
    assert.isTrue(street.parse('4203 Guadalupe St').valid);
  });

  it('should handle invalid value', function () {
    const parsed = street.parse('Asdf');
    assert.instanceOf(parsed, String);
    assert.equal(parsed.raw, 'Asdf');
    assert.isUndefined(parsed.name);
    assert.isUndefined(parsed.number);
    assert.isFalse(parsed.valid);
  });

  it('should handle non-string invalid value', function () {
    // see sc-39505
    let parsed, stringified;
    const invokeStringify = () => {
      parsed = street.parse({ foo: 42 });
      stringified = JSON.stringify(parsed);
    };
    assert.doesNotThrow(invokeStringify);

    assert.equal(stringified, '"[object Object]"');
    assert.equal(parsed.toString(), '[object Object]');
    assert.equal(parsed.raw, '[object Object]');
    assert.equal(parsed.valueOf(), '[object Object]');
    assert.isTrue(parsed.valid); // validity not all that meaningful for this type, lol
  });

  it('should strip whitespace', function () {
    const parsed = street.parse(' 4203 Guadalupe St ');
    assert.equal('4203 Guadalupe St', parsed.toString());
    assert.equal(' 4203 Guadalupe St ', parsed.raw);
  });

  it('should handle parsing a parsed street', function () {
    const parsed = street.parse(street.parse('4203 Guadalupe St'));
    assert.instanceOf(parsed, String);
    assert.equal(parsed.toString(), '4203 Guadalupe St');
    assert.equal(parsed.raw, '4203 Guadalupe St');
  });

  it('should have examples', function () {
    assert(street.examples.length);
  });
});
