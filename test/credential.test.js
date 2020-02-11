const { assert } = require('chai');
const credential = require('../lib/types/credential');

describe('Credential', function () {
  it('should not parse null', function () {
    assert.isNull(credential.parse(null));
  });

  it('should not parse undefined', function () {
    assert.isUndefined(credential.parse());
  });

  it('should be valid', function () {
    assert.isTrue(credential.parse('hi').valid);
  });

  it('should not be masked', function () {
    assert.isFalse(credential.parse('hi').masked);
  });

  it('should have examples', function () {
    assert(credential.examples.length);
  });
});
