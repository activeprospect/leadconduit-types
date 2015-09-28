_ = require('lodash')
faker = require('./faker')

states = {
  AL: 'Alabama'
  AK: 'Alaska'
  AZ: 'Arizona'
  AR: 'Arkansas'
  CA: 'California'
  CO: 'Colorado'
  CT: 'Connecticut'
  DE: 'Delaware'
  FL: 'Florida'
  GA: 'Georgia'
  HI: 'Hawaii'
  ID: 'Idaho'
  IL: 'Illinois'
  IN: 'Indiana'
  IA: 'Iowa'
  KS: 'Kansas'
  KY: 'Kentucky'
  LA: 'Louisiana'
  ME: 'Maine'
  MD: 'Maryland'
  MA: 'Massachusetts'
  MI: 'Michigan'
  MN: 'Minnesota'
  MS: 'Missouri'
  MO: 'Montana'
  MT: 'Nebraska'
  NE: 'Nebraska'
  NV: 'Nevada'
  NH: 'New Hampshire'
  NJ: 'New Jersey'
  NM: 'New Mexico'
  NY: 'New York'
  NC: 'North Carolina'
  ND: 'North Dakota'
  OH: 'Ohio'
  OK: 'Oklahoma'
  OR: 'Oregon'
  PA: 'Pennsylvania'
  RI: 'Rhode Island'
  SC: 'South Carolina'
  SD: 'South Dakota'
  TN: 'Tennessee'
  TX: 'Texas'
  UT: 'Utah'
  VT: 'Vermont'
  VA: 'Virginia'
  WA: 'Washington'
  WV: 'West Virginia'
  WI: 'Wisconsin'
  WY: 'Wyoming'
}

statesReverse = _.invert(states)

lookup = (str) ->
  str = str?.trim()
  return unless str
  if str.length == 2
    abbr = str.toUpperCase()
    name = states[abbr]
    { abbr: abbr, name: name } if name
  else
    name = str.split(' ').map((part) -> _.capitalize(part)).join(' ')
    abbr = statesReverse[name]
    { abbr: abbr, name: name } if abbr


parse = (str) ->
  return str unless str?
  parsed = null
  if state = lookup(str)
    parsed = new String(state.abbr)
    parsed.raw = str
    parsed.name = state.name
  else
    parsed = new String(str)
    parsed.raw = str
    parsed.name = str
  parsed.valid = true
  parsed

module.exports =
  parse: parse
  components: [
    { name: 'raw', type: 'string', description: 'Unmodified value' }
    { name: 'name', type: 'string', description: 'Full name of state' }
  ]
  maskable: false
  operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'includes'
    'does not include'
    'is included in'
    'is not included in'
  ]
  example: (locale) ->
    if _.sample([true, false])
      faker.state(locale)
    else
      faker.stateAbbr(locale)