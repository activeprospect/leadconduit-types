_ = require('lodash')

module.exports =

  parse: (value) ->
    return value unless value?
    value.toString()

  components: []
  maskable: false
  operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'is included in'
    'is not included in'
  ]
  examples: [
    'some words'
  ]
