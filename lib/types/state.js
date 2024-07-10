const _ = require('lodash');
const normalize = require('../normalize');
const ensureString = require('../ensureString');

const states = {
  AB: 'Alberta',
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AS: 'American Samoa',
  AZ: 'Arizona',
  BC: 'British Columbia',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  FM: 'Federated States of Micronesia FM',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MB: 'Manitoba',
  MD: 'Maryland',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MP: 'Northern Mariana Islands',
  MS: 'Mississippi',
  MT: 'Montana',
  NB: 'New Brunswick',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NL: 'Newfoundland and Labrador',
  NM: 'New Mexico',
  NS: 'Nova Scotia',
  NT: 'Northwest Territories NT',
  NU: 'Nunavut NU',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  ON: 'Ontario',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  PE: 'Prince Edward Island',
  PR: 'Puerto Rico',
  PW: 'Palau',
  QC: 'Quebec',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  SK: 'Saskatchewan',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VI: 'U.S. Virgin Islands',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
  YT: 'Yukon YT'
};

const statesReverse = _.invert(states);

const lookup = function (str) {
  if (!str || (str && !str.trim())) {
    return;
  }

  let abbr, name;
  if (str.length === 2) {
    abbr = str.toUpperCase();
    name = states[abbr];
    if (name) { return { abbr, name }; }
  } else {
    name = str.split(' ').map(part => _.capitalize(part)).join(' ');
    abbr = statesReverse[name];
    if (abbr) { return { abbr, name }; }
  }
};

const parse = function (string) {
  if (string == null) { return string; }
  const raw = ensureString(string);
  let parsed = null;

  const state = lookup(raw);
  if (state) {
    parsed = new String(state.abbr);
    parsed.raw = raw;
    parsed.name = state.name;
  } else {
    parsed = new String(string);
    parsed.raw = raw;
    parsed.name = raw;
  }
  parsed.valid = true;
  return parsed;
};

module.exports = {
  parse,
  components: [
    { name: 'raw', type: 'string', description: 'Unmodified value' },
    { name: 'name', type: 'string', description: 'Full name of state' }
  ],
  maskable: false,
  operators: [
    'is equal to',
    'is not equal to',
    'is blank',
    'is not blank',
    'is obscene',
    'is not obscene',
    'includes',
    'does not include',
    'is included in',
    'is not included in'
  ],
  examples: [
    'TX',
    'Texas',
    'Quebec',
    'Île-de-France'
  ].map(parse).map(normalize)
};
