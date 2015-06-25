chrono = require('chrono-node')
moment = require('moment')

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
      moment(@getTime()).format('YYYY-MM-DD')
  else
    parsed = new String(raw)
    parsed.raw = raw
    parsed.valid = false

  parsed

components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
]

module.exports =
  parse: parse
  components: components
  maskable: false
  operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
  ]