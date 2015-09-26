faker = require('./faker')

parse = (string) ->
  return string unless string?
  parsed = new String(string)
  parsed.masked = false
  parsed.valid = true
  parsed

module.exports =
  parse: parse
  components: []
  maskable: true
  operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'includes'
    'does not include'
    'is included in'
    'is not included in'
  ],
  example: faker.password