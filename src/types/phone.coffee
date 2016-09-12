_ = require('lodash')
phoneUtil = require('libphonenumber').phoneUtil
hintRegex = /\s*[(]?([hwcm])[)]?$/
regionCode = 'US'

tollFreeAreaCodes =
  '800': true
  '844': true
  '855': true
  '866': true
  '877': true
  '888': true

class PhoneType

  constructor: (@raw) ->

    number = @_parseNumber()

    if number
      nationalPrefix = phoneUtil.getNddPrefixForRegion(regionCode, true)
      nationalSignificantNumber = phoneUtil.getNationalSignificantNumber(number)
      nationalDestinationCodeLength = phoneUtil.getLengthOfNationalDestinationCode(number)

      if nationalDestinationCodeLength > 0
        nationalDestinationCode = nationalSignificantNumber.substring(0, nationalDestinationCodeLength)
        subscriberNumber = nationalSignificantNumber.substring(nationalDestinationCodeLength)
      else
        nationalDestinationCode = null
        subscriberNumber = nationalSignificantNumber.substring(nationalDestinationCodeLength)

      extension = number.getExtension()

      mask = @_buildMask()
      masked = mask.indexOf(true) >= 0
      if masked
        ext = if extension then "x#{extension}" else ''

        if nationalDestinationCode
          nationalDestinationCode = PhoneType._asterisk("#{nationalDestinationCode}#{subscriberNumber}#{ext}", mask).split('x')[0].substring(0, nationalDestinationCode.length)

        if nationalSignificantNumber
          nationalSignificantNumber = PhoneType._asterisk("#{nationalSignificantNumber}#{ext}", mask).split('x')[0]

        if subscriberNumber
          subscriberNumber = PhoneType._asterisk("#{subscriberNumber}#{ext}", mask).split('x')[0]

        if extension
          extension = PhoneType._asterisk(ext, mask).replace(/x/, '')

      exchange = subscriberNumber.substring(0, 3)
      line = subscriberNumber.substring(3)

      normal =
        if nationalSignificantNumber
          _.compact([nationalSignificantNumber, extension]).join('x')
        else
          raw

      @normal = normal
      @type = @_parseType()
      @raw = @raw.replace(hintRegex, '')
      @country_code = regionCode
      @prefix = nationalPrefix
      @area = nationalDestinationCode
      @exchange = exchange
      @line = line
      @number = subscriberNumber
      @extension = extension
      @is_tollfree = tollFreeAreaCodes[@area] ? false
      @masked = true if masked
      @valid = @masked or phoneUtil.isValidNumber(number)

    else
      @normal = @raw
      @valid = false


  toString: ->
    @normal

  valueOf: ->
    @toString()


  aggregate: ->
    return unless @valid
    _.pick @, 'type', 'country_code', 'prefix', 'area', 'exchange', 'is_tollfree'


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
    str.split('').reverse().map(maskChar).reverse().join('')


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
