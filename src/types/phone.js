/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('lodash');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const normalize = require('../normalize');

const supportedRegionCodes = [
  'US', // united states
  'CA', // canada
  'GB' // uk
];

const tollFreeAreaCodes = {
  '800': true,
  '844': true,
  '855': true,
  '866': true,
  '877': true,
  '888': true
};

const parse = function(string, req) {
  let parts, type;
  if (string == null) { return string; }

  [type, string] = Array.from(stripType(string));
  const [number, regionCode, mask] = Array.from(resolve(string, req != null ? req.logger : undefined));
  const raw = string.raw != null ? string.raw : string;
  if (number) {
    parts = decompose(raw, number, regionCode, mask);
    parts.type = type;
    parts.valid = parts.masked || phoneUtil.isValidNumber(number);
    return parts;
  } else {
    parts = new String(string);
    parts.raw = raw;
    if (type != null) { parts.type = type; }
    parts.valid = false;
    return parts;
  }
};

const hintRegex = /[(]?([hwcm])[)]?$/;
const stripRegex = /^\s+|\s+$/g;

var stripType = function(string) {
  const match = string.match(hintRegex);
  if (match) {
    const type = (() => { switch (match[1]) {
      case 'h': return 'home';
      case 'w': return 'work';
      case 'c': case 'm': return 'mobile';
    } })();
    return [type, string.replace(hintRegex, '').replace(stripRegex,'')];
  } else {
    return [null, string];
  }
};


var resolve = function(string, logger) {
  // normalize the number by removing everything except digits, asterisks, and the 'x' character
  // then create the mask to track the position of asterisks.
  let regionCode;
  let mask = string.replace(/[^x\d\*]/g, '').split('').map(char => char === '*');

  // mask is an array of booleans indicating whether the character at that index is masked.
  // index 0 represents the last character. For example, for the number "512789****x***",
  // the mask is [true, true, true, false, true, true, true, true, false, false, false, false, false, false].
  // the mask is reversed in this way to allow for partially mapped numbers that have optional country and
  // dialing codes.
  mask = mask.reverse();

  // remove all asterisks and replace with zero. this will allow the number to be parsed.
  string = string.replace(/[*]/g, '0');

  let number = null;
  for (regionCode of Array.from(supportedRegionCodes)) {
    try {
      number = phoneUtil.parse(string, regionCode);
    } catch (e) {
      __guardMethod__(logger, 'error', o => o.error(e));
      number = null;
    }
    if (number != null) { break; }
  }

  if (number) {
    return [number, regionCode, mask];
  } else {
    return [null, null, null];
  }
};


const asterisk = function(str, mask) {
  const maskChar = function(char, index) {
    if (mask[index]) { return '*'; } else { return char; }
  };
  return str.split('').reverse().map(maskChar).reverse().join('');
};


var decompose = function(raw, number, regionCode, mask) {
  let exchange, line, nationalDestinationCode;
  const nationalPrefix = phoneUtil.getNddPrefixForRegion(regionCode, true);
  let nationalSignificantNumber = phoneUtil.getNationalSignificantNumber(number);
  const nationalDestinationCodeLength = phoneUtil.getLengthOfNationalDestinationCode(number);

  if (nationalDestinationCodeLength > 0) {
    nationalDestinationCode = nationalSignificantNumber.substring(0, nationalDestinationCodeLength);
  } else {
    nationalDestinationCode = null;
  }

  let subscriberNumber = nationalSignificantNumber.substring(nationalDestinationCodeLength);

  let extension = number.getExtension();

  if (mask) {
    const ext = extension ? `x${extension}` : '';

    if (nationalDestinationCode) {
      nationalDestinationCode = asterisk(`${nationalDestinationCode}${subscriberNumber}${ext}`, mask).split('x')[0].substring(0, nationalDestinationCode.length);
    } else {
      nationalDestinationCode = '***'; // default to NANPA length now that libphonenumber returns null NDC for masked numbers
    }

    if (nationalSignificantNumber) {
      nationalSignificantNumber = asterisk(`${nationalSignificantNumber}${ext}`, mask).split('x')[0];
    }

    if (subscriberNumber) {
      subscriberNumber = asterisk(`${subscriberNumber}${ext}`, mask).split('x')[0];
      // force to 7 characters now that libphonenumber returns longer NSN for masked numbers
      if (['US', 'CA'].includes(regionCode)) { subscriberNumber = subscriberNumber.substring(0, 7); }
    }

    if (extension) {
      extension = asterisk(ext, mask).replace(/x/, '');
    }
  }


  if (['US', 'CA'].indexOf(regionCode) !== -1) {
    exchange = subscriberNumber.substring(0, 3);
    line = subscriberNumber.substring(3);
  } else {
    null;
  }

  const normal =
    nationalSignificantNumber ?
      _.compact([nationalSignificantNumber, extension]).join('x')
    :
      raw;

  const phone = new String(normal);
  phone.prefix = nationalPrefix;
  phone.raw = raw;
  phone.area = nationalDestinationCode;
  phone.exchange = exchange;
  phone.line = line;
  phone.number = subscriberNumber;
  phone.extension = extension;
  phone.country_code = regionCode;
  if (mask.indexOf(true) >= 0) { phone.masked = true; }
  phone.is_tollfree = tollFreeAreaCodes[phone.area] != null ? tollFreeAreaCodes[phone.area] : false;
  return phone;
};


const components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' },
  { name: 'area', type: 'string', description: 'Area code' },
  { name: 'exchange', type: 'string', description: 'Exchange' },
  { name: 'line', type: 'string', description: 'Line' },
  { name: 'number', type: 'string', description: 'Full number' },
  { name: 'extension', type: 'string', description: 'Extension' },
  { name: 'country_code', type: 'string', description: 'Country code' },
  { name: 'type', type: 'string', description: 'Number type: home, work, mobile' },
  { name: 'is_tollfree', type: 'boolean', description: `Whether the number is toll-free (${Object.keys(tollFreeAreaCodes).join(', ')})` }
];

module.exports = {
  parse,
  components,
  countryCodes: supportedRegionCodes,
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
    '5127891111',
    '512 789-1111',
    '512-789-1111 x 44',
    '1 (512) 789-1111'
  ].map(parse).map(normalize)
};

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}