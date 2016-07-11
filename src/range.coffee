_ = require('lodash')
named = require('named-regexp').named
number = require('./number')
normalize = require('./normalize')

minRegex = named /(:<min>-?\d+(?:\.\d+)?)\s*\+/                       # e.g., '10+', '-5.5+'
rangeRegex = named /(:<min>-?\d+(?:\.\d+)?)\s+(:<max>\d+(?:\.\d+)?)/  # e.g., '1-6', '2 to 7', '-8 - 100.5'
isoDateRegex = /\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}\.\d{1,3}Z)?/g

parse = (string) ->
  return string unless string?

  # Don't re-parse parsed ranges, overwriting the original raw value
  string = string.toString() unless string.replace?

  raw = string.raw ? string

  if string.match(isoDateRegex)
    parts = []

    while (m = isoDateRegex.exec(string)) != null
      parts.push m[0]

    getTime = (s) ->
      new Date(s).getTime().toString()

    string = _.take(parts.map(getTime), 2).join('-')

  # Sanitize the string the remove non-numeric characters. The rangeRegex relies on this
  # sanitization routine in order to match range strings
  #  * replace '-' and 'to' with a space
  #  * remove anything other than digits, ., and +
  sanitized = string.replace(/(.+)-|(?:to)/, '$1 ').replace(/[^-0-9 .+]/g, '')

  match = minRegex.exec(sanitized) or rangeRegex.exec(sanitized)
  if match
    captures = match.captures
    min = captures.min?[0]? and parseFloat(captures.min[0])
    max = captures.max?[0]? and parseFloat(captures.max[0])

    if _(min).isNumber() and _(max).isNumber()
      parsed = new String("#{min}-#{max}")
      parsed.raw = raw
      parsed.avg = parseFloat(((min + max) / 2).toFixed(2))
      parsed.mid = parseInt((min + max) / 2)
      parsed.min = min
      parsed.max = max
    else if _(min).isNumber()
      parsed = new String("#{min}+")
      parsed.raw = raw
      parsed.avg = null
      parsed.mid = null
      parsed.min = min
      parsed.max = null
    else
      parsed = new String(string)
      parsed.raw = string
      parsed.valid = false
  else
    num = number.parse(string)
    parsed = new String(string)
    parsed.raw = raw
    parsed.min = if num?.valid then num.valueOf() else null
    parsed.max = parsed.min
    parsed.avg = parsed.min
    parsed.mid = parsed.min
    parsed.valid = num.valid

  parsed.valid ?= true
  parsed

components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
  { name: 'mid', type: 'number', description: 'Average of max and min, rounded down to the nearest whole number' }
  { name: 'max', type: 'number', description: 'Highest number in range' }
  { name: 'min', type: 'number', description: 'Lowest number in range'}
  { name: 'avg', type: 'number', description: 'Average of min and max'}
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
    'includes'
    'does not include'
    'is included in'
    'is not included in'
  ]
  examples: [
    '100 to 200'
    '100 - 200'
    '100+'
    '100'
  ].map(parse).map(normalize)







