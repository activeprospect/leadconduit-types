assert = require('chai').assert
date = require('../src/types/date')

describe 'Date', ->

  strings = [
    'Mon Jun 02 2014'
    'Jun 02 2014'
    '06/02/2014'
    '6/2/2014'
    '6/2/14'
    '2014-06-02'
    '06-02-2014'
    '06022014'
    '20140602'
  ]

  for string in strings

    do (string) ->

      describe string, ->

        it 'should return a Date object', ->
          parsed = date.parse string
          assert.instanceOf parsed, Date
          assert.equal parsed.toISOString(), '2014-06-02T00:00:00.000Z'

        it 'should have string value', ->
          parsed = date.parse string
          assert.equal parsed.toString(), '2014-06-02'
          assert.equal parsed.valueOf(), '2014-06-02'

        it 'should have raw value', ->
          assert.equal date.parse(string).raw, string

        it 'should be valid', ->
          assert.isTrue date.parse(string).valid


  it 'should not parse garbage', ->
    parsed = date.parse 'garbage'
    assert.equal parsed.toString(), 'garbage'
    assert.equal parsed.valueOf(), 'garbage'
    assert.equal parsed.raw, 'garbage'
    assert.isFalse parsed.valid

  it 'should handle parsing a parsed date', ->
    parsed = date.parse(date.parse('Mon Jun 02 2014'))
    assert.instanceOf parsed, Date
    assert.equal parsed.toString(), '2014-06-02'
    assert.equal parsed.valueOf(), '2014-06-02'
    assert.equal parsed.raw, 'Mon Jun 02 2014'

  it 'should have examples', ->
    assert date.examples.length

