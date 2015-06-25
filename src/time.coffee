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

module.exports =
  parse: parse
  components: components
  operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
  ]