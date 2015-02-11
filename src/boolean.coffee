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
  bool.raw = string
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