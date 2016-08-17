_ = require('lodash')


class StringType

  constructor: (raw) ->
    @raw = raw

  toString: ->
    @raw.toString()

  valueOf: ->
    @toString()

  toJSON: ->
    @toString()

  aggregate: ->
    @toString()

  @components: []

  @maskable: false

  @operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'includes'
    'does not include'
    'is included in'
    'is not included in'
  ]

  @examples: [
    'some words'
  ]


module.exports = StringType
