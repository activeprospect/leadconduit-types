_ = require('lodash')
moment = require('moment')
chrono = require('chrono-node')
normalize = require('../normalize')

parse = (string) ->
  raw = string?.raw?.toString() ? string
  results = chrono.parse(string.toString())
  if results.length
    parsed = new Date(results[0].start.date())
    parsed.raw = raw
    parsed.valid = true
    parsed.valueOf = ->
      @toString()
    parsed.toString = ->
      @toISOString()
  else
    parsed = new String(raw)
    parsed.raw = raw
    parsed.valid = false
    parsed.valueOf = ->
      raw
    parsed.toString = ->
      raw
  parsed


components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
]

module.exports =
  parse: parse
  components: components
  operators: [
    'is equal to'
    'is not equal to'
    'is less than'
    'is less than or equal to'
    'is greater than'
    'is greater than or equal to'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
    'is between'
    'is not between'
  ]
  examples: [
    'Sat Jun 14 2015 13:27:33 GMT-0500 (CDT)'
    '06/14/2015 6:27:33 PM'
    '2015-06-14T18:27:33Z'
    '2015-06-14T18:27:33.000Z'
  ].map(parse).map(normalize)
