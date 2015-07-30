assert = require('chai').assert
types = require('../src/index')

supportedOperators = [
  'does not include'
  'format is invalid'
  'format is valid'
  'includes'
  'is blank'
  'is equal to'
  'is false'
  'is format invalid'
  'is format valid'
  'is greater than or equal to'
  'is greater than'
  'is included in'
  'is less than or equal to'
  'is less than'
  'is not blank'
  'is not equal to'
  'is not included in'
  'is true'
  'is between'
  'is not between'
]

describe 'Operators', ->
  for name in types.names

    it "#{name} type should only allow valid operators", ->
      for op in types[name].operators
        assert supportedOperators.indexOf(op) >= 0, "The #{op} operator is not supported by LeadConduit"

  
    