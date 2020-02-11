const { assert } = require('chai');
const lastName = require('../lib/types/last_name');

describe('Last Name', function () {
  it('should be no-op', function () {
    assert.equal(lastName.parse('Johnson'), 'Johnson');
  });

  it('should have examples', function () {
    assert(lastName.examples.length);
  });
});
