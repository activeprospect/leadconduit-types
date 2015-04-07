chrono = require('chrono-node')

pad = (val) ->
  ('00' + val).slice(-2)

parse = (string) ->
  results = chrono.parse(string.toString())
  if results.length
    date = results[0].start.date()
    month = pad(date.getMonth() + 1)
    day = pad(date.getDate())
    parsed = new String("#{date.getFullYear()}-#{month}-#{day}")
    parsed.raw = string.raw ? string
    parsed.year = date.getFullYear()
    parsed.month = date.getMonth() + 1
    parsed.day = date.getDate()
    parsed.wday = date.getDay()
    parsed.valid = true
  else
    parsed = new String(string)
    parsed.raw = string.raw ? string
    parsed.valid = false

  parsed

components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
  { name: 'year', type: 'number', description: 'Year' }
  { name: 'month', type: 'number', description: 'Month (1-12)' }
  { name: 'day', type: 'number', description: 'Day of month (1-31)' }
  { name: 'wday', type: 'number', description: 'Weekday index (Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6, Sun=7)' }
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
  ]