
chrono = require('chrono-node')
moment = require('moment')

parse = (string) ->
  results = chrono.parse(string)
  if results.length
    result = results[0].start
    date = moment(results[0].startDate)
    parsed = new String(date.format('YYYY-MM-DD'))
    parsed.raw = string
    parsed.year = result.year
    parsed.month = result.month + 1
    parsed.day = result.day
    parsed.wday = date.isoWeekday()
    parsed.valid = true
  else
    parsed = new String(string)
    parsed.raw = string
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