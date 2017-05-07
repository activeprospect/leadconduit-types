_ = require('lodash')

digit = /^\d+$/

module.exports = normalize = (obj, includeTypeMetadata = false) ->
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

      if includeTypeMetadata
        if obj instanceof Boolean
          _type = 'Boolean'
        else if obj instanceof Date
          _type = 'Date'
        else if obj instanceof Number
          _type = 'Number'
        else
          _type = 'String'
        rtn._type = _type

      for key in extendedKeys
        rtn[key] = normalize(obj[key], includeTypeMetadata)
      obj = rtn
    else if !_.isDate(obj)
      obj = obj.valueOf()
  else if obj instanceof Array
    obj = _.compact obj.map (i) ->
      normalize(i, includeTypeMetadata) unless typeof i == 'function'
  else if typeof obj == 'object'
    rtn = {}
    for key, value of obj
      continue if typeof value == 'function'
      rtn[key] = normalize(value,includeTypeMetadata)
    obj = rtn

  obj
