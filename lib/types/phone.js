const _ = require('lodash');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const normalize = require('../normalize');
const ensureString = require('../ensureString');

const tollFreeAreaCodes = {
  800: true,
  844: true,
  855: true,
  866: true,
  877: true,
  888: true
};

const parse = function (string, req) {
  if (string == null) { return string; }

  const results = stripType(ensureString(string));
  const type = results[0];
  string = results[1];

  const logger = req ? req.logger : undefined;
  const [number, regionCode, countryCallingCode, mask] = resolve(string, logger);
  const raw = string.raw != null ? string.raw : string;

  let parts;
  if (number) {
    parts = decompose(raw, number, regionCode, countryCallingCode, mask);
    parts.type = type;
    parts.valid = parts.masked || phoneUtil.isValidNumber(number);
    return parts;
  } else {
    parts = new String(string);
    parts.raw = raw;
    if (type) { parts.type = type; }
    parts.valid = false;
    return parts;
  }
};

const hintRegex = /[(]?([hwcm])[)]?$/;
const stripRegex = /^\s+|\s+$/g;

const stripType = function (string) {
  const match = string.match(hintRegex);
  if (match) {
    let type;
    switch (match[1]) {
      case 'h':
        type = 'home';
        break;
      case 'w':
        type = 'work';
        break;
      case 'c': // fallthrough
      case 'm':
        type = 'mobile';
    }

    return [type, string.replace(hintRegex, '').replace(stripRegex, '')];
  } else {
    return [null, string];
  }
};

const resolve = function (string, logger) {
  // normalize the number by removing everything except digits, asterisks, and the 'x' character
  // then create the mask to track the position of asterisks.
  let regionCode;
  let mask = string.replace(/[^x\d*]/g, '').split('').map(char => char === '*');

  // mask is an array of booleans indicating whether the character at that index is masked.
  // index 0 represents the last character. For example, for the number "512789****x***",
  // the mask is [true, true, true, false, true, true, true, true, false, false, false, false, false, false].
  // the mask is reversed in this way to allow for partially mapped numbers that have optional country and
  // dialing codes.
  mask = mask.reverse();

  // remove all asterisks and replace with zero. this will allow the number to be parsed.
  string = string.replace(/[*]/g, '0');

  let number = null;
  try {
    number = phoneUtil.parse(string, 'US');
  } catch (e) {
    number = null;
  }

  if (number) {
    const countryCallingCode = number.getCountryCode();
    regionCode = phoneUtil.getRegionCodeForCountryCode(countryCallingCode);
    return [number, regionCode, countryCallingCode, mask];
  } else {
    return [null, null, null, null];
  }
};

const asterisk = function (str, mask) {
  const maskChar = function (char, index) {
    if (mask[index]) { return '*'; } else { return char; }
  };
  return str.split('').reverse().map(maskChar).reverse().join('');
};

const decompose = function (raw, number, regionCode, countryCallingCode, mask) {
  let exchange, line, nationalDestinationCode;
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
      nationalDestinationCode = asterisk(`${nationalDestinationCode}${subscriberNumber}${ext}`, mask)
        .split('x')[0]
        .substring(0, nationalDestinationCode.length);
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

  // only applicable for numbers under the NANP
  if (countryCallingCode === 1) {
    exchange = subscriberNumber.substring(0, 3);
    line = subscriberNumber.substring(3);
  }

  const normal =
    nationalSignificantNumber
      ? _.compact([nationalSignificantNumber, extension]).join('x')
      : raw;

  const phone = new String(normal);
  phone.raw = raw;
  phone.area = nationalDestinationCode;
  phone.exchange = exchange;
  phone.line = line;
  phone.number = subscriberNumber;
  phone.extension = extension;
  phone.country_code = regionCode;
  phone.country_calling_code = countryCallingCode;
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
  { name: 'country_code', type: 'string', description: 'Two letter country code' },
  { name: 'country_calling_code', type: 'number', description: 'Numeric country calling code' },
  { name: 'type', type: 'string', description: 'Number type: home, work, mobile' },
  { name: 'is_tollfree', type: 'boolean', description: `Whether the number is toll-free (${Object.keys(tollFreeAreaCodes).join(', ')})` }
];

module.exports = {
  parse,
  components,
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
