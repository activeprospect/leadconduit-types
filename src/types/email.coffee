_ = require('lodash')
parseEmail = require('email-addresses').parseOneAddress
parseDomain = require('domain-name-parser')
normalize = require('./../normalize')

stripRegex = /^\s+|\s+$/g


class EmailType
  constructor: (@raw) ->
    addr = parseEmail(@raw)
    if addr?
      @normal = @raw.toLowerCase().replace(stripRegex, '')
      @user = addr.local

      domain = parseDomain(addr.domain)
      @domain = addr.domain
      @host = addr.domain.replace(new RegExp("\.#{domain.tld}$"), '')
      @tld = domain.tld
      @valid = true
    else
      @normal = @raw
      @valid = false

  aggregate: ->
    if @valid
      domain: @domain
      host: @host
      tld: @tld

  valueOf: ->
    @normal

  toString: ->
    @normal

  @operators = [
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
  ]

  @components = [
    { name: 'raw', type: 'string', description: 'Unmodified value' }
    { name: 'user', type: 'string', description: 'User name (everything to the left of @)' }
    { name: 'domain', type: 'string', description: 'Domain name (everything to the right of @)' }
    { name: 'host', type: 'string', description: 'Domain excluding top level domain' }
    { name: 'tld', type: 'string', description: 'Top level domain (.com, .net, etc)' }
  ]

  @examples = [
    'mikejones32@gmail.com'
    'rcampbell1976@outlook.com'
    'janets@somecompany.biz'
  ].map (v) -> new EmailType(v)


module.exports = EmailType
