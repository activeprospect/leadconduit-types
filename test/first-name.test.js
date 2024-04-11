const { assert } = require('chai');
const firstName = require('../lib/types/first_name');

describe('First Name', function () {
  it('should be no-op', function () {
    assert.equal(firstName.parse('Alex'), 'Alex');
  });

  it('should have examples', function () {
    assert(firstName.examples.length);
  });

  it('should handle non-string garbage', function () {
    let parsed, stringified;
    const invokeStringify = () => {
      parsed = firstName.parse({ foo: 42 });
      stringified = JSON.stringify(parsed);
    };
    assert.doesNotThrow(invokeStringify);

    assert.equal(stringified, '"[object Object]"');
    assert.equal(parsed.raw, '[object Object]');
    assert.isFalse(parsed.valid);
  });
});
