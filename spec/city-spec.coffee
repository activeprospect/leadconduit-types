assert = require('chai').assert
city = require('../src/types/city')

describe 'City', ->

  it 'should be no-op', ->
    assert.equal city.parse('Austin'), 'Austin'

  it 'should have examples', ->
    assert city.examples.length
