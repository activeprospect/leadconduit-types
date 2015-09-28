_ = require('lodash')
assert = require('chai').assert
faker = require('../src/faker')

describe 'Email', ->

  it 'should use name', ->
    email = faker.email(null, 'bob', 'jones')
    assert _.contains email, 'bob' or _.contains email, 'jones'
