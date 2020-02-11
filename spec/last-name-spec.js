/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const lastName = require('../lib/types/last_name');

describe('Last Name', function() {

  it('should be no-op', () => assert.equal(lastName.parse('Johnson'), 'Johnson'));

  return it('should have examples', () => assert(lastName.examples.length));
});
