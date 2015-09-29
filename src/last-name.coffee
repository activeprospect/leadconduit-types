faker = require('faker')

module.exports =
  parse: (str) -> str
  components: []
  maskable: false
  operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
  ]
  example: faker.lastName