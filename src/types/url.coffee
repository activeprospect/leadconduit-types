url = require('url')
normalize = require('../normalize')

isValidUrl = (uri) ->
  uri.protocol? and
  uri.protocol.match(/^http[s]?:/) and
  uri.slashes and
  uri.hostname

parse = (str) ->
  return str unless str?
  uri = url.parse(str?.raw?.toString() or str)

  if !uri.protocol? and str.includes('.') 
    uri.protocol = 'http:'
    str = if str.includes('//') then "http:#{str}"  else "http://#{str}"

  if isValidUrl(uri)
    parsed = new String(uri.href)
    parsed.raw = str.raw ? str
    parsed.protocol = uri.protocol.replace(/:$/, '')
    parsed.host = uri.host
    parsed.port = uri.port
    parsed.path = uri.pathname
    parsed.query = uri.query
    parsed.hash = uri.hash
    parsed.valid = true
    parsed
  else
    parsed = new String(str)
    parsed.raw = str.raw or str
    parsed.valid = false
    parsed

module.exports =
  parse: parse

  components: [
    { name: 'raw', type: 'string', description: 'Unmodified value' }
    { name: 'protocol', type: 'string', description: 'Protocol: http or https' }
    { name: 'host', type: 'string', description: 'The host name (i.e. google.com)' }
    { name: 'port', type: 'string', description: 'The numeric port number, if present' }
    { name: 'path', type: 'string', description: 'The path on the host (i.e. /some/path/to/a/file.html)' }
    { name: 'query', type: 'string', description: 'The query string (i.e. name=Joe&state=TX' }
    { name: 'hash', type: 'string', description: 'The trailing hash, if present (i.e. #docs)' }
  ]
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
  ]
  examples: [
    'https://google.com'
    'https://yourwebsite.com/some/file.asp?type=offer'
    'http://referringurl.com/a/landing/page.html'
  ].map(parse).map(normalize)
