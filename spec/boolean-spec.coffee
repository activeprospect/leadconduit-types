assert = require('chai').assert
boolean = require('../src/boolean')

describe 'Boolean', ->

  trues = [
    true
    'true'
    't'
    'yes'
    'y'
    '1'
    1
  ]

  for val in trues
    do (val) ->
      it "should parse #{typeof val} #{val} as true", ->
        parsed = boolean.parse val
        assert.equal parsed.valueOf(), true
        assert.equal parsed.raw, val
        assert.isTrue parsed.valid


  falses = [
    false
    'false'
    'f'
    'no'
    'n'
    '0'
    0
  ]

  for val in falses
    do (val) ->
      it "should parse #{typeof val} #{val} as false", ->
        parsed = boolean.parse val
        assert.equal parsed.valueOf(), false
        assert.equal parsed.raw, val
        assert.isTrue parsed.valid


  invalids = [
    '50'
    'asdf'
    '   '
  ]

  for val in invalids
    do (val) ->
      it "should parse #{val} as false and invalid", ->
        parsed = boolean.parse val
        assert.equal parsed.valueOf(), false
        assert.equal parsed.raw, val
        assert.isFalse parsed.valid

  it 'should ignore whitespace', ->
    parsed = boolean.parse '  true '
    assert.equal parsed.valueOf(), true
    assert.equal parsed.raw, '  true '
    assert.isTrue parsed.valid

  it 'should ignore character case', ->
    parsed = boolean.parse 'TRUE'
    assert.equal parsed.valueOf(), true
    assert.equal parsed.raw, 'TRUE'
    assert.isTrue parsed.valid

  it 'should handle parsing a parsed boolean', ->
    assert.isFalse boolean.parse(boolean.parse('false')).valueOf()
