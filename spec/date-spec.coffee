assert = require('chai').assert
date = require('../src/date')

describe 'Date', ->

  it 'should return a String object', ->
    parsed = date.parse 'Mon Jun 02 2014'
    assert.instanceOf parsed, String
    assert.equal parsed.toString(), '2014-06-02'

  it 'should parse the year', ->
    assert.equal date.parse('Mon Jun 02 2014').year, 2014

  it 'should parse the month', ->
    assert.equal date.parse('Mon Jun 02 2014').month, 6

  it 'should parse the day', ->
    assert.equal date.parse('Mon Jun 02 2014').day, 2

  it 'should parse the weekday', ->
    assert.equal date.parse('Mon Jun 02 2014').wday, 1

  it 'should not parse garbage', ->
    parsed = date.parse 'garbage'
    assert.equal parsed.toString(), 'garbage'
    assert.equal parsed.raw, 'garbage'
