_ = require('lodash')
normalize = require('../normalize')

states = {
  AB: 'Alberta'
  AK: 'Alaska'
  AL: 'Alabama'
  AR: 'Arkansas'
  AS: 'American Samoa'
  AZ: 'Arizona'
  BC: 'British Columbia'
  CA: 'California'
  CO: 'Colorado'
  CT: 'Connecticut'
  DC: 'District of Columbia'
  DE: 'Delaware'
  FL: 'Florida'
  FM: 'Micronesia'
  GA: 'Georgia'
  GU: 'Guam'
  HI: 'Hawaii'
  IA: 'Iowa'
  ID: 'Idaho'
  IL: 'Illinois'
  IN: 'Indiana'
  KS: 'Kansas'
  KY: 'Kentucky'
  LA: 'Louisiana'
  MA: 'Massachusetts'
  MB: 'Manitoba'
  MD: 'Maryland'
  ME: 'Maine'
  MH: 'Marshall Islands'
  MI: 'Michigan'
  MN: 'Minnesota'
  MO: 'Montana'
  MP: 'Northern Mariana Islands'
  MS: 'Missouri'
  MT: 'Nebraska'
  NB: 'New Brunswick'
  NC: 'North Carolina'
  ND: 'North Dakota'
  NE: 'Nebraska'
  NH: 'New Hampshire'
  NJ: 'New Jersey'
  NL: 'Newfoundland and Labrador'
  NM: 'New Mexico'
  NS: 'Nova Scotia'
  NV: 'Nevada'
  NY: 'New York'
  OH: 'Ohio'
  OK: 'Oklahoma'
  ON: 'Ontario'
  OR: 'Oregon'
  PA: 'Pennsylvania'
  PE: 'Prince Edward Island'
  PR: 'Puerto Rico'
  PW: 'Palau'
  QC: 'Quebec'
  RI: 'Rhode Island'
  SC: 'South Carolina'
  SD: 'South Dakota'
  SK: 'Saskatchawan'
  TN: 'Tennessee'
  TX: 'Texas'
  UT: 'Utah'
  VA: 'Virginia'
  VI: 'U.S. Virgin Islands'
  VT: 'Vermont'
  WA: 'Washington'
  WI: 'Wisconsin'
  WV: 'West Virginia'
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
  examples: [
    'TX'
    'Texas'
    'Quebec'
    'Île-de-France'
  ].map(parse).map(normalize)
