class SsnType
  constructor: (@raw) ->

    cleanedStr = @raw.replace(/[^0-9]/g, '')
    if cleanedStr.length == 9
      @normal = cleanedStr
      @first_three = cleanedStr.slice(0, 3)
      @middle_two = cleanedStr.slice(3, 5)
      @last_four = cleanedStr.slice(-4)
      @masked = false
      @valid = true
    else
      @normal = @raw
      @masked = false
      @valid = false


  toString: ->
    @normal

  valueOf: ->
    @toString()

  @maskable: true

  @components: [
    { name: 'raw', type: 'string', description: 'Unmodified value' }
    { name: 'first_three', type: 'string', description: 'First three digits of SSN' }
    { name: 'middle_two', type: 'string', description: 'Middle two digits of SSN' }
    { name: 'last_four', type: 'number', description: 'Last four digits of SSN' }
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
    '123-45-6789'
    '123 45 6789'
    '123456789'
  ].map (v) -> new SsnType(v)

module.exports = SsnType
