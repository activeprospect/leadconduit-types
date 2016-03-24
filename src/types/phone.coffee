_ = require('lodash')
phoneUtil = require('libphonenumber').phoneUtil
hintRegex = /\s*[(]?([hwcm])[)]?$/
regionCode = 'US'


class PhoneType

  constructor: (@raw) ->

    number = @_parseNumber()

    if number
      @type = @_parseType()
      @raw = @raw.replace(hintRegex, '')
      @prefix = phoneUtil.getNddPrefixForRegion(regionCode, true)
      @normal = phoneUtil.getNationalSignificantNumber(number)
      @country_code = regionCode

      areaLength = phoneUtil.getLengthOfNationalDestinationCode(number)

      if areaLength > 0
        @area = @normal.substring(0, areaLength)
        @number = @normal.substring(areaLength)
      else
        @area = null
        @number = @normal.substring(areaLength)

      @extension = number.getExtension()

      mask = @_buildMask()
      masked = mask.indexOf(true) >= 0
      if masked
        @masked = true
        ext = if @extension then "x#{@extension}" else ''

        if @area
          @area = PhoneType._asterisk("#{@area}#{@number}#{ext}", mask).substring(0, @area.length)

        if @normal
          @normal = PhoneType._asterisk("#{@normal}#{ext}", mask)

        if @number
          @number = PhoneType._asterisk("#{@number}#{ext}", mask)


      @exchange = @number.substring(0, 3)
      @line = @number.substring(3)
      @valid = @masked or phoneUtil.isValidNumber(number)

    else
      @normal = @raw
      @valid = false


  toString: ->
    @normal

  valueOf: ->
    @toString()


  aggregate: ->
    type: @type
    country_code: @country_code
    prefix: @prefix
    area: @area
    exchange: @exchange
    valid: @valid
    type: 'phone'


  _parseNumber: ->
    # remove the type hint
    string = @raw.replace(hintRegex, '')

    # remove all asterisks and replace with zero. this will allow the number to be parsed.
    string = string.replace(/[*]/g, '0')

    try
      phoneUtil.parse(string, regionCode)
    catch e
      null


  _buildMask: ->
    string = @raw.replace(hintRegex, '')

    # normalize the number by removing everything except digits, asterisks, and the 'x' character
    # then create the mask to track the position of asterisks.
    mask = string.replace(/[^x\d\*]/g, '').split('').map (char) ->
      char == '*'

    # mask is an array of booleans indicating whether the character at that index is masked.
    # index 0 represents the last character.
    mask.reverse()


  _parseType: ->
    match = @raw.match(hintRegex)
    if match
      switch match[1]
        when 'h' then 'home'
        when 'w' then 'work'
        when 'c', 'm' then 'mobile'
    else
      null


  @_asterisk: (str, mask) ->
    maskChar = (char, index) ->
      if mask[index] then '*' else char
    str.split('').reverse().map(maskChar).reverse().join('').split('x')[0]


  @maskable: false


  @components: [
    { name: 'raw', type: 'string', description: 'Unmodified value', aggregated: false }
    { name: 'area', type: 'string', description: 'Area code', aggregated: true }
    { name: 'exchange', type: 'string', description: 'Exchange', aggregated: true }
    { name: 'line', type: 'string', description: 'Line', aggregated: false }
    { name: 'number', type: 'string', description: 'Full number', aggregated: false }
    { name: 'extension', type: 'string', description: 'Extension', aggregated: false }
    { name: 'country_code', type: 'string', description: 'Country code', aggregated: true }
    { name: 'type', type: 'string', description: 'Number type: home, work, mobile', aggregated: true }
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
    '5127891111'
    '512 789-1111'
    '512-789-1111 x 44'
    '1 (512) 789-1111'
  ].map (v) -> new PhoneType(v)


module.exports = PhoneType
