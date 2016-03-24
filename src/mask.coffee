_ = require('lodash')
types = require('./types')


module.exports = mask = (obj) ->
  if types[obj.constructor.name]
    for own key, value of obj
      continue if key == 'valid'
      obj[key] = mask(value)
    obj.masked = true
    obj
  else if _.isArray(obj)
    obj.map(mask)
  else if _.isPlainObject(obj)
    for own key, value of obj
      obj[key] = mask(value)
    obj
  else if _.isString(obj) or _.isNumber(obj) or _.isDate(obj)
    obj.toString().replace(/./g, '*')
  else if _.isBoolean(obj)
   '*'
  else if _.isFunction(obj)
    obj
  else
    throw "Don't know how to mask #{obj}"
