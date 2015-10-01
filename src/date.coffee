_ = require('lodash')
chrono = require('chrono-node')
moment = require('moment')

parse = (string) ->
  raw = string.raw ? string
  results = chrono.parse(string.toString())

  if results.length
    parsed = moment(new Date(results[0].start.date())).startOf('day').toDate()
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
    'Mon Jun 02 2014'
    'Jun 02 2014'
    '06/02/2014'
    '2014-06-02'
  ]