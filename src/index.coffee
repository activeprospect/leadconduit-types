typeNames = [
  'phone',
]


module.exports = {}

module.exports.names = typeNames

typeNames.forEach (name) ->
  module.exports[name] = require("./#{name}")


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
  else if typeof obj == 'object'
    for key, value of obj
      obj[key] = normalize(value)

  obj


module.exports.normalize = normalize
