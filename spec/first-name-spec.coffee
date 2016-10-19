assert = require('chai').assert
firstName = require('../src/types/first_name')

describe 'First Name', ->

  it 'should be no-op', ->
    assert.equal firstName.parse('Alex'), 'Alex'

  it 'should have examples', ->
    assert firstName.examples.length
