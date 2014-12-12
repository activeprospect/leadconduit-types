_ = require 'lodash'

typeNames = [
  'date'
  'email'
  'phone'
  'postal_code'
  'range'
  'ssn'
  'time'
]


module.exports = {}

module.exports.names = typeNames

typeNames.forEach (name) ->
  module.exports[name] = require("./#{name.replace('_', '-')}")

digit = /^\d+$/

module.exports.normalize = normalize = (obj) ->
  return obj unless obj?
  if obj instanceof String or obj instanceof Boolean or obj instanceof Number
    extendedKeys = Object.keys(obj).filter (key) ->
      !key.match(digit)

    if extendedKeys.length
      str =
        normal: obj.valueOf()
      for key in extendedKeys
        str[key] = normalize(obj[key])
      obj = str
    else
      obj = obj.valueOf()
  else if obj instanceof Array
    obj = obj.map (i) ->
      normalize(i)
  else if typeof obj == 'object'
    for key, value of obj
      obj[key] = normalize(value)

  obj


module.exports.parse = (name, value, req) ->
  # Look up the type of the field, based on its name
  type = module.exports[name] if typeNames.indexOf(name) != -1

  if type? and value?
    # Provided a type is defined, call its parse function and set the new value
    type.parse value, req
  else
    value


module.exports.mask = mask = (obj, doMask=false) ->
  return obj unless obj?
  if obj instanceof Array
    obj = obj.map (i) ->
      mask(i, doMask)
  else if typeof obj == 'object'
    if obj.masked == false and (obj instanceof String or obj instanceof Boolean or obj instanceof Number)
      str = new String(mask(obj.toString(), true))
      for key, value of obj
        continue if key == 'valid'
        str[key] = mask(value, true) unless key.match(digit)
      str.masked = true
      obj = str
    else
      for key, value of obj
        continue if key == 'valid'
        obj[key] = mask(value, obj.masked? or doMask)
      obj.masked = true if obj.masked?
  else if _.isString(obj) or _.isNumber(obj)
    obj = obj.toString().replace(/./g, '*') if doMask
  else if _.isBoolean(obj)
    obj = '*' if doMask
  else
    throw "Don't know how to mask #{obj}"
  obj


module.exports.isValid = (value) ->
  return true unless _.isPlainObject(value)



