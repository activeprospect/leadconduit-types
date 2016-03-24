assert = require('chai').assert
date = require('../src').date

describe 'Date', ->

  strings = [
    'Mon Jun 02 2014'
    'Jun 02 2014'
    '06/02/2014'
    '2014-06-02'
    '06-02-2014'
    '06022014'
  ]

  for string in strings

    do (string) ->

      describe string, ->

        it 'should have string value', ->
          parsed = date.parse string
          assert.equal parsed.toString(), '2014-06-02'
          assert.equal parsed.valueOf(), '2014-06-02'
          assert.equal parsed.toISOString(), '2014-06-02'

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
    assert.equal parsed.toString(), '2014-06-02'
    assert.equal parsed.valueOf(), '2014-06-02'
    assert.equal parsed.raw, 'Mon Jun 02 2014'

  it 'should handle parsing a JavaScript date', ->
    now = new Date(2015, 10, 6) # 0-based month index :-/
    parsed = date.parse(now)
    assert.isTrue parsed.valid
    assert.equal parsed.toString(), '2015-11-06'
    assert.equal parsed.valueOf(), '2015-11-06'
    assert.equal parsed.raw, now

  it 'should have examples', ->
    assert date.examples.length

  it 'should produce JSON', ->
    assert.equal JSON.stringify(date.parse('Mon Jun 02 2014')), '{"raw":"Mon Jun 02 2014","normal":"2014-06-02","valid":true}'


