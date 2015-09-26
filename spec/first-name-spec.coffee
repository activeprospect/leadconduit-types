assert = require('chai').assert
firstName = require('../src/first-name')

describe 'First Name', ->

  it 'should be no-op', ->
    assert.equal firstName.parse('Alex'), 'Alex'

  it 'should get example', ->
    assert firstName.example()