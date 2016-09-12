_ = require('lodash')
moment = require('moment')
chrono = require('chrono-node')


class TimeType
  
  constructor: (@raw) ->
    results = chrono.parse(@raw.toString())
    if results.length
      @normal = new Date(results[0].start.date()).toISOString()
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
    @toString() if @valid 
    

  @maskable: false

  
  @components: [
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
    'Sat Jun 14 2015 13:27:33 GMT-0500 (CDT)'
    '06/14/2015 6:27:33 PM'
    '2015-06-14T18:27:33Z'
    '2015-06-14T18:27:33.000Z'
  ].map (v) -> new TimeType(v)

  
module.exports = TimeType
