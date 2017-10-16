parseEmail = require('email-addresses').parseOneAddress
parseDomain = require('domain-name-parser')
normalize = require('../normalize')
freemail = require('freemail')

stripRegex = /^\s+|\s+$/g

parse = (string) ->
  addr = parseEmail(string)
  if addr?
    parsed = new String(string.toLowerCase().replace(stripRegex, ''))
    parsed.raw = string.raw ? string
    parsed.user = addr.local
    parsed.is_free = freemail.isFree(string.raw ? string)
    parsed.is_disposable = freemail.isDisposable(string.raw ? string)

    domain = parseDomain(addr.domain)
    parsed.domain = addr.domain
    parsed.host = addr.domain.replace(new RegExp("\.#{domain.tld}$"), '')
    parsed.tld = domain.tld
    parsed.valid = true
  else
    parsed = new String(string)
    parsed.raw = string.raw ? string
    parsed.valid = false

  parsed


components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' }
  { name: 'user', type: 'string', description: 'User name (everything to the left of @)' }
  { name: 'domain', type: 'string', description: 'Domain name (everything to the right of @)' }
  { name: 'host', type: 'string', description: 'Domain excluding top level domain' }
  { name: 'tld', type: 'string', description: 'Top level domain (.com, .net, etc)' }
  { name: 'is_free', type: 'boolean', description: 'Whether or not the email is from a free domain (ex: gmail, yahoo, etc)' }
  { name: 'is_disposable', type: 'boolean', description: 'Whether or not the email is disposable' }
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
    'includes'
    'does not include'
    'is included in'
    'is not included in'
    'matches pattern'
    'does not match pattern'
  ]
  examples: [
    'mikejones32@gmail.com'
    'rcampbell1976@outlook.com'
    'janets@somecompany.biz'
  ].map(parse).map(normalize)
