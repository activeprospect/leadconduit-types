_ = require('lodash')
chrono = require('chrono-node')
moment = require('moment')
normalize = require('./../normalize')


class DateType
  constructor: (@raw) ->
    results = chrono.parse(@raw.toString())

    if results.length
      @normal = moment(new Date(results[0].start.date())).format('YYYY-MM-DD')
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
