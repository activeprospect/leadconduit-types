const { URL } = require('url');
const normalize = require('../normalize');
const ensureString = require('../ensureString');

const isValidUrl = function (uri) {
  return (uri.protocol != null) &&
    uri.protocol.match(/^http[s]?:/) &&
    uri.hostname;
};

const parse = function (str) {
  if (str == null) { return str; }

  const raw = ensureString(str);
  let toParse = raw;
  if (!toParse.match(/:\/\//)) { toParse = `http://${toParse}`; } // if no '://' found, add protocol prefix before parsing

  let parsed;
  try {
    const uri = new URL(toParse);

    if (isValidUrl(uri)) {
      parsed = new String(uri.href);
      parsed.protocol = uri.protocol.replace(/:$/, '');
      parsed.host = uri.host;
      parsed.port = uri.port;
      parsed.path = uri.pathname;
      parsed.query = uri.search?.replace('?', '');
      parsed.hash = uri.hash;
      parsed.valid = true;
    } else {
      parsed = new String(str);
      parsed.valid = false;
    }
  } catch (e) {
    parsed = new String(str);
    parsed.valid = false;
  }

  parsed.raw = raw;
  return parsed;
};

module.exports = {
  parse,

  components: [
    { name: 'raw', type: 'string', description: 'Unmodified value' },
    { name: 'protocol', type: 'string', description: 'Protocol: http or https' },
    { name: 'host', type: 'string', description: 'The host name (i.e. google.com)' },
    { name: 'port', type: 'string', description: 'The numeric port number, if present' },
    { name: 'path', type: 'string', description: 'The path on the host (i.e. /some/path/to/a/file.html)' },
    { name: 'query', type: 'string', description: 'The query string (i.e. name=Joe&state=TX' },
    { name: 'hash', type: 'string', description: 'The trailing hash, if present (i.e. #docs)' }
  ],
  maskable: false,
  operators: [
    'is equal to',
    'is not equal to',
    'is blank',
    'is not blank',
    'format is valid',
    'format is invalid',
    'includes',
    'does not include',
    'is included in',
    'is not included in'
  ],
  examples: [
    'https://google.com',
    'https://yourwebsite.com/some/file.asp?type=offer',
    'http://referringurl.com/a/landing/page.html'
  ].map(parse).map(normalize)
};
