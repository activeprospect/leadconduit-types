_ = require('lodash')
named = require('named-regexp').named
number = require('./number')

minRegex = named /(:<min>\d+(?:\.\d+)?)\s*\+/
rangeRegex = named /(:<min>\d+(?:\.\d+)?)\s+(:<max>\d+(?:\.\d+)?)/

parse = (string) ->
  return string unless string?

  # Sanitize the string the remove non-numeric characters. The rangeRegex relies on this
  # sanitization routine in order to match range strings
  #  * replace '-' and 'to' with a space
  #  * remove anything other than digits, ., and +
  sanitized = string.replace(/-|(?:to)/, ' ').replace(/[^0-9 .+]/g, '')

  match = minRegex.exec(sanitized) or rangeRegex.exec(sanitized)
  if match
    captures = match.captures
    min = captures.min?[0]? and parseFloat(captures.min[0])
    max = captures.max?[0]? and parseFloat(captures.max[0])

    if _(min).isNumber() and _(max).isNumber()
      parsed = new String("#{min}-#{max}")
      parsed.raw = string
      parsed.avg = ((min + max) / 2).toFixed(2)
      parsed.min = min
      parsed.max = max
    else if _(min).isNumber()
      parsed = new String("#{min}+")
      parsed.raw = string
      parsed.avg = null
      parsed.min = min
      parsed.max = null
    else
      parsed = new String(string)
      parsed.raw = string
      parsed.valid = false
  else
    num = number.parse(string)
    parsed = new String(string)
    parsed.raw = string
    parsed.min = if num?.valid then num.valueOf() else null
    parsed.max = parsed.min
    parsed.avg = parsed.min
    parsed.valid = num.valid

  parsed.valid ?= true
  parsed

components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
  { name: 'normal', type: 'number', description: 'Average of max and min, rounded down to the nearest integer' }
  { name: 'max', type: 'number', description: 'Range maximum' }
  { name: 'min', type: 'number', description: 'Range minimum'}
  { name: 'avg', type: 'number', description: 'Range average'}
]


module.exports =
  parse: parse
  components: components
  maskable: false




