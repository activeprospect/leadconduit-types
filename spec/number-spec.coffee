assert = require('chai').assert
number = require('../src/number')

describe 'Number', ->

  it 'should parse string integer', ->
    parsed = number.parse '11'
    assert.equal parsed.valueOf(), 11
    assert.equal parsed.raw, '11'
    assert.isTrue parsed.valid

  it 'should parse integer', ->
    parsed = number.parse 11
    assert.equal parsed.valueOf(), 11
    assert.equal parsed.raw, 11
    assert.isTrue parsed.valid

  it 'should parse string decimal', ->
    parsed = number.parse '1.111'
    assert.equal parsed.valueOf(), 1.111
    assert.equal parsed.raw, '1.111'
    assert.isTrue parsed.valid

  it 'should parse decimal', ->
    parsed = number.parse 1.111
    assert.equal parsed.valueOf(), 1.111
    assert.equal parsed.raw, 1.111
    assert.isTrue parsed.valid

  it 'should ignore commas', ->
    parsed = number.parse '1,100'
    assert.equal parsed.valueOf(), 1100
    assert.equal parsed.raw, '1,100'
    assert.isTrue parsed.valid

  it 'should ignore currency', ->
    parsed = number.parse '$1100'
    assert.equal parsed.valueOf(), 1100
    assert.equal parsed.raw, '$1100'
    assert.isTrue parsed.valid

  it 'should ignore extraneous text', ->
    parsed = number.parse '$1100 per month'
    assert.equal parsed.valueOf(), 1100
    assert.equal parsed.raw, '$1100 per month'
    assert.isTrue parsed.valid

  it 'should ignore whitespace', ->
    parsed = number.parse '  1100 '
    assert.equal parsed.valueOf(), 1100
    assert.equal parsed.raw, '  1100 '
    assert.isTrue parsed.valid

  it 'should handle null', ->
    assert.isNull number.parse null

  it 'should handle undefined', ->
    assert.isUndefined number.parse()

  it 'should handle all whitespace', ->
    parsed = number.parse '  '
    assert isNaN parsed.valueOf()
    assert.equal parsed.raw, '  '
    assert.isFalse parsed.valid

  it 'should handle boolean', ->
    parsed = number.parse true
    assert isNaN parsed.valueOf()
    assert.equal parsed.raw, true
    assert.isFalse parsed.valid

  it 'should handle array', ->
    parsed = number.parse [1]
    assert isNaN parsed.valueOf()
    assert.deepEqual parsed.raw, [1]
    assert.isFalse parsed.valid

  it 'should handle object', ->
    parsed = number.parse foo: 'bar'
    assert isNaN parsed.valueOf()
    assert.deepEqual parsed.raw, foo: 'bar'
    assert.isFalse parsed.valid

  it 'should handle non-number string', ->
    parsed = number.parse 'derp'
    assert isNaN parsed.valueOf()
    assert.equal parsed.raw, 'derp'
    assert.isFalse parsed.valid

  it 'should parse a parsed number', ->
    parsed = number.parse(number.parse('11'))
    assert.equal parsed.valueOf(), 11
    assert.equal parsed.raw, '11'
    assert.isTrue parsed.valid

  it 'should parse empty string', ->
    parsed = number.parse(number.parse(''))
    assert isNaN parsed.valueOf()
    assert.equal parsed.raw, ''
    assert.isFalse parsed.valid

  it 'should parse NaN', ->
    parsed = number.parse(parseInt('sports'))
    assert isNaN parsed.valueOf()
    assert isNaN parsed.raw
    assert.isFalse parsed.valid

  it 'should have examples', ->
    assert number.examples.length


