assert = require('chai').assert
date = require('../src/date')

describe 'Date', ->

  it 'should return a String object', (done) ->
    date.parse 'Mon Jun 02 2014', {}, (err, date) ->
      assert.instanceOf date, String
      assert.equal date.toString(), '2014-06-02'
      done()

  it 'should parse the year', (done) ->
    date.parse 'Mon Jun 02 2014', {}, (err, date) ->
      assert.equal date.year, 2014
      done()

  it 'should parse the month', (done) ->
    date.parse 'Mon Jun 02 2014', {}, (err, date) ->
      assert.equal date.month, 6
      done()

  it 'should parse the day', (done) ->
    date.parse 'Mon Jun 02 2014', {}, (err, date) ->
      assert.equal date.day, 2
      done()

  it 'should parse the weekday', (done) ->
    date.parse 'Mon Jun 02 2014', {}, (err, date) ->
      assert.equal date.wday, 1 # monday
      done()

  it 'should not parse garbage', (done) ->
    date.parse 'garbage', {}, (err, date) ->
      assert.equal date.toString(), 'garbage'
      assert.equal date.raw, 'garbage'
      done()

