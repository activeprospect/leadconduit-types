url = require('url')
normalize = require('./../normalize')

class UrlType

  constructor: (@raw) ->
    uri = url.parse(@raw)

    isValidUrl =
      uri.protocol? and
      uri.protocol.match(/^http[s]?:/) and
      uri.slashes and
      uri.hostname

    if isValidUrl
      @normal = uri.href
      @protocol = uri.protocol.replace(/:$/, '')
      @host = uri.host
      @port = uri.port
      @path = uri.pathname
      @query = uri.query
      @hash = uri.hash
      @valid = true
    else
      @normal = @raw
      @valid = false


  toString: ->
    @normal


  valueOf: ->
    @toString()


  aggregate: ->
    @toString() if @valid


  @components: [
    { name: 'raw', type: 'string', description: 'Unmodified value' }
    { name: 'protocol', type: 'string', description: 'Protocol: http or https' }
    { name: 'host', type: 'string', description: 'The host name (i.e. google.com)' }
    { name: 'port', type: 'string', description: 'The numeric port number, if present' }
    { name: 'path', type: 'string', description: 'The path on the host (i.e. /some/path/to/a/file.html)' }
    { name: 'query', type: 'string', description: 'The query string (i.e. name=Joe&state=TX' }
    { name: 'hash', type: 'string', description: 'The trailing hash, if present (i.e. #docs)' }
  ]

  @maskable: false

  @operators: [
    'is equal to'
    'is not equal to'
    'is blank'
    'is not blank'
    'includes'
    'does not include'
    'is included in'
    'is not included in'
  ]

  @examples: [
    'https://google.com'
    'https://yourwebsite.com/some/file.asp?type=offer'
    'http://referringurl.com/a/landing/page.html'
  ].map (v) -> new UrlType(v)


module.exports = UrlType
