/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const city = require('../lib/types/city');

describe('City', function() {

  it('should be no-op', () => assert.equal(city.parse('Austin'), 'Austin'));

  return it('should have examples', () => assert(city.examples.length));
});
