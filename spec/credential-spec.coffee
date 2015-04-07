assert = require('chai').assert
credential = require('../src/credential')


describe 'Credential', ->


  it 'should not parse null', ->
    assert.isNull credential.parse(null)


  it 'should not parse undefined', ->
    assert.isUndefined credential.parse()


  it 'should be valid', ->
    assert.isTrue credential.parse('hi').valid


  it 'should not be masked', ->
    assert.isFalse credential.parse('hi').masked