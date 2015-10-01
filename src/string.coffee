_ = require('lodash')

module.exports =
  parse: (string) -> string
  components: []
  maskable: false
  operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'includes'
    'does not include'
    'is included in'
    'is not included in'
  ]
  examples: [
    'some words'
  ]