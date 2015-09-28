_ = require('lodash')

parse = (string) ->
  return string unless string?

  number =
    if _.isNumber(string)
      new Number(string)
    else if _.isString(string)
      sanitized = string.replace?(/[^\d.]/g, '')
      if sanitized?.length
        new Number(sanitized)
      else
        new Number('NaN')
    else
      new Number('NaN')

  number.valid = !isNaN(number)
  number.raw = string.raw ? string
  number


module.exports =
  parse: parse
  components: []
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
  ],
  example: ->
    _.random(1, 9999)