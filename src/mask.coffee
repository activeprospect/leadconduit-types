_ = require('lodash')
types = require('./types')


mask = (obj) ->
  if _.isArray(obj)
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
  else if !obj?
    obj
  else
    console.log "don't know how to mask #{obj}"
    throw "Don't know how to mask #{obj}"

module.exports = (obj) ->
  if types[obj?.constructor.name] and obj?.masked == false
    # masking required
    for own key, value of obj
      continue if key == 'valid'
      obj[key] = mask(value)
    obj.masked = true
    obj
  else if _.isArray(obj)
    obj.map(module.exports)
  else if _.isPlainObject(obj)
    for own key, value of obj
      obj[key] = module.exports(value)
    obj
  else
    obj


