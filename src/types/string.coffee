parse = (value) ->
  return value unless value?
  value.toString()


parse.components = []
parse.maskable = false
parse.operators = [
  'is equal to'
  'is not equal to'
  'is blank'
  'is not blank'
  'includes'
  'does not include'
  'is included in'
  'is not included in'
]
parse.examples = [
  'some words'
]


module.exports = parse
