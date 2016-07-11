_ = require('lodash')
number = require('./number')
normalize = require('./normalize')

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
  examples: [
    'yes'
    'no'
    'Y'
    'N'
    'true'
    'false'
    'T'
    'F'
    '1'
    '0'
  ].map(parse).map(normalize)
