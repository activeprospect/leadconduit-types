_ = require('lodash')

digit = /^\d+$/

module.exports = normalize = (obj) ->
  return obj unless obj?

  if obj instanceof String or obj instanceof Boolean or obj instanceof Number or obj instanceof Date
    extendedKeys = Object.keys(obj).filter (key) ->
      !key.match(digit) and typeof obj[key] != 'function'

    if extendedKeys.length
      normal =
        if _.isDate(obj)
          new Date(obj.getTime())
        else
          obj.valueOf()
      rtn = { normal: normal }
      for key in extendedKeys
        rtn[key] = normalize(obj[key])
      obj = rtn
    else if !_.isDate(obj)
      obj = obj.valueOf()
  else if obj instanceof Array
    obj = _.compact obj.map (i) ->
      normalize(i) unless typeof i == 'function'
  else if typeof obj == 'object'
    rtn = {}
    for key, value of obj
      continue if typeof value == 'function'
      rtn[key] = normalize(value)
    obj = rtn

  obj
