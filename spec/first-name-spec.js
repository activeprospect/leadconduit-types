/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const firstName = require('../lib/types/first_name');

describe('First Name', function() {

  it('should be no-op', () => assert.equal(firstName.parse('Alex'), 'Alex'));

  return it('should have examples', () => assert(firstName.examples.length));
});
