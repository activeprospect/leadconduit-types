const { assert } = require('chai');
const object = require('../lib/types/object');

describe.only('Object', function () {
  const objects = [
    {foo: 'bar'},
    '{"foo":"bar"}'
  ];

  for (const val of objects) {
    it(`should parse ${typeof val} ${JSON.stringify(val)} as object`, function () {
      const parsed = object.parse(val);
      assert.deepEqual(parsed.valueOf(), {foo: 'bar', valid: true, raw: val});
    });
  }

  const invalids = [
    '   ',
    'donkey',
    '<foo>bar</foo>'
  ];

  for (const val of invalids) {
    it(`should parse ${typeof val} ${JSON.stringify(val)} as invalid`, function () {
      const parsed = object.parse(val);
      assert.deepEqual(parsed, {valid: false, raw: val});
    });
  }

  it('should ignore whitespace', function () {
    const val = '  {"foo":"bar"} ';
    const parsed = object.parse(val);
    assert.deepEqual(parsed.valueOf(), {foo: 'bar', valid: true, raw: val});
  });

  it('should handle parsing a parsed object', function () {
    const val = '{"foo":"bar"}';
    const parsed = object.parse(object.parse(val));
    assert.deepEqual(parsed.valueOf(), {foo: 'bar', valid: true, raw: val});
  });

  it('should have examples', function () {
    assert(object.examples.length);
  });
});
