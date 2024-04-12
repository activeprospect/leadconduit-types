const { assert } = require('chai');
const lastName = require('../lib/types/last_name');

describe('Last Name', function () {
  it('should be no-op', function () {
    assert.equal(lastName.parse('Johnson'), 'Johnson');
  });

  it('should have examples', function () {
    assert(lastName.examples.length);
  });

  it('should handle non-string garbage', function () {
    let parsed, stringified;
    const invokeStringify = () => {
      parsed = lastName.parse({ foo: 42 });
      stringified = JSON.stringify(parsed);
    };
    assert.doesNotThrow(invokeStringify);

    assert.equal(stringified, '"[object Object]"');
    assert.equal(parsed.raw, '[object Object]');
    assert.isFalse(parsed.valid);
  });
});
