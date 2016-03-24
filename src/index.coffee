_ = require 'lodash'
parse = require('./parse')
normalize = require './normalize'
mask = require './mask'

<<<<<<< 04e812869da57dca1e83a37f09e6d3b2a6b5cb9c
typeNames = [
  'boolean'
  'city'
  'credential'
  'date'
  'email'
  'first_name'
  'gender'
  'last_name'
  'number'
  'phone'
  'postal_code'
  'range'
  'ssn'
  'state'
  'street'
  'string'
  'time'
  'url'
]
=======
names = Object.keys(parse).map _.snakeCase
>>>>>>> WIP

module.exports =
  names: Object.keys(parse)
  normalize: normalize
  mask: mask
  clone: _.cloneDeep
  parse: (name, value, req) ->
    parse[name]?(value)
  isValid: (value) ->
    return true if !_.isPlainObject(value)

module.exports[name] = require("./types/#{_.kebabCase(name)}") for name in names




module.exports.expandExamples = (field) ->
  return field unless field.type
  return field unless field.examples?.length
  field.examples = _.compact field.examples.map (example) ->
    return example if field.type == 'string'
    str = (example?.raw or example)?.trim()
    return example unless str
    normalize(module.exports[field.type]?.parse(str) or str)
  field

