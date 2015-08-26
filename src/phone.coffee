_ = require('lodash')
phoneUtil = require('libphonenumber').phoneUtil

supportedRegionCodes = [
  'US', # united states
  'CA', # canada
  'GB'  # uk
]

parse = (string, req) ->
  return string unless string?

  [type, string] = stripType(string)
  [number, regionCode, mask] = resolve(string, req?.logger)
  raw = string.raw ? string
  if number
    parts = decompose(raw, number, regionCode, mask)
    parts.type = type
    parts.valid = parts.masked or phoneUtil.isValidNumber(number)
    parts
  else
    parts = new String(string)
    parts.raw = raw
    parts.type = type if type?
    parts.valid = false
    parts

hintRegex = /[(]?([hwcm])[)]?$/
stripRegex = /^\s+|\s+$/g

stripType = (string) ->
  match = string.match(hintRegex)
  if match
    type = switch match[1]
      when 'h' then 'home'
      when 'w' then 'work'
      when 'c', 'm' then 'mobile'
    [type, string.replace(hintRegex, '').replace(stripRegex,'')]
  else
    [null, string]


resolve = (string, logger) ->
  # normalize the number by removing everything except digits, asterisks, and the 'x' character
  # then create the mask to track the position of asterisks.
  mask = string.replace(/[^x\d\*]/g, '').split('').map (char) ->
    char == '*'

  # mask is an array of booleans indicating whether the character at that index is masked.
  # index 0 represents the last character.
  mask = mask.reverse()

  # remove all asterisks and replace with zero. this will allow the number to be parsed.
  string = string.replace(/[*]/g, '0')

  number = null
  for regionCode in supportedRegionCodes
    try
      number = phoneUtil.parse(string, regionCode)
    catch e
      logger?.error?(e)
      number = null
    break if number?

  if number
    [number, regionCode, mask]
  else
    [null, null, null]


asterisk = (str, mask) ->
  maskChar = (char, index) ->
    if mask[index] then '*' else char
  str.split('').reverse().map(maskChar).reverse().join('').split('x')[0]

decompose = (raw, number, regionCode, mask) ->
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

  if mask
    ext = if extension then "x#{extension}" else ''

    if nationalDestinationCode
      nationalDestinationCode = asterisk("#{nationalDestinationCode}#{subscriberNumber}#{ext}", mask).substring(0, nationalDestinationCode.length)

    if nationalSignificantNumber
      nationalSignificantNumber = asterisk("#{nationalSignificantNumber}#{ext}", mask)

    if subscriberNumber
      subscriberNumber = asterisk("#{subscriberNumber}#{ext}", mask)


  if ['US', 'CA'].indexOf(regionCode) != -1
    exchange = subscriberNumber.substring(0, 3)
    line = subscriberNumber.substring(3)
  else
    null

  phone = new String(nationalSignificantNumber or raw)
  phone.prefix = nationalPrefix
  phone.raw = raw
  phone.area = nationalDestinationCode
  phone.exchange = exchange
  phone.line = line
  phone.number = subscriberNumber
  phone.extension = extension
  phone.country_code = regionCode
  phone.masked = true if _.contains(mask, true)
  phone


components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
  { name: 'area', type: 'string', description: 'Area code' }
  { name: 'exchange', type: 'string', description: 'Exchange' }
  { name: 'line', type: 'string', description: 'Line' }
  { name: 'number', type: 'string', description: 'Full number' }
  { name: 'extension', type: 'string', description: 'Extension' }
  { name: 'country_code', type: 'string', description: 'Country code' }
  { name: 'type', type: 'string', description: 'Number type: home, work, mobile' }
]


module.exports =
  parse: parse
  components: components
  countryCodes: supportedRegionCodes
  maskable: false
  operators: [
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
