module.exports =
  parse: (str) -> str
  components: []
  maskable: false
  operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'matches pattern'
    'does not match pattern'
    'includes'
    'does not include'
    'is included in'
    'is not included in'
  ]
  examples: [
    'Jones'
    'Campbell'
    'Smith'
  ]
