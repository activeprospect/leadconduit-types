parse = (string) ->
  return string unless string?
  raw = string.raw ? string
  cleanedStr = string.replace(/[^0-9]/g, '')
  if cleanedStr.length == 9
    parsed = new String(cleanedStr)
    parsed.raw = raw
    parsed.first_three = cleanedStr.slice(0, 3)
    parsed.middle_two = cleanedStr.slice(3, 5)
    parsed.last_four = cleanedStr.slice(-4)
    parsed.masked = false
    parsed.valid = true
    parsed
  else
    parsed = new String(string)
    parsed.raw = raw
    parsed.masked = false
    parsed.valid = false
    parsed


components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
  { name: 'first_three', type: 'string', description: 'First three digits of SSN' }
  { name: 'middle_two', type: 'string', description: 'Middle two digits of SSN' }
  { name: 'last_four', type: 'number', description: 'Last four digits of SSN' }
]


module.exports =
  parse: parse
  components: components
  maskable: true