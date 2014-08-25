assert = require('chai').assert
parse = require('../src/number').parse

describe 'Number', ->

  it 'should return a String object', ->
    parsed = parse '1000'
    assert.instanceOf parsed, String
    assert.equal parsed.toString(), '1000'

  it 'should disregard non-essential characters', ->
    parsed = parse '$1,000.01 donkey '
    assert.instanceOf parsed, String
    assert.equal parsed.toString(), '1000.01'
    assert.equal parsed.raw, '$1,000.01 donkey '

  it 'should handle NaN', ->
    parsed = parse 'donkey'
    assert.instanceOf parsed, String
    assert.equal parsed.toString(), 'donkey'
    assert.equal parsed.raw, 'donkey'