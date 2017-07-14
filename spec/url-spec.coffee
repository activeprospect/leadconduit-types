assert = require('chai').assert
url = require('../src/types/url')


describe 'URL', ->

  it 'should not parse null', ->
    assert.isNull url.parse(null)

  it 'should not parse undefined', ->
    assert.isUndefined url.parse()

  it 'should parse a parsed url', ->
    parsed = url.parse(url.parse('http://google.com/search?q=hi'))
    assert.equal parsed.toString(), 'http://google.com/search?q=hi'
    assert.equal parsed.raw, 'http://google.com/search?q=hi'
    assert.equal parsed.host, 'google.com'
    assert.equal parsed.path, '/search'
    assert.equal parsed.query, 'q=hi'
    assert.isTrue parsed.valid

  it 'should not parse invalid', ->
    parsed =  url.parse('donkey')
    assert.equal parsed.raw, 'donkey'
    assert !parsed.valid

  it 'should have examples', ->
    assert url.examples.length

  it 'should prepend http when protocol is missing', ->
    parsed =  url.parse('donkey.com')
    assert.equal parsed.raw, 'http://donkey.com'

  it 'should prepend http when protocol is missing and slashes are at the beginning of the URL', ->
    parsed =  url.parse('//donkey.com')
    assert.equal parsed.raw, 'http://donkey.com'

  it 'should not prepend http when protocol is missing and slashes are at the beginning of the URL', ->
    parsed =  url.parse('fox://donkey.com')
    assert.equal parsed.raw, 'fox://donkey.com'


  describe 'valid values', ->

    strings = [
      'https://google.com/search?q=hi#results'
      '    HTTPS://Google.com/search?q=hi#results     '
    ]

    for string in strings
      do (string) ->
        describe "'#{string}'", ->

          beforeEach ->
            @parsed = url.parse(string)

          it 'should keep raw value', ->
            assert.equal @parsed.raw, string

          it 'should have protocol', ->
            assert.equal @parsed.protocol, 'https'

          it 'should have host', ->
            assert.equal @parsed.host, 'google.com'

          it 'should have port', ->
            assert.isNull @parsed.port

          it 'should have path', ->
            assert.equal @parsed.path, '/search'

          it 'should have query', ->
            assert.equal @parsed.query, 'q=hi'

          it 'should have query', ->
            assert.equal @parsed.hash, '#results'

          it 'should be normalized', ->
            assert.equal @parsed.valueOf(), 'https://google.com/search?q=hi#results'

          it 'should be marked valid', ->
            assert.isTrue @parsed.valid


  describe 'invalid values', ->

    strings = [
      ''
      ' '
      'http'
      'https://'
      'donkey://google.com'
      'whatever'
    ]

    for string in strings
      do (string) ->
        describe "'#{string}'", ->

          beforeEach ->
            @parsed = url.parse(string)

          it 'should keep raw value', ->
            assert.equal @parsed.raw, string

          it 'should not be valid', ->
            assert.isFalse @parsed.valid

          it 'should be normalized', ->
            assert.equal @parsed.valueOf(), string
