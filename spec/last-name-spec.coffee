assert = require('chai').assert
lastName = require('../lib/types/last_name')

describe 'Last Name', ->

  it 'should be no-op', ->
    assert.equal lastName.parse('Johnson'), 'Johnson'

  it 'should have examples', ->
    assert lastName.examples.length
