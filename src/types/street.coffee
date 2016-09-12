_ = require('lodash')


parseRegex = /^(\S+)\s+(.+)$/

class StreetType

  constructor: (@raw) ->
    addr = @raw?.trim().match(parseRegex)
    if addr?
      @normal = null
      @number = addr[1]?.trim()
      @name = addr[2]?.trim()
      @normal = "#{@number} #{@name }"
      @valid = true
    else
      @valid = false

      
  valueOf: ->
    @normal

    
  toString: ->
    @normal.toString()


  aggregate: ->
    return unless @valid
    @toString()

    
  @components: [
    { name: 'raw', type: 'string', description: 'Unmodified value' }
    { name: 'number', type: 'string', description: 'Street Number' }
    { name: 'name', type: 'string', description: 'Street Name' }
  ]

  
  @maskable: false

  
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
    '4203 Guadalupe St',
    '00283 Ondricka Street',
    '0746 Monahan Islands',
    '73398 Tomas Club'
  ].map (v) -> new StreetType(v)


module.exports = StreetType
