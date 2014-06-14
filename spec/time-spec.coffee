assert = require('chai').assert
time = require('../src/time')

describe 'Time', ->


  strings = [
    'Sat Jun 14 2014 13:27:33 GMT-0500 (CDT)'
    '06/14/2014 01:27:33 PM'
  ]

  for string in strings
    ( (string) ->
      describe string, ->
        it 'should return a String object', (done) ->
          time.parse string, {}, (err, date) ->
            assert.instanceOf date, String
            assert.equal date.toString(), '2014-06-14T18:27:33.000Z'
            done()

        it 'should parse the year', (done) ->
          time.parse string, {}, (err, date) ->
            assert.equal date.year, 2014
            done()

        it 'should parse the month', (done) ->
          time.parse string, {}, (err, date) ->
            assert.equal date.month, 6
            done()

        it 'should parse the day', (done) ->
          time.parse string, {}, (err, date) ->
            assert.equal date.day, 14
            done()

        it 'should parse the hour', (done) ->
          time.parse string, {}, (err, date) ->
            assert.equal date.hour, 13
            done()

        it 'should parse the minute', (done) ->
          time.parse string, {}, (err, date) ->
            assert.equal date.min, 27
            done()

        it 'should parse the second', (done) ->
          time.parse string, {}, (err, date) ->
            assert.equal date.sec, 33
            done()

        it 'should parse the meridiem', (done) ->
          time.parse string, {}, (err, date) ->
            assert.equal date.meridiem, 'pm'
            done()

#        it 'should parse the weekday', (done) ->
#          time.parse string, {}, (err, date) ->
#            console.log(date)
#            assert.equal date.wday, 6 # saturday
#            done()

        it 'should not parse garbage', (done) ->
          time.parse 'garbage', {}, (err, date) ->
            assert.equal date.toString(), 'garbage'
            assert.equal date.raw, 'garbage'
            done()
    )(string)

