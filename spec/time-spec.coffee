assert = require('chai').assert
time = require('../src/time')

describe 'Time', ->

  tz = process.env.TZ

  before ->
    process.env.TZ = 'Europe/Amsterdam'

  after ->
    process.env.TZ = tz


  strings = [
    'Sat Jun 14 2014 13:27:33 GMT-0500 (CDT)'
    '06/14/2014 01:27:33 PM'
  ]

  for string in strings
    ( (string) ->
      describe string, ->
        it 'should return a String object', ->
          date = time.parse string
          assert.instanceOf date, String
          assert.equal date.toString(), '2014-06-14T18:27:33.000Z'
            
        it 'should parse the year', ->
          date = time.parse string
          assert.equal date.year, 2014
            
        it 'should parse the month', ->
          date = time.parse string
          assert.equal date.month, 6
            
        it 'should parse the day', ->
          date = time.parse string
          assert.equal date.day, 14
            
        it 'should parse the hour', ->
          date = time.parse string
          assert.equal date.hour, 13
            
        it 'should parse the minute', ->
          date = time.parse string
          assert.equal date.min, 27
            
        it 'should parse the second', ->
          date = time.parse string
          assert.equal date.sec, 33
            
        it 'should parse the meridiem', ->
          date = time.parse string
          assert.equal date.meridiem, 'pm'
            
        it 'should not parse garbage', ->
          date = time.parse 'garbage'
          assert.equal date.toString(), 'garbage'
          assert.equal date.raw, 'garbage'
)(string)

