_ = require('lodash')
named = require('named-regexp').named
NumberType = require('./number')


minRegex = named /(:<min>-?\d+(?:\.\d+)?)\s*\+/                       # e.g., '10+', '-5.5+'
rangeRegex = named /(:<min>-?\d+(?:\.\d+)?)\s+(:<max>\d+(?:\.\d+)?)/  # e.g., '1-6', '2 to 7', '-8 - 100.5'
isoDateRegex = /\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}\.\d{1,3}Z)?/g


class RangeType

  constructor: (@raw) ->

    string = @raw.toString()

    if string.match(isoDateRegex)
      parts = []
      while (m = isoDateRegex.exec(string)) != null
        parts.push m[0]
      string = _(parts)
        .map (p) -> new Date(p).getTime().toString()
        .take 2
        .join '-'


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
        @normal = "#{min}-#{max}"
        @avg = parseFloat(((min + max) / 2).toFixed(2))
        @min = min
        @mid = parseInt((min + max) / 2)
        @max = max
      else if _(min).isNumber()
        @normal = "#{min}+"
        @avg = null
        @min = min
        @mid = null
        @max = null
      else
        @normal = @raw
        @valid = false
    else
      num = new NumberType(string)
      @normal = if num.valid then num.normal else @raw
      @min = if num.valid then num.valueOf() else null
      @max = @min
      @mid = @min
      @avg = @min
      @valid = num.valid

    @valid ?= true


  toString: ->
    @toValue()


  toValue: ->
    @normal


  aggregate: ->
    return unless @valid
    _.pick @, 'min', 'max', 'mid', 'avg'


  @components: [
    { name: 'raw', type: 'string', description: 'Unmodified value', aggregated: false }
    { name: 'max', type: 'number', description: 'Range maximum', aggregated: true  }
    { name: 'min', type: 'number', description: 'Range minimum', aggregated: true }
    { name: 'mid', type: 'number', description: 'Average of max and min, rounded down to the nearest whole number' }
    { name: 'avg', type: 'number', description: 'Average of max and min, rounded down to the nearest integer', aggregated: true }
  ]

  @maskable: false

  @operators: [
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

  @examples: [
    '100 to 200'
    '100 - 200'
    '100+'
    '100'
  ].map (v) -> new RangeType(v)



module.exports = RangeType
