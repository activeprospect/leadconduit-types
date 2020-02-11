const Handlebars = require('handlebars');
const { named } = require('named-regexp');
const normalize = require('../normalize');
const _ = require('lodash');

const supportedRegionCodes = [
  'US', // united states
  'CA', // canada
  'GB' // uk
];

const handlers = {
  US: {
    regex: named(/^(:<code>(:<zip>\d{5})(?:\s*(?:-)?\s*)?(:<four>\d{4})?)?$/i),
    format: '{{zip}}{{#if four}}-{{four}}{{/if}}'
  },
  CA: {
    regex: named(/^(:<code>(:<fsa>(:<district>[a-z])[0-9][a-z])\s*(:<ldu>[0-9][a-z][0-9]))$/i),
    format: '{{fsa}} {{ldu}}'
  },
  GB: {
    regex: named(/^(:<code>(:<outcode>[a-z]{1,2}[0-9]{1,2}[a-z0-9]{0,1})?\s*(:<incode>[0-9][a-z]{2}))$/i),
    format: '{{outcode}} {{incode}}'
  }
};

const parse = function (string) {
  let value;
  for (const region of supportedRegionCodes) {
    const handler = handlers[region];
    const match = handler.regex.exec(string.trim());

    if (match) {
      const { captures } = match;
      for (const [key, value] of new Map(Object.entries(captures))) {
        captures[key] = value[0];
      }
      const normal = Handlebars.compile(handler.format)(captures);
      const parsed = new String(normal.toUpperCase());
      parsed.raw = string.raw != null ? string.raw : string;
      parsed.country_code = region;

      for (const key in captures) {
        value = captures[key];
        parsed[key] = _.result(value, 'toUpperCase', null);
      }

      parsed.valid = true;
      return parsed;
    }
  }

  value = new String(string);
  value.raw = string.raw != null ? string.raw : string;
  value.valid = false;
  return value;
};

const components = [
  { name: 'raw', type: 'string', description: 'Unmodified value' },
  { name: 'country_code', type: 'string', description: 'Country abbreviation' },
  { name: 'zip', type: 'string', description: 'US zip code (first 5 digits)' },
  { name: 'four', type: 'string', description: 'US zip code (last 4 digits)' },
  { name: 'fsa', type: 'string', description: 'Canadian forward sortation area' },
  { name: 'ldu', type: 'string', description: 'Canadian local delivery unit' },
  { name: 'outcode', type: 'string', description: 'Great Britain outward code' },
  { name: 'incode', type: 'string', description: 'Great Britain inward code' }
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
    'is not included in',
    'matches pattern',
    'does not match pattern'
  ],
  examples: [
    '78751',
    '78751-4224',
    '78751 4224',
    'Q2E 4U7',
    'A11 1AA',
    'AA11A 1AA'
  ].map(parse).map(normalize)
};
