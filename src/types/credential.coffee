normalize = require('./../normalize')


class CredentialType

  constructor: (@raw) ->
    @masked = false
    @valid = true

  toString: ->
    @raw

  valueOf: ->
    @toString()

  @maskable: true

  @components: []

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
    'sekret-pazzward'
    'befa4e7379d81173dfe8d1a53deaf591'
    '483571ec0724b4c3243bdf142c8e75c99cae90ac'
  ].map (v) -> new CredentialType(v)


module.exports = CredentialType
