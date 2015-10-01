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
  gender

module.exports =
  parse: parse
  components: []
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
  ]
