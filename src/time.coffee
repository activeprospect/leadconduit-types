chrono = require('chrono-node')

parse = (string) ->
  raw = string.raw ? string
  results = chrono.parse(string.toString())
  if results.length
    date = results[0].start.date()
    parsed = new String(date.toISOString())
    parsed.raw = raw
    parsed.year = date.getFullYear()
    parsed.month = date.getMonth() + 1
    parsed.day = date.getDate()
    parsed.hour = date.getHours()
    parsed.min = date.getMinutes()
    parsed.sec = date.getSeconds()
    parsed.meridiem = if date.getHours() <= 11 then 'am' else 'pm'
    parsed.wday = getWeekday(date.getDay())
    parsed.valid = true
  else
    parsed = new String(string)
    parsed.raw = raw
    parsed.valid = false

  parsed

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