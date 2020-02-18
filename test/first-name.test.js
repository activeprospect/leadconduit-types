const { assert } = require('chai');
const firstName = require('../lib/types/first_name');

describe('First Name', function () {
  it('should be no-op', function () {
    assert.equal(firstName.parse('Alex'), 'Alex');
  });

  it('should have examples', function () {
    assert(firstName.examples.length);
  });
});
