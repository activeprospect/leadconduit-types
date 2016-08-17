_ = require('lodash')
moment = require('moment')

formats = [
  'ddd MMM DD YYYY' # 'Mon Jun 02 2014'
  'MMM DD YYYY'     # 'Jun 02 2014'
  'MM/DD/YYYY'      # '06/02/2014'
  'YYYY-MM-DD'      # '2014-06-02'
  'MM-DD-YYYY'      # '06-02-2014'
  'MMDDYYYY'        # '06022014'
]


class DateType
  
  constructor: (@raw) ->
    results = moment(@raw.toString(), formats)

    if results.isValid()
      @normal = moment(results.toDate()).format('YYYY-MM-DD')
      @valid = true

    else
      @normal = @raw
      @valid = false

      
  valueOf: ->
    @toString()

    
  toString: ->
    @normal

    
  toISOString: ->
    @toString()


  aggregate: ->
    return unless @valid
    @toString()

    
  @maskable: false

  
  @components = [
    { name: 'raw', type: 'string', description: 'Unmodified value' }
  ]


  @operators: [
    'is equal to'
    'is not equal to'
    'is less than'
    'is less than or equal to'
    'is greater than'
    'is greater than or equal to'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
    'is between'
    'is not between'
  ]

  @examples: [
    'Mon Jun 02 2014'
    'Jun 02 2014'
    '06/02/2014'
    '2014-06-02'
  ].map (v) -> new DateType(v)

module.exports = DateType
