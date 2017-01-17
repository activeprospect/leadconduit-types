module.exports =
  parse: (str) -> str
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
    'matches pattern'
    'does not match pattern'
  ]
  examples: [
    'Austin'
    'Dallas'
    'Chicago'
    'Paris'
  ]
