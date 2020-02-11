/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const credential = require('../lib/types/credential');


describe('Credential', function() {


  it('should not parse null', () => assert.isNull(credential.parse(null)));


  it('should not parse undefined', () => assert.isUndefined(credential.parse()));


  it('should be valid', () => assert.isTrue(credential.parse('hi').valid));


  it('should not be masked', () => assert.isFalse(credential.parse('hi').masked));


  return it('should have examples', () => assert(credential.examples.length));
});
