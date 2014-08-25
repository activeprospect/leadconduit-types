

typeNames = [
  'date'
  'email'
  'number'
  'phone'
  'postal_code'
  'range'
  'time'
]


module.exports = {}

module.exports.names = typeNames

typeNames.forEach (name) ->
  module.exports[name] = require("./#{name.replace('_', '-')}")


digit = /^\d+$/

normalize = (obj) ->
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


module.exports.normalize = normalize


module.exports.parse = (name, value, req) ->
  # Look up the type of the field, based on its name
  type = module.exports[name] if typeNames.indexOf(name) != -1

  if type? and value?
    # Provided a type is defined, call its parse function and set the new value
    type.parse value, req
  else
    value

