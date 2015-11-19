assert = require('chai').assert
gender = require('../src/gender')

describe 'Gender', ->

  males = [
    'male'
    'm'
    'M'
    'Male'
    'MALE'
    '   m'
  ]

  for val in males
    do (val) ->
      it "should parse #{val} as male", ->
        parsed = gender.parse val
        assert.equal parsed.valueOf(), 'male'
        assert.equal parsed.raw, val
        assert.isTrue parsed.valid
        assert.equal parsed.abbr, 'M'


  females = [
    'female'
    'f'
    'F'
    'Female'
    'FEMALE'
    '    f'
  ]

  for val in females
    do (val) ->
      it "should parse #{val} as female", ->
        parsed = gender.parse val
        assert.equal parsed.valueOf(), 'female'
        assert.equal parsed.raw, val
        assert.isTrue parsed.valid
        assert.equal parsed.abbr, 'F'


  others = [
    'other'
    'o'
    'O'
    'Other'
    'OTHER'
    '    o'
  ]

  for val in others
    do (val) ->
      it "should parse #{val} as other", ->
        parsed = gender.parse val
        assert.equal parsed.valueOf(), 'other'
        assert.equal parsed.raw, val
        assert.isTrue parsed.valid
        assert.equal parsed.abbr, 'O'


  invalids = [
    '50'
    'asdf'
    '   '
    5
    true
  ]

  for val in invalids
    do (val) ->
      it "should parse #{val} as invalid", ->
        parsed = gender.parse val
        assert.equal parsed.valueOf(), val.toString()
        assert.equal parsed.raw, val
        assert.isFalse parsed.valid
        assert.isNull parsed.abbr


  it 'should handle parsing a parsed gender', ->
    parsed = gender.parse(gender.parse('f'))
    assert.equal parsed.valueOf(), 'female'
    assert.equal parsed.raw, 'f'
    assert.isTrue parsed.valid
    assert.equal parsed.abbr, 'F'

  it 'should have examples', ->
    assert gender.examples.length