_ = require 'lodash'
normalize = require('./normalize')
aggregate = require('./aggregate')
types = require('./types')
digit = /^\d+$/

module.exports.names = typeNames = Object.keys(types)

for name, type of types
  module.exports[name] = type

module.exports.normalize = normalize
module.exports.aggregate = aggregate

module.exports.parse = (name, value, req) ->
  # Look up the type of the field, based on its name
  fieldType = module.exports[name] if typeNames.indexOf(name) != -1

  if fieldType? and value?
    if fieldType.components?.length and value.valid?
      # the value already has components, so parsing isn't necessary
      return value
    else
      # call its parse function and set the new value
      fieldType.parse value, req
  else
    value


module.exports.mask = mask = (obj, doMask=false) ->
  return obj unless obj?
  if obj instanceof Array
    obj = obj.map (i) ->
      mask(i, doMask)
  else if typeof obj == 'object'
    if obj.masked == false and (obj instanceof String or obj instanceof Boolean or obj instanceof Number or obj instanceof Date)
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
  else if _.isString(obj) or _.isNumber(obj) or _.isDate(obj)
    obj = obj.toString().replace(/./g, '*') if doMask
  else if _.isBoolean(obj)
    obj = '*' if doMask
  else if _.isFunction(obj)
    undefined
  else
    throw "Don't know how to mask #{obj}"
  obj

clone = (vars) ->
  if _.isArray(vars)
    vars.map (v) ->
      clone(v)
  else if vars instanceof String
    str = new String(vars.toString())
    for name, value of vars
      str[name] = value unless name.match(digit)
    str
  else if vars instanceof Number or vars instanceof Boolean or vars instanceof Date
    obj = new vars.constructor(vars.valueOf())
    for name, value of vars
      obj[name] = value
    obj
  else if _.isNumber(vars) or _.isBoolean(vars)
    vars.valueOf()
  else if _.isDate(vars)
    new Date(vars.getTime())
  else if _.isFunction(vars)
    vars
  else if vars instanceof Object
    obj = {}
    for name, value of vars
      obj[name] = clone(value)
    obj
  else
    vars

module.exports.clone = clone

module.exports.isValid = (value) ->
  return true unless _.isPlainObject(value)

module.exports.expandExamples = (field) ->
  return field unless field.type
  return field unless field.examples?.length
  field.examples = _.compact field.examples.map (example) ->
    return example if field.type == 'string'
    str = (example?.raw or example)?.trim()
    return example unless str
    normalize(module.exports[field.type]?.parse(str) or str)
  field

