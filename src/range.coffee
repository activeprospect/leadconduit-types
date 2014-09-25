_ = require('lodash')
named = require('named-regexp').named

minRegex = named /(:<min>\d+)\s*\+/
rangeRegex = named /(:<min>\d+)\s*(?:\-|to|\s+)\s*(:<max>\d+)/

parse = (string) ->
  return string unless string?

  match = minRegex.exec(string) or rangeRegex.exec(string)
  if match
    captures = match.captures
    min = captures.min?[0]? and parseFloat(captures.min[0])
    max = captures.max?[0]? and parseFloat(captures.max[0])

    if _(min).isNumber() and _(max).isNumber()
      parsed = new String("#{min}-#{max}")
      parsed.raw = string
      parsed.avg = (min + max) / 2
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
    num = parseFloat(string)
    num = null if isNaN(num)
    parsed = new String(string)
    parsed.raw = string
    parsed.min = num
    parsed.max = num
    parsed.avg = num

  parsed.valid ?= true
  parsed


components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
  { name: 'normal', type: 'number', description: 'Average of max and min, rounded down to the nearest integer' }
  { name: 'max', type: 'number', description: 'Range maximum' }
  { name: 'min', type: 'number', description: 'Range minimum'}
]


module.exports =
  parse: parse
  components: components
  maskable: false




