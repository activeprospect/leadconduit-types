_ = require('lodash')
number = require('./number')

parse = (string) ->
  return string unless string?
  bool =
    if _.isBoolean(string)
      new Boolean(string.valueOf())
    else if _.isString(string)
      sanitized = string.replace?(/[^a-z0-9]/ig, '').toLowerCase()
      parseBoolean(sanitized)
    else if _.isNumber(string)
      parseBoolean(string.toString())
    else
      parseBoolean('NaB')
  bool.valid ?= true
  bool.raw = string.raw ? string
  bool

parseBoolean = (value) ->
  switch value
    when 'y', 'yes', 'true', 't', '1' then new Boolean(true)
    when 'n', 'no', 'false', 'f', '0' then new Boolean(false)
    else
      bool = new Boolean(false)
      bool.valid = false
      bool

examples = [ 'true', 'false', 't', 'f', '1', '0', 'y', 'n' ]

module.exports =
  parse: parse
  components: []
  maskable: false
  operators: [
    'is true'
    'is false'
    'is blank'
    'is not blank'
    'format is valid'
    'format is invalid'
  ],
  example: ->
    modifier = [
      (str) -> str.toUpperCase()
      (str) -> if str.length > 1 then _.capitalize(str) else str
      (str) -> str
    ][_.sample([0, 1, 2])]
    modifier(_.sample(examples))
