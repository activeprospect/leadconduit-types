_ = require('lodash')
normalize = require('./../normalize')

class StateType

  constructor: (@raw) ->
    str = @raw.trim()
    if str.length == 2
      abbr = str.toUpperCase()
      if name = StateType.states[abbr]
        @abbr = abbr
        @name = name
    else
      name = str.split(' ').map((part) -> _.capitalize(part)).join(' ')
      if abbr = StateType.statesReverse[name]
        @name = name
        @abbr = abbr

    @abbr ?= @raw
    @name ?= @raw
    @valid = true


  toString: ->
    @abbr

  valueOf: ->
    @toString()


  @states: {
    AL: 'Alabama'
    AK: 'Alaska'
    AS: 'American Samoa'
    AZ: 'Arizona'
    AR: 'Arkansas'
    CA: 'California'
    CO: 'Colorado'
    CT: 'Connecticut'
    DE: 'Delaware'
    DC: 'District of Columbia'
    FL: 'Florida'
    GA: 'Georgia'
    GU: 'Guam'
    HI: 'Hawaii'
    ID: 'Idaho'
    IL: 'Illinois'
    IN: 'Indiana'
    IA: 'Iowa'
    KS: 'Kansas'
    KY: 'Kentucky'
    LA: 'Louisiana'
    ME: 'Maine'
    MH: 'Marshall Islands'
    MD: 'Maryland'
    MA: 'Massachusetts'
    MI: 'Michigan'
    FM: 'Micronesia'
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
    MP: 'Northern Mariana Islands'
    OH: 'Ohio'
    OK: 'Oklahoma'
    OR: 'Oregon'
    PW: 'Palau'
    PA: 'Pennsylvania'
    PR: 'Puerto Rico'
    RI: 'Rhode Island'
    SC: 'South Carolina'
    SD: 'South Dakota'
    TN: 'Tennessee'
    TX: 'Texas'
    VI: 'U.S. Virgin Islands'
    UT: 'Utah'
    VT: 'Vermont'
    VA: 'Virginia'
    WA: 'Washington'
    WV: 'West Virginia'
    WI: 'Wisconsin'
    WY: 'Wyoming'
  }

  @statesReverse: _.invert(StateType.states)


  @components: [
    { name: 'raw', type: 'string', description: 'Unmodified value', aggregated: false }
    { name: 'name', type: 'string', description: 'Full name of state', aggregated: false }
  ]

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
    'TX'
    'Texas'
    'Quebec'
    'Île-de-France'
  ].map (v) -> new StateType(v)


module.exports = StateType
