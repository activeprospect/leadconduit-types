/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash');
const {
  assert
} = require('chai');
const types = require('../lib');


describe('String', function() {

  it('should not parse null', () => assert.isNull(types.string.parse(null)));

  it('should not parse undefined', () => assert.isUndefined(types.string.parse()));

  it('should have examples', () => assert(types.string.examples.length));

  return (() => {
    const result = [];
    for (let name in types) {
      const type = types[name];
      if (!_.isPlainObject(type)) { continue; }
      result.push((((name, type) => // for each type...
      it(`should cast ${name} to string primitive`, function() {

        // parse an example value
        let left;
        const example = type.examples[0];
        const raw = (left = (example != null ? example.raw : undefined) != null ? (example != null ? example.raw : undefined) : (example != null ? example.normal : undefined)) != null ? left : example;
        const richValue = type.parse(raw);

        // and expect that the string representation is the normal form converted to a string
        const parsed = types.string.parse(richValue);
        assert.typeOf(parsed, 'string');
        return assert.equal(parsed, richValue.toString());
      })))(name, type));
    }
    return result;
  })();
});
