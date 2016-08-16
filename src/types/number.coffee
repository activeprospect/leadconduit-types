_ = require('lodash')

class NumberType

  constructor: (@raw) ->
    @normal =
      if _.isNumber(@raw)
        @raw
      else if _.isString(@raw)
        sanitized = @raw.replace?(/[^-\d.]/g, '')
        if sanitized?.length
          new Number(sanitized).valueOf()
        else
          parseInt('NaN')
      else
        parseInt('NaN')

    @valid = !isNaN(@normal)

  toString: ->
    @normal.toString()

  valueOf: ->
    @normal

  @components: []

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
    '100'
    '100.999'
    '$100.99'
    '1,000'
    '1,000.00'
  ].map (v) -> new NumberType(v)


module.exports = NumberType
