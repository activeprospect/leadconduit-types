_ = require('lodash')
phoneUtil = require('libphonenumber').phoneUtil
normalize = require('./normalize')


parseRegex = /^(\S+)\s+(.+)$/

parse = (string) ->

  addr = string.trim().match(parseRegex)

  if addr?
    parsed = new String(string.trim())
    parsed.raw = string.raw ? string
    parsed.street_number = addr[1]
    parsed.street_name = addr[2]
    parsed.valid = true
  else
    parsed = new String(string)
    parsed.raw = string.raw ? string
    parsed.valid = false

  parsed


module.exports =
  parse: parse
  components: [
    { name: 'raw', type: 'string', description: 'Unmodified value' }
    { name: 'street_number', type: 'string', description: 'Street Number' }
    { name: 'street_name', type: 'string', description: 'Street Name' }
  ]
  maskable: false
  operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
    'includes'
    'does not include'
    'is included in'
    'is not included in'
  ],
  examples: [
    '4203 Guadalupe St',
    '00283 Ondricka Street',
    '0746 Monahan Islands',
    '73398 Tomas Club'
  ].map(parse).map(normalize)