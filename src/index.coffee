_ = require 'lodash'
parse = require('./parse')
normalize = require './normalize'
mask = require './mask'


names = Object.keys(parse).map _.snakeCase


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
    module.exports[field.type]?.parse(str) ? str
  field

