assert = require('chai').assert
range = require('../src/range')
number = require('../src/number')
date = require('../src/date')
time = require('../src/time')


describe 'Range', ->

  it 'should support dash separator', ->
    r = range.parse '1 - 10'
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '1 - 10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5
    assert.isTrue r.valid

  it 'should support "to" separator', ->
    r = range.parse '1 to 10'
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '1 to 10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5
    assert.isTrue r.valid

  it 'should support arbitrary spaces in separator', ->
    r = range.parse '1     to      10'
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '1     to      10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5
    assert.isTrue r.valid

  it 'should support greater than range', ->
    r = range.parse '10+'
    assert.equal r.toString(), '10+'
    assert.equal r.raw, '10+'
    assert.equal r.min, 10
    assert.isNull r.max
    assert.isNull r.avg
    assert.isTrue r.valid

  it 'should support greater than range with decimal', ->
    r = range.parse '10.5+'
    assert.equal r.toString(), '10.5+'
    assert.equal r.raw, '10.5+'
    assert.equal r.min, 10.5
    assert.isNull r.max
    assert.isNull r.avg
    assert.isTrue r.valid

  it 'should support single integer string', ->
    r = range.parse '10'
    assert.equal r.toString(), '10'
    assert.equal r.raw, '10'
    assert.equal r.min, 10
    assert.equal r.max, 10
    assert.equal r.avg, 10
    assert.isTrue r.valid

  it 'should support single integer', ->
    r = range.parse 10
    assert.equal r.toString(), '10'
    assert.equal r.raw, '10'
    assert.equal r.min, 10
    assert.equal r.max, 10
    assert.equal r.avg, 10
    assert.isTrue r.valid

  it 'should support single decimal strings', ->
    r = range.parse '5.5'
    assert.equal r.toString(), '5.5'
    assert.equal r.raw, '5.5'
    assert.equal r.min, 5.5
    assert.equal r.max, 5.5
    assert.equal r.avg, 5.5
    assert.isTrue r.valid

  it 'should support single decimal strings', ->
    r = range.parse 5.5
    assert.equal r.toString(), '5.5'
    assert.equal r.raw, '5.5'
    assert.equal r.min, 5.5
    assert.equal r.max, 5.5
    assert.equal r.avg, 5.5
    assert.isTrue r.valid

  it 'should support arbitrary leading space', ->
    r = range.parse '      1 to 10'
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '      1 to 10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5
    assert.isTrue r.valid

  it 'should support missing delimiter', ->
    r = range.parse '1 10'
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '1 10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5
    assert.isTrue r.valid

  it 'should support arbitrary trailing space', ->
    r = range.parse '1 to 10     '
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '1 to 10     '
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5
    assert.isTrue r.valid

  it 'should ignore currency characters', ->
    r = range.parse '$1 to $10'
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '$1 to $10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5
    assert.isTrue r.valid

  it 'should ignore commas in numbers', ->
    r = range.parse '$1,000 to $10,000'
    assert.equal r.toString(), '1000-10000'
    assert.equal r.raw, '$1,000 to $10,000'
    assert.equal r.min, 1000
    assert.equal r.max, 10000
    assert.equal r.avg, 5500
    assert.isTrue r.valid

  it 'should support ranges with decimals', ->
    r = range.parse '999.95 to 10000.95'
    assert.equal r.toString(), '999.95-10000.95'
    assert.equal r.raw, '999.95 to 10000.95'
    assert.equal r.min, 999.95
    assert.equal r.max, 10000.95
    assert.equal r.avg, 5500.45
    assert.isTrue r.valid

  it 'should handle invalid string', ->
    r = range.parse 'asdf'
    assert.equal r.toString(), 'asdf'
    assert.equal r.raw, 'asdf'
    assert.isNull r.min
    assert.isNull r.max
    assert.isNull r.avg
    assert.isFalse r.valid
  
  it 'should parse 0 as min and max', ->
    r = range.parse '0'
    assert.equal r.toString(), '0'
    assert.equal r.raw, '0'
    assert.equal r.min, 0
    assert.equal r.max, 0
    assert.equal r.avg, 0
    assert.isTrue r.valid

  it 'should parse a parsed range', ->
    r = range.parse(range.parse('1 - 10'))
    assert.equal r.toString(), '1-10'
    assert.equal r.raw, '1 - 10'
    assert.equal r.min, 1
    assert.equal r.max, 10
    assert.equal r.avg, 5.5
    assert.isTrue r.valid

  it 'should parse a parsed number', ->
    r = range.parse(number.parse('4'))
    assert.equal r.toString(), '4'
    assert.equal r.raw, '4'
    assert.equal r.min, 4
    assert.equal r.max, 4
    assert.equal r.avg, 4
    assert.isTrue r.valid

  it 'should parse a date string', ->
    r = range.parse('2015-07-25')
    assert.equal r.toString(), '1437782400000'
    assert.equal r.raw, '2015-07-25'
    assert.equal r.min, 1437782400000
    assert.equal r.max, 1437782400000
    assert.equal r.avg, 1437782400000
    assert.isTrue r.valid

  it 'should parse a parsed date', ->
    r = range.parse(date.parse('2015-07-25'))
    assert.equal r.toString(), '1437782400000'
    assert.equal r.raw, '2015-07-25'
    assert.equal r.min, 1437782400000
    assert.equal r.max, 1437782400000
    assert.equal r.avg, 1437782400000
    assert.isTrue r.valid

  it 'should parse a time string', ->
    r = range.parse('2015-07-25T01:59:32.021Z')
    assert.equal r.toString(), '1437789572021'
    assert.equal r.raw, '2015-07-25T01:59:32.021Z'
    assert.equal r.min, 1437789572021
    assert.equal r.max, 1437789572021
    assert.equal r.avg, 1437789572021
    assert.isTrue r.valid

  it 'should parse a parsed time', ->
    r = range.parse(time.parse('2015-07-25T01:59:32.021Z'))
    assert.equal r.toString(), '1437789572021'
    assert.equal r.raw, '2015-07-25T01:59:32.021Z'
    assert.equal r.min, 1437789572021
    assert.equal r.max, 1437789572021
    assert.equal r.avg, 1437789572021
    assert.isTrue r.valid

  it 'should parse a date range string', ->
    r = range.parse('2015-07-01 - 2015-07-25')
    assert.equal r.toString(), '1435708800000-1437782400000'
    assert.equal r.raw, '2015-07-01 - 2015-07-25'
    assert.equal r.min, 1435708800000
    assert.equal r.max, 1437782400000
    assert.equal r.avg, 1436745600000
    assert.isTrue r.valid

  it 'should parse the first two matches of a date range string', ->
    r = range.parse('2015-07-01 - 2015-07-25 - 2015-07-30')
    assert.equal r.toString(), '1435708800000-1437782400000'
    assert.equal r.min, 1435708800000
    assert.equal r.max, 1437782400000
    assert.equal r.avg, 1436745600000
    assert.isTrue r.valid

  it 'should parse a time range string', ->
    r = range.parse('2015-07-01T01:59:32.022Z - 2015-07-25T01:59:32:021Z')
    assert.equal r.toString(), '1435715972022-1437782400000'
    assert.equal r.raw, '2015-07-01T01:59:32.022Z - 2015-07-25T01:59:32:021Z'
    assert.equal r.min, 1435715972022
    assert.equal r.max, 1437782400000
    assert.equal r.avg, 1436749186011
    assert.isTrue r.valid

  it 'should parse the first two matches of a time range string', ->
    r = range.parse('2015-07-01T01:59:32.022Z - 2015-07-25T01:59:32:021Z - 2015-07-30T01:59:32:021Z')
    assert.equal r.toString(), '1435715972022-1437782400000'
    assert.equal r.min, 1435715972022
    assert.equal r.max, 1437782400000
    assert.equal r.avg, 1436749186011
    assert.isTrue r.valid


