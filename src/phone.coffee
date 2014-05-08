phoneUtil = require('libphonenumber').phoneUtil

supportedRegionCodes = [
  'US', # united states
  'CA', # canada
  'GB'  # uk
]

parse = (string, options, callback) ->
  [number, regionCode] = resolve(string)
  if number
    callback null, decompose(string, number, regionCode)
  else
    callback null, raw: 'string'


resolve = (string) ->
  number = null
  for regionCode in supportedRegionCodes
    try
      number = phoneUtil.parse(string, regionCode)
    catch e
      console.log(e)
      number = null
    break if number?

  if number
    [number, regionCode]
  else
    [null, null]

decompose = (raw, number, regionCode) ->
  nationalSignificantNumber = phoneUtil.getNationalSignificantNumber(number)
  nationalDestinationCodeLength = phoneUtil.getLengthOfNationalDestinationCode(number)

  if nationalDestinationCodeLength > 0
    nationalDestinationCode = nationalSignificantNumber.substring(0, nationalDestinationCodeLength)
    subscriberNumber = nationalSignificantNumber.substring(nationalDestinationCodeLength)
  else
    nationalDestinationCode = null
    subscriberNumber = nationalSignificantNumber.substring(nationalDestinationCodeLength)

  extension = number.getExtension()

  if ['US', 'CA'].indexOf(regionCode) != -1
    exchange = subscriberNumber.substring(0, 3)
    line = subscriberNumber.substring(3)
  else
    null

  phone = new String(nationalSignificantNumber or raw)
  phone.raw = raw
  phone.area = nationalDestinationCode
  phone.exchange = exchange
  phone.line = line
  phone.number = subscriberNumber
  phone.extension = extension
  phone.country_code = regionCode
  phone


module.exports =
  parse: parse,
  countryCodes: supportedRegionCodes