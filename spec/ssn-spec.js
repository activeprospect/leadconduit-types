assert = require('chai').assert
ssn = require('../lib/types/ssn')


describe 'SSN', ->


  it 'should not parse null', ->
    assert.isNull ssn.parse(null)


  it 'should not parse undefined', ->
    assert.isUndefined ssn.parse()


  it 'should have examples', ->
    assert ssn.examples.length


  describe 'Valid values', ->

    strings = [
      '123456789'
      '123-45-6789'
      '123 45 6789'
      '123.45.6789'
      ' 123-45-6789 '
      'donkey 123456789'
    ]

    for string in strings
      do (string) ->
        describe "'#{string}'", ->

          beforeEach ->
            @parsed = ssn.parse(string)

          it 'should keep raw value', ->
            assert.equal @parsed.raw, string

          it 'should have first three', ->
            assert.equal @parsed.first_three, '123'

          it 'should have second two', ->
            assert.equal @parsed.middle_two, '45'

          it 'should have last four', ->
            assert.equal @parsed.last_four, '6789'

          it 'should have masked flag', ->
            assert.isFalse @parsed.masked

          it 'should be marked valid', ->
            assert.isTrue @parsed.valid


  describe 'Invalid values', ->

    strings = [
      'abcd'
      ''
      '   '
    ]

    for string in strings
      do (string) ->
        describe "'#{string}'", ->

          beforeEach ->
            @parsed = ssn.parse(string)

          it 'should keep raw value', ->
            assert.equal @parsed.raw, string

          it 'should not have first three', ->
            assert.isUndefined @parsed.first_three

          it 'should not have second two', ->
            assert.isUndefined @parsed.middle_two

          it 'should not have last four', ->
            assert.isUndefined @parsed.last_four

          it 'should have masked flag', ->
            assert.isFalse @parsed.masked

          it 'should be marked invalid', ->
            assert.isFalse @parsed.valid


  it 'should parse a parsed ssn', ->
    parsed = ssn.parse(ssn.parse('123-12-1234'))
    assert.equal parsed.toString(), '123121234'
    assert.equal parsed.raw, '123-12-1234'
    assert.isTrue parsed.valid


