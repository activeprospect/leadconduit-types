faker = require('./faker')

module.exports =
  parse: (str) -> str
  components: []
  maskable: false
  operators: [
    'is blank'
    'is not blank'
  ]
  example: faker.lastName