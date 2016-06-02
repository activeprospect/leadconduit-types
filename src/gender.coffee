normalize = require('./normalize')

parse = (string) ->
  return string unless string?
  raw = string.raw ? string
  normalized = raw.toString().toLowerCase().trim()
  gender =
    switch normalized
      when 'm', 'male' then new String("male")
      when 'f', 'female' then new String("female")
      when 'o', 'other' then new String("other")
      else
        invalid = new String(raw)
        invalid.valid = false
        invalid
  gender.raw = raw
  gender.valid ?= true
  gender.abbr =
    switch gender.valueOf()
      when 'male' then 'M'
      when 'female' then 'F'
      when  'other' then 'O'
      else null
  gender

components = [
  { name: 'raw', type: 'string', description: 'Unmodified value'}
  { name: 'abbr', type: 'string', description: 'Abbreviated name of gender'}
]

module.exports =
  parse: parse
  components: components
  maskable: false
  operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
  ],
  examples: [
    'male'
    'female'
    'other'
    'M'
    'F'
    'O'
  ].map(parse).map(normalize)
