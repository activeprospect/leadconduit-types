Handlebars = require('handlebars')
named = require('named-regexp').named


select = (arr, predicate) ->
  for item in arr
    retVal = predicate(item)
    return retVal if retVal?
  return [null, null, null]


class PostalCodeType

  constructor: (@raw) ->

    [ region, match, format ] = select PostalCodeType.regionCodes, (region)  =>
      handler = PostalCodeType._handlers[region]
      match = handler.regex.exec(@raw.trim())
      [ region, match, handler.format ] if match

    if match
      captures = match.captures
      for key, value of captures
        captures[key] = value[0]
      @normal = Handlebars.compile(format)(captures).toUpperCase()
      @country_code = region
      for key, value of captures
        @[key] = value?.toUpperCase() ? null
      @valid = true

    else
      @normal = @raw
      @valid = false


  toString: ->
    @normal


  valueOf: ->
    @toString()


  @regionCodes: [
    'US', # united states
    'CA', # canada
    'GB'  # uk
  ]

  @_handlers:
    US:
      regex: named /^(:<zip>\d{5})(?:(?:\s*(?:\-)?\s*)?(:<four>\d{4}))?$/i
      format: '{{zip}}{{#if four}}-{{four}}{{/if}}'
    CA:
      regex: named /^(:<fsa>(:<district>[a-z])[0-9][a-z])\s*(:<ldu>[0-9][a-z][0-9])$/i
      format: '{{fsa}} {{ldu}}'
    GB:
      regex: named /^(:<outcode>[a-z]{1,2}[0-9]{1,2}[a-z0-9]{0,1})?\s*(:<incode>[0-9][a-z]{2})$/i
      format: '{{outcode}} {{incode}}'


  @maskable: false


  @components: [
    { name: 'raw', type: 'string', description: 'Unmodified value', aggregated: false }
    { name: 'country_code', type: 'string', description: 'Country abbreviation', aggregated: true }
    { name: 'zip', type: 'string', description: 'US zip code (first 5 digits)', aggregated: true }
    { name: 'four', type: 'string', description: 'US zip code (last 4 digits)', aggregated: true }
    { name: 'fsa', type: 'string', description: 'Canadian forward sortation area', aggregated: true }
    { name: 'ldu', type: 'string', description: 'Canadian local delivery unit', aggregated: true }
    { name: 'outcode', type: 'string', description: 'Great Britain outward code', aggregated: true }
    { name: 'incode', type: 'string', description: 'Great Britain inward code', aggregated: true }
  ]


  @operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
    'includes'
    'does not include'
    'is included in'
    'is not included in'
  ]


  @examples: [
    '78751'
    '78751-4224'
    '78751 4224'
    'Q2E 4U7'
    'A11 1AA'
    'AA11A 1AA'
  ].map  (v) -> new PostalCodeType(v)




module.exports = PostalCodeType
