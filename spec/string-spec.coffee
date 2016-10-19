_ = require('lodash')
assert = require('chai').assert
types = require('../src')


describe 'String', ->

  it 'should not parse null', ->
    assert.isNull types.string.parse(null)

  it 'should not parse undefined', ->
    assert.isUndefined types.string.parse()

  it 'should have examples', ->
    assert types.string.examples.length

  for name, type of types
    continue unless _.isPlainObject(type)
    do (name, type) ->

      # for each type...
      it "should cast #{name} to string primitive", ->

        # parse an example value
        example = type.examples[0]
        raw = example?.raw ? example?.normal ? example
        richValue = type.parse(raw)

        # and expect that the string representation is the normal form converted to a string
        parsed = types.string.parse(richValue)
        assert.typeOf parsed, 'string'
        assert.equal parsed, richValue.toString()
