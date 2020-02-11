const _ = require('lodash');
const { assert } = require('chai');
const types = require('../lib');

describe('String', function () {
  it('should not parse null', function () {
    assert.isNull(types.string.parse(null));
  });

  it('should not parse undefined', function () {
    assert.isUndefined(types.string.parse());
  });

  it('should have examples', function () {
    assert(types.string.examples.length);
  });

  for (const [name, type] of new Map(Object.entries(types))) {
    if (!_.isPlainObject(type)) { continue; }

    // for each type...
    it(`should cast ${name} to string primitive`, function () {
      // parse an example value
      const example = type.examples[0];
      const raw = _.get(example, 'raw') || _.get(example, 'normal') || example;
      const richValue = type.parse(raw);

      // and expect that the string representation is the normal form converted to a string
      const parsed = types.string.parse(richValue);
      assert.typeOf(parsed, 'string');
      assert.equal(parsed, richValue.toString());
    });
  }
});
