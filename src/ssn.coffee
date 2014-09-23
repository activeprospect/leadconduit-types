parse = (string) ->
  return string unless string?
  cleanedStr = string.replace(/[^0-9]/g, '')
  if cleanedStr.length == 9
    ssn = new String(cleanedStr)
    ssn.raw = string
    ssn.first_three = cleanedStr.slice(0, 3)
    ssn.middle_two = cleanedStr.slice(3, 5)
    ssn.last_four = cleanedStr.slice(-4)
    ssn.masked = false
    ssn
  else
    ssn = new String(string)
    ssn.raw = string
    ssn.masked = false
    ssn


components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
  { name: 'first_three', type: 'string', description: 'First three digits of SSN' }
  { name: 'middle_two', type: 'string', description: 'Middle two digits of SSN' }
  { name: 'last_four', type: 'number', description: 'Last four digits of SSN' }
  { name: 'masked', type: 'boolean', description: 'Is the SSN masked? Always set to true.' }
]


module.exports =
  parse: parse
  components: components
  maskable: true