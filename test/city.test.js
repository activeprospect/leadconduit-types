const { assert } = require('chai');
const city = require('../lib/types/city');

describe('City', function () {
  it('should be no-op', function () {
    assert.equal(city.parse('Austin'), 'Austin');
  });

  it('should have examples', function () {
    assert(city.examples.length);
  });
});
