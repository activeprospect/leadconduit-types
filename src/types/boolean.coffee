_ = require('lodash')
number = require('./number')

class BooleanType
  @_parse: (value) ->
    switch value
      when 'y', 'yes', 'true', 't', '1' then true
      when 'n', 'no', 'false', 'f', '0' then false

  constructor: (@raw) ->
    @normal =
      if _.isBoolean(@raw)
        @raw.valueOf()
      else if _.isString(@raw)
        sanitized = @raw.replace?(/[^a-z0-9]/ig, '').toLowerCase()
        BooleanType._parse(sanitized)
      else if _.isNumber(@raw)
        BooleanType._parse(@raw.toString())
      else
        @raw

    @valid = _.isBoolean(@normal)
    @normal ?= false

  valueOf: ->
    @normal

  toString: ->
    @normal.toString()

  @maskable: false

  @components: []

  @operators: [
    'is true'
    'is false'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
  ]

  @examples: [
    'true'
    'false'
    'T'
    'F'
    '1'
    '0'
    'Y'
    'N'
  ].map (v) -> new BooleanType(v)


module.exports = BooleanType
