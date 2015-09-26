_ = require('lodash')
assert = require('chai').assert
state = require('../src/state')


describe 'State', ->

  it 'should not parse null', ->
    assert.isNull state.parse(null)

  it 'should not parse undefined', ->
    assert.isUndefined state.parse()

  it 'should parse a parsed state', ->
    parsed = state.parse(state.parse('TX'))
    assert.equal parsed.toString(), 'TX'
    assert.equal parsed.raw, 'TX'
    assert.equal parsed.name, 'Texas'
    assert.isTrue parsed.valid

  it 'should get example', ->
    assert state.parse(state.example())


  describe 'valid values', ->

    strings = [
      'TX'
      'Texas'
      'tx'
      'texas'
    ]

    for string in strings
      do (string) ->
        describe "'#{string}'", ->

          beforeEach ->
            @parsed = state.parse(string)

          it 'should keep raw value', ->
            assert.equal @parsed.raw, string

          it 'should have name', ->
            assert.equal @parsed.name, 'Texas'

          it 'should have abbr', ->
            assert.equal @parsed.valueOf(), 'TX'

          it 'should be marked valid', ->
            assert.isTrue @parsed.valid


  describe 'unknown states', ->

    strings = [
      'DX'
      ''
      '  '
      'Dexus'
      'DEXUS NEXUS'
    ]

    for string in strings
      do (string) ->
        describe "'#{string}'", ->

          beforeEach ->
            @parsed = state.parse(string)

          it 'should keep raw value', ->
            assert.equal @parsed.raw, string

          it 'should have normalized name', ->
            assert.equal @parsed.name, string

          it 'should be marked valid', ->
            # There's no such thing as an invalid state right now because we really only provide
            # extra metadata for the 50 united states
            assert.isTrue @parsed.valid

