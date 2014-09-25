parseEmail = require('email-addresses').parseOneAddress
parseDomain = require('domain-name-parser')

stripRegex = /^\s+|\s+$/g

parse = (string) ->

  addr = parseEmail(string)

  if addr?
    parsed = new String(string.toLowerCase().replace(stripRegex, ''))
    parsed.raw = string
    parsed.user = addr.local

    domain = parseDomain(addr.domain)
    parsed.domain = addr.domain
    parsed.host = addr.domain.replace(new RegExp("\.#{domain.tld}$"), '')
    parsed.tld = domain.tld
    parsed.valid = true
  else
    parsed = new String(string)
    parsed.raw = string
    parsed.valid = false

  parsed
  
  
components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
  { name: 'user', type: 'string', description: 'User name (everything to the left of @)' }
  { name: 'domain', type: 'string', description: 'Domain name (everything to the right of @)' }
  { name: 'host', type: 'string', description: 'Domain excluding top level domain' }
  { name: 'tld', type: 'string', description: 'Top level domain (.com, .net, etc)' }
]


module.exports =
  parse: parse
  components: components
  maskable: false