_ = require('lodash')
types = require('./types')

parse = (Ctor) ->
  (value) ->
    return value unless value?
    return value unless value.toString()
    if Ctor == types.String
      console.log 'new', 'String', '->', typeof value, value
      types.String(value)
    else if value instanceof Ctor
      console.log 'existing', Ctor.name, '->', typeof value, value
      value
    else
      console.log 'new', Ctor.name, '->', typeof value,  value, new Ctor(value)
      new Ctor(value)

for name, Ctor of types
  Ctor.parse = parse(Ctor)
  typeName = _.snakeCase(name.replace(/Type$/, ''))
  module.exports[typeName] = Ctor.parse
