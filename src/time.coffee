_ = require('lodash')
moment = require('moment')
chrono = require('chrono-node')

parse = (string) ->
  raw = string.raw ? string
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


exampleFormats = [
  moment.defaultFormat
  'MMMM Do YYYY, h:mm:ss a'
  'MM/DD/YYYY h:mm a'
  'LLL'
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
  example: ->
    moment().format(exampleFormats[_.random(0, exampleFormats.length - 1)])