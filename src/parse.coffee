_ = require('lodash')
types = require('./types')

parse = (Ctor) ->
  (value) ->
    return value unless value?
    return value unless value.toString()
    if value instanceof Ctor
      value
    else
      new Ctor(value)

for name, Ctor of types
  Ctor.parse = parse(Ctor)
  typeName = _.snakeCase(name.replace(/Type$/, ''))
  module.exports[typeName] = Ctor.parse
