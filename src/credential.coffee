parse = (string) ->
  return string unless string?
  parsed = new String(string)
  parsed.masked = false
  parsed.valid = true
  parsed

module.exports =
  parse: parse
  components: []
  maskable: true