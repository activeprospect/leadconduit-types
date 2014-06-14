chrono = require('chrono-node')

parse = (string, options, callback) ->
  results = chrono.parse(string)
  if results.length
    result = results[0].start
    date = results[0].startDate
    parsed = new String(date.toISOString())
    parsed.raw = string
    parsed.year = result.year
    parsed.month = result.month + 1
    parsed.day = result.day
    parsed.hour = result.hour
    parsed.min = result.minute
    parsed.sec = result.second
    parsed.meridiem = result.meridiem
    parsed.wday = getWeekday(result.dayOfWeek)
  else
    parsed = new String(string)
    parsed.raw = string

  callback(null, parsed)

getWeekday = (day) ->
  if day == 0
    7
  else
    day

components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
  { name: 'year', type: 'number', description: 'Year' }
  { name: 'month', type: 'number', description: 'Month (1-12)' }
  { name: 'day', type: 'number', description: 'Day of month (1-31)' }
  { name: 'hour', type: 'number', description: 'Hour of day (0-23)' }
  { name: 'minute', type: 'number', description: 'Minute of hour (0-59)' }
  { name: 'second', type: 'number', description: 'Second of minute (0-59)' }
  { name: 'meridiem', type: 'string', description: 'Meridiem (am or pm)' }
  { name: 'wday', type: 'number', description: 'Weekday index (Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6, Sun=7)' }
]

module.exports =
  parse: parse
  components: components