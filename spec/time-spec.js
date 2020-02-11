assert = require('chai').assert
time = require('../lib/types/time')

describe 'Time', ->

  it 'should have examples', ->
    assert time.examples.length

  strings = [
    'Sat Jun 14 2014 13:27:33 GMT-0500 (CDT)'
    '06/14/2014 6:27:33 PM'
    '2014-06-14T18:27:33Z'
    '2014-06-14T18:27:33.000Z'
  ]

  for string in strings
    do (string) ->
      describe string, ->
        it 'should return a Date object', ->
          date = time.parse string
          assert.instanceOf date, Date

        it 'should retain raw value', ->
          date = time.parse string
          assert.equal date.raw, string

        it 'should be marked valid', ->
          date = time.parse string
          assert.isTrue date.valid

        it 'should have ISO string value', ->
          date = time.parse string
          assert.equal date.valueOf(), '2014-06-14T18:27:33.000Z'
          assert.equal date.toString(), '2014-06-14T18:27:33.000Z'

            
  it 'should not parse garbage', ->
    date = time.parse 'garbage'
    assert.equal date.toString(), 'garbage'
    assert.equal date.raw, 'garbage'
    assert.equal date.toString(), 'garbage'
    assert.equal date.valueOf(), 'garbage'
    assert.isFalse date.valid

  it 'should parse a parsed time', ->
    date = time.parse(time.parse('06/14/2014 6:27:33 PM'))
    assert.instanceOf date, Date
    assert.equal date.toString(), '2014-06-14T18:27:33.000Z'
    assert.equal date.valueOf(), '2014-06-14T18:27:33.000Z'
    assert.equal date.raw, '06/14/2014 6:27:33 PM'
    assert.isTrue date.valid

  it 'should handle parsing a JavaScript date', ->
    now = new Date(2015, 10, 6, 11, 47, 42) # 0-based month index :-/
    parsed = time.parse(now)
    assert.instanceOf parsed, Date
    assert.deepEqual parsed.toString(), now.toISOString()
    assert.isTrue parsed.valid
    assert.equal parsed.toString(), '2015-11-06T11:47:42.000Z'
    assert.equal parsed.valueOf(), '2015-11-06T11:47:42.000Z'
    assert.equal parsed.raw, now
