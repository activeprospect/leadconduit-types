const { URL } = require('url');
const normalize = require('../normalize');
const ensureString = require('../ensureString');

/**
 * Parses ip if in the following formats:
 * ipv4: 128.71.239.188
 * ipv6: [1268:753d:682d:3dab:3596:cc01:6891:e1a6]
 * @param {string} ipStr
 * @returns {module:url.URL}
 */
function parseIpFormat (ipStr) {
  return new URL(`https://${ipStr}`);
}

/**
 * Parses ipv6 if in the following formats:
 * ipv6: 1268:753d:682d:3dab:3596:cc01:6891:e1a6
 * ipv6 with path: 1268:753d:682d:3dab:3596:cc01:6891:e1a6/hello
 * @param {string} ipStr
 * @returns {module:url.URL} - [1268:753d:682d:3dab:3596:cc01:6891:e1a6]/hello
 */
function parseIpv6WithoutBrackets (ipStr) {
  const ipv6LikeRegex = /^((::ffff|ffff:):(\d{1,3}\.){3}\d{1,3}|(([0-9a-f]{0,4}|:)(:[0-9a-f]{0,4}){0,7}))/i;
  const str = ipStr.replace(ipv6LikeRegex, '[$1]');
  return parseIpFormat(str);
}

/**
 * Map ipv4 to ipv6 for ipv6 systems to talk to ipv4 systems:
 * @param {string} ipStr - 192.168.100.228
 * @returns {string} - [::ffff:c0a8:64e4]
 */
function mapIpv4ToIpv6 (ipStr) {
  const parsed = new URL(`https://[ffff::${ipStr}]`);
  return parsed.hostname;
}

/**
 * @description Checks string for "://" to determine if it has a protocol (e.g. http, https, ftp, etc.)
 * @param {string} str
 * @returns {boolean}
 */
function hasProtocol (str) {
  return /:\/\//.test(str);
}

/**
 * @description Ipv4 can be mapped to Ipv6; however, when an ipv4 is included in the ipv6
 * it occurs at the end of the ipv6 address. This function checks if the string starts with
 * an ipv4 address while allowing for the inclusion of a port number or path included with the string.
 * @param {string} str
 * @returns {boolean}
 */
function startsWithIpv4 (str) {
  return /^(\d{1,3}\.){3}\d{1,3}\b/.test(str);
}

/**
 * @description Checks if string has brackets like ipv6 (e.g. [::ffff:c0a8:64e4])
 * @param {string} str
 * @returns {boolean}
 */
function hasBrackets (str) {
  return /^\[.*]/.test(str);
}

function parseIp (ipStr) {
  if (hasProtocol(ipStr)) {
    // strip protocol recall function
    // this will prevent https://google.com from being parsed as an ip
    // and avoid duplicating logic
    return parseIp(ipStr.replace(/^.*:\/\//, ''));
  }

  if (startsWithIpv4(ipStr) || hasBrackets(ipStr)) {
    return parseIpFormat(ipStr);
  }

  return parseIpv6WithoutBrackets(ipStr);
}

const parse = function (str) {
  if (str == null) { return str; }

  const raw = ensureString(str);

  let parsed;
  try {
    const uri = parseIp(raw.replace(/\s/g, ''));
    parsed = new String(uri.hostname);
    parsed.valid = true;
    if (startsWithIpv4(uri.hostname)) {
      parsed.isIpv4 = true;
      // IP v4 can be converted to IP v6; however, the reverse is not true
      parsed.mapToIpv6 = mapIpv4ToIpv6(uri.hostname);
    } else {
      parsed.isIpv4 = false;
      parsed.mapToIpv6 = uri.hostname;
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
    { name: 'isIpv4', type: 'boolean', description: 'Whether the IP address is IP v4 or not' },
    { name: 'mapToIpv6', type: 'string', description: 'The IP converted to IP v6' }
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
    '198.51.90.161',
    'https://198.51.90.162',
    '0d49:6f05:e485:29bb:3122:f151:aa71:4a3b',
    '[ffff::198.51.90.163]',
    'https://[56c6:75e8:cddf:199b:f696:4192:baae:eb2e]'
  ].map(parse).map(normalize)
};
