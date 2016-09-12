

class GenderType

  constructor: (@raw) ->
    @normal =
      switch @raw.toString().toLowerCase().trim()
        when 'm', 'male' then 'male'
        when 'f', 'female' then 'female'
        when 'o', 'other' then 'other'

    @abbr =
      switch @normal
        when 'male' then 'M'
        when 'female' then 'F'
        when 'other' then 'O'
        else null

    @valid = @normal?
    @normal ?= @raw


  aggregate: ->
    name: @normal
    valid: @valid


  valueOf: ->
    @normal

  toString: ->
    @normal

  @components: [
    { name: 'raw', type: 'string', description: 'Unmodified value'}
    { name: 'abbr', type: 'string', description: 'Abbreviated name of gender: M, F, or O'}
  ]

  @maskable: false

  @operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
  ]

  @examples: [
    'male'
    'female'
    'other'
    'M'
    'F'
    'O'
  ].map (v) -> new GenderType(v)



module.exports = GenderType
