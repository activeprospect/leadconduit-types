assert = require('chai').assert
lastName = require('../src/last-name')

describe 'Last Name', ->

  it 'should be no-op', ->
    assert.equal lastName.parse('Johnson'), 'Johnson'

  it 'should have examples', ->
    assert lastName.examples.length
