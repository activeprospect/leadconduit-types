const { assert } = require('chai');
const city = require('../lib/types/city');

describe('City', function () {
  it('should be no-op', function () {
    assert.equal(city.parse('Austin'), 'Austin');
  });

  it('should have examples', function () {
    assert(city.examples.length);
  });

  it('should handle non-string garbage', function () {
    let parsed, stringified;
    const invokeStringify = () => {
      parsed = city.parse({ foo: 42 });
      stringified = JSON.stringify(parsed);
    };
    assert.doesNotThrow(invokeStringify);

    assert.equal(stringified, '"[object Object]"');
    assert.equal(parsed.raw, '[object Object]');
    assert.isFalse(parsed.valid);
  });

  it('should have the expected operators', function () {
    assert(city.operators, [
      'is equal to',
      'is not equal to',
      'is blank',
      'is not blank',
      'format is valid',
      'format is invalid',
      'includes',
      'does not include',
      'is included in',
      'is not included in',
      'matches pattern',
      'does not match pattern'
    ]);
  });
});
